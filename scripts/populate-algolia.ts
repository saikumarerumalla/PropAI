import { addObjects } from '../src/lib/algolia';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

console.log('ALGOLIA_APP_ID:', process.env.NEXT_PUBLIC_ALGOLIA_APP_ID);
console.log('ALGOLIA_ADMIN_API_KEY:', process.env.ALGOLIA_ADMIN_API_KEY);

const properties = [
  {
    city: 'Mumbai',
    propertyType: 'Apartment',
    bedrooms: 2,
    price: 15000000,
    address: '123, Marine Drive, Mumbai',
    description: 'A beautiful 2BHK apartment with a sea view.',
    image: 'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    id: 1,
  },
  {
    city: 'Delhi',
    propertyType: 'House',
    bedrooms: 4,
    price: 30000000,
    address: '456, Greater Kailash, Delhi',
    description: 'A spacious 4BHK house with a garden.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVnfDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    id: 2,
  },
  {
    city: 'Bangalore',
    propertyType: 'Condo',
    bedrooms: 3,
    price: 20000000,
    address: '789, Koramangala, Bangalore',
    description: 'A modern 3BHK condo with all amenities.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    id: 3,
  },
];

addObjects(properties)
  .then(() => console.log('Properties added to Algolia'))
  .catch(console.error);
