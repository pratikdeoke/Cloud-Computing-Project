const DEFAULT_BACKEND_URL = "https://tourist-backend-kappa.vercel.app";

const HOP_BY_HOP_HEADERS = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
];

const getBackendBaseUrl = (env) => {
  const configured = env?.API_BASE_URL || env?.VITE_API_BASE_URL || DEFAULT_BACKEND_URL;
  return configured.trim().replace(/\/+$/, "");
};

const sanitizeRequestHeaders = (incomingHeaders) => {
  const headers = new Headers(incomingHeaders);
  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));
  return headers;
};

export async function onRequest(context) {
  const { request, env, params } = context;
  const backendBaseUrl = getBackendBaseUrl(env);
  const incomingUrl = new URL(request.url);
  const path = Array.isArray(params.path) ? params.path.join("/") : params.path || "";
  const targetUrl = `${backendBaseUrl}/api/${path}${incomingUrl.search}`;

  const init = {
    method: request.method,
    headers: sanitizeRequestHeaders(request.headers),
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(request.method.toUpperCase())) {
    init.body = request.body;
  }

  const upstreamResponse = await fetch(targetUrl, init);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: upstreamResponse.headers,
  });
}
