import { NextRequest, NextResponse } from "next/server";
import https from "https";

const TARGET_SERVER_URL = "http://uvn-235-31.ams01.zonevs.eu:5005";

// Configure HTTPS agent to ignore SSL certificate errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL certificate errors
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "DELETE");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "PATCH");
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "HEAD");
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "OPTIONS");
}

async function handleProxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Construct the target URL
    const path = pathSegments.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${TARGET_SERVER_URL}/${path}${
      searchParams ? `?${searchParams}` : ""
    }`;

    // Prepare headers to forward
    const headers: HeadersInit = {};

    // Forward relevant headers (excluding host-specific ones)
    const headersToForward = [
      "authorization",
      "content-type",
      "accept",
      "user-agent",
      "x-forwarded-for",
      "x-real-ip",
      "cache-control",
      "if-modified-since",
      "if-none-match",
      "etag",
      "range",
      "accept-encoding",
      "accept-language",
      "referer",
      "origin",
    ];

    headersToForward.forEach((headerName) => {
      const headerValue = request.headers.get(headerName);
      if (headerValue) {
        headers[headerName] = headerValue;
      }
    });

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for methods that support it
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const body = await request.text();
      if (body) {
        requestOptions.body = body;
      }
    }

    // Make the request to the target server with SSL certificate ignoring
    const response = await fetch(targetUrl, {
      ...requestOptions,
      // @ts-expect-error - Node.js specific agent for ignoring SSL errors
      agent: targetUrl.startsWith("https:") ? httpsAgent : undefined,
    });

    // Prepare response headers to forward
    const responseHeaders: HeadersInit = {};

    // Forward relevant response headers
    const responseHeadersToForward = [
      "content-type",
      "content-length",
      "content-encoding",
      "cache-control",
      "etag",
      "last-modified",
      "expires",
      "access-control-allow-origin",
      "access-control-allow-methods",
      "access-control-allow-headers",
      "access-control-expose-headers",
      "set-cookie",
    ];

    responseHeadersToForward.forEach((headerName) => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        responseHeaders[headerName] = headerValue;
      }
    });

    // Get response body
    const responseBody = await response.text();

    // Return the proxied response
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);

    return new NextResponse(
      JSON.stringify({
        error: "Proxy request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
