import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { getCart, removeCartItem, changeCartItemQty, Cart } from '../modules/common/api';
import Error from '../modules/common/components/error';
import PageWrapper from '../modules/common/components/page-wrapper';
import { cart, calcItems } from '../modules/carts';
import ItemRow from '../modules/carts/components/item-row';
import Summary from '../modules/carts/components/summary';

const debounce = (func: Function, timeout = 500) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
};

const emptyCart: Cart = {
  _id: '',
  items: [],
  services: [],
};

const fetchCart = async (): Promise<Cart> => {
  const cart = await getCart().catch((err) => {
    if (err.statusCode === 404) return emptyCart;
    throw err;
  });

  return cart;
}

const changeQty = async ({ productId, qty }: { productId: string, qty: number }) => {
  return changeCartItemQty(productId, qty);
};

const Cart: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const removeItemMutation = useMutation(removeCartItem, {
    onSuccess: data => {
      queryClient.setQueryData('cart', data);
      cart.update(calcItems(data));
    },
    onError: () => {
      toast.error('Ошибка при удалении товара');
    }
  });
  const changeItemQtyMutation = useMutation(changeQty, {
    onSuccess: data => {
      queryClient.setQueryData('cart', data);
      cart.update(calcItems(data));
    },
    onError: () => {
      toast.error('Ошибка при изменении количества товара');
    }
  });

  const { status, data, error } = useQuery<Cart, Error>('cart', fetchCart, { retry: false });

  let content;
  switch (status) {
    case 'loading':
      // todo: table placeholder
      content = (<p>Загрузка...</p>);
      break;
    case 'error':
      content = (
        <Error error={error} />
      );
      break;
    case 'success':
      if (!data.items.length) {
        content = (<h2>Корзина пуста</h2>)
      }
      else {
        let sum = 0;
        let count = 0;
        let valid = true;
        const delivery = data.services.reduce((s, item) => s + item.price, 0);
        content = (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='order-2 lg:col-span-2 lg:order-1'>
              <div className='bg-white rounded mb-8 px-4 py-2'>
                <table className='w-full'>
                  <tbody>
                    {data.items.map((item) => {
                      count += item.qty;
                      sum += item.qty * item.product.price;

                      const debouncedUpdate = debounce((value: number) => changeItemQtyMutation.mutate({
                        productId: item.product._id,
                        qty: value
                      }));

                      if (item.product.qty < item.qty) valid = false;

                      return (
                        <ItemRow
                          key={item.product._id}
                          product={item.product}
                          qty={item.qty}
                          onDelete={() => removeItemMutation.mutate(item.product._id)}
                          onChange={(value: number) => debouncedUpdate(value)}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='order-1 lg:col-span-1 lg:order-2'>
              <Summary
                btn={{
                  disabled: !valid,
                  tooltip: valid ? '' : 'Недостаточно товара в наличии',
                  action: () => router.push('/checkout/address'),
                  text: 'Перейти к оформлению',
                }}
                itemsCount={count}
                itemsPrice={sum}
                deliveryPrice={delivery}
              />
            </div>
          </div>
        );
      }
  }

  return (
    <PageWrapper
      title='Корзина - Darlingdove'
    >
      <div className='px-2'>
        <h1 className='text-3xl font-semibold mb-4'>Корзина</h1>
        {content}
      </div>
    </PageWrapper>
  )
}

export default Cart;
