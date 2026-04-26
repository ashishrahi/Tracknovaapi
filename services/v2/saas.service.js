import crypto from "crypto";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { getCentralDBModels } from "../../db/index.js";
import sendMailService from "../../utils/emailService/nodeMailer.js";

function ensureObjectId(id, fieldName) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, `Invalid ${fieldName}`);
  }
  return new mongoose.Types.ObjectId(id);
}

function assertSuperAdmin(user) {
  if (user?.users?.[0]?.role !== "SuperAdmin") {
    throw new ApiErrorResponse(StatusCodes.FORBIDDEN, "Only SuperAdmin can perform this action");
  }
}

export async function createCheckoutSessionService(payload) {
  const { Company, SaasSubscriptionInvoice } = await getCentralDBModels();
  const companyId = ensureObjectId(payload.companyId, "companyId");
  const company = await Company.findById(companyId).lean();
  if (!company) {
    throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Company not found");
  }

  const provider = payload.provider === "stripe" ? "stripe" : "razorpay";
  const amount = Number(payload.amount || 0);
  if (!amount || amount <= 0) {
    throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Amount must be greater than 0");
  }

  const planCode = String(payload.planCode || "PRO_MONTHLY").trim();
  const providerSubscriptionId = `sub_${provider}_${Date.now()}`;
  const providerInvoiceId = `inv_${provider}_${Date.now()}`;

  const invoice = await SaasSubscriptionInvoice.create({
    companyId,
    provider,
    providerInvoiceId,
    providerSubscriptionId,
    planCode,
    amount,
    currency: (payload.currency || "INR").toUpperCase(),
    status: "created",
    metadata: { initiatedBy: payload.initiatedBy || "system" },
  });

  return {
    invoiceId: String(invoice._id),
    provider,
    checkoutUrl:
      provider === "razorpay"
        ? `${process.env.RAZORPAY_CHECKOUT_URL || "https://checkout.razorpay.com"}/pay/${providerSubscriptionId}`
        : `${process.env.STRIPE_CHECKOUT_URL || "https://checkout.stripe.com"}/pay/${providerSubscriptionId}`,
    providerSubscriptionId,
    providerInvoiceId,
  };
}

