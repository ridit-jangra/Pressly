import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sites = await prisma.site.findMany();
    return NextResponse.json(sites);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { siteName, siteUrl } = body;

    const site = await prisma.site.create({
      data: {
        siteName,
        siteUrl,
      },
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}
