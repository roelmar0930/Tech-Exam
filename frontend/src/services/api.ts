import axios from 'axios';
import { Product, PaginatedResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000'; // Backend URL

export const api = {
  getProducts: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Product>> => {
    const response = await axios.get(`${API_BASE_URL}/api/products`, {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  },

  updateStock: async (productId: number, newStock: number): Promise<void> => {
    await axios.patch(`${API_BASE_URL}/api/products/${productId}`, {
      stock: newStock,
    });
  },
};