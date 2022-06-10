import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Head from 'next/head';

import { restorePasswordByToken } from "../modules/common/api";
import PageWrapper from "../modules/common/components/page-wrapper";

const restore = (token: string) => async () => {
  if (!token) return;
  await restorePasswordByToken(token);
}

const Restore: NextPage = () => {
  const router = useRouter();
  const token = router.query.token as string;

  const { status } = useQuery(['restore-password', token], restore(token), { retry: false });

  let content;
  if (!token) {
    content = (
      <p>Отсутствует токен</p>
    );
  }
  else if (status === 'error') {
    content = (
      <p>Что-то пошло не так!</p>
    );
  }
  else if (status === 'loading') {
    content = (
      <p>Восстанавливаем доступ...</p>
    );
  }
  else {
    router.push('/profile');
  }

  return (
    <PageWrapper>
      <Head>
        <title>Интернет магазин почтовых открыток для посткроссинга DarlingDove</title>
        <meta name="description" content='Чудесный магазин почтовых открыток! Здесь вы можете купить качественные почтовые открытки для посткроссинга и сопутствующие товары!' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="px-2">
        {content}
      </div>
    </PageWrapper>
  );
}

export default Restore;
