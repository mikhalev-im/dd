import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

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
    <PageWrapper
      title="Восстановление пароля - Darlingdove"
    >
      <div className="px-2">
        {content}
      </div>
    </PageWrapper>
  );
}

export default Restore;
