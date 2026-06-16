---
name: security-rules
description: Frontend security constraints — secrets management, XSS prevention, client storage security, and HTTPS.
version: 1.0.0
---

# SECRETS MANAGEMENT

- **No Hardcoded Secrets:** Never hardcode API keys, client secrets, passwords, or tokens in the codebase.
- **Environment Variables:** Always read configuration secrets from environment variables (e.g., `process.env` or `import.meta.env`).
- **Gitignore Compliance:** Verify that all env files (like `.env`, `.env.local`) are strictly listed in `.gitignore` to prevent leakage.

# CROSS-SITE SCRIPTING (XSS) PREVENTION

- **Safe Rendering:** Avoid using `dangerouslySetInnerHTML` in React components.
- **Mandatory Sanitization:** If raw HTML rendering is absolutely required, the inputs must be sanitized using `dompurify` (DOMPurify.sanitize) before rendering.
- **Attribute Escaping:** Always escape dynamic inputs when passing them to attributes like `href` (especially for `javascript:` URIs) or `src`.

# CLIENT-SIDE STORAGE SECURITY

- **No Plaintext Sensitive Data:** Do not store sensitive information (e.g., user passwords, credit card numbers, PII) in plaintext inside `localStorage` or `sessionStorage`.
- **Session Tokens:** Auth tokens stored in `localStorage` must be handled securely (e.g., use Short-Lived tokens, clear storage on logout, protect against theft via XSS).
- **Secure Cookies:** For web-auth sessions, prefer using secure, `HttpOnly` and `SameSite=Strict` cookies managed by the backend instead of storage where possible.

# SECURE COMMUNICATION

- **HTTPS Only:** Ensure all API endpoints and third-party script integrations run over secure HTTPS protocols.
- **CORS Handling:** Verify endpoints configuration to restrict access to trusted origins.
- **Input Validation:** Validate all inputs before sending them to the backend to prevent payload exploitation.
