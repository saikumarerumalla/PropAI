// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Provides suggestions for improving property search queries based on initial search results.
 *
 * - suggestSearchImprovement - A function that suggests improvements to a search query.
 * - SuggestSearchImprovementInput - The input type for the suggestSearchImprovement function.
 * - SuggestSearchImprovementOutput - The return type for the suggestSearchImprovement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSearchImprovementInputSchema = z.object({
  searchQuery: z.string().describe('The original search query.'),
  searchResults: z.string().describe('The initial search results.'),
});
export type SuggestSearchImprovementInput = z.infer<typeof SuggestSearchImprovementInputSchema>;

const SuggestSearchImprovementOutputSchema = z.object({
  improvedQuerySuggestions: z.array(z.string()).describe('Suggestions for improving the search query based on the initial results.'),
});
export type SuggestSearchImprovementOutput = z.infer<typeof SuggestSearchImprovementOutputSchema>;

export async function suggestSearchImprovement(input: SuggestSearchImprovementInput): Promise<SuggestSearchImprovementOutput> {
  return suggestSearchImprovementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSearchImprovementPrompt',
  input: {schema: SuggestSearchImprovementInputSchema},
  output: {schema: SuggestSearchImprovementOutputSchema},
  prompt: `You are an expert property search assistant for the Indian market. Given an initial search query and the initial search results, provide suggestions for improving the search query so that the user can find more relevant properties.

Original Search Query: {{{searchQuery}}}

Initial Search Results: {{{searchResults}}}

Here are some examples of how you can provide suggestions:

- If the user searches for "apartments in Bangalore," you could suggest, "Try searching for '2 BHK apartments in Koramangala, Bangalore' for more specific results."
- If the user searches for "houses under 1 crore," you could suggest, "Consider including a city in your search, like 'houses under 1 crore in Pune'."
- If the search results are too broad, you could suggest adding amenities, like "Try adding 'with parking' or 'gated community' to your search."

Suggestions for improving the search query:
`,
});

const suggestSearchImprovementFlow = ai.defineFlow(
  {
    name: 'suggestSearchImprovementFlow',
    inputSchema: SuggestSearchImprovementInputSchema,
    outputSchema: SuggestSearchImprovementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
