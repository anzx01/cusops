import { prisma } from "@/lib/prisma";

export async function getCurrentMerchantId() {
  const merchantId = process.env.DEMO_MERCHANT_ID || "demo-merchant";

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { id: true },
  });

  if (!merchant) {
    throw new Error(
      `Demo merchant "${merchantId}" was not found. Run npm run db:setup.`,
    );
  }

  return merchant.id;
}

export async function getCurrentMerchant() {
  const merchantId = await getCurrentMerchantId();

  return prisma.merchant.findUniqueOrThrow({
    where: { id: merchantId },
  });
}
