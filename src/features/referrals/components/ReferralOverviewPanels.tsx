import Link from "next/link";
import { ArrowRight, CircleAlert, Clock3, Flag } from "lucide-react";
import type {
  ReferralTab,
  ReferralOverviewSummary,
} from "../referrals.overview.types";

export function ReferralMetrics({
  summary,
}: {
  summary: ReferralOverviewSummary;
}) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {summary.metrics.map((metric) => (
        <article
          key={metric.label}
          className={`min-w-0 rounded-lg border bg-card p-4 ${metric.tone === "primary" ? "border-primary" : metric.tone === "success" ? "border-success" : "border-border"}`}
        >
          <h2
            className={`text-[11px] font-semibold ${metric.tone === "primary" ? "text-primary" : metric.tone === "success" ? "text-success" : "text-muted-foreground"}`}
          >
            {metric.label}
          </h2>
          <p
            className={`mt-1 text-xl font-bold tabular-nums ${metric.tone === "success" ? "text-success" : "text-foreground"}`}
          >
            {metric.value}
          </p>
          <p
            className={`mt-2 text-[10px] ${metric.tone === "primary" ? "text-primary font-semibold" : "text-muted-foreground"}`}
          >
            {metric.detail}
          </p>
          <p
            className={`mt-0.5 text-[10px] ${metric.tone === "success" ? "text-success font-semibold" : "text-muted-foreground"}`}
          >
            {metric.footnote}
          </p>
        </article>
      ))}
    </div>
  );
}

export function ReferralJourney({
  summary,
}: {
  summary: ReferralOverviewSummary;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-bold">Referral Journey</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Track how referrals move from code usage to successful reward payout
        (Registered ≠ Successful).
      </p>
      <ol className="mt-4 flex items-center">
        {summary.journey.map((step, index) => (
          <li key={step.label} className="flex min-w-0 flex-1 items-center">
            <div
              className={`flex-1 rounded-md border p-3 ${step.tone === "primary" ? "border-primary bg-primary/5 text-primary" : step.tone === "success" ? "border-success bg-success/10 text-success" : "border-border bg-muted/30"}`}
            >
              <p className="text-[10px]">
                {index + 1}. {step.label}
              </p>
              <div className="mt-1 flex items-end justify-between gap-1">
                <strong className="text-lg">{step.value}</strong>
                <span className="text-[10px] font-medium">{step.detail}</span>
              </div>
            </div>
            {index < 4 && (
              <div className="flex w-8 shrink-0 flex-col items-center text-muted-foreground">
                <span className="text-[9px] font-semibold">{step.rate}</span>
                <ArrowRight className="size-4" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ReferralRules({
  summary,
}: {
  summary: ReferralOverviewSummary;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-bold">Current Referral Rules</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Active system reward configuration
      </p>
      <dl className="mt-4 space-y-4">
        <div className="rounded-md bg-muted/40 p-4">
          <dt className="text-[10px] font-semibold text-muted-foreground">
            REFERRAL REWARD
          </dt>
          <dd className="mt-1 flex items-center gap-4">
            <strong className="text-xl text-primary">
              ₦{summary.reward.toLocaleString()}
            </strong>
            <span className="text-[10px] text-muted-foreground">
              per qualifying referral
            </span>
          </dd>
        </div>
        <div className="rounded-md bg-muted/40 p-4">
          <dt className="text-[10px] font-semibold text-muted-foreground">
            QUALIFYING THRESHOLD
          </dt>
          <dd className="mt-1 flex items-center gap-4">
            <strong className="text-lg">
              ₦{summary.threshold.toLocaleString()}
            </strong>
            <span className="text-[10px] text-muted-foreground">
              min. first transaction
            </span>
          </dd>
        </div>
      </dl>
      <div className="mt-5 border-t border-border pt-3 text-[10px]">
        <p className="flex justify-between">
          <span className="text-muted-foreground">Last Updated</span>
          <strong>{summary.updatedAt}</strong>
        </p>
        <p className="mt-1 flex justify-between">
          <span className="text-muted-foreground">Updated By</span>
          <strong>{summary.updatedBy}</strong>
        </p>
      </div>
      <Link
        href="/settings"
        className="mt-4 flex items-center justify-center gap-1 rounded-md border border-primary/15 bg-primary/5 p-3 text-xs font-semibold text-primary hover:bg-primary/10"
      >
        Manage Referral Settings <ArrowRight className="size-3" />
      </Link>
    </section>
  );
}

export function ReferralAttention({
  onNavigate,
  summary,
}: {
  onNavigate: (tab: ReferralTab) => void;
  summary: ReferralOverviewSummary;
}) {
  const items = [
    {
      label: "Pending Reward Approval",
      count: summary.attentionCounts.rewards,
      action: "Review Rewards",
      tab: "Rewards & Approvals" as const,
      icon: Clock3,
      tone: "text-warning bg-yellow/15",
    },
    {
      label: "Failed Bank Payouts",
      count: summary.attentionCounts.payouts,
      action: "Review Payouts",
      tab: "Payouts" as const,
      icon: CircleAlert,
      tone: "text-destructive bg-destructive/10",
    },
    {
      label: "Flagged / Suspicious",
      count: summary.attentionCounts.flagged,
      action: "Review Activity",
      tab: "Referral Activity" as const,
      icon: Flag,
      tone: "text-muted-foreground bg-muted",
    },
  ];
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-bold">Requires Attention</h2>
      <p className="text-xs text-muted-foreground">
        Referral records that require administrative review or action.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.tab)}
            className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/20 p-3 text-[10px] hover:bg-muted/50"
          >
            <span className="flex items-center gap-2 font-semibold">
              <item.icon className={`size-5 rounded-full p-1 ${item.tone}`} />
              {item.label}
            </span>
            <span className={`rounded px-1.5 py-0.5 font-bold ${item.tone}`}>
              {item.count}
            </span>
            <span className="font-semibold text-primary">{item.action}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
