import { prisma } from "@/lib/prisma";

export async function trackEvent(input: {
  merchantId: string;
  eventType: string;
  entityType?: string;
  entityId?: string;
  properties?: Record<string, unknown>;
}) {
  await prisma.analyticsEvent.create({
    data: {
      merchantId: input.merchantId,
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      properties: input.properties ? JSON.stringify(input.properties) : undefined,
    },
  });
}
