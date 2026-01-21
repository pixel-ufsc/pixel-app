import { Platform } from "react-native";

interface Auth {
  getToken: () => Promise<string | null>;
}

class ApiClient {
  constructor() {
    if (Platform.OS === "web") {
      this.baseUrl = process.env.API_BASE_URI || "http://localhost:3040";
    } else {
      this.baseUrl = process.env.API_NATIVE_URI || "http://10.0.2.2:3040";
    }
  }

  private baseUrl: string;

  private async request<T = any>(
    path: string,
    auth: Auth,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await auth.getToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ${response.status}: ${error}`);
    }

    return response.json();
  }

  public get<T = any>(path: string, auth: Auth) {
    return this.request<T>(path, auth, { method: "GET" });
  }

  public post<T = any>(path: string, auth: Auth, body: any) {
    return this.request<T>(path, auth, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  
  public put<T = any>(path: string, auth: Auth, body: any) {
    return this.request<T>(path, auth, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public delete<T = any>(path: string, auth: Auth) {
    return this.request<T>(path, auth, { method: "DELETE" });
  }
}



const api = new ApiClient();

export default api;
