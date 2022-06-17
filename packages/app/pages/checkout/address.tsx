import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEventHandler } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { Cart, getCart, getUser, updateUser, User } from '../../modules/common/api';
import PageWrapper from '../../modules/common/components/page-wrapper';

interface FormTarget {
  firstName?: { value: string };
  lastName?: { value: string };
  country?: { value: string };
  postalCode?: { value: string };
  address?: { value: string };
}

const CheckoutAddress: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const userQuery = useQuery<User, Error>('user', getUser, { retry: false });
  const cartQuery = useQuery<Cart, Error>('cart', getCart, { retry: false });

  const userMutation = useMutation((data: User) => {
    const { _id, ...rest } = data;
    return updateUser(_id, rest);
  }, {
    onSuccess: (data) => {
      queryClient.setQueryData('user', data);
      router.push('/checkout/confirm');
    },
    onError: () => {
      toast.error('Что-то пошло не так!');
    },
  });

  if (userQuery.status === 'error') {
    router.replace('/login');
    return null;
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const target = e.target as typeof e.target & FormTarget;

    const data = {
      _id: userQuery.data?._id || '',
      firstName: target.firstName?.value || '',
      lastName: target.lastName?.value || '',
      country: target.country?.value || '',
      postalCode: target.postalCode?.value || '',
      address: target.address?.value || '',
    };

    userMutation.mutate(data);
  };

  const { sum, qty } = (cartQuery.data?.items || []).reduce((result, item) => {
    result.sum += item.product.price * item.qty;
    result.qty += item.qty;
    return result;
  }, { sum: 0, qty: 0 });
  const delivery = cartQuery.data?.services.reduce((sum, item) => sum + item.price, 0) || 0;

  return (
    <PageWrapper
      title='Заказ - Darlingdove'
    >
      <div className='mb-6 px-2 py-4'>
        <h1 className='text-3xl font-semibold mb-4'>Доставка</h1>
        <div className='grid lg:grid-cols-3 gap-6'>
          <form className='bg-white rounded p-4 lg:col-span-2 order-2 lg:order-1' id='address-form' onSubmit={onSubmit}>
            <div className='mb-2'>
              <label className='w-full' htmlFor="firstName">Имя</label>
              <input
                required
                type="text"
                id='firstName'
                name="firstName"
                defaultValue={userQuery.data?.firstName}
                className='w-full border rounded py-1 px-2'
              />
            </div>
            <div className='mb-2'>
              <label className='w-full' htmlFor="lastName">Фамилия</label>
              <input
                required
                type="text"
                id='lastName'
                name="lastName"
                defaultValue={userQuery.data?.lastName}
                className='w-full border rounded py-1 px-2'
              />
            </div>
            <div className='mb-2'>
              <label className='w-full' htmlFor="country">Страна</label>
              <input
                disabled
                required
                value='Россия'
                type="text"
                id='country'
                name="country"
                className='w-full border rounded py-1 px-2'
              />
            </div>
            <div className='mb-2'>
              <label className='w-full' htmlFor="postalCode">Индекс</label>
              <input
                required
                type="text"
                id='postalCode'
                name="postalCode"
                defaultValue={userQuery.data?.postalCode}
                className='w-full border rounded py-1 px-2'
              />
            </div>
            <div className='mb-2'>
              <label className='w-full' htmlFor="address">Адрес</label>
              <input
                required
                type="text"
                id='address'
                name="address"
                defaultValue={userQuery.data?.address}
                className='w-full border rounded py-1 px-2'
              />
            </div>
          </form>

          <div className='order-1 lg:order-2'>
            <div className='bg-white rounded py-2 px-6'>
              <div className='py-4 border-b'>
                <button className='bg-green-500 hover:bg-green-600 text-white text-center py-4 w-full rounded font-semibold' form='address-form'>
                  Продолжить
                </button>
              </div>
              <div className='border-b py-4'>
                <p className='font-semibold mb-2 text-lg'>Всего</p>
                <p className='flex justify-between'>
                  <span>Товары ({qty})</span>
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
      </div>
    </PageWrapper>
  )
}

export default CheckoutAddress;
