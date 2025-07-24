"use client";

import { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-hooks-web';
import { structureQuery } from '@/ai/flows/structure-query';
import type { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Use environment variables for Algolia keys
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;

if (!appId || !searchKey) {
  throw new Error("Algolia App ID or Search API Key is not configured. Please check your .env.local file.");
}

const searchClient = algoliasearch(appId, searchKey);

interface StructuredQuery {
  city?: string;
  propertyType?: 'House' | 'Apartment' | 'Condo';
  bedrooms_min?: number;
  bedrooms_max?: number;
  price_max?: number;
  area?: string;
  amenities?: string;
  transactionType?: string;
}

const Hit = ({ hit }: { hit: Property }) => <PropertyCard property={hit} />;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setFilters(''); // Clear previous filters
    setQuery(''); // Clear previous query

    try {
      const response = await structureQuery(trimmedQuery);
      const structured: StructuredQuery = JSON.parse(response.structuredQuery);
      
      let filterParts: string[] = [];
      if (structured.city) {
        filterParts.push(`city:'${structured.city}'`);
      }
      if (structured.propertyType) {
        filterParts.push(`propertyType:'${structured.propertyType}'`);
      }
      if (structured.bedrooms_min) {
        filterParts.push(`bedrooms >= ${structured.bedrooms_min}`);
      }
      if (structured.bedrooms_max) {
        filterParts.push(`bedrooms <= ${structured.bedrooms_max}`);
      }
      if (structured.price_max) {
        filterParts.push(`price <= ${structured.price_max}`);
      }
      if (structured.area) {
        filterParts.push(`area:'${structured.area}'`);
      }
      if (structured.amenities) {
        filterParts.push(`amenities:'${structured.amenities}'`);
      }
       if (structured.transactionType) {
         filterParts.push(`transactionType:'${structured.transactionType}'`);
      }
      
      const generatedFilters = filterParts.join(' AND ');
      
      if (generatedFilters) {
        setFilters(generatedFilters);
        setQuery(trimmedQuery); // Use original query for text search
      } else {
        setQuery(trimmedQuery);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to process search query. Performing basic search.');
      setQuery(trimmedQuery);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">PropAI</h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 font-body">
          Your intelligent property search assistant for India.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g., 'A 3 bedroom apartment in Mumbai under 2 crores'"
          className="flex-grow bg-white/80 focus:bg-white rounded-md p-2 border border-gray-300"
          aria-label="Property search query"
        />
        <Button type="submit" disabled={isLoading || !searchQuery} size="lg" className="font-bold">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </form>
      
      <div className="mt-12">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[240px] w-full rounded-lg" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Search Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasSearched && !isLoading && !error && (
          <InstantSearch searchClient={searchClient} indexName="properties">
            <Configure filters={filters} query={query} />{/* Use single Configure */}
            <Hits hitComponent={Hit} />
          </InstantSearch>
        )}
        
        {!isLoading && !error && !hasSearched && (
            <div className="text-center py-16">
                <h2 className="text-2xl font-headline font-semibold">Find your dream property in India</h2>
                <p className="mt-2 text-foreground/70">Start by entering what you're looking for in the search bar above.</p>
            </div>
        )}
      </div>
    </main>
  );
}
