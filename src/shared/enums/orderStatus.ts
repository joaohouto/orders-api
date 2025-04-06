export const OrderStatuses = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PRODUCTION: "IN_PRODUCTION",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED",
} as const;

export type OrderStatus = keyof typeof OrderStatuses;
