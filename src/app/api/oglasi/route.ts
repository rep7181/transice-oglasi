import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { notifyNewAd } from "@/lib/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const region = searchParams.get("region");
  const city = searchParams.get("city");
  const category = searchParams.get("cat");
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const where: Record<string, unknown> = { status: "ACTIVE" };

  if (country) where.country = { slug: country };
  if (region) where.region = { slug: region };
  if (city) where.city = { slug: city };
  if (category) where.category = { slug: category };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [ads, total] = await Promise.all([
    prisma.ad.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { order: "asc" } },
        country: true,
        region: true,
        city: true,
        category: true,
      },
      orderBy: [{ featured: "desc" }, { premium: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.ad.count({ where }),
  ]);

  return NextResponse.json({
    ads,
    total,
    pages: Math.ceil(total / limit),
    page,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      age,
      price,
      phone,
      whatsapp,
      viber,
      telegram,
      countryId,
      regionId,
      cityId,
      categoryId,
      imageUrls,
    } = body;

    if (!title || !description || !countryId || !categoryId) {
      return NextResponse.json(
        { error: "Naslov, opis, država i kategorija su obavezni" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    const uniqueSuffix = Date.now().toString(36);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const ad = await prisma.ad.create({
      data: {
        title,
        slug,
        description,
        age: age ? parseInt(age) : null,
        price: price ? parseInt(price) : null,
        phone,
        whatsapp,
        viber,
        telegram,
        userId: user.id,
        countryId,
        regionId: regionId || null,
        cityId: cityId || null,
        categoryId,
        images: imageUrls?.length
          ? {
              create: imageUrls.map((url: string, i: number) => ({
                url,
                order: i,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });

    // Send email notification (don't await - fire and forget)
    notifyNewAd({
      title,
      slug,
      description,
      userName: user.name,
      userEmail: user.email,
    });

    return NextResponse.json({ ad }, { status: 201 });
  } catch (error) {
    console.error("Create ad error:", error);
    return NextResponse.json(
      { error: "Greška pri kreiranju oglasa" },
      { status: 500 }
    );
  }
}
