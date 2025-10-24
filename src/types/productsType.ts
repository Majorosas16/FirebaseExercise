export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface InitialState {
  products: Product[];
  cart: Product[];
}
