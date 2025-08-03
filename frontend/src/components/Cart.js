import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Cart({ token, cartId }) {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    async function fetchCartItems() {
      if (!cartId) return;
      try {
        const response = await axios.get('http://localhost:8080/carts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cart = response.data.find((c) => c.id === cartId);
        if (cart) {
          setCartItems(cart.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch cart items', error);
      }
    }
    fetchCartItems();
  }, [cartId, token]);

  const placeOrder = async () => {
    try {
      await axios.post(
        'http://localhost:8080/orders',
        { cart_id: cartId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderPlaced(true);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Failed to place order', error);
      alert('Failed to place order');
    }
  };

  if (!cartId) {
    return <div>No items in cart.</div>;
  }

  if (orderPlaced) {
    return <div>Order has been placed. Thank you!</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>{item.name} - {item.status}</li>
        ))}
      </ul>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default Cart;
