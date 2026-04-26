const HTTP_MIN = 100;
const HTTP_MAX = 599;

/** @type {unique symbol} Non-enumerable { requestId?, traceId? } */
const kContext = Symbol("ApiErrorResponse._context");

/** @type {unique symbol} Original stack for wrapped Error (dev-only JSON). */
const kCapturedStack = Symbol("ApiErrorResponse._capturedStack");

/**
 * @typedef {Object} ApiRequestContext
 * @property {string} [requestId]
 * @property {string} [traceId]
 *
 * @typedef {Object} ApiErrorMeta
 * @property {string} timestamp ISO-8601 UTC
 * @property {string} [requestId]
 * @property {string} [traceId]
 *
 * @typedef {Object} ApiValidationIssue
 * @property {string} [path] Field or dotted path
 * @property {string} [field] Legacy alias for path
 * @property {string} [message] Human description
 * @property {string} [code] Machine-readable sub-code
 * @property {string} [msg] Legacy alias for message
 * @property {Record<string, unknown>} [ext] Extra vendor-specific data
 *
 * @typedef {Object} ApiErrorStandardOptions
 * @property {number} [statusCode]
 * @property {string} [message]
 * @property {string} [errorCode] Machine-readable; defaults to E_<statusCode>
 * @property {unknown} [errorDetails] Extra safe-to-expose context (not stack traces)
 * @property {ApiValidationIssue[]|unknown[]} [errors] Validation or field errors
 * @property {string} [requestId]
 * @property {string} [traceId]
 */

let _tsNow;

/**
 * Injected in tests. Default: ISO-8601 UTC.
 * @param {() => string} [fn]
 */
function setTimestampProviderForTests(fn) {
  _tsNow = fn;
}

function getTimestamp() {
  return (_tsNow || (() => new Date().toISOString()))();
}

/**
 * @param {unknown} v
 * @returns {boolean}
 */
function isNonEmptyString(v) {
  return v != null && String(v) !== "";
}

/**
 * @param {unknown} v
 * @returns {v is Record<string, unknown>}
 */
function isPlainOptions(v) {
  if (v == null || typeof v !== "object") return false;
  if (Array.isArray(v)) return false;
  if (v instanceof Date || v instanceof RegExp) return false;
  if (v instanceof Error) return false;
  return Object.getPrototypeOf(v) === Object.prototype;
}

function isHttpCode(n) {
  return Number.isFinite(n) && n >= HTTP_MIN && n <= HTTP_MAX;
}

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 * @param {ApiErrorResponse} self
 * @param {ApiRequestContext} ctx
 */
function setRequestContext(self, ctx) {
  if (ctx == null) return;
  const cur = self[kContext] || {};
  if (isNonEmptyString(/** @type {string} */ (ctx.requestId)))
    cur.requestId = String(ctx.requestId);
  if (isNonEmptyString(/** @type {string} */ (ctx.traceId)))
    cur.traceId = String(ctx.traceId);
  if (Object.keys(cur).length) self[kContext] = cur;
}

/**
 * @param {ApiErrorResponse} self
 * @returns {ApiRequestContext}
 */
function getRequestContext(self) {
  return self[kContext] || {};
}

/**
 * @param {ApiErrorResponse} self
 * @returns {ApiErrorMeta}
 */
function buildErrorResponseMeta(self) {
  const ctx = getRequestContext(self);
  /** @type {ApiErrorMeta} */
  const m = { timestamp: getTimestamp() };
  if (ctx.requestId) m.requestId = ctx.requestId;
  if (ctx.traceId) m.traceId = ctx.traceId;
  return m;
}

/**
 * @param {ApiErrorMeta} meta
 * @param {Record<string, unknown>} body
 * @returns {Record<string, unknown>}
 */
function withMeta(body, meta) {
  if (body.meta) return { ...body, meta: { ...meta, ...body.meta } };
  return { ...body, meta };
}

/**
 * @param  {...any} a
 * @returns {{ isSuccess: boolean, statusCode: number, message: string, errorCode?: string, errorDetails?: unknown, errors?: unknown[], _capturedStack?: string } | null}
 */
