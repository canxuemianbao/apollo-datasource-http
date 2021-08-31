"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const http_1 = __importDefault(require("http"));
const undici_1 = require("undici");
const abort_controller_1 = __importDefault(require("abort-controller"));
const querystring_1 = __importDefault(require("querystring"));
const src_1 = require("../src");
const agent = new undici_1.Agent({
    keepAliveTimeout: 10,
    keepAliveMaxTimeout: 10,
});
(0, undici_1.setGlobalDispatcher)(agent);
const test = ava_1.default;
test('Should be able to make a simple GET call', async (t) => {
    var _a;
    t.plan(5);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path);
        }
    })();
    const response = await dataSource.getFoo();
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.falsy(response.maxTtl);
    t.deepEqual(response.body, { name: 'foo' });
});
test('Should be able to make a simple POST call', async (t) => {
    var _a;
    t.plan(2);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'POST');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        postFoo() {
            return this.post(path);
        }
    })();
    const response = await dataSource.postFoo();
    t.deepEqual(response.body, { name: 'foo' });
});
test('Should be able to make a simple POST with JSON body', async (t) => {
    var _a;
    t.plan(4);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        t.is(req.method, 'POST');
        t.is(req.headers['content-type'], 'application/json; charset=utf-8');
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            var _a;
            t.deepEqual(data, '{"foo":"bar"}');
            res.writeHead(200, {
                'content-type': 'application/json',
            });
            res.write(JSON.stringify(wanted));
            res.end();
            (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
        });
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        postFoo() {
            return this.post(path, {
                body: {
                    foo: 'bar',
                },
            });
        }
    })();
    const response = await dataSource.postFoo();
    t.deepEqual(response.body, { name: 'foo' });
});
test('Should be able to make a simple DELETE call', async (t) => {
    var _a;
    t.plan(2);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'DELETE');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        deleteFoo() {
            return this.delete(path);
        }
    })();
    const response = await dataSource.deleteFoo();
    t.deepEqual(response.body, { name: 'foo' });
});
test('Should be able to make a simple PUT call', async (t) => {
    var _a;
    t.plan(2);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'PUT');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        putFoo() {
            return this.put(path);
        }
    })();
    const response = await dataSource.putFoo();
    t.deepEqual(response.body, { name: 'foo' });
});
test('Should be able to make a simple PATCH call', async (t) => {
    var _a;
    t.plan(2);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'PATCH');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        patchFoo() {
            return this.patch(path);
        }
    })();
    const response = await dataSource.patchFoo();
    t.deepEqual(response.body, { name: 'foo' });
});
test('Should be able to pass query params', async (t) => {
    var _a;
    t.plan(3);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        t.is(req.url, '/?a=1&b=2');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path, {
                query: {
                    a: 1,
                    b: '2',
                    c: undefined,
                },
            });
        }
    })();
    const response = await dataSource.getFoo();
    t.deepEqual(response.body, { name: 'foo' });
});
test('Should error on HTTP errors > 299 and != 304', async (t) => {
    var _a;
    t.plan(4);
    const path = '/';
    const server = http_1.default.createServer((req, res) => {
        var _a, _b;
        const queryObject = querystring_1.default.parse((_a = req.url) === null || _a === void 0 ? void 0 : _a.replace('/?', ''));
        t.is(req.method, 'GET');
        res.writeHead(queryObject['statusCode']);
        res.end();
        (_b = res.socket) === null || _b === void 0 ? void 0 : _b.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo(statusCode) {
            return this.get(path, {
                query: {
                    statusCode,
                },
            });
        }
    })();
    await t.throwsAsync(dataSource.getFoo(401), {
        instanceOf: Error,
        code: 401,
        message: 'Response code 401 (Unauthorized)',
    }, 'Unauthenticated');
    await t.throwsAsync(dataSource.getFoo(500), {
        instanceOf: Error,
        code: 500,
        message: 'Response code 500 (Internal Server Error)',
    }, 'Internal Server Error');
});
test('Should not parse content as JSON when content-type header is missing', async (t) => {
    var _a;
    t.plan(3);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(200);
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path);
        }
    })();
    const response = await dataSource.getFoo();
    t.is(response.statusCode, 200);
    t.is(response.body, JSON.stringify(wanted));
});
test('Should memoize subsequent GET calls to the same endpoint', async (t) => {
    var _a;
    t.plan(17);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        setTimeout(() => res.end(), 50).unref();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path);
        }
    })();
    let response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.falsy(response.maxTtl);
    response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
    t.false(response.isFromCache);
    t.true(response.memoized);
    t.falsy(response.maxTtl);
    response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
    t.false(response.isFromCache);
    t.true(response.memoized);
    t.falsy(response.maxTtl);
    response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
    t.false(response.isFromCache);
    t.true(response.memoized);
    t.falsy(response.maxTtl);
});
test('Should not memoize subsequent GET calls for unsuccessful responses', async (t) => {
    var _a;
    t.plan(17);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a, _b;
        const queryObject = querystring_1.default.parse((_a = req.url) === null || _a === void 0 ? void 0 : _a.replace('/?', ''));
        t.is(req.method, 'GET');
        res.writeHead(queryObject['statusCode'], {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        setTimeout(() => res.end(), 50).unref();
        (_b = res.socket) === null || _b === void 0 ? void 0 : _b.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        onError(error) {
            if (error instanceof src_1.RequestError) {
                t.false(error.response.isFromCache);
                t.false(error.response.memoized);
                t.falsy(error.response.maxTtl);
                t.truthy(error.request);
            }
        }
        getFoo(statusCode) {
            return this.get(path, {
                query: {
                    statusCode,
                },
            });
        }
    })();
    let response = await dataSource.getFoo(300);
    t.deepEqual(response.body, { name: 'foo' });
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.falsy(response.maxTtl);
    await t.throwsAsync(dataSource.getFoo(401), {
        instanceOf: Error,
        code: 401,
        message: 'Response code 401 (Unauthorized)',
    });
    await t.throwsAsync(dataSource.getFoo(500), {
        instanceOf: Error,
        code: 500,
        message: 'Response code 500 (Internal Server Error)',
    });
});
test('Should be able to define a custom cache key for request memoization', async (t) => {
    var _a;
    t.plan(7);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        onCacheKeyCalculation(request) {
            t.pass('onCacheKeyCalculation');
            t.truthy(request);
            return 'foo';
        }
        getFoo() {
            return this.get(path);
        }
    })();
    let response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
    response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
});
test('Should correctly calculate and sort query parameters', async (t) => {
    var _a;
    t.plan(3);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        t.is(req.url, '/?a=1&b=2&z=z');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path, {
                query: {
                    b: 2,
                    a: 1,
                    z: 'z',
                },
            });
        }
    })();
    let response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
});
test('Should call onError on request error', async (t) => {
    var _a;
    t.plan(11);
    const path = '/';
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(500);
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        onResponse(request, response) {
            t.truthy(request);
            t.truthy(response);
            t.pass('onResponse');
            return super.onResponse(request, response);
        }
        onError(error) {
            t.is(error.name, 'RequestError');
            t.is(error.message, 'Response code 500 (Internal Server Error)');
            if (error instanceof src_1.RequestError) {
                t.is(error.code, 500);
                t.truthy(error.request);
                t.truthy(error.response);
            }
            t.pass('onRequestError');
        }
        async getFoo() {
            return await this.get(path);
        }
    })();
    await t.throwsAsync(dataSource.getFoo(), {
        instanceOf: Error,
        code: 500,
        message: 'Response code 500 (Internal Server Error)',
    }, 'Server error');
});
test('Should be possible to pass a request context', async (t) => {
    var _a;
    t.plan(3);
    const path = '/';
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(200);
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        onResponse(request, response) {
            t.deepEqual(request.context, { a: '1' });
            t.pass('onResponse');
            return super.onResponse(request, response);
        }
        async getFoo() {
            return await this.get(path, {
                context: {
                    a: '1',
                },
            });
        }
    })();
    await dataSource.getFoo();
});
test.cb('Should abort request when abortController signal is called', (t) => {
    var _a;
    t.plan(2);
    const path = '/';
    const server = http_1.default
        .createServer((req, res) => {
        t.is(req.method, 'GET');
        setTimeout(() => {
            var _a;
            res.writeHead(200);
            res.end();
            (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
        }, 50);
    })
        .unref();
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const abortController = new abort_controller_1.default();
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        async getFoo() {
            return await this.get(path, {
                signal: abortController.signal,
            });
        }
    })();
    t.throwsAsync(async () => {
        try {
            await dataSource.getFoo();
            t.fail();
        }
        catch (error) {
            t.pass('Throw error');
            throw error;
        }
    }, {
        instanceOf: Error,
        message: 'Request aborted',
    }, 'Timeout').finally(t.end);
    abortController.abort();
});
test.cb('Should timeout because server does not respond fast enough', (t) => {
    var _a;
    t.plan(3);
    const path = '/';
    const server = http_1.default
        .createServer((req, res) => {
        t.is(req.method, 'GET');
        setTimeout(() => {
            var _a;
            res.writeHead(200);
            res.end();
            (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
        }, 100);
    })
        .unref();
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL, {
                clientOptions: {
                    bodyTimeout: 50,
                    headersTimeout: 50,
                },
            });
        }
        async getFoo() {
            return await this.get(path);
        }
    })();
    t.throwsAsync(async () => {
        try {
            await dataSource.getFoo();
            t.fail();
        }
        catch (error) {
            t.pass('Throw error');
            throw error;
        }
    }, {
        instanceOf: Error,
        message: 'Headers Timeout Error',
    }, 'Timeout').finally(t.end);
});
test('Should be able to modify request in willSendRequest', async (t) => {
    var _a;
    t.plan(3);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        t.deepEqual(req.headers['x-foo'], 'bar');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        async onRequest(request) {
            request.headers = {
                'X-Foo': 'bar',
            };
        }
        getFoo() {
            return this.get(path);
        }
    })();
    const response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
});
test('Should be able to define base headers for every request', async (t) => {
    var _a;
    t.plan(4);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        t.deepEqual(req.headers['x-foo'], 'bar');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL, {
                requestOptions: {
                    headers: {
                        'X-Foo': 'bar',
                    },
                },
            });
        }
        async onRequest(request) {
            t.deepEqual(request.headers, {
                'X-Foo': 'bar',
            });
        }
        getFoo() {
            return this.get(path);
        }
    })();
    const response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
});
test('Initialize data source with cache and context', async (t) => {
    var _a;
    t.plan(3);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            t.deepEqual(this.context, {
                a: 1,
            });
            return this.get(path);
        }
    })();
    const cacheMap = new Map();
    dataSource.initialize({
        context: {
            a: 1,
        },
        cache: {
            async delete(key) {
                return cacheMap.delete(key);
            },
            async get(key) {
                return cacheMap.get(key);
            },
            async set(key, value) {
                cacheMap.set(key, value);
            },
        },
    });
    const response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
});
test('Should cache a GET response and respond with the result on subsequent calls', async (t) => {
    var _a;
    t.plan(15);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    let dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path, {
                requestCache: {
                    maxTtl: 10,
                    maxTtlIfError: 20,
                },
            });
        }
    })();
    const cacheMap = new Map();
    const datasSourceConfig = {
        context: {
            a: 1,
        },
        cache: {
            async delete(key) {
                return cacheMap.delete(key);
            },
            async get(key) {
                return cacheMap.get(key);
            },
            async set(key, value) {
                cacheMap.set(key, value);
            },
        },
    };
    dataSource.initialize(datasSourceConfig);
    let response = await dataSource.getFoo();
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.is(response.maxTtl, 10);
    t.deepEqual(response.body, wanted);
    response = await dataSource.getFoo();
    t.false(response.isFromCache);
    t.true(response.memoized);
    t.is(response.maxTtl, 10);
    t.deepEqual(response.body, wanted);
    dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path, {
                requestCache: {
                    maxTtl: 10,
                    maxTtlIfError: 20,
                },
            });
        }
    })();
    dataSource.initialize(datasSourceConfig);
    response = await dataSource.getFoo();
    t.true(response.isFromCache);
    t.false(response.memoized);
    t.is(response.maxTtl, 10);
    t.deepEqual(response.body, wanted);
    const cached = JSON.parse(cacheMap.get(baseURL + path));
    t.is(cacheMap.size, 2);
    t.like(cached, {
        statusCode: 200,
        trailers: {},
        opaque: null,
        headers: {
            connection: 'keep-alive',
            'keep-alive': 'timeout=5',
            'transfer-encoding': 'chunked',
        },
        body: wanted,
    });
});
test('Should respond with stale-if-error cache on origin error', async (t) => {
    var _a;
    t.plan(12);
    const path = '/';
    const wanted = { name: 'foo' };
    let reqCount = 0;
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        if (reqCount === 0)
            res.writeHead(200, {
                'content-type': 'application/json',
            });
        else
            res.writeHead(500, {
                'content-type': 'application/json',
            });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
        reqCount++;
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    let dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path, {
                requestCache: {
                    maxTtl: 10,
                    maxTtlIfError: 20,
                },
            });
        }
    })();
    const cacheMap = new Map();
    const datasSourceConfig = {
        context: {
            a: 1,
        },
        cache: {
            async delete(key) {
                return cacheMap.delete(key);
            },
            async get(key) {
                return cacheMap.get(key);
            },
            async set(key, value) {
                cacheMap.set(key, value);
            },
        },
    };
    dataSource.initialize(datasSourceConfig);
    let response = await dataSource.getFoo();
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.is(response.maxTtl, 10);
    t.deepEqual(response.body, wanted);
    t.is(cacheMap.size, 2);
    cacheMap.delete(baseURL + path);
    dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path, {
                requestCache: {
                    maxTtl: 10,
                    maxTtlIfError: 20,
                },
            });
        }
    })();
    dataSource.initialize(datasSourceConfig);
    response = await dataSource.getFoo();
    t.true(response.isFromCache);
    t.false(response.memoized);
    t.is(response.maxTtl, 10);
    t.deepEqual(response.body, wanted);
    t.is(cacheMap.size, 1);
});
test('Should not cache POST requests', async (t) => {
    var _a;
    t.plan(6);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'POST');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        postFoo() {
            return this.post(path, {
                requestCache: {
                    maxTtl: 10,
                    maxTtlIfError: 20,
                },
            });
        }
    })();
    const cacheMap = new Map();
    dataSource.initialize({
        context: {
            a: 1,
        },
        cache: {
            async delete(key) {
                return cacheMap.delete(key);
            },
            async get(key) {
                return cacheMap.get(key);
            },
            async set(key, value, options) {
                t.deepEqual(options, { ttl: 10 });
                cacheMap.set(key, value);
            },
        },
    });
    const response = await dataSource.postFoo();
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.falsy(response.maxTtl);
    t.deepEqual(response.body, wanted);
    t.is(cacheMap.size, 0);
});
test('Should only cache GET successful responses with the correct status code', async (t) => {
    var _a;
    t.plan(30);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a, _b;
        const queryObject = querystring_1.default.parse((_a = req.url) === null || _a === void 0 ? void 0 : _a.replace('/?', ''));
        t.is(req.method, 'GET');
        res.writeHead(queryObject['statusCode'], {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_b = res.socket) === null || _b === void 0 ? void 0 : _b.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo(statusCode) {
            return this.get(path, {
                query: {
                    statusCode,
                },
                requestCache: {
                    maxTtl: 10,
                    maxTtlIfError: 20,
                },
            });
        }
    })();
    const cacheMap = new Map();
    dataSource.initialize({
        context: {
            a: 1,
        },
        cache: {
            async delete(key) {
                return cacheMap.delete(key);
            },
            async get(key) {
                return cacheMap.get(key);
            },
            async set(key, value) {
                cacheMap.set(key, value);
            },
        },
    });
    let response = await dataSource.getFoo(200);
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.is(response.maxTtl, 10);
    t.deepEqual(response.body, wanted);
    t.is(cacheMap.size, 2);
    cacheMap.clear();
    response = await dataSource.getFoo(203);
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.is(response.maxTtl, 10);
    t.deepEqual(response.body, wanted);
    t.is(cacheMap.size, 2);
    cacheMap.clear();
    response = await dataSource.getFoo(204);
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.falsy(response.maxTtl);
    t.falsy(response.body);
    t.is(cacheMap.size, 0);
    cacheMap.clear();
    response = await dataSource.getFoo(300);
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.falsy(response.maxTtl);
    t.deepEqual(response.body, wanted);
    t.is(cacheMap.size, 0);
    cacheMap.clear();
    response = await dataSource.getFoo(301);
    t.false(response.isFromCache);
    t.false(response.memoized);
    t.falsy(response.maxTtl);
    t.deepEqual(response.body, wanted);
    t.is(cacheMap.size, 0);
});
test('Response is not cached due to origin error', async (t) => {
    var _a;
    const path = '/';
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(500);
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL);
        }
        getFoo() {
            return this.get(path, {
                requestCache: {
                    maxTtl: 10,
                    maxTtlIfError: 20,
                },
            });
        }
    })();
    const cacheMap = new Map();
    dataSource.initialize({
        context: {
            a: 1,
        },
        cache: {
            async delete(key) {
                return cacheMap.delete(key);
            },
            async get(key) {
                return cacheMap.get(key);
            },
            async set(key, value) {
                console.log(key);
                cacheMap.set(key, value);
            },
        },
    });
    await t.throwsAsync(dataSource.getFoo(), {
        message: 'Response code 500 (Internal Server Error)',
        code: 500,
    }, 'message');
    t.is(cacheMap.size, 0);
});
test('Should be able to pass custom Undici Pool', async (t) => {
    var _a;
    t.plan(2);
    const path = '/';
    const wanted = { name: 'foo' };
    const server = http_1.default.createServer((req, res) => {
        var _a;
        t.is(req.method, 'GET');
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(JSON.stringify(wanted));
        res.end();
        (_a = res.socket) === null || _a === void 0 ? void 0 : _a.unref();
    });
    t.teardown(server.close.bind(server));
    server.listen();
    const baseURL = `http://localhost:${(_a = server.address()) === null || _a === void 0 ? void 0 : _a.port}`;
    const pool = new undici_1.Pool(baseURL);
    const dataSource = new (class extends src_1.HTTPDataSource {
        constructor() {
            super(baseURL, {
                pool,
            });
        }
        getFoo() {
            return this.get(path);
        }
    })();
    const response = await dataSource.getFoo();
    t.deepEqual(response.body, wanted);
});
//# sourceMappingURL=http-data-source.test.js.map