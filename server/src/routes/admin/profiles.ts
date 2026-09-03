import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { writeAudit } from "../../services/auditLog";

const router = express.Router();

// Helper to get staff info
function getStaff(req: Request) {
  return req.staff ? { id: req.staff.id, role: req.staff.role } : null;
}

// GET /admin/profiles/activation-queue
router.get("/", async (req: Request, res: Response) => {
  const prisma: PrismaClient = req.prisma!;
  const { profileType, page = "1", limit = "20" } = req.query as any;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);

  const where: any = { status: "Pending" };
  if (profileType) where.profileType = profileType;

  const profiles = await prisma.profile.findMany({
    where,
    orderBy: { createdAt: "asc" },
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileType: true,
      attributes: true,
      activationData: true,
      status: true,
      createdAt: true,
    },
  });

  // redact activationData if staff role not authorized
  const staff = getStaff(req);
  const allowedRoles = ["SUPER_ADMIN", "VERIFICATION_OFFICER", "MODERATOR"];
  const sanitized = profiles.map((p) => {
    const copy: any = { ...p };
    if (!staff || !allowedRoles.includes(staff.role)) {
      delete copy.activationData;
    }
    return copy;
  });

  res.json({ data: sanitized });
});

// POST /admin/profiles/:id/approve
router.post("/:id/approve", async (req: Request, res: Response) => {
  const { id } = req.params;
  const prisma: PrismaClient = req.prisma!;
  const staff = getStaff(req);
  if (!staff) return res.status(401).json({ error: "Unauthorized" });

  const profile = await prisma.profile.update({
    where: { id },
    data: {
      status: "Active",
      approvedBy: staff.id,
    },
  });

  await writeAudit(prisma, {
    staffProfileId: staff.id,
    action: "approve_profile",
    entityType: "Profile",
    entityId: id,
    description: `Approved profile ${id}`,
    ip: req.ip,
  });

  // placeholder for notification dispatch
  // notifyUser(profile.id, 'profile_approved')

  // redact activationData for non-privileged roles
  const allowedRoles = ["SUPER_ADMIN", "VERIFICATION_OFFICER", "MODERATOR"];
  const result: any = { ...profile };
  if (!allowedRoles.includes(staff.role)) delete result.activationData;

  res.json({ data: result });
});

// POST /admin/profiles/:id/reject
router.post("/:id/reject", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body as { reason?: string };
  const prisma: PrismaClient = req.prisma!;
  const staff = getStaff(req);
  if (!staff) return res.status(401).json({ error: "Unauthorized" });
  if (!reason || reason.trim().length === 0) return res.status(400).json({ error: "reason is required" });

  const profile = await prisma.profile.update({
    where: { id },
    data: {
      status: "Rejected",
      rejectedReason: reason,
    },
  });

  await writeAudit(prisma, {
    staffProfileId: staff.id,
    action: "reject_profile",
    entityType: "Profile",
    entityId: id,
    description: `Rejected profile ${id}: ${reason}`,
    ip: req.ip,
  });

  // notify user placeholder

  const allowedRoles = ["SUPER_ADMIN", "VERIFICATION_OFFICER", "MODERATOR"];
  const result: any = { ...profile };
  if (!allowedRoles.includes(staff.role)) delete result.activationData;

  res.json({ data: result });
});

// POST /admin/profiles/:id/suspend
router.post("/:id/suspend", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { suspendedUntil } = req.body as { suspendedUntil?: string };
  const prisma: PrismaClient = req.prisma!;
  const staff = getStaff(req);
  if (!staff) return res.status(401).json({ error: "Unauthorized" });
  if (!suspendedUntil) return res.status(400).json({ error: "suspendedUntil is required" });
  const until = new Date(suspendedUntil);
  if (isNaN(until.getTime())) return res.status(400).json({ error: "invalid suspendedUntil" });

  const profile = await prisma.profile.update({
    where: { id },
    data: {
      status: "Suspended",
      suspendedUntil: until,
    },
  });

  await writeAudit(prisma, {
    staffProfileId: staff.id,
    action: "suspend_profile",
    entityType: "Profile",
    entityId: id,
    description: `Suspended until ${until.toISOString()}`,
    ip: req.ip,
  });

  const allowedRoles = ["SUPER_ADMIN", "VERIFICATION_OFFICER", "MODERATOR"];
  const result: any = { ...profile };
  if (!allowedRoles.includes(staff.role)) delete result.activationData;

  res.json({ data: result });
});

// POST /admin/profiles/:id/remove
router.post("/:id/remove", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { confirm } = req.body as { confirm?: boolean };
  const prisma: PrismaClient = req.prisma!;
  const staff = getStaff(req);
  if (!staff) return res.status(401).json({ error: "Unauthorized" });
  if (!confirm) return res.status(400).json({ error: "confirmation required" });

  const profile = await prisma.profile.update({
    where: { id },
    data: {
      status: "Deleted",
      deletedAt: new Date(),
    },
  });

  await writeAudit(prisma, {
    staffProfileId: staff.id,
    action: "remove_profile",
    entityType: "Profile",
    entityId: id,
    description: `Soft-deleted profile ${id}`,
    ip: req.ip,
  });

  const allowedRoles = ["SUPER_ADMIN", "VERIFICATION_OFFICER", "MODERATOR"];
  const result: any = { ...profile };
  if (!allowedRoles.includes(staff.role)) delete result.activationData;

  res.json({ data: result });
});

export default router;
