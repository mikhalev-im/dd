import type { NextPage } from 'next';
import Head from 'next/head';
import PageWrapper from '../modules/common/components/page-wrapper';

const textWrapperStyle = { maxWidth: '900px' };

const About: NextPage = () => {
  return (
    <PageWrapper>
      <Head>
        <title>Интернет магазин почтовых открыток для посткроссинга DarlingDove</title>
        <meta name="description" content='Чудесный магазин почтовых открыток! Здесь вы можете купить качественные почтовые открытки для посткроссинга и сопутствующие товары!' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="px-2 py-4 mx-auto" style={textWrapperStyle}>
        <h1 className='mb-4 text-3xl font-semibold'>О нас</h1>
        <h2 className='mb-4 text-2xl'>Мы рады приветствовать Вас в нашем магазине!</h2>

        <p className='mb-2'>DarlingDove – интернет-магазин почтовых открыток для посткроссинга! Владельцы магазина тоже посткроссеры, поэтому мы знаем о необходимом качестве и самых актуальных темах!</p>

        <p className='mb-2'>У нас вы можете заказать качественные открытки размером 10 x 15 см, изготовленные на плотном мелованном картоне 295 г/кв.м. при офсетной печати. Лицевая сторона заламинирована. Оборотная имеет разлиновку для адреса, данные магазина, а также самое главное – название и автора! На ощупь шероховатая, подходит для любых пишущих принадлежностей.</p>

        <p className='mb-4'>Заказы принимаются круглосуточно, формируются в течении двух дней после получения оплаты. Отправка происходит с понедельника по субботу.</p>

        <h2 className='mb-4 text-2xl'>Наши контакты:</h2>

        <table>
          <tr>
            <td>Email:</td>
            <td className='px-2'><a href="mailto:info@darlingdove.ru" className='hover:text-blue-700'>info@darlingdove.ru</a></td>
          </tr>
          <tr>
            <td>VK:</td>
            <td className='px-2'><a href="https://vk.com/darlingdove" className='hover:text-blue-700'>https://vk.com/darlingdove</a></td>
          </tr>
          <tr>
            <td>Адерс:</td>
            <td className='px-2'>Республика Коми, г. Сыктывкар</td>
          </tr>
        </table>
      </section>
    </PageWrapper>
  )
}

export default About;
