import { PlanTier } from "@prisma/client";

export const PLAN_LIMITS: Record<PlanTier, number | null> = {
  ESSENTIAL: 300,
  PROFESSIONAL: 1500,
  ULTIMATE: null,
};

export function resolveAuthorizationLimit(
  plan: PlanTier,
  customLimit?: number | null
) {
  if (typeof customLimit === "number") {
    return customLimit;
  }

  return PLAN_LIMITS[plan];
}
