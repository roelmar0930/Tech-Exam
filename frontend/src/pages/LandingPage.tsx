import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Pagination, 
  Box,
  CircularProgress
} from '@mui/material';
import { ProductCard } from '../components/ProductCard';
import { api } from '../services/api';
import { Product } from '../types';
import debounce from 'lodash/debounce';

export const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const ITEMS_PER_PAGE = 12;

  const fetchProducts = async (currentPage: number, searchTerm: string) => {
    try {
      setLoading(true);
      const response = await api.getProducts(currentPage, ITEMS_PER_PAGE, searchTerm);
      setProducts(response.items);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
      
      // Update page if backend returned a different page number (e.g., when resetting to last valid page)
      if (response.page !== currentPage) {
        setPage(response.page);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((searchTerm: string) => {
    setPage(1);
    fetchProducts(1, searchTerm);
  }, 500);

  useEffect(() => {
    fetchProducts(page, search);
  }, [page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
    debouncedFetch(searchTerm);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <TextField
        fullWidth
        label="Search products"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4
          }}>
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    md: 'calc(33.333% - 16px)',
                    lg: 'calc(25% - 18px)'
                  }
                }}
              >
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>

          <Box display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};