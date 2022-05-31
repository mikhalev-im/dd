import type { NextPage } from 'next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Head from 'next/head';
import { toast } from 'react-toastify';

import { getCart, removeCartItem, changeCartItemQty, Cart, Product } from '../modules/common/api';
import Error from '../modules/common/components/error';
import PageWrapper from '../modules/common/components/page-wrapper';
import { cart, calcItems } from '../modules/carts';
import ItemRow from '../modules/carts/components/item-row';

const debounce = (func: Function, timeout = 500) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
};

const changeQty = async ({ productId, qty }: { productId: string, qty: number }) => {
  return changeCartItemQty(productId, qty);
};

const Cart: NextPage = () => {
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

  const { status, data, error } = useQuery<Cart, Error>('cart', getCart);


  let content;
  switch (status) {
    case 'loading':
      // todo: table placeholder
      content = (<h2>Loading...</h2>);
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
        const delivery = data.services.reduce((s, item) => s + item.price, 0);
        content = (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='order-2 lg:col-span-2 lg:order-1'>
              <div className='bg-white rounded mb-8 px-4 py-2'>
                <table className='w-full'>
                  {data.items.map((item) => {
                    count += item.qty;
                    sum += item.qty * item.product.price;

                    const debouncedUpdate = debounce((value: number) => changeItemQtyMutation.mutate({
                      productId: item.product._id,
                      qty: value
                    }));

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
                </table>
              </div>
            </div>
            <div className='order-1 lg:col-span-1 lg:order-2'>
              <div className='bg-white rounded py-2 px-6'>
                <div className='py-4 border-b'>
                  <button className='bg-green-500 hover:bg-green-600 text-white text-center py-4 w-full rounded font-semibold'>
                    Перейти к оформлению
                  </button>
                </div>
                <div className='border-b py-4'>
                  <p className='font-semibold mb-2 text-lg'>Корзина</p>
                  <p className='flex justify-between'>
                    <span>Товары ({count})</span>
                    <span>{sum} ₽</span>
                  </p>
                  <p className='flex justify-between'>
                    <span>Доставка</span>
                    <span>{delivery} ₽</span>
                  </p>
                </div>
                <div className='py-4 font-semibold flex justify-between text-lg'>
                  <span>Общая стоимость</span>
                  <span>{sum + delivery} ₽</span>
                </div>
              </div>
            </div>
          </div>
        );
      }
  }

  return (
    <PageWrapper>
      <Head>
        <title>Интернет магазин почтовых открыток для посткроссинга DarlingDove</title>
        <meta name="description" content='Чудесный магазин почтовых открыток! Здесь вы можете купить качественные почтовые открытки для посткроссинга и сопутствующие товары!' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='px-2'>
        <h1 className='text-3xl font-semibold mb-4'>Корзина</h1>
        {content}
      </div>

    </PageWrapper>
  )
}

export default Cart;
