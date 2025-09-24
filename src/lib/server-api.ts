const API_BASE_URL = process.env.VPN_API_BASE_URL!;
const API_TOKEN = process.env.VPN_API_TOKEN!;
const ADMIN_TG_ID = process.env.VPN_API_TG_ID!;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class ServerApiClient {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      console.log(`Making ${options.method || "GET"} request to:`, url);
      console.log("Request options:", options);

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "X-Token": API_TOKEN,
          ...options.headers,
        },
      });

      console.log(`Response status: ${response.status} ${response.statusText}`);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        console.error(`API Error: ${response.status}`, data);
        return {
          error:
            data.message ||
            `API Error: ${response.status} ${response.statusText}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error("Server API Error:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown server error",
        status: 500,
      };
    }
  }

  static async getUser(tgId: number) {
    return this.makeRequest(`users/${tgId}?tg_id=${ADMIN_TG_ID}`);
  }

  static async getUserKeys(tgId: number) {
    return this.makeRequest(`keys/all/${tgId}?tg_id=${ADMIN_TG_ID}`);
  }

  static async getReferrals(tgId: number) {
    return this.makeRequest(`referrals/all/${tgId}?tg_id=${ADMIN_TG_ID}`);
  }

  static async getPayments(tgId: number) {
    return this.makeRequest(`payments/by_tg_id/${tgId}?tg_id=${ADMIN_TG_ID}`);
  }

  static async createKey(tgId: number, keyData: any) {
    return this.makeRequest(`keys`, {
      method: "POST",
      body: JSON.stringify({ ...keyData, tg_id: ADMIN_TG_ID }),
    });
  }

  static async updateKey(keyId: string, keyData: any) {
    return this.makeRequest(
      `keys/edit/by_email/${keyId}?tg_id=${ADMIN_TG_ID}`,
      {
        method: "PATCH",
        body: JSON.stringify(keyData),
      }
    );
  }

  static async deleteKey(keyId: string) {
    return this.makeRequest(`keys/${keyId}?tg_id=${ADMIN_TG_ID}`, {
      method: "DELETE",
    });
  }
}
