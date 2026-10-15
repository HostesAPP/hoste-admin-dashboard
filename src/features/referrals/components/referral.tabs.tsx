import type { ReferralTab } from "../referrals.overview.types";

const TABS: ReferralTab[] = [
  "Overview",
  "Referral Activity",
  "Referrers",
  "Rewards & Approvals",
  "Payouts",
];

export function ReferralTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: ReferralTab;
  onTabChange: (tab: ReferralTab) => void;
}) {
  return (
    <nav
      aria-label="Referral sections"
      className="flex gap-7 border-b border-border"
    >
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          aria-current={activeTab === tab ? "page" : undefined}
          onClick={() => onTabChange(tab)}
          className={`border-b-2 pb-3 text-xs ${activeTab === tab ? "border-primary font-semibold text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
