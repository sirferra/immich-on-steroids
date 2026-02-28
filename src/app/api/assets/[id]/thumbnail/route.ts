import { NextRequest } from "next/server";
import { proxyImmichGet } from "@/lib/immich-proxy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  
  const { id } = await context.params;
  return await proxyImmichGet(request, `/assets/${id}/thumbnail`);
}
