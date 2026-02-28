"use client";

type JsonBody = Record<string, unknown>;

class ImmichApiClient {
  private static instance: ImmichApiClient;

  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_IMMICH_BASE_URL ?? "";
  }

  static getInstance() {
    if (!ImmichApiClient.instance) {
      ImmichApiClient.instance = new ImmichApiClient();
    }

    return ImmichApiClient.instance;
  }

  private async request(path: string, method: string, body?: JsonBody) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    try {
      return await response.json();
    } catch {
      return response;
    }
  }

  GET(path: string) {
    return this.request(path, "GET");
  }

  POST(path: string, body: JsonBody) {
    return this.request(path, "POST", body);
  }

  PUT(path: string, body: JsonBody) {
    return this.request(path, "PUT", body);
  }

  PATCH(path: string, body: JsonBody) {
    return this.request(path, "PATCH", body);
  }

  DELETE(path: string) {
    return this.request(path, "DELETE");
  }
}

const client = ImmichApiClient.getInstance();

class Album {
  static getAll() {
    return client.GET("/albums");
  }
}

class Memories {
  static getAll() {
    return client.GET("/memories");
  }
}

export class ApiClient {
  static Album = Album;
  static Memories = Memories;
}
