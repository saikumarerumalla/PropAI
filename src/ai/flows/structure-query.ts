'use server';

/**
 * @fileOverview This file defines a Genkit flow for structuring user property search queries into a JSON format.
 *
 * - structureQuery - A function that takes a free-form text query and returns a structured JSON object.
 *
 * - StructureQueryInput - The input type for the structureQuery function (a string query).
 * - StructureQueryOutput - The return type for the structureQuery function (a JSON string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StructureQueryInputSchema = z.string().describe('A free-form text query describing the ideal property.');
export type StructureQueryInput = z.infer<typeof StructureQueryInputSchema>;

const StructureQueryOutputSchema = z.object({
  structuredQuery: z.string().describe('A JSON string representing the structured query.'),
});
export type StructureQueryOutput = z.infer<typeof StructureQueryOutputSchema>;
export async function structureQuery(input: StructureQueryInput): Promise<StructureQueryOutput> {
  try {
    const rawOutput = await structureQueryFlow(input);
    // Log the raw output from the AI model for debugging
    console.log('Raw AI output:', rawOutput);

    let structuredQueryString = '{}'; // Default to an empty object

    if (typeof rawOutput === 'string') {
      // If the raw output is a string, assume it might be the JSON string directly
      try {
        JSON.parse(rawOutput);
        structuredQueryString = rawOutput;
      } catch (e) {
        console.warn('Raw AI output string is not valid JSON.', e);
      }
    } else if (rawOutput && typeof rawOutput === 'object' && 'structuredQuery' in rawOutput && typeof rawOutput.structuredQuery === 'string') {
      // If the raw output is an object with a structuredQuery field
      try {
        JSON.parse(rawOutput.structuredQuery);
        structuredQueryString = rawOutput.structuredQuery;
      } catch (e) {
        console.warn(`Raw AI output object's structuredQuery field is not valid JSON.`, e);
      }
    } else {
       console.warn('AI output is not a string or an object with a structuredQuery field. Returning empty structured query.');
    }

    return { structuredQuery: structuredQueryString };

  } catch (error) {
    console.error('Error in structureQuery flow:', error);
    // Return an empty structured query in case of any error
    return { structuredQuery: '{}' };
  }
}

const structureQueryPrompt = ai.definePrompt({
  name: 'structureQueryPrompt',
  input: {schema: StructureQueryInputSchema},
  output: {schema: StructureQueryOutputSchema},
  prompt: `You are an AI assistant designed to extract key information from property search queries for the Indian real estate market and format it as a JSON object.

  Based on the user's query, populate the fields in the JSON object below. If a field's information is not present in the query, omit that field from the JSON object.

  Return ONLY the JSON object.

  User query: {{{$input}}}

  JSON object:
  {
    "city": string, // The city mentioned in the query.
    "area": string, // Specific area or locality within the city.
    "propertyType": string, // The type of property (e.g., "Apartment", "House", "Villa", "Plot", "Commercial").
    "bedrooms_min": number, // The minimum number of bedrooms (consider BHK).
    "bedrooms_max": number, // The maximum number of bedrooms (consider BHK).
    "price_max": number, // The maximum price in Indian Rupees (recognize lakhs and crores, convert to numeric value, e.g., "2 crores" becomes 20000000).
    "amenities": string, // Any mentioned amenities (e.g., "parking", "garden", "gated community", "private pool").
    "transactionType": string // Whether it's for "sale" or "rent".
  }

  Examples:

  User query: "Show me 3 bedroom apartments in Bangalore under 2 crores"
  JSON object:
  {
    "city": "Bangalore",
    "bedrooms_min": 3,
    "bedrooms_max": 3,
    "price_max": 20000000,
    "propertyType": "Apartment"
  }

  User query: "I'm looking for a house in Mumbai with at least 4 bedrooms and a budget of 5 crores"
  JSON object:
  {
    "city": "Mumbai",
    "bedrooms_min": 4,
    "price_max": 50000000,
    "propertyType": "House"
  }

  User query: "Find me a 2 or 3 bhk condo in Delhi"
  JSON object:
  {
    "city": "Delhi",
    "bedrooms_min": 2,
    "bedrooms_max": 3,
    "propertyType": "Condo"
  }

  User query: "Apartment for sale in Pune around Koregaon Park with 2 BHK"
  JSON object:
  {
    "city": "Pune",
    "area": "Koregaon Park",
    "bedrooms_min": 2,
    "bedrooms_max": 2,
    "propertyType": "Apartment",
    "transactionType": "sale"
  }

  User query: "Villa in Goa with a private pool, budget up to 10 crore"
  JSON object:
  {
    "city": "Goa",
    "price_max": 100000000,
    "propertyType": "Villa",
    "amenities": "private pool"
  }

  User query: "Commercial property on rent in Chennai"
  JSON object:
  {
    "city": "Chennai",
    "propertyType": "Commercial",
    "transactionType": "rent"
  }

  User query: "2 bedroom apartment in Mumbai under 2 crores"
  JSON object:
  {
    "city": "Mumbai",
    "bedrooms_min": 2,
    "bedrooms_max": 2,
    "price_max": 20000000,
    "propertyType": "Apartment"
  }
`,
});

const structureQueryFlow = ai.defineFlow(
  {
    name: 'structureQueryFlow',
    inputSchema: StructureQueryInputSchema,
    outputSchema: StructureQueryOutputSchema,
  },
  async input => {
    const {output} = await structureQueryPrompt(input);
    return output!;
  }
);
