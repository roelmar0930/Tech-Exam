export interface Product {
  id: number;
  thumbnail: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  shippingInformation: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CheckoutForm {
  name: string;
  address: string;
  contactNumber: string;
  deliveryDateRange: {
    start: string;
    end: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}