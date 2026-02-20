import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base URL for dummyjson API
const DUMMY_JSON_API = 'https://dummyjson.com';

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Web Ordering App API' });
});

// Products routes
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;
    
    let url = `${DUMMY_JSON_API}/products`;
    if (search) {
      url = `${DUMMY_JSON_API}/products/search?q=${search}`;
    }

    const response = await axios.get(url);
    const { products, total } = response.data;

    // Calculate pagination
    const paginatedProducts = products.slice(skip, skip + limit);
    const actualTotal = products.length; // Use actual number of products
    const totalPages = Math.ceil(actualTotal / limit);

    // Only return products if we're within valid page range
    if (page > totalPages) {
      res.json({
        items: [],
        total: actualTotal,
        page: totalPages, // Reset to last valid page
        limit: limit
      });
    } else {
      res.json({
        items: paginatedProducts,
        total: actualTotal,
        page: page,
        limit: limit
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Cart routes (to be implemented)
app.get('/api/cart', (req: Request, res: Response) => {
  // TODO: Implement cart functionality
  res.json({ message: 'Cart endpoint' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});