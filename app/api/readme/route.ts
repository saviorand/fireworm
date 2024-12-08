import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const readmePath = path.join(process.cwd(), "public", "readme.md");
    const content = fs.readFileSync(readmePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown",
      },
    });
  } catch (error) {
    return new NextResponse("Failed to load README", { status: 500 });
  }
}
