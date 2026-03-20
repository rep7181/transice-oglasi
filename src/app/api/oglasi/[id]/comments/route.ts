import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: adId } = await params;

  const comments = await prisma.comment.findMany({
    where: { adId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: adId } = await params;

  const body = await req.json();
  const name = (body.name || "").trim().slice(0, 50) || "Anonimno";
  const text = (body.text || "").trim().slice(0, 1000);

  if (!text) {
    return NextResponse.json({ error: "Komentar ne može biti prazan" }, { status: 400 });
  }

  const ad = await prisma.ad.findUnique({ where: { id: adId }, select: { id: true } });
  if (!ad) {
    return NextResponse.json({ error: "Oglas ne postoji" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { name, text, adId },
  });

  return NextResponse.json(comment, { status: 201 });
}
