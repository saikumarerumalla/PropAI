import Image from 'next/image';
import type { Property } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Bath, Ruler } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const isForRent = property.propertyType === 'Apartment' && property.price < 10000;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-60 w-full">
          <Image
            src={property.image}
            alt={`Image of ${property.address}`}
            fill
            className="object-cover"
            data-ai-hint={
              property.propertyType === 'House' ? 'house exterior' : 
              property.propertyType === 'Apartment' ? 'apartment building' : 
              'condo building'
            }
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <p className="text-3xl font-headline font-bold text-primary mb-2">
            ${property.price.toLocaleString()}
            {isForRent && <span className="text-lg font-body font-normal text-muted-foreground">/month</span>}
          </p>
          <CardTitle className="text-xl font-headline">{property.address}</CardTitle>
          <CardDescription className="font-body text-base text-muted-foreground">{property.city}, {property.state}</CardDescription>
          <p className="mt-4 font-body text-foreground/80">{property.description}</p>
        </div>
        <div className="flex justify-around items-center border-t border-border pt-4 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-accent" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-5 w-5 text-accent" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-accent" />
            <span>{property.area} sqft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
