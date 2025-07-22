export interface Property {
  id: string;
  image: string;
  price: number;
  address: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  propertyType: 'House' | 'Apartment' | 'Condo';
  description: string;
}
