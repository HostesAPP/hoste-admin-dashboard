"use client";

import type { Profile } from "../types/profiles.types";

interface ProfileExperienceCardProps {
  profile: Profile;
}

export function ProfileExperienceCard({ profile }: ProfileExperienceCardProps) {
  const defaultExperience = [
    {
      role: "Event Host",
      company: "XYZ Events",
      period: "2023–2026",
    },
    {
      role: "Senior Usher",
      company: "ABC Events",
      period: "2021–2023",
    },
  ];

  const experienceList =
    profile.experienceList?.length ? profile.experienceList : defaultExperience;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-4">
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        Experience
      </h3>

      <div className="relative pl-6 space-y-5">
        {/* Continuous timeline line */}
        <div className="absolute left-2.5 top-2 bottom-3 w-px bg-border/80" />

        {experienceList.map((item, idx) => (
          <div key={idx} className="relative flex flex-col gap-0.5">
            {/* Dot on line */}
            <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-muted-foreground/50 ring-4 ring-card" />

            <span className="text-xs font-bold text-foreground">
              {item.role} — {item.company}
            </span>
            <span className="text-xs text-muted-foreground">{item.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
