const HTTP_MIN = 100;
const HTTP_MAX = 599;

const W_RETURN_DATA = "returnData";
const W_COMMON = "common";
const W_DB = "dbReturn";

/** @type {unique symbol} Non-enumerable envelope tag (omitted from JSON and Object.assign). */
const kEnvelope = Symbol("ApiSuccessResponse._envelope");

/**
 * @type {unique symbol} Non-enumerable { requestId?, traceId? }.
 * Prevents accidental spread onto downstream payloads.
 */
const kContext = Symbol("ApiSuccessResponse._context");

const W = Object.freeze({
  RETURN_DATA: W_RETURN_DATA,
  COMMON: W_COMMON,
  DB: W_DB,
});

/**
 * @typedef {typeof W[keyof typeof W]} EnvelopeName
 *
 * @typedef {Object} ApiRequestContext
 * @property {string} [requestId] Correlates to gateway / load balancer request id
 * @property {string} [traceId] OpenTelemetry or W3C trace id (often same as or parent of requestId)
 *
 * @typedef {Object} ApiPaginationMeta
 * @property {number} [page] 1-based page index
 * @property {number} [pageSize] Items per page
 * @property {number} [total] Total items across all pages (when known)
 * @property {number} [totalPages] Derived: ceil(total / pageSize) when total and pageSize are set
 * @property {boolean} [hasNext] Whether another page exists after the current one
 * @property {boolean} [hasPrevious] Whether a page exists before the current one
 *
 * @typedef {Object} ApiResponseMeta
 * @property {string} timestamp ISO-8601 UTC
 * @property {string} [requestId]
 * @property {string} [traceId]
 * @property {ApiPaginationMeta} [pagination] Cursor/offset style pagination
 *
 * @typedef {Object} ApiSuccessStandardOptions
 * @property {boolean} [isSuccess]
 * @property {number} [statusCode] HTTP status for transport (also exposed in body where applicable)
 * @property {string} [message] Human-facing message
 * @property {unknown} [data] Payload
 * @property {number} [pageNo] Legacy: 1-based page
 * @property {number} [pageSize] Legacy: page size
 * @property {number} [rowCount] Row count (list length or total depending on call site)
 * @property {number} [totalCount] Total rows for paginated collection when known
 * @property {string} [requestId] Shorthand for kContext
 * @property {string} [traceId] Shorthand for kContext
 * @property {EnvelopeName} [envelope] Internal: returnData | common | dbReturn
 * @property {any[]} [_commonArgs] Internal: variadic for common()
 *
 * @typedef {Object} ReturnDataOptions
 * @property {boolean} isSuccess
 * @property {boolean} [internalSuccess] Omitted from JSON; kept for backward-compat typing only
 * @property {string} [mesg] Maps to public `message`
 * @property {unknown} [insertedId]
 * @property {unknown} [data]
 * @property {string} [requestId]
 * @property {string} [traceId]
 * @property {typeof W.RETURN_DATA} [envelope]
 *
 * @typedef {Object} DbReturnOptions
 * @property {boolean} isSuccess
 * @property {string|number|null} [id]
 * @property {string|number|boolean} [createUpdate]
 * @property {string} [msg] Maps to public `message`
 * @property {unknown} [data]
 * @property {string} [requestId]
 * @property {string} [traceId]
 * @property {typeof W.DB} [envelope]
 */

function isHttpCode(n) {
  return Number.isFinite(n) && n >= HTTP_MIN && n <= HTTP_MAX;
}

/**
 * @param {unknown} v
 * @returns {v is Record<string, unknown>}
 */
function isPlainOptions(v) {
  if (v == null || typeof v !== "object") return false;
  if (Array.isArray(v)) return false;
  if (v instanceof Date || v instanceof RegExp) return false;
  return Object.getPrototypeOf(v) === Object.prototype;
}

/**
 * @param {ApiSuccessResponse} self
 * @param {ApiRequestContext} ctx
 */
