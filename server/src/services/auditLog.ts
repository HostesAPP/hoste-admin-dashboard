import { PrismaClient } from "@prisma/client";

export async function writeAudit(prisma: PrismaClient, params: {
  staffUserId?: string | null;
  staffProfileId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  description?: string | null;
  ip?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      staffUserId: params.staffUserId || undefined,
      staffProfileId: params.staffProfileId || undefined,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId || undefined,
      description: params.description || undefined,
      ip: params.ip || undefined,
    },
  });
}
