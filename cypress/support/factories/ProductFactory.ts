export interface ProductData {
  id: number;
  name: string;
  price: string;
}

export class ProductFactory {
  static defaultProduct(): ProductData {
    return {
      id: 2,
      name: "Men Tshirt",
      price: "Rs. 400",
    };
  }
}