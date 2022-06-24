import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { Cart, createOrder, getOrderPaymentUrl, getCart, getUser, User } from '../../modules/common/api';
import PageWrapper from '../../modules/common/components/page-wrapper';
import Summary from '../../modules/carts/components/summary';
import { useRouter } from 'next/router';

const CheckoutConfirm: NextPage = () => {
  const router = useRouter();

  const userQuery = useQuery<User, Error>('user', getUser, { retry: false });
  const cartQuery = useQuery<Cart, Error>('cart', getCart, { retry: false });

  if (userQuery.status === 'error') {
    router.replace('/login');
    return null;
  }

  if (cartQuery.status === 'loading') {
    return (
      <PageWrapper
        title='Заказ - Darlingdove'
      >
        <div className='mb-6 px-2 py-4'>
          <h1 className='text-3xl font-semibold mb-4'>Подтверждение заказа</h1>
          <div>Загрузка...</div>
        </div>
      </PageWrapper>
    );
  }

  const onPay = async () => {
    try {
      // create order
      const order = await createOrder({ cartId: cartQuery.data?._id || '' });
      // redirect to the payment gateway
      const { url } = await getOrderPaymentUrl(order._id);
      router.push(url);
    }
    catch (err) {
      toast.error('Что-то пошло не так!');
    }
  }

  let count = 0;
  let sum = 0;
  const delivery = cartQuery.data?.services.reduce((s, item) => s + item.price, 0) || 0;

  return (
    <PageWrapper
      title='Заказ - Darlingdove'
    >
      <div className='mb-6 px-2 py-4'>
        <h1 className='text-3xl font-semibold mb-4'>Подтверждение заказа</h1>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='order-2 lg:col-span-2 lg:order-1'>
            <div className='bg-white rounded mb-8 px-4 py-2'>
              <table className='w-full'>
                <tbody>
                  {cartQuery.data?.items.map((item) => {
                    count += item.qty;
                    sum += item.qty * item.product.price;

                    return (
                      <tr key={item.product._id} className='border-b last:border-b-0'>
                        <td className='hidden md:table-cell w-48 py-2'>
                          <Image
                            src={item.product.images.sm}
                            alt={item.product.description}
                            width={175}
                            height={125}
                            className='rounded'
                          />
                        </td>
                        <td className='py-2'>
                          <p>
                            <Link href={`/product/${item.product.sku}`}>
                              <a className='hover:text-blue-700'>{item.product.name}</a>
                            </Link></p>
                          <p className='text-xs text-slate-500'>{item.product.sku}</p>
                        </td>
                        <td className='px-2 w-20 text-right'>
                          {item.product.price} ₽
                        </td>
                        <td className='px-2 text-center whitespace-nowrap'>
                          {item.qty} шт
                        </td>
                        <td className='px-2 w-20 hidden ss-table-cell'>
                          {item.product.price * item.qty} ₽
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className='order-1 lg:col-span-1 lg:order-2'>
            <Summary
              itemsCount={count}
              itemsPrice={sum}
              deliveryPrice={delivery}
              user={userQuery.data}
              btn={{ text: 'Оплатить', action: onPay }}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CheckoutConfirm;