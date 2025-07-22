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

  Here's the user's query: {{{$input}}}

  Please return a JSON string that represents the structured query.
  Ensure the JSON is valid and parsable.
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
