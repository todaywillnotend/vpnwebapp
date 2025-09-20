import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.VPN_API_BASE_URL;
const API_TOKEN = process.env.VPN_API_TOKEN || "";
const ADMIN_TG_ID = process.env.VPN_API_TG_ID || "";

console.log("API Configuration:", {
  API_BASE_URL,
  API_TOKEN: API_TOKEN ? "***SET***" : "NOT SET",
  ADMIN_TG_ID: ADMIN_TG_ID ? "***SET***" : "NOT SET",
});

if (!API_TOKEN) {
  console.error("VPN_API_TOKEN is not set in environment variables");
}

if (!API_BASE_URL) {
  console.error("VPN_API_BASE_URL is not set in environment variables");
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

    // Автоматически добавляем admin tg_id если его нет в query параметрах
    if (ADMIN_TG_ID) {
      searchParams.set("tg_id", ADMIN_TG_ID);
      console.log(`GET: Added admin tg_id ${ADMIN_TG_ID} to query params`);
    }

    const apiPath = path.join("/");
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_URL}/${apiPath}${queryString ? `?${queryString}` : ""}`;

    console.log(`GET request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Token": API_TOKEN,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed: ${response.status} ${response.statusText}`,
        `URL: ${apiUrl}`,
        `Response: ${errorText}`
      );
      return NextResponse.json(
        {
          error: "API request failed",
          status: response.status,
          statusText: response.statusText,
          url: apiUrl,
          details: errorText,
        },
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

    // Автоматически добавляем admin tg_id если его нет в теле запроса
    if (body && typeof body === "object" && !body.tg_id && ADMIN_TG_ID) {
      body.tg_id = parseInt(ADMIN_TG_ID);
      console.log(`POST: Added admin tg_id ${ADMIN_TG_ID} to request body`);
    }

    // Строим URL для внешнего API
    const apiPath = path.join("/");
    const apiUrl = `${API_BASE_URL}/${apiPath}`;

    console.log(`POST request to: ${apiUrl} with body:`, body);

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

    // Автоматически добавляем admin tg_id если его нет в теле запроса
    if (body && typeof body === "object" && !body.tg_id && ADMIN_TG_ID) {
      body.tg_id = parseInt(ADMIN_TG_ID);
    }

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

    // Строим URL для внешнего API с query параметром tg_id
    const deleteUrl = new URL(`${API_BASE_URL}/${apiPath}`);
    if (ADMIN_TG_ID) {
      deleteUrl.searchParams.set("tg_id", ADMIN_TG_ID);
    }

    // Делаем запрос к внешнему API
    const response = await fetch(deleteUrl.toString(), {
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
