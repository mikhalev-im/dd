import "@reach/dialog/styles.css";
import type { NextPage } from 'next';
import { FormEventHandler, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Dialog } from "@reach/dialog";
import { HiOutlineX } from 'react-icons/hi';

import { getUser, changePassword, logout, getOrders, GetOrdersResponse, User } from '../modules/common/api';
import PageWrapper from '../modules/common/components/page-wrapper';
import Pagination from '../modules/common/components/pagination';

interface FormTarget {
  password?: { value: string };
  passwordConfirm?: { value: string };
}

const fetchOrders = (offset: number) => async () => {
  return getOrders(offset);
}

const statusLabels = {
  notPaid: 'Ожидает оплаты',
  paid: 'Оплачен',
  shipped: 'Отправлен',
  done: 'Завершен'
};

const Profile: NextPage = () => {
  const router = useRouter();
  const offset = router.query.offset ? parseInt(router.query.offset as string, 10) : 0;

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const userQuery = useQuery<User, Error>('user', getUser, { retry: false });
  const ordersQuery = useQuery<GetOrdersResponse>(['orders', offset], fetchOrders(offset), { retry: false });

  const onPageChange = (value: number) => {
    router.push(`${window.location.pathname}?offset=${value}`);
  }

  const onLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    }
    catch (err) {
      toast.error('Что-то пошло не так!');
    }
  }

  const onChangePassword: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const target = e.target as typeof e.target & FormTarget;

    const password = target.password?.value || '';
    const passwordConfirm = target.passwordConfirm?.value || '';

    if (password !== passwordConfirm) {
      toast.error('Пароли не совпадают!');
      return;
    }

    try {
      await changePassword(userQuery.data?._id || '', password);
      toast.info('Пароль успешно изменен!');
      setShowPasswordDialog(false);
    }
    catch (err) {
      toast.error('Что-то пошло не так!');
    }
  }

  if (userQuery.status === 'error') {
    router.replace('/login');
    return null;
  }

  let content;
  if (!ordersQuery.data || !ordersQuery.data.data.length) {
    content = (
      <p>Нет заказов</p>
    );
  }
  else {
    content = (
      <div>
        <div className='bg-white rounded'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left px-6 py-3 hidden lg:table-cell'>ID</th>
                <th className='text-left px-6 py-3'>Дата</th>
                <th className='text-left sm:px-6 py-3 px-2'>Статус</th>
                <th className='text-right px-6 py-3 hidden lg:table-cell'>Количество</th>
                <th className='text-right px-6 py-3'>Сумма</th>
                <th className='text-right px-6 py-3 hidden sm:table-cell'>Трек номер</th>
              </tr>
            </thead>
            <tbody>
              {ordersQuery.data.data.map((order) => {
                const qty = order.items.reduce((c, item) => c + item.qty, 0);
                const date = new Date(order.createdTime);

                return (
                  <tr key={order.shortId} className='border-b hover:cursor-pointer hover:bg-gray-50' onClick={() => console.log('click')}>
                    <td className='px-6 py-4 hidden lg:table-cell'>{order.shortId}</td>
                    <td className='px-6 py-4'>{date.toLocaleDateString('ru-RU')}</td>
                    <td className='sm:px-6 py-4 px-2'>{statusLabels[order.status]}</td>
                    <td className='text-right px-6 py-4 hidden lg:table-cell'>{qty}</td>
                    <td className='text-right px-6 py-4'>{order.total} ₽</td>
                    <td className='text-right px-6 py-4 hidden sm:table-cell'>{order.trackingNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination total={ordersQuery.data.total} offset={offset} pageSize={25} onChange={onPageChange} />
      </div>
    );
  }

  return (
    <PageWrapper>
      <Head>
        <title>Интернет магазин почтовых открыток для посткроссинга DarlingDove</title>
        <meta name="description" content='Чудесный магазин почтовых открыток! Здесь вы можете купить качественные почтовые открытки для посткроссинга и сопутствующие товары!' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='px-2'>
        <h1 className='text-3xl font-semibold mb-4'>Личный кабинет</h1>
        <div className='grid md:grid-cols-4 gap-6'>
          <div className='md:border-r md:col-span-1'>
            <ul className='w-full flex justify-end md:block'>
              <li className='hover:bg-gray-200 rounded'>
                <button className='py-2 px-4 block w-full text-left' onClick={() => setShowPasswordDialog(true)}>Сменить пароль</button>
              </li>
              <li className='hover:bg-gray-200 rounded '>
                <button className='py-2 px-4 block w-full text-left' onClick={onLogout}>Выйти</button>
              </li>
            </ul>
          </div>
          <div className='md:col-span-3'>
            {content}
          </div>
        </div>
        <Dialog
          className='rounded max-w-xs relative'
          style={{ width: '80vw' }}
          isOpen={showPasswordDialog}
          onDismiss={() => setShowPasswordDialog(false)}
          aria-label="Change password"
        >
          <button
            type="button"
            className="absolute top-2 right-2"
            onClick={() => setShowPasswordDialog(false)}
          >
            <HiOutlineX />
          </button>
          <form onSubmit={onChangePassword}>
            <div className="mb-2">
              <label htmlFor="">Новый пароль</label>
              <input required type="password" name='password' className="border rounded w-full py-1 px-2" />
            </div>
            <div className="mb-4">
              <label htmlFor="">Повторите пароль</label>
              <input required type="password" name='passwordConfirm' className="border rounded w-full py-1 px-2" />
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2">Сменить пароль</button>
          </form>
        </Dialog>
      </div>
    </PageWrapper>
  )
}

export default Profile;
