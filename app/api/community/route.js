import clientPromise from "@/lib/mongodb";
import { generateCommunityInsight } from "@/lib/gemini";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("agrosentry");

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);

    // 🔹 This Week Data
    const thisWeek = await db
      .collection("detections")
      .aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: "$pestType", count: { $sum: 1 } } },
      ])
      .toArray();

    // 🔹 Last Week Data
    const lastWeek = await db
      .collection("detections")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
          },
        },
        { $group: { _id: "$pestType", count: { $sum: 1 } } },
      ])
      .toArray();

    // 🔹 Intelligent Analysis Logic
    const analysis = thisWeek.map((pest) => {
      const previous = lastWeek.find((p) => p._id === pest._id);
      const previousCount = previous ? previous.count : 0;

      let growth = 0;
      let risk = "Low";

      if (previousCount === 0) {
        growth = 100;

        if (pest.count >= 5) {
          risk = "High";
        } else if (pest.count >= 2) {
          risk = "Medium";
        }
      } else {
        growth = ((pest.count - previousCount) / previousCount) * 100;

        if (growth > 75) {
          risk = "High";
        } else if (growth > 30) {
          risk = "Medium";
        }
      }

      // 🔮 Predict next week risk
      let predictedRisk = "Low";

      if (risk === "High" && growth > 50) {
        predictedRisk = "Very High";
      } else if (risk === "Medium" && growth > 30) {
        predictedRisk = "High";
      } else if (growth > 0) {
        predictedRisk = "Medium";
      }

      return {
        pest: pest._id,
        thisWeek: pest.count,
        lastWeek: previousCount,
        growth: Math.round(growth),
        risk,
        predictedRisk,
      };
    });

    // 🔹 Generate Gemini AI Summary
    const regionScore = analysis.reduce((acc, item) => {
      if (item.risk === "High") return acc + 3;
      if (item.risk === "Medium") return acc + 2;
      return acc + 1;
    }, 0);

    // 🧠 Gemini AI Summary
    const summaryPrompt = `
You are an agricultural AI intelligence system.

Based on this pest outbreak analysis:
${JSON.stringify(analysis, null, 2)}

1. Explain the situation clearly.
2. Suggest immediate farmer actions.
3. Suggest preventive measures for next week.
4. Keep language simple and practical.
`;

    const aiSummary = await generateCommunityInsight(summaryPrompt);

    return Response.json({
      analysis,
      aiSummary,
      regionScore,
    });
  } catch (error) {
    console.error("Community Agent Error:", error);
    return Response.json(
      { error: "Community Intelligence Agent failed." },
      { status: 500 },
    );
  }
}
