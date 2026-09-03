import { Request, Response, NextFunction } from "express";

// For local testing we accept X-Staff-Id and X-Staff-Role headers.
export function staffAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const staffId = req.header("x-staff-id") || req.header("X-Staff-Id");
  const staffRole = req.header("x-staff-role") || req.header("X-Staff-Role");
  if (staffId && staffRole) {
    req.staff = { id: staffId as string, role: staffRole as string };
  }
  next();
}

export function requireRoles(allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.staff) return res.status(401).json({ error: "Unauthorized: staff auth required" });
    if (!allowed.includes(req.staff.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient staff role" });
    }
    next();
  };
}
