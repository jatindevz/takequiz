export function extractFromAIResponse({ message }) {
  console.log("➡️ Entered extractFromAIResponse");

  const match = message.match(/```json\s*([\s\S]*?)\s*```/);

  if (!match) {
    console.error("❌ Could not find JSON block in AI response.");
    console.log("🧾 Full message:", message);
    throw new Error("Could not find JSON block in AI response.");
  }

  try {
    const jsonText = match[1].trim();

    // Extra: Clean up newlines, trailing commas, or bad quotes
    const cleaned = jsonText
      .replace(/\\n/g, "\\n") // escape actual newlines
      .replace(/,\s*}/g, "}") // trailing comma fix
      .replace(/,\s*]/g, "]");

    const parsed = JSON.parse(cleaned);
    console.log("✅ Parsed JSON from AI response successfully");
    return parsed;
  } catch (error) {
    console.error("❌ Failed to parse quiz JSON:", match[1], error);
    throw new Error("Invalid JSON format in AI response.");
  }
}



const prompt = `You are a professional quiz maker.

Generate 15 multiple-choice questions on the topic:' {{topic}} '.

For each question, include:
1. The question text.
2. Four options labeled A, B, C, and D.
3. The correct answer (e.g., "B").
4. A explanation (1-2 lines).

Note:This quiz should be more difficult.

Respond with **only a JSON array**, inside a Markdown code block.
**Strictly Do not include any introductory or extra text.**

Format the response as a JSON array like this:
Example output:
\`\`\`json
[
  {
    "question": "What is the capital of France?",
    "options": {
      "A": "Berlin",
      "B": "Paris",
      "C": "Rome",
      "D": "Madrid"
    },
    "correctAnswer": "B",
    "explanation": "Paris is the capital and most populous city of France.",
  },
  ...
]\`\`\`
`


const generatePrompt = (data) => {
    return prompt.replace("{{topic}}", data);
}

export { generatePrompt }