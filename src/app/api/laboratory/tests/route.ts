
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
// @ts-ignore -- ws is installed without declaration files in this project.
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

// The generated Prisma client may not yet include the LabTest model.
const labTest = (prisma as PrismaClient & {
  labTest: {
    findMany: (args: { orderBy: { createdAt: "desc" } }) => Promise<unknown[]>;
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
}).labTest;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// GET: Load existing laboratory tests
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

// POST: Save a new laboratory test
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
      { error: "Could not save laboratory test. Check whether its name already exists." },
      { status: 500 }
    );
  }
}
[{
  "id": 1,
  "name": "Blood Glucose",
  "category": "Biochemistry",
  "description": "Sample test record",
  "price": 500,
  "createdAt": "2026-11-24 19:06:34.205",
  "updatedAt": "2026-11-24 19:06:34.205"
}, {
  "id": 2,
  "name": "Liver Function Test (LFT)",
  "category": "Biochemistry",
  "description": "Sample test record",
  "price": 1800,
  "createdAt": "2026-11-24 19:06:34.205",
  "updatedAt": "2026-11-24 19:06:34.205"
}, {
  "id": 3,
  "name": "Renal Function Test (RFT)",
  "category": "Biochemistry",
  "description": "Sample test record",
  "price": 1500,
  "createdAt": "2026-11-24 19:06:34.205",
  "updatedAt": "2026-11-24 19:06:34.205"
}, {
  "id": 4,
  "name": "Urine Complete Examination",
  "category": "Pathology",
  "description": "Sample test record",
  "price": 600,
  "createdAt": "2026-11-24 19:06:34.205",
  "updatedAt": "2026-11-24 19:06:34.205"
}, {
  "id": 5,
  "name": "Thyroid Function Test (TFT)",
  "category": "Hormones",
  "description": "Sample test record",
  "price": 2200,
  "createdAt": "2026-11-24 19:06:34.205",
  "updatedAt": "2026-11-24 19:06:34.205"
}]
