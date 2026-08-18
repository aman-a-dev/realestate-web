import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { properties, type Property } from "@/lib/properties";
import { STATS, VALUES, TEAM, MILESTONES, BRAND } from "@/lib/data";

/**
 * If your property detail route is /property/[id],
 * change this to:
 * const PROPERTY_BASE = "/property";
 */
const PROPERTY_BASE = "/properties";

const clean = (value: unknown) => String(value ?? "").trim();

const cleanList = (items: string[] = []) =>
  items
    .map((item) => clean(item))
    .filter(Boolean)
    .join(", ");

const formatPrice = (property: Property) =>
  property.status === "For Rent"
    ? `$${property.price.toLocaleString()}/month`
    : `$${property.price.toLocaleString()}`;

const propertyUrl = (property: Property) =>
  `${PROPERTY_BASE}/${clean(property.id)}`;

const SITE_PAGES = [
  {
    title: "Home",
    path: "/",
    description:
      "Main landing page with featured properties, company overview, and primary call-to-actions.",
  },
  {
    title: "About",
    path: "/about",
    description:
      "Company story, values, team members, milestones, and trust information.",
  },
  {
    title: "Contact",
    path: "/contact",
    description:
      "Contact page for speaking with an agent, scheduling viewings, or getting support.",
  },
  {
    title: "Interactive Map",
    path: "/map",
    description:
      "Interactive property map for browsing properties visually by location.",
  },
] as const;

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "near",
  "have",
  "has",
  "any",
  "some",
  "please",
  "show",
  "want",
  "wants",
  "need",
  "needs",
  "looking",
  "about",
  "what",
  "whats",
  "where",
  "which",
  "how",
  "can",
  "you",
  "me",
  "list",
  "property",
  "properties",
  "house",
  "home",
  "apartment",
  "villa",
  "studio",
  "rent",
  "buy",
  "price",
  "prices",
]);

