import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { type } = body;

  if (type !== "like" && type !== "dislike") {
    return NextResponse.json({ error: "Nevažeći tip glasanja" }, { status: 400 });
  }

  try {
    const ad = await prisma.ad.update({
      where: { id },
      data: {
        [type === "like" ? "likes" : "dislikes"]: { increment: 1 },
      },
      select: { likes: true, dislikes: true },
    });

    return NextResponse.json(ad);
  } catch {
    return NextResponse.json({ error: "Oglas nije pronađen" }, { status: 404 });
  }
}
