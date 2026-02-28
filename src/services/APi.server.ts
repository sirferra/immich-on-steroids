import { MemoryType } from "@/models/Memory";

type JsonBody = Record<string, unknown>;

class ImmichApiServer {
  private static instance: ImmichApiServer;

  private readonly baseUrl: string;
  private readonly apiKey: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_IMMICH_BASE_URL ?? "";
    this.apiKey = process.env.NEXT_IMMICH_API_KEY ?? process.env.NEXT_KEY ?? "";
  }

  static getInstance() {
    if (!ImmichApiServer.instance) {
      ImmichApiServer.instance = new ImmichApiServer();
    }

    return ImmichApiServer.instance;
  }

  private async request(path: string, method: string, body?: JsonBody) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
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

const client = ImmichApiServer.getInstance();

class Album {
  static getAll() {
    return client.GET("/albums");
  }
}

class Memories {
  static getAll(): Promise<MemoryType[]> {
    return client.GET("/memories");
  }
}

export class Api {
  static Album = Album;
  static Memories = Memories;
}
