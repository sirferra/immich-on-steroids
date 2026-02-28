import { NextRequest } from "next/server";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function mergeSearchParams(requestUrl: URL, upstreamUrl: URL) {
  requestUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });
}

export async function proxyImmichGet(
  request: NextRequest,
  upstreamPath: string,
): Promise<Response> {
  const baseUrl = getRequiredEnv("NEXT_IMMICH_BASE_URL");
  const apiKey = getRequiredEnv("NEXT_IMMICH_API_KEY");
  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(`${baseUrl}${upstreamPath}`);

  mergeSearchParams(requestUrl, upstreamUrl);

  console.log(`============= Proxying request to: ${upstreamUrl.toString()}`);

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });

  const headers = new Headers();
  const contentType = upstreamResponse.headers.get("content-type");
  const contentLength = upstreamResponse.headers.get("content-length");
  const cacheControl = upstreamResponse.headers.get("cache-control");
  const etag = upstreamResponse.headers.get("etag");

  if (contentType) headers.set("content-type", contentType);
  if (contentLength) headers.set("content-length", contentLength);
  if (cacheControl) headers.set("cache-control", cacheControl);
  if (etag) headers.set("etag", etag);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
}
