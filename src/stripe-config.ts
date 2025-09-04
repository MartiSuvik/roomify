export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

export const products: Product[] = [
  {
    id: 'prod_SvQAXBg7XqPOte',
    priceId: 'price_1RzZJt01mQ6htghpe3ra2Zr6',
    name: 'Free',
    description: 'Connect Own API Key to generate styles.',
    mode: 'payment',
    price: 0,
  },
  {
    id: 'prod_SvQCCOEBxaDUSt',
    priceId: 'price_1RzZLv01mQ6htghpooyNsUTa',
    name: 'Pro',
    description: 'All-Done-For You Plan',
    mode: 'subscription',
    price: 29,
  },
  {
    id: 'prod_SvQDjXEBvAbNrz',
    priceId: 'price_1RzZMf01mQ6htghp6uXeh97w',
    name: 'Business',
    description: 'All-Done-For You Plan + Support + All new upcoming features.',
    mode: 'subscription',
    price: 99,
  },
];

export function getProductByPriceId(priceId: string): Product | undefined {
  return products.find(product => product.priceId === priceId);
}