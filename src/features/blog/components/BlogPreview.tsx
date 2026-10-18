"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  Clock3,
  Share2,
  CheckCircle2,
  Heart,
  MessageSquare,
  X,
  ExternalLink,
  Pencil,
} from "lucide-react";

export default function BlogPreviewPage() {
  const [published, setPublished] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditMessage, setShowEditMessage] = useState(false);

  const blogTitle = "5 Things to Consider When Hiring Event Staff";

  return (
    <main className="min-h-screen bg-[#414141] px-[7px] py-[10px] font-sans text-[#172033]">
      <div className="mx-auto min-h-[692px] w-full max-w-[860px] overflow-hidden border border-[#DDE2E8] bg-[#FAFAFB]">
        {/* Top navigation */}

        <header className="flex h-[49px] items-center border-b border-[#E7E9EC] bg-white px-[12px]">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-[28px] w-[100px] items-center gap-[6px] rounded-[7px] border border-[#E3E8EF] bg-white px-[11px] text-[10px] font-medium text-[#273449] hover:bg-[#F8FAFC]"
          >
            <ArrowLeft size={13} />
            Back
          </button>
        </header>

        {/* Page heading and actions */}

        <section className="flex flex-wrap items-center justify-between gap-[12px] px-[11px] pb-[9px] pt-[10px]">
          <div>
            <h1 className="text-[17px] font-bold leading-[22px] tracking-[-0.35px] text-[#172033]">
              Blog Preview
            </h1>

            <nav className="mt-[3px] flex items-center gap-[3px] text-[9px]">
              <span className="text-[#247541]">Blog Management</span>

              <ChevronRight size={10} className="text-[#9AA4B2]" />

              <span className="text-[#64748B]">All Posts</span>

              <ChevronRight size={10} className="text-[#9AA4B2]" />

              <span className="font-semibold text-[#172033]">Blog Preview</span>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-[8px]">
            <button
              type="button"
              onClick={() => setShowEditMessage(true)}
              className="flex h-[28px] items-center justify-center rounded-[7px] border border-[#FF693D] bg-white px-[16px] text-[9px] font-semibold text-[#F05224] shadow-sm hover:bg-[#FFF7F4]"
            >
              Edit Post
            </button>

            <button
              type="button"
              onClick={() => setPublished(!published)}
              className="flex h-[28px] items-center justify-center rounded-[7px] border border-[#F5A623] bg-white px-[15px] text-[9px] font-semibold text-[#D97706] shadow-sm hover:bg-[#FFFBEB]"
            >
              {published ? "Unpublish" : "Publish"}
            </button>

            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="flex h-[28px] items-center justify-center gap-[6px] rounded-[7px] border border-[#D8E0E9] bg-white px-[12px] text-[9px] font-semibold text-[#344054] shadow-sm hover:bg-[#F8FAFC]"
            >
              <Share2 size={12} />
              Share
            </button>

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex h-[28px] items-center justify-center gap-[5px] rounded-[7px] bg-[#19683A] px-[13px] text-[9px] font-semibold text-white shadow-sm hover:bg-[#15562F]"
            >
              Preview on Site
              <ExternalLink size={10} />
            </button>
          </div>
        </section>

        {/* Main content */}

        <div className="grid grid-cols-1 items-start gap-[16px] px-[9px] pb-[6px] md:grid-cols-[minmax(0,1.58fr)_minmax(0,0.94fr)]">
          {/* Blog article */}

          <article className="min-w-0 overflow-hidden rounded-[10px] border border-[#E3E9F0] bg-white px-[17px] pb-[18px] pt-[15px] shadow-[0_2px_8px_rgba(24,39,75,0.06)]">
            {/* Publication status */}

            <div className="mb-[7px] flex flex-wrap items-center gap-[7px] text-[9px]">
              <span
                className={`inline-flex items-center gap-[4px] rounded-full px-[7px] py-[3px] text-[8px] font-semibold ${
                  published
                    ? "bg-[#DDF8E5] text-[#16803D]"
                    : "bg-[#FFF0D5] text-[#A16207]"
                }`}
              >
                <span
                  className={`h-[5px] w-[5px] rounded-full ${
                    published ? "bg-[#22C55E]" : "bg-[#F59E0B]"
                  }`}
                />
                {published ? "Published" : "Draft"}
              </span>

              <span className="text-[#A0A9B7]">•</span>

              <span className="text-[#71819A]">Aug 10, 2026 at 10:30 AM</span>
            </div>

            {/* Article title */}

            <h2 className="mb-[9px] max-w-[390px] text-[19px] font-bold leading-[23px] tracking-[-0.4px] text-[#172033]">
              {blogTitle}
            </h2>

            {/* Author and reading information */}

            <div className="mb-[13px] flex flex-wrap items-center justify-between gap-[8px]">
              <div className="flex items-center gap-[6px]">
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#176A3A] text-[10px] font-semibold text-white">
                  S
                </div>

                <div>
                  <p className="text-[9px] font-bold leading-[12px] text-[#202A3E]">
                    Naomi Admin
                  </p>

                  <p className="text-[8px] leading-[10px] text-[#71819A]">
                    Event Planning
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-[10px] text-[9px] text-[#71819A]">
                <span className="flex items-center gap-[3px]">
                  <Eye size={12} />
                  1,245 views
                </span>

                <span className="flex items-center gap-[3px]">
                  <Clock3 size={12} />6 min read
                </span>
              </div>
            </div>

            {/* Featured image illustration */}

            <div className="relative mb-[9px] h-[184px] overflow-hidden rounded-[7px] bg-gradient-to-br from-[#20193F] via-[#41146B] to-[#100C28]">
              {/* Background glow */}

              <div className="absolute -right-[20px] top-[28px] h-[100px] w-[200px] rounded-full bg-[#8B28C4] opacity-60 blur-[35px]" />

              <div className="absolute bottom-[-35px] left-[22%] h-[100px] w-[230px] rounded-full bg-[#7D28BA] opacity-60 blur-[25px]" />

              {/* Decorative circles */}

              <div className="absolute left-[12%] top-[40px] h-[57px] w-[57px] rounded-full bg-[#67204F] opacity-70" />

              <div className="absolute left-[34%] top-[14px] h-[86px] w-[86px] rounded-full bg-[#30245C] opacity-80" />

              <div className="absolute right-[20%] top-[62px] h-[64px] w-[64px] rounded-full bg-[#66317C] opacity-60" />

              {/* Hosté illustration silhouette */}

              <div className="absolute bottom-[5px] right-[21%] h-[139px] w-[78px]">
                <div
                  className="absolute bottom-0 left-[4px] h-[127px] w-[70px] bg-[#100B20]"
                  style={{
                    clipPath:
                      "polygon(40% 0%, 52% 8%, 63% 24%, 73% 42%, 92% 66%, 100% 100%, 0% 100%, 3% 75%, 15% 54%, 31% 36%, 39% 19%)",
                  }}
                />

                <div
                  className="absolute left-[18px] top-[5px] h-[60px] w-[23px] rotate-[20deg] bg-[#100B20]"
                  style={{
                    clipPath: "polygon(0 0, 100% 45%, 35% 100%, 25% 54%)",
                  }}
                />

                {/* Serving tray */}

                <div className="absolute left-[-26px] top-[64px] h-[2px] w-[64px] bg-[#F0F0F4]" />

                <div className="absolute left-[-13px] top-[52px] flex items-end gap-[8px]">
                  <span className="h-[12px] w-[7px] border-x border-b border-[#F7F5FF] [clip-path:polygon(0_0,100%_0,70%_100%,30%_100%)]" />
                  <span className="h-[16px] w-[8px] border-x border-b border-[#F7F5FF] [clip-path:polygon(0_0,100%_0,70%_100%,30%_100%)]" />
                  <span className="h-[12px] w-[7px] border-x border-b border-[#F7F5FF] [clip-path:polygon(0_0,100%_0,70%_100%,30%_100%)]" />
                </div>

                <div className="absolute bottom-[38px] left-[5px] text-[15px] font-bold tracking-[-0.5px] text-[#FF5A0A]">
                  Hosté
                </div>
              </div>
            </div>

            {/* Article body */}

            <div className="space-y-[9px] text-[10px] leading-[15px] text-[#3E4D67]">
              <p>
                Hiring the right event staff can make or break your event. From
                professionalism to reliability, the right team ensures
                everything runs smoothly while you focus on enjoying the
                occasion.
              </p>

              <p>Here are five key factors to keep in mind:</p>

              <section>
                <h3 className="mb-[2px] font-bold text-[#172033]">
                  1. Experience Matters
                </h3>

                <p>
                  Look for staff who have prior experience in the type of event
                  you are hosting. Experienced staff can handle unexpected
                  situations with ease and maintain a high level of service.
                </p>
              </section>

              <section>
                <h3 className="mb-[2px] font-bold text-[#172033]">
                  2. Professionalism &amp; Attitude
                </h3>

                <p>
                  A positive attitude, good communication, and professionalism
                  go a long way in creating a
                </p>
              </section>
            </div>
          </article>

          {/* Right sidebar */}

          <aside className="flex min-w-0 flex-col gap-[10px]">
            {/* Post information */}

            <section className="rounded-[10px] border border-[#E3E9F0] bg-white px-[14px] pb-[5px] pt-[11px] shadow-[0_2px_8px_rgba(24,39,75,0.06)]">
              <h3 className="mb-[9px] text-[10px] font-bold text-[#172033]">
                Post Information
              </h3>

              <InfoRow label="Status">
                <span
                  className={`rounded-full px-[8px] py-[3px] text-[8px] font-semibold ${
                    published
                      ? "bg-[#DDF8E5] text-[#16803D]"
                      : "bg-[#FFF0D5] text-[#A16207]"
                  }`}
                >
                  {published ? "Published" : "Draft"}
                </span>
              </InfoRow>

              <InfoRow label="Post ID">
                <span className="font-semibold text-[#172033]">#BLOG-128</span>
              </InfoRow>

              <InfoRow label="Author">
                <span className="flex items-center gap-[7px] font-semibold text-[#172033]">
                  <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#176A3A] text-[8px] text-white">
                    N
                  </span>
                  Naomi Admin
                </span>
              </InfoRow>

              <InfoRow label="Category">
                <span className="rounded-[5px] bg-[#DDF5E6] px-[7px] py-[4px] text-[8px] font-semibold text-[#176B3A]">
                  Event Planning
                </span>
              </InfoRow>

              <InfoRow label="Tags">
                <div className="flex items-center gap-[4px]">
                  <span className="rounded-[5px] bg-[#FFF0C5] px-[6px] py-[4px] text-[8px] font-medium text-[#B86A00]">
                    Event Staff
                  </span>

                  <span className="rounded-[5px] bg-[#EDE9FE] px-[6px] py-[4px] text-[8px] font-medium text-[#5B36D6]">
                    Hiring Tips
                  </span>

                  <span className="rounded-[5px] bg-[#F0F3F7] px-[7px] py-[4px] text-[8px] font-medium text-[#64748B]">
                    +2
                  </span>
                </div>
              </InfoRow>

              <InfoRow label="Published On">
                <span className="text-right text-[9px] font-semibold text-[#172033]">
                  Aug 10, 2026 at 10:30 AM
                </span>
              </InfoRow>

              <InfoRow label="Last Updated" last>
                <span className="text-right text-[9px] font-semibold text-[#172033]">
                  Aug 10, 2026 at 10:30 AM
                </span>
              </InfoRow>
            </section>

            {/* SEO information */}

            <section className="rounded-[10px] border border-[#E3E9F0] bg-white px-[14px] pb-[12px] pt-[11px] shadow-[0_2px_8px_rgba(24,39,75,0.06)]">
              <h3 className="mb-[10px] text-[10px] font-bold text-[#172033]">
                SEO Information
              </h3>

              <div className="mb-[10px]">
                <p className="mb-[3px] text-[9px] text-[#71819A]">SEO Title</p>

                <p className="text-[9px] font-semibold leading-[13px] text-[#172033]">
                  {blogTitle}
                </p>
              </div>

              <div>
                <p className="mb-[3px] text-[9px] text-[#71819A]">
                  Meta Description
                </p>

                <p className="text-[10px] leading-[14px] text-[#45536D]">
                  Discover the top 5 things to consider when hiring event staff
                  for your next event to ensure a successful and stress-free
                  experience.
                </p>
              </div>
            </section>

            {/* Post statistics */}

            <section className="rounded-[10px] border border-[#E3E9F0] bg-white px-[13px] pb-[13px] pt-[11px] shadow-[0_2px_8px_rgba(24,39,75,0.06)]">
              <h3 className="mb-[9px] text-[10px] font-bold text-[#172033]">
                Post Statistics
              </h3>

              <div className="grid grid-cols-3 gap-[9px]">
                <StatCard
                  icon={<Eye size={13} />}
                  value="1,245"
                  label="Views"
                  iconColor="text-[#6557FF]"
                />

                <StatCard
                  icon={<Heart size={13} />}
                  value="86"
                  label="Likes"
                  iconColor="text-[#FF4B55]"
                />

                <StatCard
                  icon={<MessageSquare size={12} />}
                  value="12"
                  label="Comments"
                  iconColor="text-[#16A34A]"
                />
              </div>
            </section>

            {/* Content checklist */}

            <section className="min-h-[96px] rounded-[10px] border border-[#E3E9F0] bg-white px-[14px] pb-[12px] pt-[11px] shadow-[0_2px_8px_rgba(24,39,75,0.06)]">
              <h3 className="mb-[11px] text-[10px] font-bold text-[#172033]">
                Content Checklist
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#45536D]">
                  Featured Image
                </span>

                <span className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#DDF8E5] text-[#16A34A]">
                  <CheckCircle2 size={11} strokeWidth={2.5} />
                </span>
              </div>
            </section>
          </aside>
        </div>

        {/* Share modal */}

        {showShare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-[360px] rounded-xl border border-[#E3E9F0] bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[15px] font-bold">Share Blog Post</h2>

                <button
                  type="button"
                  onClick={() => setShowShare(false)}
                  aria-label="Close share dialog"
                >
                  <X size={17} />
                </button>
              </div>

              <p className="mb-3 text-[12px] text-[#64748B]">{blogTitle}</p>

              <div className="flex gap-2">
                <input
                  readOnly
                  value="https://hoste.com/blog/5-things-to-consider"
                  className="min-w-0 flex-1 rounded-md border border-[#E3E9F0] px-2 py-2 text-[10px] outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(
                      "https://hoste.com/blog/5-things-to-consider",
                    );
                  }}
                  className="rounded-md bg-[#19683A] px-3 py-2 text-[10px] font-semibold text-white"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Site preview modal */}

        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-[600px] rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[16px] font-bold">Site Preview</h2>

                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mb-3 text-[12px] text-[#64748B]">
                Preview of how this article appears on the Hosté website.
              </p>

              <h3 className="mb-3 text-[22px] font-bold">{blogTitle}</h3>

              <p className="text-[12px] leading-6 text-[#45536D]">
                Hiring the right event staff can make or break your event. From
                professionalism to reliability, the right team ensures
                everything runs smoothly while you focus on enjoying the
                occasion.
              </p>
            </div>
          </div>
        )}

        {/* Edit notification */}

        {showEditMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-[330px] rounded-xl bg-white p-5 shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <Pencil size={17} className="text-[#F05224]" />
                <h2 className="text-[14px] font-bold">Edit Blog Post</h2>
              </div>

              <p className="mb-4 text-[12px] leading-5 text-[#64748B]">
                Connect this button to your existing Create Blog Post page to
                edit this article.
              </p>

              <button
                type="button"
                onClick={() => setShowEditMessage(false)}
                className="w-full rounded-md bg-[#19683A] px-4 py-2 text-[11px] font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function InfoRow({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[25px] items-center justify-between gap-2 ${
        last ? "" : "border-b border-[#F0F2F5]"
      }`}
    >
      <span className="shrink-0 text-[9px] text-[#71819A]">{label}</span>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  iconColor,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconColor: string;
}) {
  return (
    <div className="flex h-[47px] min-w-0 flex-col items-center justify-center rounded-[7px] bg-[#F7F9FC] px-1">
      <div className="flex items-center gap-[5px]">
        <span className={iconColor}>{icon}</span>

        <span className="text-[13px] font-bold leading-[15px] text-[#172033]">
          {value}
        </span>
      </div>

      <span className="mt-[1px] text-[8px] text-[#71819A]">{label}</span>
    </div>
  );
}
