import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import { RootState } from '../store';
import { clearCart } from '../store/cartSlice';
import { api } from '../services/api';
import { CheckoutForm, Product } from '../types';

export const CheckoutPage: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    address: '',
    contactNumber: '',
    deliveryDateRange: {
      start: '',
      end: '',
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'deliveryDateStart' || name === 'deliveryDateEnd') {
      setFormData(prev => ({
        ...prev,
        deliveryDateRange: {
          ...prev.deliveryDateRange,
          [name === 'deliveryDateStart' ? 'start' : 'end']: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current product data for each cart item
      const currentProducts = await Promise.all(
        cart.map(async (item) => {
          const response = await axios.get(`http://localhost:3001/products/${item.id}`);
          return response.data as Product;
        })
      );

      // Check if there's enough stock for each item
      const insufficientStock = currentProducts.some((product: Product, index: number) => {
        const cartItem = cart[index];
        return product.stock < cartItem.quantity;
      });

      if (insufficientStock) {
        throw new Error('Some items in your cart are no longer in stock');
      }

      // Update stock for each product using current stock values
      await Promise.all(
        cart.map((item, index) => {
          const currentStock = currentProducts[index].stock;
          return api.updateStock(item.id, currentStock - item.quantity);
        })
      );

      setSuccess(true);
      dispatch(clearCart());
      
      // Show success state for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error processing checkout:', error);
      setSuccess(false);
      alert(error instanceof Error ? error.message : 'Error processing your order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Your cart is empty</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Order placed successfully! Redirecting to home page...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: { md: '0 0 66.666667%' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
                <TextField
                  required
                  fullWidth
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    required
                    fullWidth
                    label="Delivery Start Date"
                    name="deliveryDateStart"
                    type="date"
                    value={formData.deliveryDateRange.start}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Delivery End Date"
                    name="deliveryDateEnd"
                    type="date"
                    value={formData.deliveryDateRange.end}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </Paper>
        </Box>

        <Box sx={{ flex: { md: '0 0 33.333333%' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {cart.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography variant="body1">
                  {item.title} x {item.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">
              Total: ${calculateTotal().toFixed(2)}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};