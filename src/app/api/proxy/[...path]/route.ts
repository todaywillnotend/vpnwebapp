import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.VPN_API_BASE_URL;
const API_TOKEN = process.env.VPN_API_TOKEN || "";

if (!API_TOKEN) {
  console.error("VPN_API_TOKEN is not set in environment variables");
}

/**
 * Обработчик GET запросов к внешнему API
 * Проксирует запросы для обхода CORS ограничений
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;
    const searchParams = request.nextUrl.searchParams;

    const apiPath = path.join("/");
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_URL}/${apiPath}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Token": API_TOKEN,
      },
    });

    if (!response.ok) {
      console.error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "API request failed", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Token",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;
    const body = await request.json();

    // Строим URL для внешнего API
    const apiPath = path.join("/");
    const apiUrl = `${API_BASE_URL}/${apiPath}`;

    // Делаем запрос к внешнему API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": API_TOKEN,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "API request failed", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Token",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;
    const body = await request.json();

    // Строим URL для внешнего API
    const apiPath = path.join("/");
    const apiUrl = `${API_BASE_URL}/${apiPath}`;

    // Делаем запрос к внешнему API
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Token": API_TOKEN,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "API request failed", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Token",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;

    // Строим URL для внешнего API
    const apiPath = path.join("/");
    const apiUrl = `${API_BASE_URL}/${apiPath}`;

    // Делаем запрос к внешнему API
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Token": API_TOKEN,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "API request failed", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Token",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Token",
    },
  });
}
