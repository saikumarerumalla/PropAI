"use client";

import { useState } from 'react';
import { structureQuery } from '@/ai/flows/structure-query';
import { ALL_PROPERTIES } from '@/lib/data';
import type { Property } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, AlertCircle } from 'lucide-react';

interface StructuredQuery {
  location?: string;
  propertyType?: 'House' | 'Apartment' | 'Condo';
  minBedrooms?: number;
  maxPrice?: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setProperties([]);
    setHasSearched(true);

    try {
      const response = await structureQuery(searchQuery);
      const structuredQuery: StructuredQuery = JSON.parse(response.structuredQuery);

      let filteredProperties = ALL_PROPERTIES;
      
      if (structuredQuery.location) {
        const location = structuredQuery.location.toLowerCase();
        filteredProperties = filteredProperties.filter(
          p => p.city.toLowerCase().includes(location) || p.state.toLowerCase().includes(location) || p.address.toLowerCase().includes(location)
        );
      }

      if (structuredQuery.propertyType) {
        const type = structuredQuery.propertyType.toLowerCase();
        filteredProperties = filteredProperties.filter(
          p => p.propertyType.toLowerCase() === type
        );
      }
      
      if (structuredQuery.minBedrooms) {
        filteredProperties = filteredProperties.filter(
          p => p.bedrooms >= structuredQuery.minBedrooms!
        );
      }

      if (structuredQuery.maxPrice) {
        filteredProperties = filteredProperties.filter(
          p => p.price <= structuredQuery.maxPrice!
        );
      }
      
      setProperties(filteredProperties);

    } catch (err) {
      console.error(err);
      setError('Failed to process search query. Please try a different search or try again later.');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">PropAI</h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 font-body">
          Your intelligent property search assistant. Just tell us what you're looking for.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto flex gap-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g., 'A 3 bedroom house in Springfield for under $500k'"
          className="flex-grow bg-white/80 focus:bg-white"
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

        {!isLoading && !error && hasSearched && properties.length === 0 && (
            <div className="text-center py-16">
                <h2 className="text-2xl font-headline font-semibold">No Properties Found</h2>
                <p className="mt-2 text-foreground/70">We couldn't find any properties matching your search. Please try a different query.</p>
            </div>
        )}

        {!isLoading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {!isLoading && !error && !hasSearched && (
            <div className="text-center py-16">
                <h2 className="text-2xl font-headline font-semibold">Find your dream property</h2>
                <p className="mt-2 text-foreground/70">Start by entering what you're looking for in the search bar above.</p>
            </div>
        )}
      </div>
    </main>
  );
}
