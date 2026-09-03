import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { staffAuthMiddleware, requireRoles } from "./middleware/auth";
import { idempotencyMiddleware } from "./middleware/idempotency";
import profilesRouter from "./routes/admin/profiles";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// attach prisma to request (simple DI)
declare global {
  namespace Express {
    interface Request {
      prisma?: PrismaClient;
      staff?: { id: string; role: string };
    }
  }
}

app.use((req, _res, next) => {
  req.prisma = prisma;
  next();
});

// simple staff auth for testing
app.use(staffAuthMiddleware);

// Idempotency middleware applied before admin routes. It will only act when an Idempotency-Key header is present.
app.use(idempotencyMiddleware);

app.use("/admin/profiles", requireRoles(["SUPER_ADMIN","VERIFICATION_OFFICER","MODERATOR"]), profilesRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
