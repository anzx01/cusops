import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const dbPath = join(process.cwd(), "prisma", "dev.db");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec("PRAGMA foreign_keys = OFF;");

const tables = [
  "AnalyticsEvent",
  "AiRun",
  "Message",
  "Booking",
  "Conversation",
  "Lead",
  "CalendarConnection",
  "MissingKnowledgeItem",
  "Channel",
  "HandoffContact",
  "Faq",
  "BusinessProfile",
  "ServiceArea",
  "Service",
  "AiAgent",
  "RoiSettings",
  "MerchantMember",
  "Merchant",
  "User",
];

for (const table of tables) {
  db.exec(`DROP TABLE IF EXISTS "${table}";`);
}

db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Merchant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "industry" TEXT NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Shanghai',
  "locale" TEXT NOT NULL DEFAULT 'zh-CN',
  "phone" TEXT,
  "email" TEXT,
  "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "MerchantMember" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'admin',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MerchantMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "MerchantMember_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "MerchantMember_userId_merchantId_key" ON "MerchantMember"("userId", "merchantId");
CREATE INDEX "MerchantMember_merchantId_idx" ON "MerchantMember"("merchantId");

CREATE TABLE "Service" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL DEFAULT 90,
  "priceNote" TEXT,
  "aiBookingAllowed" BOOLEAN NOT NULL DEFAULT true,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Service_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Service_merchantId_active_idx" ON "Service"("merchantId", "active");

CREATE TABLE "ServiceArea" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "ruleType" TEXT NOT NULL DEFAULT 'city',
  "ruleValue" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "ServiceArea_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ServiceArea_merchantId_active_idx" ON "ServiceArea"("merchantId", "active");

CREATE TABLE "BusinessProfile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL UNIQUE,
  "companyIntro" TEXT NOT NULL,
  "businessHours" TEXT NOT NULL,
  "bookingRules" TEXT NOT NULL,
  "priceRules" TEXT NOT NULL,
  "forbiddenPromises" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "BusinessProfile_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Faq" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Faq_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Faq_merchantId_active_idx" ON "Faq"("merchantId", "active");

CREATE TABLE "HandoffContact" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "HandoffContact_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "HandoffContact_merchantId_isDefault_idx" ON "HandoffContact"("merchantId", "isDefault");

CREATE TABLE "Channel" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'web_chat',
  "name" TEXT NOT NULL,
  "publicKey" TEXT NOT NULL UNIQUE,
  "brandColor" TEXT NOT NULL DEFAULT '#155EEF',
  "welcomeText" TEXT NOT NULL DEFAULT '您好，我是 AI 接待员。请问需要预约什么服务？',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Channel_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Channel_merchantId_active_idx" ON "Channel"("merchantId", "active");

CREATE TABLE "Lead" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "name" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "address" TEXT,
  "postalCode" TEXT,
  "serviceNeed" TEXT,
  "preferredTime" TEXT,
  "qualificationStatus" TEXT NOT NULL DEFAULT 'new',
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Lead_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Lead_merchantId_status_idx" ON "Lead"("merchantId", "status");
CREATE INDEX "Lead_merchantId_qualificationStatus_idx" ON "Lead"("merchantId", "qualificationStatus");

CREATE TABLE "Conversation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "leadId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'new',
  "tag" TEXT,
  "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
  "handoffRequired" BOOLEAN NOT NULL DEFAULT false,
  "handoffReason" TEXT,
  "summary" TEXT,
  "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Conversation_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Conversation_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Conversation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "Conversation_merchantId_status_idx" ON "Conversation"("merchantId", "status");
CREATE INDEX "Conversation_merchantId_lastMessageAt_idx" ON "Conversation"("merchantId", "lastMessageAt");

CREATE TABLE "Message" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "senderType" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

CREATE TABLE "AiAgent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL DEFAULT 'AI 接待员',
  "tone" TEXT NOT NULL DEFAULT '专业、简洁、友好',
  "defaultLanguage" TEXT NOT NULL DEFAULT 'zh-CN',
  "proactivelyGuideBooking" BOOLEAN NOT NULL DEFAULT true,
  "allowPriceQuote" BOOLEAN NOT NULL DEFAULT false,
  "allowServiceTimeCommitment" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "AiAgent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AiRun" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "confidence" REAL,
  "inputSnapshot" TEXT,
  "outputSnapshot" TEXT,
  "safetyResult" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiRun_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "AiRun_conversationId_createdAt_idx" ON "AiRun"("conversationId", "createdAt");

CREATE TABLE "MissingKnowledgeItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "conversationId" TEXT,
  "question" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "MissingKnowledgeItem_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "MissingKnowledgeItem_merchantId_status_idx" ON "MissingKnowledgeItem"("merchantId", "status");

CREATE TABLE "CalendarConnection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'google',
  "accountEmail" TEXT,
  "calendarId" TEXT,
  "accessTokenHint" TEXT,
  "connected" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "CalendarConnection_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "CalendarConnection_merchantId_provider_idx" ON "CalendarConnection"("merchantId", "provider");

CREATE TABLE "Booking" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "leadId" TEXT,
  "serviceId" TEXT,
  "startsAt" DATETIME NOT NULL,
  "endsAt" DATETIME NOT NULL,
  "address" TEXT,
  "status" TEXT NOT NULL DEFAULT 'confirmed',
  "calendarEventId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Booking_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Booking_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "Booking_merchantId_startsAt_idx" ON "Booking"("merchantId", "startsAt");
CREATE INDEX "Booking_merchantId_status_idx" ON "Booking"("merchantId", "status");

CREATE TABLE "AnalyticsEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "properties" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsEvent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "AnalyticsEvent_merchantId_eventType_idx" ON "AnalyticsEvent"("merchantId", "eventType");
CREATE INDEX "AnalyticsEvent_merchantId_createdAt_idx" ON "AnalyticsEvent"("merchantId", "createdAt");

CREATE TABLE "RoiSettings" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "merchantId" TEXT NOT NULL UNIQUE,
  "averageOrderValueCents" INTEGER NOT NULL DEFAULT 50000,
  "minutesSavedPerAiLead" INTEGER NOT NULL DEFAULT 6,
  "hourlyLaborCostCents" INTEGER NOT NULL DEFAULT 5000,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "RoiSettings_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
`);

db.close();

console.log(`SQLite development database created at ${dbPath}`);
