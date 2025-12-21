'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('../util/logger');
function baseUrl() {
    const raw = process.env.PRINTER_API_URL || 'http://localhost:8761';
    return raw.replace(/\/$/, '');
}
async function discover(params = {}) {
    const url = new URL('/v1/printers/discover', baseUrl());
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '')
            return;
        url.searchParams.set(key, String(value));
    });
    const res = await fetch(url.toString());
    if (!res.ok) {
        const body = await safeJson(res);
        throw new Error(body && body.error && body.error.message || `discover failed: ${res.status}`);
    }
    return res.json();
}
async function status(printerId) {
    const url = new URL(`/v1/printers/${encodeURIComponent(printerId)}/status`, baseUrl());
    const res = await fetch(url.toString());
    if (!res.ok) {
        const body = await safeJson(res);
        throw new Error(body && body.error && body.error.message || `status failed: ${res.status}`);
    }
    return res.json();
}
async function queue(printerId) {
    const url = new URL(`/v1/printers/${encodeURIComponent(printerId)}/queue`, baseUrl());
    const res = await fetch(url.toString());
    if (!res.ok) {
        const body = await safeJson(res);
        throw new Error(body && body.error && body.error.message || `queue failed: ${res.status}`);
    }
    return res.json();
}
async function printRaw(printerId, payload) {
    const url = new URL(`/v1/printers/${encodeURIComponent(printerId)}/print`, baseUrl());
    const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawBase64: payload.toString('base64') })
    });
    if (!res.ok) {
        const body = await safeJson(res);
        throw new Error(body && body.error && body.error.message || `print failed: ${res.status}`);
    }
    return res.json();
}
async function safeJson(res) {
    try {
        return await res.json();
    }
    catch (err) {
        logger.warn({ err: err && err.message }, 'printer api json parse failed');
        return null;
    }
}
module.exports = {
    discover,
    status,
    queue,
    printRaw
};
