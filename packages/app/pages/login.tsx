import { FormEventHandler, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import ContentLoader from 'react-content-loader';

import PageWrapper from '../modules/common/components/page-wrapper';
import { getUser, login, register, restorePassword, User } from '../modules/common/api';

interface FormTarget {
  email?: { value: string };
  password?: { value: string };
  passwordConfirm?: { value: string };
}

const tabBtnText = {
  login: 'Войти',
  restore: 'Восстановить',
  register: 'Зарегистрироваться',
};

const Login: NextPage = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register' | 'restore'>('login');
  const { status } = useQuery<User, Error>('user', getUser, { retry: false });

  if (status === 'loading') {
    // TODO: add HEAD
    return (
      <PageWrapper
        title='Вход - Darlingdove'
      >
        <div className='mt-40 mb-40'>
          <ContentLoader
            viewBox="0 0 100 88"
            backgroundColor="#e5e7eb"
            foregroundColor="#d1d5db"
            className='mx-auto w-80'
          >
            <rect x="0" y="0" rx="2" ry="2" width="100" height="88" />
          </ContentLoader>
        </div>
      </PageWrapper>
    );
  }

  if (status === 'success') {
    router.replace('/profile');
    return null;
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const target = e.target as typeof e.target & FormTarget;

    const email = target.email?.value || '';
    const password = target.password?.value || '';
    const passwordConfirm = target.passwordConfirm?.value || '';

    // restore password
    if (tab === 'restore') {
      try {
        await restorePassword(email);
      }
      catch (err) {
        toast.error('Ошибка! Возможно пользователь не существует');
        return;
      }

      toast.info('Проверьте Вашу почту!');
      return;
    }

    // login
    if (tab === 'login') {
      try {
        await login(email, password);
      }
      catch (err) {
        toast.error('Ошибка! Возможно пользователь не существует');
        return;
      }
      router.replace('/profile');
      return;
    }

    // register
    if (password !== passwordConfirm) {
      toast.error('Пароли не совпадают!');
      return;
    }

    try {
      await register(email, password, passwordConfirm);
    }
    catch (err) {
      toast.error('Ошибка! Возможно пользователь уже существует');
      return;
    }

    router.replace('/profile');
  }

  return (
    <PageWrapper
      title='Вход - Darlingdove'
    >
      <div className='mt-40 mb-40'>
        <form onSubmit={onSubmit} className='mx-auto w-80 rounded bg-white p-4'>
          <div className='text-center mb-4'>
            <button
              type="button"
              className={`py-2 px-2 w-1/2 rounded ${tab === 'login' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('login')}
            >
              Вход
            </button>
            <button
              type="button"
              className={`py-2 px-2 w-1/2 rounded ${tab === 'register' ? 'bg-gray-200' : 'hover:bg-gray-100'} `}
              onClick={() => setTab('register')}
            >
              Регистрация
            </button>
          </div>
          <div className='mb-6'>
            <div className='mb-2'>
              <label htmlFor="email">Электронная почта</label>
              <input required type="email" id='email' name='email' className='border rounded w-full py-1 px-2' />
            </div>
            {tab !== 'restore' && (
              <div className='mb-2'>
                <label htmlFor="password">Пароль</label>
                <input required type="password" id='password' name='password' className='border rounded w-full py-1 px-2' />
              </div>
            )}
            {tab === 'register' && (
              <div className='mb-2'>
                <label htmlFor="passwordConfirm">Подтвердите пароль</label>
                <input required type="password" id='passwordConfirm' name='passwordConfirm' className='border rounded w-full py-1 px-2' />
              </div>
            )}
          </div>
          <div className='mb-2'>
            <button className='w-full px-2 py-2 text-white bg-blue-500 hover:bg-blue-600'>
              {tabBtnText[tab]}
            </button>
          </div>
          <div className='text-right'>
            <button type='button' className='hover:text-blue-700 text-sm' onClick={() => setTab('restore')}>Забыли пароль?</button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}

export default Login;
