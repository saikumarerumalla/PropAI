'use server';

/**
 * @fileOverview This file defines a Genkit flow for structuring user property search queries into a JSON format.
 *
 * - structureQuery - A function that takes a free-form text query and returns a structured JSON object.
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
  return structureQueryFlow(input);
}

const structureQueryPrompt = ai.definePrompt({
  name: 'structureQueryPrompt',
  input: {schema: StructureQueryInputSchema},
  output: {schema: StructureQueryOutputSchema},
  prompt: `You are an AI assistant designed to convert unstructured property search queries into a structured JSON format.

  The JSON format should include fields for location, property type, minimum bedrooms, maximum price, and any other relevant criteria specified in the query.

  Here are some examples:

  User query: "Show me 3 bedroom apartments in Bangalore under 2 crores"
  Structured Query:
  {
    "city": "Bangalore",
    "bedrooms_min": 3,
    "bedrooms_max": 3,
    "price_max": 20000000,
    "propertyType": "Apartment"
  }
  
  User query: "I'm looking for a house in Mumbai with at least 4 bedrooms and a budget of 5 crores"
  Structured Query:
  {
    "city": "Mumbai",
    "bedrooms_min": 4,
    "price_max": 50000000,
    "propertyType": "House"
  }
  
  User query: "Find me a 2 or 3 bhk condo in Delhi"
  Structured Query:
  {
    "city": "Delhi",
    "bedrooms_min": 2,
    "bedrooms_max": 3,
    "propertyType": "Condo"
  }

  Here's the user's query: {{{$input}}}

  Please return a JSON string that represents the structured query.
  Ensure the JSON is valid and parsable.
  The currency is Indian Rupees (INR). Do not include currency symbols in the JSON output.
  If a field is not specified in the query, do not include it in the JSON output.
  Recognize Indian numeric terms like "lakh" (100,000) and "crore" (10,000,000).
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
