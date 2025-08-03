import React, { useState } from 'react';
import Login from './components/Login';
import ItemList from './components/ItemList';
import Cart from './components/Cart';

function App() {
  const [token, setToken] = useState(null);
  const [cartId, setCartId] = useState(null);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div>
      <h1>Shopping Cart</h1>
      <ItemList token={token} cartId={cartId} setCartId={setCartId} />
      <Cart token={token} cartId={cartId} />
    </div>
  );
}

export default App;