function setRequestContext(self, ctx) {
  if (ctx == null) return;
  const cur = self[kContext] || {};
  if (ctx.requestId != null && String(ctx.requestId) !== "")
    cur.requestId = String(ctx.requestId);
  if (ctx.traceId != null && String(ctx.traceId) !== "") cur.traceId = String(ctx.traceId);
  if (Object.keys(cur).length) self[kContext] = cur;
}

/**
 * @param {ApiSuccessResponse} self
 * @returns {ApiRequestContext}
 */
function getRequestContext(self) {
  return self[kContext] || {};
}

/**
 * @param  {any[]} args
 * @returns {object|null} null = caller should not use this helper (e.g. empty input)
 */
function fromPositionalArgs(args) {
  const len = args.length;

  if (len === 0) {
    return { isSuccess: true, statusCode: 200, message: "OK", data: undefined };
  }
  if (len === 2) {
    const [a, b] = args;
    if (typeof a === "number" && isHttpCode(a) && typeof b === "string") {
      return {
        isSuccess: a >= 200 && a < 300,
        statusCode: a,
        message: b,
        data: undefined,
      };
    }
  }
  if (len === 3) {
    const [a, b, c] = args;
    if (typeof a === "boolean" && typeof b === "number" && isHttpCode(b) && typeof c === "string") {
      return { isSuccess: a, statusCode: b, message: c, data: undefined };
    }
    if (typeof a === "number" && isHttpCode(a) && typeof b === "string") {
      return {
        isSuccess: a >= 200 && a < 300,
        statusCode: a,
        message: b,
        data: c,
      };
    }
  }
  if (len === 4) {
    const [a, b, c, d] = args;
    if (typeof a === "boolean" && typeof b === "number" && isHttpCode(b) && typeof c === "string") {
      return { isSuccess: a, statusCode: b, message: c, data: d };
    }
    if (typeof a === "number" && isHttpCode(a) && typeof b === "number" && isHttpCode(b) && typeof c === "string" && a === b) {
      return {
        isSuccess: a >= 200 && a < 300,
        statusCode: a,
        message: c,
        data: d,
      };
    }
  }
  if (len === 5) {
    const [a, b, c, d, e] = args;
    if (typeof a === "boolean" && typeof b === "number" && isHttpCode(b) && typeof c === "string") {
      return { isSuccess: a, statusCode: b, message: c, data: d, rowCount: e };
    }
  }
  if (len === 6) {
    const [a, b, c, d, e, f] = args;
    if (typeof a === "boolean" && typeof b === "number" && isHttpCode(b) && typeof c === "string") {
      return {
        isSuccess: a,
        statusCode: b,
        message: c,
        data: d,
        pageNo: e,
        pageSize: f,
      };
    }
  }
  if (len === 7) {
    const [a, b, c, d, pNo, pSize, rCount] = args;
    if (typeof a === "boolean" && typeof b === "number" && isHttpCode(b) && typeof c === "string") {
      return {
        isSuccess: a,
        statusCode: b,
        message: c,
        data: d,
        pageNo: pNo,
        pageSize: pSize,
        rowCount: rCount,
      };
    }
  }
  return null;
}

/**
 * @param  {any[]} args
 * @returns {{ isSuccess: any, internalSuccess: any, mesg: any, insertedId: any, data: any }}
 */
function parseReturnDataArgsToObject(args) {
  const n = args.length;
  const isSuccess = args[0];
  const internalSuccess = args[1];
  const mesg = args[2];
  const insertedId = args[3];
  const data = args[4];
  if (n <= 2) {
    return { isSuccess, internalSuccess, mesg: undefined, insertedId: undefined, data: undefined };
  }
  if (n === 3) {
    return { isSuccess, internalSuccess, mesg, insertedId: undefined, data: undefined };
  }
  if (n === 4) {
    return { isSuccess, internalSuccess, mesg, insertedId, data: undefined };
  }
  if (mesg == null && typeof insertedId === "string" && data !== undefined) {
    return { isSuccess, internalSuccess, mesg: insertedId, insertedId: null, data };
  }
  return { isSuccess, internalSuccess, mesg, insertedId, data };
}

