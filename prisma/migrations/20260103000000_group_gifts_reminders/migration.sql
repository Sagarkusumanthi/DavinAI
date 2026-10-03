-- Add delivery confirmation flag to Order
ALTER TABLE "Order" ADD COLUMN "deliveryConfirmedByCustomer" BOOLEAN NOT NULL DEFAULT false;

-- New enums
CREATE TYPE "OccasionType" AS ENUM ('BIRTHDAY', 'ANNIVERSARY', 'WEDDING', 'FESTIVAL', 'OTHER');
CREATE TYPE "SplitType" AS ENUM ('EQUAL', 'CUSTOM');

-- Reminder
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "occasionName" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "occasionType" "OccasionType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "repeatYearly" BOOLEAN NOT NULL DEFAULT false,
    "remindMe" TEXT NOT NULL,
    "giftCategory" TEXT,
    "note" TEXT,
    "giftPlanned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Reminder_customerId_idx" ON "Reminder"("customerId");
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- GroupGift
CREATE TABLE "GroupGift" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "occasionType" "OccasionType" NOT NULL,
    "recipientName" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "goalAmount" DECIMAL(10,2) NOT NULL,
    "splitType" "SplitType" NOT NULL DEFAULT 'EQUAL',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GroupGift_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "GroupGift_createdById_idx" ON "GroupGift"("createdById");
ALTER TABLE "GroupGift" ADD CONSTRAINT "GroupGift_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GroupGift" ADD CONSTRAINT "GroupGift_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- GroupGiftItem (supports multiple selected gifts per group)
CREATE TABLE "GroupGiftItem" (
    "id" TEXT NOT NULL,
    "groupGiftId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "GroupGiftItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "GroupGiftItem_groupGiftId_idx" ON "GroupGiftItem"("groupGiftId");
ALTER TABLE "GroupGiftItem" ADD CONSTRAINT "GroupGiftItem_groupGiftId_fkey" FOREIGN KEY ("groupGiftId") REFERENCES "GroupGift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GroupGiftItem" ADD CONSTRAINT "GroupGiftItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- GroupGiftContributor
CREATE TABLE "GroupGiftContributor" (
    "id" TEXT NOT NULL,
    "groupGiftId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupGiftContributor_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "GroupGiftContributor_groupGiftId_idx" ON "GroupGiftContributor"("groupGiftId");
ALTER TABLE "GroupGiftContributor" ADD CONSTRAINT "GroupGiftContributor_groupGiftId_fkey" FOREIGN KEY ("groupGiftId") REFERENCES "GroupGift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
