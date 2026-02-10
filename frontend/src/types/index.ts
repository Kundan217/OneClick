export interface Product {
  _id: string;
  id: string; // Using _id for both for simplicity in components
  title: string;
  name: string; // Keep for compatibility
  price: number;
  image: string;
  category: string;
  description: string;
  vendor: {
    _id: string;
    vendorName: string;
    ownerName: string;
    city: string;
  };
}