export async function markInvoicePaidFromWebhookService(payload, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  if (!secret) {
    throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Webhook secret not configured");
  }
  const expected = crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");
  if (signature !== expected) {
    throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Invalid webhook signature");
  }

  const { SaasSubscriptionInvoice, Company } = await getCentralDBModels();
  const providerInvoiceId = payload?.payload?.payment?.entity?.invoice_id;
  const paidAt = payload?.payload?.payment?.entity?.created_at
    ? new Date(payload.payload.payment.entity.created_at * 1000)
    : new Date();
  const invoice = await SaasSubscriptionInvoice.findOneAndUpdate(
    { providerInvoiceId },
    { $set: { status: "paid", periodStart: paidAt, periodEnd: new Date(paidAt.getTime() + 30 * 24 * 60 * 60 * 1000) } },
    { new: true }
  );
  if (!invoice) {
    throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Invoice not found");
  }

  await Company.updateOne(
    { _id: invoice.companyId },
    {
      $set: {
        "subscription.status": "Active",
        "subscription.plan": invoice.planCode.includes("ENTERPRISE") ? "Enterprise" : "Pro",
        "subscription.fromDate": invoice.periodStart || new Date(),
        "subscription.toDate": invoice.periodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }
  );

  return { ok: true, invoiceId: invoice._id };
}

export async function upsertTenantUsageMetricService(payload) {
  const { TenantUsageMetric } = await getCentralDBModels();
  const companyId = ensureObjectId(payload.companyId, "companyId");
  const metricDate = payload.metricDate ? new Date(payload.metricDate) : new Date();
  const metricDay = new Date(Date.UTC(metricDate.getUTCFullYear(), metricDate.getUTCMonth(), metricDate.getUTCDate()));

  const doc = await TenantUsageMetric.findOneAndUpdate(
    { companyId, metricDate: metricDay },
    {
      $set: {
        dbName: payload.dbName,
        users: Number(payload.users || 0),
        vehicles: Number(payload.vehicles || 0),
        activeDevices: Number(payload.activeDevices || 0),
        apiCalls: Number(payload.apiCalls || 0),
      },
    },
    { upsert: true, new: true }
  ).lean();

  return doc;
}

export async function listTenantUsageSeriesService(companyId, days = 30) {
  const { TenantUsageMetric } = await getCentralDBModels();
  const cid = ensureObjectId(companyId, "companyId");
  const limitDays = Math.min(365, Math.max(1, Number(days) || 30));
  const from = new Date(Date.now() - limitDays * 24 * 60 * 60 * 1000);
  return TenantUsageMetric.find({ companyId: cid, metricDate: { $gte: from } }).sort({ metricDate: 1 }).lean();
}

export async function sendLifecycleEventEmailService(payload) {
  const { Company, LifecycleEmailLog } = await getCentralDBModels();
  const companyId = ensureObjectId(payload.companyId, "companyId");
  const company = await Company.findById(companyId).lean();
  if (!company) {
    throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Company not found");
  }
  const eventType = String(payload.eventType || "subscription_activated");
  const subject = `[${company.companyName}] ${eventType.replace(/_/g, " ")}`;
  const to = payload.to || company.companyEmail;
  const html = `<h3>${company.companyName}</h3><p>Event: ${eventType}</p><p>Plan: ${company.subscription?.plan || "N/A"}</p>`;

  const log = await LifecycleEmailLog.create({ companyId, eventType, to, subject, status: "queued" });
  try {
    await sendMailService(process.env.NODEMAILER_EMAIL_USER, to, subject, subject, html);
    await LifecycleEmailLog.updateOne({ _id: log._id }, { $set: { status: "sent" } });
    return { id: log._id, status: "sent" };
  } catch (e) {
    await LifecycleEmailLog.updateOne({ _id: log._id }, { $set: { status: "failed", errorMessage: e?.message || "mail_failed" } });
    throw e;
  }
}

export async function createSupportTicketService(payload, actor) {
  const { SupportTicket } = await getCentralDBModels();
  const companyId = ensureObjectId(payload.companyId, "companyId");
  return SupportTicket.create({
    companyId,
    dbName: payload.dbName,
    title: payload.title,
    description: payload.description,
    priority: payload.priority || "medium",
    createdBy: actor || {},
  });
}

export async function listSupportTicketsService(filter = {}) {
  const { SupportTicket } = await getCentralDBModels();
  const q = {};
  if (filter.companyId) q.companyId = ensureObjectId(filter.companyId, "companyId");
  if (filter.status) q.status = String(filter.status);
  return SupportTicket.find(q).sort({ createdAt: -1 }).limit(200).lean();
}

export async function updateSupportTicketService(id, patch) {
  const { SupportTicket } = await getCentralDBModels();
  const oid = ensureObjectId(id, "ticketId");
  const updates = {};
  if (patch.status) updates.status = patch.status;
  if (patch.priority) updates.priority = patch.priority;
  if (patch.resolutionNote !== undefined) updates.resolutionNote = patch.resolutionNote;
  const ticket = await SupportTicket.findOneAndUpdate({ _id: oid }, { $set: updates }, { new: true }).lean();
  if (!ticket) throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Support ticket not found");
  return ticket;
}

export async function startImpersonationService(payload, user) {
  assertSuperAdmin(user);
  const { Company, ImpersonationSession } = await getCentralDBModels();
  const companyId = ensureObjectId(payload.companyId, "companyId");
  const company = await Company.findById(companyId).lean();
  if (!company?.database?.dbName) {
    throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Company or tenant DB missing");
  }
  const superAdmin = user.users[0];
  const session = await ImpersonationSession.create({
    superAdminUserId: String(superAdmin._id),
    superAdminUsername: superAdmin.username,
    companyId,
    companyDbName: company.database.dbName,
    targetUsername: payload.targetUsername || "admin",
    reason: payload.reason || "",
  });
  return {
    sessionId: session._id,
    impersonation: {
      companyId: String(company._id),
      dbName: company.database.dbName,
      targetUsername: session.targetUsername,
      isActive: true,
    },
  };
}

export async function stopImpersonationService(sessionId, user) {
  assertSuperAdmin(user);
  const { ImpersonationSession } = await getCentralDBModels();
  const sid = ensureObjectId(sessionId, "sessionId");
  const session = await ImpersonationSession.findOneAndUpdate(
    { _id: sid, isActive: true },
    { $set: { isActive: false, endedAt: new Date() } },
    { new: true }
  ).lean();
  if (!session) throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Impersonation session not found");
  return { sessionId: session._id, isActive: false };
}

export async function revenueDashboardService(rangeDays = 30) {
  const { SaasSubscriptionInvoice } = await getCentralDBModels();
  const days = Math.min(365, Math.max(1, Number(rangeDays) || 30));
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await SaasSubscriptionInvoice.find({ status: "paid", createdAt: { $gte: from } }).lean();

  const mrr = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const byPlan = {};
  const byGateway = {};
  for (const row of rows) {
    byPlan[row.planCode] = (byPlan[row.planCode] || 0) + Number(row.amount || 0);
    byGateway[row.provider] = (byGateway[row.provider] || 0) + Number(row.amount || 0);
  }
  return {
    mrr,
    paidInvoices: rows.length,
    avgInvoiceValue: rows.length ? Math.round((mrr / rows.length) * 100) / 100 : 0,
    byPlan,
    byGateway,
  };
}
