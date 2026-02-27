export interface Product {
  _id: string;
  id: string;
  name: string;
  title: string;
  image: string;
  price: number;
  description: string;
  category: string | { _id: string; name: string };
  countInStock: number;
  rating?: number;
  numReviews?: number;
  materials?: string;
  careInstructions?: string;
  specifications?: string[];
  warranty?: string;
  vendor?: {
    _id: string;
    vendorName: string;
    ownerName: string;
    city: string;
    story?: string;
    specialty?: string;
    workshopImage?: string;
  };
  [key: string]: any;
}

export interface Review {
  _id: string;
  product: string;
  customer: string;
  customerName: string;
  rating: number;
  title: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}
