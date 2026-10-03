/**
 * Generate public/cv.pdf from the print view (/pdf).
 *
 * Production-only by design: the site is built with `pnpm build` and served
 * with `pnpm start` on a free local port (never the dev server, so no
 * dev-only UI can leak into the document). Playwright (Chromium) opens
 * /pdf and prints it to A4 — the page's own @page rule (size + margins) is
 * the single source of truth for the page box (preferCSSPageSize), and
 * printBackground keeps any intentional fills.
 *
 * Output: public/cv.pdf (committed to the repo; the GitHub workflow
 * regenerate-pdf.yml reruns this every January 1 and on demand).
 *
 * Usage: pnpm generate:pdf   (from the project root; Node >= 22.18 runs
 * TypeScript natively, no extra runner needed).
 */
import { spawn, spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { chromium } from "playwright";

const IS_WINDOWS = process.platform === "win32";
const PNPM = IS_WINDOWS ? "pnpm.cmd" : "pnpm";
const OUTPUT = path.resolve("public", "cv.pdf");

/** Run a pnpm command in the project root; fail the script on non-zero. */
function runPnpm(args: string[]): void {
  const result = spawnSync(PNPM, args, {
    stdio: "inherit",
    shell: true,
    cwd: process.cwd(),
  });
  if (result.status !== 0) {
    throw new Error(`pnpm ${args.join(" ")} failed (exit ${result.status})`);
  }
}

/**
 * Ask the OS for a free TCP port: bind to 0, take the assigned port,
 * release it again. Avoids clashing with any server the owner already has
 * running (dev on 3000, ad-hoc captures on 3100, ...).
 */
async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        reject(new Error("could not determine a free port"));
        return;
      }
      server.close(() => resolve(address.port));
    });
  });
}

/** Poll the print view until the production server answers 200. */
async function waitReady(base: string, timeoutMs = 90_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const res = await fetch(`${base}/pdf`);
      if (res.status === 200) return;
    } catch {
      // not listening yet — keep polling
    }
    if (Date.now() > deadline) {
      throw new Error(`${base}/pdf did not come up within ${timeoutMs} ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

/** Stop the production server (and its whole process tree). */
function killServer(server: { pid?: number }): void {
  if (server.pid === undefined) return;
  const result = IS_WINDOWS
    ? spawnSync("taskkill", ["/F", "/T", "/PID", String(server.pid)], {
        stdio: "ignore",
        shell: true,
      })
    : spawnSync("kill", ["-TERM", String(server.pid)], { stdio: "ignore" });
  if (result.status !== 0) {
    console.warn("warn: could not confirm the production server was stopped");
  }
}

/**
 * Bring up the production server on a free port, wait for it, run `task`,
 * and always kill the server's process tree on the way out.
 */
async function withProductionServer(
  task: (base: string) => Promise<void>,
): Promise<void> {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  console.log(`→ pnpm start on ${base}`);

  const server = spawn(PNPM, ["start", "-p", String(port)], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });

  try {
    await waitReady(base);
    await task(base);
  } finally {
    killServer(server);
  }
}

/** Print /pdf to A4 with Playwright/Chromium into public/cv.pdf. */
async function printPdf(base: string): Promise<void> {
  console.log("→ printing /pdf to A4 (Playwright/Chromium)");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(String(error)));

    await page.goto(`${base}/pdf`, { waitUntil: "load", timeout: 30_000 });

    // Fonts must be loaded before printing, or the PDF would silently
    // fall back to system faces (a printed document cannot re-fetch).
    await page.evaluate(() => document.fonts.ready);
    // And the portrait must be decoded (naturalWidth > 0).
    await page.waitForFunction(
      () =>
        [...document.images].every(
          (img) => img.complete && img.naturalWidth > 0,
        ),
      { timeout: 15_000 },
    );

    await page.pdf({
      path: OUTPUT,
      printBackground: true,
      // The stylesheet's @page (A4, 15 mm margins) drives the page box.
      preferCSSPageSize: true,
    });

    if (pageErrors.length > 0) {
      throw new Error(
        `/pdf threw page errors while rendering:\n${pageErrors.join("\n")}`,
      );
    }
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  console.log("→ pnpm build (production)");
  runPnpm(["build"]);

  await withProductionServer(async (base) => {
    await printPdf(base);
  });

  const sizeKb = statSync(OUTPUT).size / 1024;
  console.log(`✓ ${path.relative(process.cwd(), OUTPUT)} (${sizeKb.toFixed(0)} kB)`);
}

main().catch((error) => {
  console.error(`✗ generate:pdf failed: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
