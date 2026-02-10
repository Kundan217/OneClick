export interface Product {
  _id: string;
  id: string;
  name: string;
  title: string;
  image: string;
  price: number;
  description: string;
  category: string;
  countInStock: number;
  [key: string]: any;
}
