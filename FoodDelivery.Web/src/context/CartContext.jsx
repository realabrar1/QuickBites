import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (foodItemId, quantity = 1) => {
    if (!isAuthenticated) return false;
    setLoading(true);
    try {
      const updatedCart = await cartService.addItem(foodItemId, quantity);
      setCart(updatedCart);
      return true;
    } catch (err) {
      alert(err.message || 'Could not add item to cart.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    setLoading(true);
    try {
      const updatedCart = await cartService.updateQuantity(cartItemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      alert(err.message || 'Could not update quantity.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    setLoading(true);
    try {
      const updatedCart = await cartService.removeItem(cartItemId);
      setCart(updatedCart);
    } catch (err) {
      alert(err.message || 'Could not remove item.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await cartService.clearCart();
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const totalItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart, totalItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
