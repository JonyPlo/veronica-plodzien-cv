import { ContactSection } from "@/components/contact-section";
import { EducationSection } from "@/components/education-section";
import { ExperienceSection } from "@/components/experience-section";
import { Hero } from "@/components/hero";
import { SkillsSection } from "@/components/skills-section";
import { copy } from "@/lib/copy";
import { assetUrl, loadCv } from "@/lib/cv";
import { formatPeriod, resolveMarkers } from "@/lib/years";

/**
 * Revalidate daily: the year math ({years_in_role}, {career_years}) is
 * recomputed on every revalidation, so the page stays correct across the
 * new year without a redeploy.
 */
export const revalidate = 86400;

export default function CvPage() {
  const cv = loadCv();

  const profile = resolveMarkers(cv.profile, { cv });

  const experienceItems = cv.experience.map((job) => ({
    current: job.current,
    period: formatPeriod(job.from, job.to, job.current, copy.timeline.current),
    position: job.position,
    company: job.company,
    description: resolveMarkers(job.description, { cv, job }),
  }));

  const educationItems = cv.education.map((edu) => ({
    period: formatPeriod(edu.from, edu.to, false, copy.timeline.current),
    degree: edu.degree,
    institution: edu.institution,
    level: edu.level,
  }));

  const location = [
    cv.contact.city,
    cv.contact.province,
    cv.contact.country,
  ].join(", ");

  return (
    <>
      {/* Hero: full width on mobile, ~1080px centered on large screens. */}
      <div className="mx-auto w-full px-5 sm:px-8 lg:max-w-[67.5rem]">
        <Hero
          name={cv.name}
          photoSrc={assetUrl(cv.photo.web)}
          photoAlt={copy.page.photoAlt(cv.name)}
          profile={profile}
          phone={cv.contact.phone}
          phoneLink={cv.contact.phoneLink}
          whatsapp={cv.contact.whatsapp}
          email={cv.contact.email}
        />
      </div>

      {/* Reading sections: ~720px column. */}
      <div className="mx-auto w-full max-w-[45rem] px-5 sm:px-8">
        <ExperienceSection items={experienceItems} />

        {educationItems.length > 0 && (
          <EducationSection items={educationItems} />
        )}

        {cv.computerSkills.length > 0 && (
          <SkillsSection items={cv.computerSkills} />
        )}

        <ContactSection
          phone={cv.contact.phone}
          phoneLink={cv.contact.phoneLink}
          whatsapp={cv.contact.whatsapp}
          email={cv.contact.email}
          location={location}
        />
      </div>
    </>
  );
}
