// Prisma snippet for Payments, Payouts, Refunds, Engagements, and related enums
// Drop into server/prisma/schema.prisma (merge with existing models)

// Enums
enum PaymentStatus {
  Pending
  Successful
  Failed
  Cancelled
  Refunded
}

enum EngagementStatus {
  Pending
  Accepted
  InProgress
  Completed
  Cancelled
  Disputed
}

enum BookingType {
  ONE_TIME
  PART_TIME
  FULL_TIME
  CONTRACT
}

// Payment model
model Payment {
  id               String        @id @default(uuid())
  referenceId      String        @unique
  paymentType      String
  amount           Decimal       @db.Decimal(12,2)
  commissionAmount Decimal       @db.Decimal(12,2)
  processingFee    Decimal       @db.Decimal(12,2)
  status           PaymentStatus @default(Pending)
  metadata         Json?
  createdAt        DateTime      @default(now())
  // relations
  engagement       Engagement?   @relation(fields: [engagementId], references: [id])
  engagementId     String?
}

// Payout model
model Payout {
  id          String   @id @default(uuid())
  referenceId String   @unique
  engagement  Engagement @relation(fields: [engagementId], references: [id])
  engagementId String
  amount      Decimal  @db.Decimal(12,2)
  processingFee Decimal @db.Decimal(12,2)
  finalAmount Decimal  @db.Decimal(12,2)
  status      String
  createdAt   DateTime @default(now())
}

// Refund model
model Refund {
  id            String   @id @default(uuid())
  referenceId   String   @unique
  payment       Payment  @relation(fields: [paymentId], references: [id])
  paymentId     String
  engagementId  String?  // optional link
  amount        Decimal  @db.Decimal(12,2)
  destination   String   // original payment method identifier
  processingFee Decimal  @db.Decimal(12,2)
  description   String?  // admin-only, not exposed to customers
  createdAt     DateTime @default(now())
}

// Engagement model
model Engagement {
  id               String            @id @default(uuid())
  referenceId      String            @unique
  createdByProfileId String
  payment          Payment?          @relation()
  paymentId        String?
  groupId          String?
  bookingType      BookingType?
  status           EngagementStatus  @default(Pending)
  createdAt        DateTime          @default(now())
  participants     EngagementParticipant[]
}

model EngagementParticipant {
  id           String   @id @default(uuid())
  engagement   Engagement @relation(fields: [engagementId], references: [id])
  engagementId String
  profileId    String
  engagementRole String
  status       String
  amount       Decimal  @db.Decimal(12,2)
  cancellationReason String?
}