/**
 * @param  {any[]} args CommonResponse legacy variadic
 * @returns {Record<string, any>}
 */
function toCommonStandardBody(args) {
  const n = args.length;
  const status = args[0];
  const message = args[1];
  const statusOk = status === 1 || status === true || (typeof status === "string" && status === "1");
  const base = { isSuccess: statusOk, statusCode: 200, message, data: args[2] };
  if (n === 2) {
    return { ...base, data: undefined };
  }
  if (n === 3) {
    return base;
  }
  if (n === 4) {
    return { ...base, rowCount: args[3] };
  }
  if (n === 5) {
    return { ...base, rowCount: args[3], pageNo: args[4] };
  }
  if (n === 6) {
    return {
      isSuccess: statusOk,
      statusCode: 200,
      message,
      data: args[2],
      totalCount: args[3],
      pageNo: args[4],
      pageSize: args[5],
      rowCount: args[3],
    };
  }
  if (n === 7) {
    if (args[3] == null) {
      return {
        isSuccess: statusOk,
        statusCode: 200,
        message,
        data: args[2],
        pageNo: args[4],
        pageSize: args[5],
        rowCount: args[6],
      };
    }
    return {
      isSuccess: statusOk,
      statusCode: 200,
      message,
      data: args[2],
      totalCount: args[3],
      pageNo: args[5],
      pageSize: args[6],
      rowCount: args[3],
    };
  }
  return { ...base, data: undefined };
}

/**
 * @param {object} self
 * @param {any[]} args
 */
function initCommonEnvelop(self, args) {
  const n = args.length;
  const std = toCommonStandardBody(args);
  self[kEnvelope] = W_COMMON;
  self.isSuccess = std.isSuccess;
  self.statusCode = std.statusCode;
  self.status = args[0];
  self.message = args[1];
  if (std.pageNo !== undefined) self.pageNo = std.pageNo;
  if (std.pageSize !== undefined) self.pageSize = std.pageSize;
  if (std.rowCount !== undefined) self.rowCount = std.rowCount;
  if (std.totalCount !== undefined) self.totalCount = std.totalCount;
  if (n === 2) return;
  self.data = args[2];
  if (n === 3) return;
  if (n === 4) {
    self.rowCount = args[3];
    return;
  }
  if (n === 5) {
    self.rowCount = args[3];
    self.pageNo = args[4];
    return;
  }
  if (n === 6) {
    self.data = args[2];
    self.totalCount = args[3];
    self.pageNo = args[4];
    self.pageSize = args[5];
    self.rowCount = args[3];
    return;
  }
  if (n === 7) {
    self.data = args[2];
    if (args[3] == null) {
      self.pageNo = args[4];
      self.pageSize = args[5];
      self.rowCount = args[6];
    } else {
      self.totalCount = args[3];
      self.pageNo = args[5];
      self.pageSize = args[6];
      self.rowCount = args[3];
    }
  }
}

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
 * @param {object} p
 * @param {number} [p.pageNo]
 * @param {number} [p.pageSize]
 * @param {number} [p.totalCount]
 * @param {number} [p.rowCount] Used as total when page+size are set (e.g. paginated list total)
 * @returns {ApiPaginationMeta | null} Null when a bare rowCount with no page context would be ambiguous
 */