const SYSTEM_PROMPT = `
You are ${BRAND.name} Real Estate's AI support assistant.

Your job is to help customers with:
- Property listings
- Property recommendations
- Pricing
- Locations
- Company information
- Team information
- Real estate services
- Website navigation

Company Information
Name: ${BRAND.name}
Tagline: ${BRAND.tagline}
Founded: ${BRAND.founded}
Location: ${BRAND.location}

Website Pages:
${SITE_PAGES.map(
  (page) => `- [${page.title}](${page.path}): ${page.description}`,
).join("\n")}

Property Detail Pages:
- Property detail pages use this format: ${PROPERTY_BASE}/{id}
- Example: [${clean(properties[0]?.title || "Property 1")}](${PROPERTY_BASE}/${clean(properties[0]?.id || "1")})
- If a user asks for /property/1, treat it as a request for property ID 1 and use ${PROPERTY_BASE}/1 unless the app explicitly uses a different route.
- When mentioning a property, always provide a Markdown link to its detail page.
- When mentioning website pages, use Markdown links.

Company Statistics
${STATS.map(
  (stat) => `- ${clean(stat.label)}: ${clean(stat.value)}${clean(stat.suffix)}`,
).join("\n")}

Company Values
${VALUES.map(
  (value) => `- ${clean(value.title)}: ${clean(value.description)}`,
).join("\n")}

Team Members
${TEAM.map(
  (member) =>
    `- ${clean(member.name)} — ${clean(member.role)}: ${clean(member.bio)}`,
).join("\n")}

Milestones
${MILESTONES.map(
  (milestone) => `- ${clean(milestone.year)}: ${clean(milestone.event)}`,
).join("\n")}

Available Properties:
${properties
  .map((property) => {
    const title = clean(property.title);
    const id = clean(property.id);
    const city = clean(property.city);
    const location = clean(property.location);
    const type = clean(property.type);
    const status = clean(property.status);
    const description = clean(property.description);
    const tags = cleanList(property.tags);
    const features = cleanList(property.features);

    return [
      `- [${title}](${propertyUrl(property)})`,
      `  ID: ${id}`,
      `  Type: ${type}`,
      `  Location: ${city}, ${location}`,
      `  Price: ${formatPrice(property)}`,
      `  Bedrooms: ${property.beds}`,
      `  Bathrooms: ${property.baths}`,
      `  Area: ${property.area} sqm`,
      `  Status: ${status}`,
      `  Tags: ${tags}`,
      `  Features: ${features}`,
      `  Description: ${description}`,
    ].join("\n");
  })
  .join("\n\n")}

Response Guidelines:
- Be friendly, warm, helpful, and professional.
- Use only the provided data.
- Do not invent properties, prices, team members, statistics, or company information.
- If you do not know something, say so honestly and suggest the Contact page: [Contact](/contact).
- For property questions, recommend up to 3 specific properties from the provided list.
- When recommending properties, include Markdown links to their detail pages.
- If the user asks about the map, direct them to [Interactive Map](/map).
- If the user asks about contacting the company, direct them to [Contact](/contact).
- If the user asks about the company story, team, or values, direct them to [About](/about) when useful.
- Keep responses concise but informative.
- Use Markdown formatting.
- Use bullet points for lists.
- Use **bold** for important labels.
- Do not output raw HTML.
- Do not start every response with hello, hi, or a greeting.
- Only greet on the first user message unless the user explicitly says hello/hi first.
- Usually end with a short open question to continue the conversation, unless the user asked for a direct factual answer only.
`.trim();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];

    const normalizedMessages = rawMessages
      .slice(-30)
      .map((message: any) => ({
        role: message?.role === "assistant" ? "assistant" : "user",
        content: clean(message?.content),
      }))
      .filter((message: any) => message.content.length > 0);

    if (!normalizedMessages.length) {
      return NextResponse.json({
        reply: `Hi 👋 I'm the **${BRAND.name}** assistant. I can help you with properties, pricing, locations, company information, and website pages like [Map](/map), [About](/about), and [Contact](/contact).\n\nWhat are you looking for today?`,
      });
    }

    const lastUserMessage = [...normalizedMessages]
      .reverse()
      .find((message: any) => message.role === "user");

    const userQuery = lastUserMessage?.content || "";

    if (!userQuery) {
      return NextResponse.json({
        reply:
          "I didn't catch that. Could you please repeat your question? You can ask me about properties, pricing, locations, company info, or website pages.",
      });
    }

    const userMessageCount = normalizedMessages.filter(
      (message: any) => message.role === "user",
    ).length;

    const isFirstUserMessage = userMessageCount <= 1;

    const lowerQuery = userQuery.toLowerCase();

    const isPropertyQuery =
      /propert|house|home|apartment|villa|studio|penthouse|commercial|building|rent|buy|sell|price|bed|bath|bedroom|bathroom|sqm|square|location|city|area|neighborhood|listing|map/i.test(
        lowerQuery,
      );

    let matchingProperties: Property[] = [];

    if (isPropertyQuery) {
      const wantsRent = /\b(rent|renting|rental|lease|monthly)\b/i.test(
        lowerQuery,
      );
      const wantsBuy =
        /\b(buy|buying|purchase|purchasing|sale|sales|own)\b/i.test(lowerQuery);

      const searchTerms = lowerQuery
        .split(/[^a-z0-9]+/i)
        .map((term: any) => term.trim())
        .filter(
          (term: any) =>
            (term.length >= 2 || /^\d+$/.test(term)) && !STOPWORDS.has(term),
        );

      matchingProperties = properties
        .filter((property) => {
          const searchableText = [
            clean(property.id),
            clean(property.title),
            clean(property.city),
            clean(property.location),
            clean(property.type),
            clean(property.status),
            clean(property.description),
            cleanList(property.tags),
            cleanList(property.features),
            String(property.beds),
            String(property.baths),
            String(property.area),
          ]
            .join(" ")
            .toLowerCase();

          const termMatch =
            searchTerms.length === 0 ||
            searchTerms.some((term: any) => searchableText.includes(term));

          const statusMatch =
            (wantsRent && wantsBuy) ||
            (!wantsRent && !wantsBuy) ||
            (wantsRent
              ? clean(property.status) === "For Rent"
              : clean(property.status) === "For Sale");

          return termMatch && statusMatch;
        })
        .slice(0, 3);
    }

    const propertyContext = isPropertyQuery
      ? matchingProperties.length > 0
        ? `
Relevant property results:
${matchingProperties
  .map((property, index) => {
    return [
      `${index + 1}. [${clean(property.title)}](${propertyUrl(property)})`,
      `   ID: ${clean(property.id)}`,
      `   Type: ${clean(property.type)}`,
      `   Location: ${clean(property.city)}, ${clean(property.location)}`,
      `   Price: ${formatPrice(property)}`,
      `   Bedrooms: ${property.beds}`,
      `   Bathrooms: ${property.baths}`,
      `   Area: ${property.area} sqm`,
      `   Status: ${clean(property.status)}`,
      `   Features: ${cleanList(property.features)}`,
      `   Description: ${clean(property.description)}`,
    ].join("\n");
  })
  .join("\n\n")}

Instructions:
- Recommend the most relevant properties from the list above.
- Include Markdown links to the property detail pages.
- Do not invent additional properties.
`.trim()
        : `
The user asked about properties, but no exact matches were found.

Instructions:
- Say that you couldn't find an exact match.
- Suggest broadening the search criteria.
- Suggest browsing the [Interactive Map](/map).
- Suggest contacting the team through the [Contact page](/contact).
`.trim()
      : "";

    const greetingInstruction = isFirstUserMessage
      ? "This is the first user message. Start with a brief friendly greeting, then answer the user's question."
      : "This is an ongoing conversation. Continue naturally. Do not repeat an initial greeting unless the user explicitly says hello or hi.";

    const formattingInstruction = `
Respond in Markdown.

Use:
- Short paragraphs
- Bullet points where helpful
- **Bold labels**
- Internal Markdown links like [Map](/map), [About](/about), [Contact](/contact), and [Property](/properties/1)

Do not output HTML.
`.trim();

    const system = [
      SYSTEM_PROMPT,
      propertyContext,
      greetingInstruction,
      formattingInstruction,
    ]
      .filter(Boolean)
      .join("\n\n");

    // ✅ FIXED: Using the recommended replacement model
    // Llama 3.3 70B is the direct replacement for the decommissioned 3.1 version.
    // Note: Llama 3.3 70B itself is scheduled for deprecation on August 16, 2026.
    // Plan to migrate to "openai/gpt-oss-120b" before that date.
    const modelId = process.env.AI_MODEL || "llama-3.3-70b-versatile";
    const model = groq(modelId);

    const { text } = await generateText({
      model,
      instructions: system,
      messages: normalizedMessages,
      temperature: 0.4,
      maxTokens: 1400,
    } as any);

    return NextResponse.json({
      reply:
        text ||
        "I'm not sure how to answer that. Could you please rephrase your question? 🤔",
      metadata: {
        propertiesFound: matchingProperties.length,
        queryType: isPropertyQuery ? "property" : "general",
        isFirstUserMessage,
      },
    });
  } catch (error: any) {
    console.error("Support API Error:", error);

    let fallbackReply = `🙏 I apologize, but I'm having technical difficulties right now. Please try again in a moment or use the [Contact page](/contact).`;

    if (error?.message?.includes("API key")) {
      fallbackReply = `🔑 I'm having trouble connecting to the AI provider. Please contact the developer or use the [Contact page](/contact).`;
    }

    return NextResponse.json({ reply: fallbackReply }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: `${BRAND.name} Support AI`,
    provider: `Groq (${process.env.AI_MODEL || "llama-3.3-70b-versatile"})`,
    timestamp: new Date().toISOString(),
  });
}
