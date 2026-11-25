

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Check whether a value is a valid non-negative integer.
function validNumber(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

// GET: Fetch medicines from Neon
export async function GET() {
  try {
    const medicines = await (prisma as unknown as { medicine: any }).medicine.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(medicines, { status: 200 });
  } catch (error) {
    console.error("PHARMACY GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load medicines. Check the server terminal." },
      { status: 500 }
    );
  }
}

// POST: Add a medicine to Neon
export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const {
      name,
      category,
      manufacturer,
      unit,
      purchasePrice,
      sellingPrice,
      stockQuantity,
      lowStockThreshold,
      expiryDate,
    } = data;

    // Required fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return NextResponse.json(
        { error: "Medicine name and category are required." },
        { status: 400 }
      );
    }

    // Numeric validation
    if (
      !validNumber(purchasePrice) ||
      !validNumber(sellingPrice) ||
      !validNumber(stockQuantity)
    ) {
      return NextResponse.json(
        {
          error:
            "Prices and stock must be valid non-negative whole numbers.",
        },
        { status: 400 }
      );
    }

    // Low stock threshold
    let finalLowStockThreshold = 10;

    if (lowStockThreshold !== undefined) {
      if (!validNumber(lowStockThreshold)) {
        return NextResponse.json(
          { error: "Invalid low stock threshold." },
          { status: 400 }
        );
      }

      finalLowStockThreshold = lowStockThreshold;
    }

    // Expiry date
    let parsedExpiryDate: Date | null = null;

    if (
      expiryDate !== undefined &&
      expiryDate !== null &&
      expiryDate !== ""
    ) {
      if (
        typeof expiryDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)
      ) {
        return NextResponse.json(
          { error: "Expiry date must use YYYY-MM-DD format." },
          { status: 400 }
        );
      }

      const date = new Date(`${expiryDate}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== expiryDate
      ) {
        return NextResponse.json(
          { error: "Invalid expiry date." },
          { status: 400 }
        );
      }

      parsedExpiryDate = date;
    }

    // Save medicine in Neon
    const medicine = await (prisma as unknown as { medicine: any }).medicine.create({
      data: {
        name: name.trim(),
        category: category.trim(),

        manufacturer:
          typeof manufacturer === "string" && manufacturer.trim()
            ? manufacturer.trim()
            : null,

        unit:
          typeof unit === "string" && unit.trim()
            ? unit.trim()
            : "Tablet",

        purchasePrice,
        sellingPrice,
        stockQuantity,
        lowStockThreshold: finalLowStockThreshold,
        expiryDate: parsedExpiryDate,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error("PHARMACY POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save medicine. Check the server terminal." },
      { status: 500 }
    );
  }
}