function buildPaginationMeta(p) {
  const page = p.pageNo;
  const pageSize = p.pageSize;
  const totalCount = p.totalCount;
  const rowCount = p.rowCount;

  const hasPage = page != null && Number.isFinite(Number(page));
  const hasSize = pageSize != null && Number.isFinite(Number(pageSize));
  const hasTotalCount = totalCount != null && Number.isFinite(Number(totalCount));

  if (hasPage && hasSize) {
    const out = /** @type {ApiPaginationMeta} */ ({});
    out.page = Math.max(1, Math.floor(Number(page)));
    out.pageSize = Math.max(1, Math.floor(Number(pageSize)));
    let total;
    if (hasTotalCount) {
      total = Math.max(0, Math.floor(Number(totalCount)));
    } else if (rowCount != null && Number.isFinite(Number(rowCount))) {
      total = Math.max(0, Math.floor(Number(rowCount)));
    } else {
      return out;
    }
    out.total = total;
    out.totalPages = Math.max(1, Math.ceil(total / out.pageSize));
    out.hasPrevious = out.page > 1;
    out.hasNext = out.page < out.totalPages;
    return out;
  }

  if (hasTotalCount && !hasPage && !hasSize) {
    return { total: Math.max(0, Math.floor(Number(totalCount))) };
  }

  return null;
}

/**
 * @param {ApiSuccessResponse} self
 * @returns {ApiResponseMeta}
 */
function buildResponseMeta(self) {
  const ctx = getRequestContext(self);
  /** @type {ApiResponseMeta} */
  const m = { timestamp: getTimestamp() };
  if (ctx.requestId) m.requestId = ctx.requestId;
  if (ctx.traceId) m.traceId = ctx.traceId;

  const p = buildPaginationMeta({
    pageNo: self.pageNo,
    pageSize: self.pageSize,
    totalCount: self.totalCount,
    rowCount: self.rowCount,
  });
  if (p) m.pagination = p;
  return m;
}

/**
 * @param {ApiResponseMeta} meta
 * @param {Record<string, unknown>} body
 * @returns {Record<string, unknown>}
 */
function withMeta(body, meta) {
  if (body.meta) return { ...body, meta: { ...meta, ...body.meta } };
  return { ...body, meta };
}

class ApiSuccessResponse {
  /**
   * @param  {...(ApiSuccessStandardOptions | any)} args
   *  - options object: `{ isSuccess, statusCode, message, data, pageNo?, pageSize?, rowCount?, requestId?, traceId? }` for standard
   *  - or internal: `{ envelope: 'returnData' | 'common' | 'dbReturn', ... }` (use statics).
   *  - legacy positional: `(isSuccess, statusCode, message, data, …)` for standard.
   */
  constructor(...args) {
    if (args.length === 1 && isPlainOptions(args[0])) {
      const o = args[0];
      if (o.envelope === W_RETURN_DATA) {
        this[kEnvelope] = W_RETURN_DATA;
        this.isSuccess = o.isSuccess;
        this.insertedId = o.insertedId;
        this.data = o.data;
        this.statusCode = 200;
        this.message = o.mesg != null && o.mesg !== undefined ? String(o.mesg) : "OK";
        setRequestContext(/** @type {any} */ (this), o);
        return;
      }
      if (o.envelope === W_DB) {
        this[kEnvelope] = W_DB;
        this.isSuccess = o.isSuccess;
        this.id = o.id;
        this.createUpdate = o.createUpdate;
        this.data = o.data;
        this.statusCode = 200;
        this.message = o.msg != null ? String(o.msg) : "OK";
        setRequestContext(/** @type {any} */ (this), o);
        return;
      }
      if (o.envelope === W_COMMON && o._commonArgs) {
        initCommonEnvelop(this, o._commonArgs);
        setRequestContext(/** @type {any} */ (this), o);
        return;
      }

      this.isSuccess = o.isSuccess ?? true;
      this.statusCode = o.statusCode != null ? Number(o.statusCode) : 200;
      this.message = o.message != null ? String(o.message) : "OK";
      this.data = o.data;
      if (o.pageNo !== undefined) this.pageNo = o.pageNo;
      if (o.pageSize !== undefined) this.pageSize = o.pageSize;
      if (o.rowCount !== undefined) this.rowCount = o.rowCount;
      if (o.totalCount !== undefined) this.totalCount = o.totalCount;
      setRequestContext(/** @type {any} */ (this), o);
      return;
    }

    const n = fromPositionalArgs(args);
    if (n == null) {
      this.isSuccess = true;
      this.statusCode = 200;
      this.message = "OK";
      this.data = undefined;
    } else {
      this.isSuccess = n.isSuccess;
      this.statusCode = n.statusCode;
      this.message = n.message;
      this.data = n.data;
      if (n.pageNo !== undefined) this.pageNo = n.pageNo;
      if (n.pageSize !== undefined) this.pageSize = n.pageSize;
      if (n.rowCount !== undefined) this.rowCount = n.rowCount;
    }
  }