function fromPositionalArgs(a) {
  const args = a;
  const len = args.length;

  if (len === 0) {
    return {
      isSuccess: false,
      statusCode: 400,
      message: "An error occurred",
    };
  }
  if (len === 1) {
    const [x] = args;
    if (isPlainOptions(x)) {
      return {
        isSuccess: x.isSuccess ?? false,
        statusCode: x.statusCode != null ? Number(x.statusCode) : 400,
        message: x.message ?? "An error occurred",
        errorCode: x.errorCode,
        errorDetails: x.errorDetails,
        errors: x.errors,
      };
    }
    if (x instanceof Error) {
      return {
        isSuccess: false,
        statusCode: 400,
        message: x.message,
        _capturedStack: x.stack,
      };
    }
    if (typeof x === "string") {
      return { isSuccess: false, statusCode: 400, message: x };
    }
    if (typeof x === "number" && isHttpCode(x)) {
      return { isSuccess: false, statusCode: x, message: "An error occurred" };
    }
    return { isSuccess: false, statusCode: 400, message: "An error occurred" };
  }
  if (len === 2) {
    const [p0, p1] = args;
    if (typeof p0 === "string" && typeof p1 === "number" && isHttpCode(p1)) {
      return { isSuccess: false, statusCode: p1, message: p0 };
    }
    if (typeof p0 === "number" && isHttpCode(p0) && (typeof p1 === "string" || p1 == null)) {
      return { isSuccess: false, statusCode: p0, message: p1 == null ? "An error occurred" : String(p1) };
    }
  }
  if (len === 3) {
    const [p0, p1, p2] = args;
    if (typeof p0 === "boolean" && typeof p1 === "number" && isHttpCode(p1) && (typeof p2 === "string" || p2 == null)) {
      return {
        isSuccess: false,
        statusCode: p1,
        message: p2 == null ? "An error occurred" : String(p2),
      };
    }
    if (typeof p0 === "string" && p1 == null && typeof p2 === "number" && isHttpCode(p2)) {
      return { isSuccess: false, statusCode: p2, message: p0 };
    }
    if (typeof p0 === "number" && isHttpCode(p0) && typeof p1 === "string") {
      return {
        isSuccess: false,
        statusCode: p0,
        message: p1,
        errorDetails: p2 == null ? undefined : p2,
      };
    }
  }

  if (len >= 4) {
    const [p0, p1, p2] = args;
    if (typeof p0 === "boolean" && typeof p1 === "number" && isHttpCode(p1) && typeof p2 === "string") {
      return { isSuccess: false, statusCode: p1, message: p2, errorDetails: args[3] };
    }
  }

  return { isSuccess: false, statusCode: 400, message: "An error occurred" };
}

/**
 * @param {string} code
 * @param {ApiValidationIssue[]} arr
 * @returns {Record<string, unknown>[]}
 */
function normalizeValidationErrors(code, arr) {
  if (!Array.isArray(arr) || !arr.length) return [];
  return arr.map((item) => {
    if (item == null || typeof item !== "object" || Array.isArray(item)) {
      return { message: String(item), code };
    }
    const o = /** @type {Record<string, unknown>} */ (item);
    const path = o.path ?? o.field;
    const message = o.message ?? o.msg;
    const out = /** @type {Record<string, unknown>} */ ({ code: o.code != null ? String(o.code) : code });
    if (path != null) out.path = String(path);
    if (message != null) out.message = String(message);
    for (const k of Object.keys(o)) {
      if (k === "path" || k === "field" || k === "message" || k === "msg" || k === "code")
        continue;
      out[k] = o[k];
    }
    return out;
  });
}

/**
 * @param {string | undefined} explicit
 * @param {number} statusCode
 */
function resolveErrorCode(explicit, statusCode) {
  if (isNonEmptyString(explicit)) return String(explicit);
  return `E_${statusCode}`;
}

