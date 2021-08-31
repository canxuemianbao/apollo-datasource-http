"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPDataSource = exports.RequestError = void 0;
const apollo_datasource_1 = require("apollo-datasource");
const undici_1 = require("undici");
const http_1 = require("http");
const quick_lru_1 = __importDefault(require("@alloc/quick-lru"));
const apollo_server_errors_1 = require("apollo-server-errors");
const url_1 = require("url");
class RequestError extends Error {
    constructor(message, code, request, response) {
        super(message);
        this.message = message;
        this.code = code;
        this.request = request;
        this.response = response;
        this.name = 'RequestError';
    }
}
exports.RequestError = RequestError;
const statusCodeCacheableByDefault = new Set([200, 203]);
class HTTPDataSource extends apollo_datasource_1.DataSource {
    constructor(baseURL, options) {
        var _a, _b, _c, _d, _e;
        super();
        this.baseURL = baseURL;
        this.options = options;
        this.memoizedResults = new quick_lru_1.default({
            maxSize: ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.lru) === null || _b === void 0 ? void 0 : _b.maxSize) ? this.options.lru.maxSize : 100,
            maxAge: ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.lru) === null || _d === void 0 ? void 0 : _d.maxAge) ? this.options.lru.maxAge : 1000 * 60 * 5,
        });
        this.pool = (_e = options === null || options === void 0 ? void 0 : options.pool) !== null && _e !== void 0 ? _e : new undici_1.Pool(this.baseURL, options === null || options === void 0 ? void 0 : options.clientOptions);
        this.globalRequestOptions = options === null || options === void 0 ? void 0 : options.requestOptions;
        this.logger = options === null || options === void 0 ? void 0 : options.logger;
    }
    buildQueryString(query) {
        const params = new url_1.URLSearchParams();
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                const value = query[key];
                if (value !== undefined) {
                    params.append(key, value.toString());
                }
            }
        }
        params.sort();
        return params.toString();
    }
    initialize(config) {
        this.context = config.context;
        this.cache = config.cache;
    }
    isResponseOk(statusCode) {
        return statusCode >= 200 && statusCode <= 399;
    }
    isResponseCacheable(request, response) {
        return statusCodeCacheableByDefault.has(response.statusCode) && request.method === 'GET';
    }
    onCacheKeyCalculation(request) {
        return request.origin + request.path;
    }
    onResponse(request, response) {
        if (this.isResponseOk(response.statusCode)) {
            return response;
        }
        throw new RequestError(`Response code ${response.statusCode} (${http_1.STATUS_CODES[response.statusCode.toString()]})`, response.statusCode, request, response);
    }
    async get(path, requestOptions) {
        return this.request({
            headers: {},
            query: {},
            body: null,
            context: {},
            ...requestOptions,
            method: 'GET',
            path,
            origin: this.baseURL,
        });
    }
    async post(path, requestOptions) {
        return this.request({
            headers: {},
            query: {},
            body: null,
            context: {},
            ...requestOptions,
            method: 'POST',
            path,
            origin: this.baseURL,
        });
    }
    async delete(path, requestOptions) {
        return this.request({
            headers: {},
            query: {},
            body: null,
            context: {},
            ...requestOptions,
            method: 'DELETE',
            path,
            origin: this.baseURL,
        });
    }
    async put(path, requestOptions) {
        return this.request({
            headers: {},
            query: {},
            body: null,
            context: {},
            ...requestOptions,
            method: 'PUT',
            path,
            origin: this.baseURL,
        });
    }
    async patch(path, requestOptions) {
        return this.request({
            headers: {},
            query: {},
            body: null,
            context: {},
            ...requestOptions,
            method: 'PATCH',
            path,
            origin: this.baseURL,
        });
    }
    async performRequest(request, cacheKey) {
        var _a, _b, _c;
        try {
            if (request.body !== null && typeof request.body === 'object') {
                if (request.headers['content-type'] === undefined) {
                    request.headers['content-type'] = 'application/json; charset=utf-8';
                }
                request.body = JSON.stringify(request.body);
            }
            await ((_a = this.onRequest) === null || _a === void 0 ? void 0 : _a.call(this, request));
            const requestOptions = {
                method: request.method,
                origin: request.origin,
                path: request.path,
                headers: request.headers,
                signal: request.signal,
                body: request.body,
            };
            const responseData = await this.pool.request(requestOptions);
            let body = await responseData.body.text();
            if (((_b = responseData.headers['content-type']) === null || _b === void 0 ? void 0 : _b.includes('application/json')) &&
                body.length &&
                typeof body === 'string') {
                body = JSON.parse(body);
            }
            const response = {
                isFromCache: false,
                memoized: false,
                ...responseData,
                body: body,
            };
            this.onResponse(request, response);
            if (request.requestCache && this.isResponseCacheable(request, response)) {
                response.maxTtl = request.requestCache.maxTtl;
                const cachedResponse = JSON.stringify(response);
                this.cache
                    .set(cacheKey, cachedResponse, {
                    ttl: request.requestCache.maxTtl,
                })
                    .catch((err) => { var _a; return (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(err); });
                this.cache
                    .set(`staleIfError:${cacheKey}`, cachedResponse, {
                    ttl: request.requestCache.maxTtl + request.requestCache.maxTtlIfError,
                })
                    .catch((err) => { var _a; return (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(err); });
            }
            return response;
        }
        catch (error) {
            (_c = this.onError) === null || _c === void 0 ? void 0 : _c.call(this, error, request);
            if (request.requestCache) {
                const cacheItem = await this.cache.get(`staleIfError:${cacheKey}`);
                if (cacheItem) {
                    const response = JSON.parse(cacheItem);
                    response.isFromCache = true;
                    return response;
                }
            }
            throw (0, apollo_server_errors_1.toApolloError)(error);
        }
    }
    async request(request) {
        var _a;
        if (Object.keys(request.query).length > 0) {
            request.path = request.path + '?' + this.buildQueryString(request.query);
        }
        const cacheKey = this.onCacheKeyCalculation(request);
        if (request.method === 'GET') {
            if (this.memoizedResults.has(cacheKey)) {
                const response = await this.memoizedResults.get(cacheKey);
                response.memoized = true;
                response.isFromCache = false;
                return response;
            }
        }
        const options = {
            ...request,
            ...this.globalRequestOptions,
        };
        if (options.method === 'GET') {
            if (request.requestCache) {
                try {
                    const cacheItem = await this.cache.get(cacheKey);
                    if (cacheItem) {
                        const cachedResponse = JSON.parse(cacheItem);
                        cachedResponse.memoized = false;
                        cachedResponse.isFromCache = true;
                        return cachedResponse;
                    }
                    const response = this.performRequest(options, cacheKey);
                    this.memoizedResults.set(cacheKey, response);
                    return response;
                }
                catch (error) {
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(`Cache item '${cacheKey}' could not be loaded: ${error.message}`);
                }
            }
            const response = this.performRequest(options, cacheKey);
            this.memoizedResults.set(cacheKey, response);
            return response;
        }
        return this.performRequest(options, cacheKey);
    }
}
exports.HTTPDataSource = HTTPDataSource;
//# sourceMappingURL=http-data-source.js.map