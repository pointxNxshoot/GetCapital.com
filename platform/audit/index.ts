// Central audit logger — every sensitive action writes here
import { prisma } from "@/platform/db";

export interface AuditEntry {
  actingUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  eventCategory: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  requestId: string;
  severity?: string;
  metadata?: object;
  changedFields?: object;
  actingOnBehalfOfUserId?: string;
}

export async function record(entry: AuditEntry) {
  return prisma.auditLog.create({
    data: {
      actingUserId: entry.actingUserId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      eventCategory: entry.eventCategory,
      severity: entry.severity ?? "info",
      metadata: (entry.metadata as any) ?? undefined,
      changedFields: (entry.changedFields as any) ?? undefined,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      sessionId: entry.sessionId,
      requestId: entry.requestId,
      actingOnBehalfOfUserId: entry.actingOnBehalfOfUserId,
    },
  });
}
