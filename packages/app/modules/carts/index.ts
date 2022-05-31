import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addItemToCart, Cart } from '../common/api';

type CartCallback = (value: number) => void;

interface CartEventsEmitter {
  value: number;
  callbacks: CartCallback[];
  subscribe: (cb: CartCallback) => void;
  unsubscribe: (cb: CartCallback) => void;
  update: (value: number) => void;
}

export const cart: CartEventsEmitter = {
  value: 0,
  callbacks: [],
  subscribe(cb) {
    cart.callbacks.push(cb);
  },
  unsubscribe(cb) {
    cart.callbacks = cart.callbacks.filter(c => c !== cb);
  },
  update(value) {
    cart.value = value;
    cart.callbacks.forEach(cb => cb(value));
  },
}

export const useCart = () => {
  const [count, setCount] = useState(cart.value);

  useEffect(() => {
    const cb = (value: number) => setCount(value);

    cart.subscribe(cb);

    return () => cart.unsubscribe(cb);
  }, [])

  return count;
}

export const calcItems = (cart: Cart) => {
  return cart.items.reduce((c, item) => c + item.qty, 0);
}

export const addToCart = async (productId: string, qty: number = 1) => {
  try {
    const updatedCart = await addItemToCart(productId, qty);
    const count = calcItems(updatedCart);
    cart.update(count);
    toast.success('Товар доавлен в корзину!');
  }
  catch (err) {
    toast.error('Ошибка при добавлении товара в корзину');
  }
}