"use client";

import type { Profile } from "../types/profiles.types";

interface ProfileServicesSkillsCardProps {
  profile: Profile;
}

export function ProfileServicesSkillsCard({
  profile,
}: ProfileServicesSkillsCardProps) {
  const defaultServices = [
    "Event Hosting",
    "Ushering",
    "Corporate Events",
    "Wedding Events",
  ];

  const defaultSkills = [
    "Communication",
    "Customer Service",
    "Public Speaking",
    "Event Coordination",
  ];

  const services = profile.services?.length ? profile.services : defaultServices;
  const skills = profile.skills?.length ? profile.skills : defaultSkills;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-4">
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        Services &amp; Skills
      </h3>

      {/* Services Row */}
      <div className="flex items-start gap-4">
        <span className="text-xs text-muted-foreground min-w-[70px] pt-1">
          Services:
        </span>
        <div className="flex items-center flex-wrap gap-2">
          {services.map((service) => (
            <span
              key={service}
              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-muted/60 text-foreground/80 border border-border/60"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Skills Row */}
      <div className="flex items-start gap-4">
        <span className="text-xs text-muted-foreground min-w-[70px] pt-1">
          Skills:
        </span>
        <div className="flex items-center flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-muted/60 text-foreground/80 border border-border/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
