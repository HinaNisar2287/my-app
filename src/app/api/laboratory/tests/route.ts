
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Temporary type definition for the laboratory model.
const labTest = (
  prisma as unknown as {
    labTest: {
      findMany: (args: {
        orderBy: { createdAt: "desc" };
      }) => Promise<unknown[]>;

      create: (args: {
        data: {
          name: string;
          category: string;
          description: string | null;
          price: number;
          updatedAt: Date;
        };
      }) => Promise<unknown>;
    };
  }
).labTest;

// GET: Load laboratory tests
export async function GET() {
  try {
    const tests = await labTest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("GET laboratory tests error:", error);

    return NextResponse.json(
      { error: "Failed to load laboratory tests" },
      { status: 500 }
    );
  }
}

// POST: Create laboratory test
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, category, description, price } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      !Number.isInteger(price) ||
      price < 0
    ) {
      return NextResponse.json(
        { error: "Please provide valid test details." },
        { status: 400 }
      );
    }

    const test = await labTest.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        description:
          typeof description === "string"
            ? description.trim() || null
            : null,
        price,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("POST laboratory test error:", error);

    return NextResponse.json(
      { error: "Could not save laboratory test." },
      { status: 500 }
    );
  }
}
