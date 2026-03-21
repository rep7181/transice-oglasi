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
  let user = await getCurrentUser();
  if (!user) {
    // Allow anonymous posting - use admin as fallback owner
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin) {
      return NextResponse.json({ error: "Greška servera" }, { status: 500 });
    }
    user = admin;
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
      countrySlug,
      regionSlug,
      citySlug,
      categorySlug,
      imageUrls,
    } = body;

    if (!title || !description || !countrySlug || !categorySlug) {
      return NextResponse.json(
        { error: "Naslov, opis, država i kategorija su obavezni" },
        { status: 400 }
      );
    }

    // Resolve slugs to IDs
    const country = await prisma.country.findUnique({ where: { slug: countrySlug } });
    if (!country) return NextResponse.json({ error: "Nepoznata država" }, { status: 400 });
    const countryId = country.id;

    const region = regionSlug ? await prisma.region.findFirst({ where: { slug: regionSlug, countryId } }) : null;
    const regionId = region?.id || null;

    const city = citySlug ? await prisma.city.findFirst({ where: { slug: citySlug, regionId: regionId! } }) : null;
    const cityId = city?.id || null;

    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) return NextResponse.json({ error: "Nepoznata kategorija" }, { status: 400 });
    const categoryId = category.id;

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
