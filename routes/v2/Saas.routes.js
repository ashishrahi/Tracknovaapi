import express from "express";
import {
  createCheckoutSession,
  razorpayWebhook,
  upsertUsage,
  listUsage,
  sendLifecycleEmail,
  createSupportTicket,
  listSupportTickets,
  updateSupportTicket,
  startImpersonation,
  stopImpersonation,
  revenueDashboard,
} from "../../controllers/v2/saas.controller.js";

const router = express.Router();

router.post("/subscriptions/checkout-session", createCheckoutSession);
router.post("/subscriptions/webhook/razorpay", razorpayWebhook);

router.post("/usage", upsertUsage);
router.get("/usage/:companyId", listUsage);

router.post("/emails/lifecycle", sendLifecycleEmail);

router.post("/support/tickets", createSupportTicket);
router.get("/support/tickets", listSupportTickets);
router.patch("/support/tickets/:ticketId", updateSupportTicket);

router.post("/impersonation/start", startImpersonation);
router.post("/impersonation/stop", stopImpersonation);

router.get("/revenue/dashboard", revenueDashboard);

export default router;
