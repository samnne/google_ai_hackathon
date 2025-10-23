

export const schema = () => {
  return {
    type: "object",
    patternProperties: {
      // Matches UUID v4 format
      "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$": {
        type: "object",
        required: ["topic", "description", "resources", "goal", "difficulty"],
        properties: {
          topic: {
            type: "string",
          },
          goal: {
            type: "string",
          },
          resources: {
            type: "array",
            items: {
              type: "object",
              required: ["goal", "description", "resource"],
              properties: {
                goal: { type: "string" },
                description: { type: "string" },
                resource: {
                  type: "object",
                  required: ["link"],
                  properties: {
                    link: { type: "string" },
                  },
                },
              },
            },
          },
          description: {
            type: "string",
          },
          difficulty: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
          },
        },
      },
    },
    additionalProperties: false, // Only allow UUID keys
    minProperties: 1,
    maxProperties: 1,
  };
};

export class AIClient {
  constructor(language = "en") {
    this.language = language;
    this.session = null;
    this.available = false;
  }

  async init() {
    try {
      const availability = await LanguageModel.availability();

      if (availability === "unavailable") {
        console.warn("⚠️ Language model unavailable on this device.");
        this.available = false;
        return;
      }

      this.session = await LanguageModel.create({
        initialPrompts: [
          {
            role: "system",
            content:
              "You are a helpful assistant. You have knowledge on all the skills and hobbies and jobs in the world and want to teach everyone about it in a step-by-step process returned as valid JSON.",
          },
        ],
        expectedInputs: [{ type: "text" }],
        expectedOutputs: [{ type: "text" }],
        topK: 2,
        temperature: 1,
        output: { language: this.language },
      });

      this.available = true;
      console.log("✅ AIClient initialized successfully.");
    } catch (error) {
      console.error("❌ Failed to initialize AIClient:", error);
      this.available = false;
    }
  }

  async prompt(text) {
    if (!this.available || !this.session) {
      console.warn("⚠️ AIClient unavailable — returning fallback response.");
      return { error: "AIClient unavailable", result: null };
    }

    const s = schema();
    try {
      const result = await this.session.prompt(text, {
        responseConstraint: s,
        omitResponseConstraintInput: true,
        output: { language: this.language },
      });
      return result;
    } catch (error) {
      console.error("⚠️ AIClient prompt error:", error);
      return { error: "AIClient prompt failed", result: null };
    }
  }

  destroy() {
    if (this.session) {
      this.session.destroy();
      this.session = null;
      this.available = false;
    }
  }
}


const client = new AIClient("en");
try {
  await client.init();
  //console.log(JSON.parse(res), "######################");
} catch (e) {
  console.log(e);
  
}
export { client };