  get StatusCode() {
    return this.statusCode;
  }

  /**
   * Attach W3C / platform correlation ids (not enumerable; only serialized under `meta`).
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
    const env = this[kEnvelope];
    const meta = buildResponseMeta(this);

    if (env === W_RETURN_DATA) {
      const body = {
        isSuccess: this.isSuccess,
        message: this.message,
        ...(this.data !== undefined && { data: this.data }),
        ...(this.insertedId !== undefined && { insertedId: this.insertedId }),
      };
      return withMeta(body, meta);
    }

    if (env === W_COMMON) {
      const statusOk = this.status === 1 || this.status === true || (typeof this.status === "string" && this.status === "1");
      const body = {
        status: this.status,
        isSuccess: statusOk,
        message: this.message,
        ...(this.data !== undefined && { data: this.data }),
        ...(this.rowCount !== undefined && { rowCount: this.rowCount }),
        ...(this.pageNo !== undefined && { pageNo: this.pageNo }),
        ...(this.pageSize !== undefined && { pageSize: this.pageSize }),
        ...(this.totalCount !== undefined && { totalCount: this.totalCount }),
      };
      return withMeta(body, meta);
    }

    if (env === W_DB) {
      const body = {
        isSuccess: this.isSuccess,
        message: this.message,
        ...(this.id != null && { id: this.id }),
        ...(this.createUpdate !== undefined && { createUpdate: this.createUpdate }),
        ...(this.data !== undefined && { data: this.data }),
      };
      return withMeta(body, meta);
    }

    const body = {
      isSuccess: this.isSuccess,
      statusCode: this.statusCode,
      message: this.message,
      ...(this.data !== undefined && { data: this.data }),
      ...(this.pageNo !== undefined && { pageNo: this.pageNo }),
      ...(this.pageSize !== undefined && { pageSize: this.pageSize }),
      ...(this.rowCount !== undefined && { rowCount: this.rowCount }),
      ...(this.totalCount !== undefined && { totalCount: this.totalCount }),
    };
    return withMeta(body, meta);
  }
}

Object.assign(ApiSuccessResponse, {
  /** @readonly */
  Envelope: W,
  /**
   * Legacy .NET-style success body (`isSuccess`, `message`, `insertedId`, `data`).
   * `internalSuccess` and duplicate `mesg` are not exposed in JSON.
   */
  returnData(...args) {
    return new ApiSuccessResponse({
      envelope: W_RETURN_DATA,
      ...parseReturnDataArgsToObject(args),
    });
  },
  /**
   * Legacy `status` / list-detail (+ optional pagination) body.
   */
  common(...args) {
    return new ApiSuccessResponse({ envelope: W_COMMON, _commonArgs: args });
  },
  /**
   * Legacy mutation/DB result body. Only `message` is exposed (not duplicate `msg`).
   */
  dbReturn(isSuccess, id, createUpdate, msg, data) {
    return new ApiSuccessResponse({
      envelope: W_DB,
      isSuccess,
      id,
      createUpdate,
      msg,
      data,
    });
  },
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

export { ApiSuccessResponse };
