import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("agrosentry");

  await db.collection("detections").insertMany([
    {
      cropType: "Wheat",
      pestType: "Aphids",
      district: "Pune",
      severity: 2,
      createdAt: new Date("2026-01-25T10:00:00Z") // Old
    },
    {
      cropType: "Wheat",
      pestType: "Aphids",
      district: "Pune",
      severity: 3,
      createdAt: new Date() // Current
    },
    {
      cropType: "Wheat",
      pestType: "Aphids",
      district: "Pune",
      severity: 4,
      createdAt: new Date() // Current
    }
  ]);

  return Response.json({ seeded: true });
}