class ApiErrorResponse extends Error {
  /**
   * @param  {...(ApiErrorStandardOptions | any)} args
   *  - options: `{ statusCode, message, errorCode?, errorDetails?, errors?, requestId?, traceId? }`
   *  - legacy positional: `(statusCode, message)`, `(message, statusCode)`,
   *  `(isSuccess, statusCode, message)`, `(message, null, statusCode)`,
   *  `(statusCode, message, errorDetails)`.
   */
  constructor(...args) {
    if (args.length === 1 && args[0] instanceof ApiErrorResponse) {
      const e = args[0];
      super(e.message);
      this.name = "ApiErrorResponse";
      this.isSuccess = false;
      this.statusCode = e.statusCode;
      this.message = e.message;
      this.errorCode = e.errorCode;
      this.errorDetails = e.errorDetails;
      this.errors = e.errors;
      if (e[kContext]) this[kContext] = { ...e[kContext] };
      if (e[kCapturedStack]) this[kCapturedStack] = e[kCapturedStack];
      return;
    }
    let opts;
    /** @type {{ requestId?: string, traceId?: string } | null} */
    let ctxFromOpts = null;
    if (args.length === 1 && isPlainOptions(args[0])) {
      const x = args[0];
      opts = {
        isSuccess: x.isSuccess ?? false,
        statusCode: x.statusCode != null ? Number(x.statusCode) : 400,
        message: x.message ?? "An error occurred",
        errorCode: x.errorCode,
        errorDetails: x.errorDetails,
        errors: x.errors,
        _capturedStack: x._capturedStack,
      };
      ctxFromOpts = { requestId: x.requestId, traceId: x.traceId };
    } else {
      opts = fromPositionalArgs(args) || { isSuccess: false, statusCode: 400, message: "An error occurred" };
    }

    if (!isHttpCode(opts.statusCode)) {
      opts.statusCode = 400;
    }
    if (typeof opts.message !== "string") {
      opts.message = String(opts.message ?? "An error occurred");
    }

    super(opts.message);
    this.name = "ApiErrorResponse";
    this.isSuccess = false;
    this.statusCode = /** @type {number} */ (opts.statusCode);
    this.message = opts.message;
    this.errorCode = resolveErrorCode(/** @type {string|undefined} */ (opts.errorCode), this.statusCode);
    this.errorDetails = opts.errorDetails;
    this.errors = Array.isArray(opts.errors) ? opts.errors : undefined;
    if (opts._capturedStack) {
      this[kCapturedStack] = String(opts._capturedStack);
    }
    if (ctxFromOpts) {
      setRequestContext(/** @type {any} */ (this), ctxFromOpts);
    }
  }

  get StatusCode() {
    return this.statusCode;
  }

  get ErrorMessage() {
    return this.message;
  }

  /**
   * @param {ApiRequestContext} ctx
   * @returns {this}
   */
  withContext(ctx) {
    setRequestContext(/** @type {any} */ (this), ctx);
    return this;
  }

  /**
   * @returns {Record<string, unknown>}
   */
  toJSON() {
    const meta = buildErrorResponseMeta(/** @type {any} */ (this));
    const errCode = this.errorCode;
    const validation = normalizeValidationErrors(
      errCode,
      Array.isArray(this.errors) ? this.errors : []
    );
    const body = /** @type {Record<string, unknown>} */ ({
      isSuccess: false,
      statusCode: this.statusCode,
      message: this.message,
      errorCode: errCode,
      ...(this.errorDetails != null ? { errorDetails: this.errorDetails } : {}),
      ...(validation.length > 0 ? { errors: validation } : {}),
    });
    if (isDevelopment()) {
      const s = this[kCapturedStack] || this.stack;
      if (isNonEmptyString(s)) {
        body.stack = s;
      }
    }
    return withMeta(body, meta);
  }
}

Object.assign(ApiErrorResponse, {
  /**
   * @param {() => string} fn
   * @returns {() => void} restore
   */
  _setTimestampProviderForTests(fn) {
    const prev = _tsNow;
    setTimestampProviderForTests(fn);
    return () => {
      setTimestampProviderForTests(prev);
    };
  },
});

export { ApiErrorResponse };
