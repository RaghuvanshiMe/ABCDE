import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ItemList({ token, cartId, setCartId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get('http://localhost:8080/items');
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch items', error);
      }
    }
    fetchItems();
  }, []);

  const addToCart = async (itemId) => {
    try {
      if (!cartId) {
        // Create cart with first item
        const response = await axios.post(
          'http://localhost:8080/carts/',
          { items: [itemId] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartId(response.data.id);
      } else {
        // Add item to existing cart (not implemented in backend, so recreate cart with all items)
        alert('Adding items to existing cart is not supported yet.');
      }
    } catch (error) {
      console.error('Failed to add item to cart', error);
    }
  };

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.status}{' '}
            <button onClick={() => addToCart(item.id)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;
