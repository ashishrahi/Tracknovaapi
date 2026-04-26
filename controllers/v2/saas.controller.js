import { StatusCodes } from "http-status-codes";
import { ApiSuccessResponse } from "../../utils/apiResponse/index.js";
import {
  createCheckoutSessionService,
  markInvoicePaidFromWebhookService,
  upsertTenantUsageMetricService,
  listTenantUsageSeriesService,
  sendLifecycleEventEmailService,
  createSupportTicketService,
  listSupportTicketsService,
  updateSupportTicketService,
  startImpersonationService,
  stopImpersonationService,
  revenueDashboardService,
} from "../../services/v2/saas.service.js";

function actorFromRequest(req) {
  const u0 = req.user?.users?.[0];
  return {
    userId: u0?._id ?? null,
    username: u0?.username ?? "unknown",
    email: u0?.email ?? "",
    role: u0?.role ?? "",
  };
}

export async function createCheckoutSession(req, res, next) {
  try {
    const data = await createCheckoutSessionService(req.body || {});
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Checkout session created", data));
  } catch (e) {
    next(e);
  }
}

export async function razorpayWebhook(req, res, next) {
  try {
    const sig = req.headers["x-razorpay-signature"];
    const data = await markInvoicePaidFromWebhookService(req.body || {}, sig);
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Webhook processed", data));
  } catch (e) {
    next(e);
  }
}

export async function upsertUsage(req, res, next) {
  try {
    const data = await upsertTenantUsageMetricService(req.body || {});
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Usage metric upserted", data));
  } catch (e) {
    next(e);
  }
}

export async function listUsage(req, res, next) {
  try {
    const data = await listTenantUsageSeriesService(req.params.companyId, req.query.days);
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Usage series", data));
  } catch (e) {
    next(e);
  }
}

export async function sendLifecycleEmail(req, res, next) {
  try {
    const data = await sendLifecycleEventEmailService(req.body || {});
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Lifecycle email processed", data));
  } catch (e) {
    next(e);
  }
}

export async function createSupportTicket(req, res, next) {
  try {
    const data = await createSupportTicketService(req.body || {}, actorFromRequest(req));
    return res.status(StatusCodes.CREATED).json(new ApiSuccessResponse(true, StatusCodes.CREATED, "Support ticket created", data));
  } catch (e) {
    next(e);
  }
}

export async function listSupportTickets(req, res, next) {
  try {
    const data = await listSupportTicketsService(req.query || {});
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Support tickets", data));
  } catch (e) {
    next(e);
  }
}

export async function updateSupportTicket(req, res, next) {
  try {
    const data = await updateSupportTicketService(req.params.ticketId, req.body || {});
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Support ticket updated", data));
  } catch (e) {
    next(e);
  }
}

export async function startImpersonation(req, res, next) {
  try {
    const data = await startImpersonationService(req.body || {}, req.user || {});
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Impersonation started", data));
  } catch (e) {
    next(e);
  }
}

export async function stopImpersonation(req, res, next) {
  try {
    const data = await stopImpersonationService(req.body?.sessionId, req.user || {});
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Impersonation stopped", data));
  } catch (e) {
    next(e);
  }
}

export async function revenueDashboard(req, res, next) {
  try {
    const data = await revenueDashboardService(req.query.days);
    return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "Revenue dashboard", data));
  } catch (e) {
    next(e);
  }
}
