import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const site = await prisma.site.findUnique({
      where: { id: params.id },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch site" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const site = await prisma.site.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(site);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update site" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.site.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Site deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 }
    );
  }
}
