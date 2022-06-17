import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import PageWrapper from "../../modules/common/components/page-wrapper";
import { getOrder, getOrderPaymentUrl, Order } from '../../modules/common/api';
import Error from '../../modules/common/components/error';
import Summary from '../../modules/carts/components/summary';

const fetchOrder = (ready: boolean, orderId: string) => async () => {
  if (!ready) return;
  return getOrder(orderId);
}

const OrderPage = () => {
  const router = useRouter();
  const orderId = router.query.order as string;
  const { status, data, error } = useQuery<Order | undefined, Error>(['order', orderId], fetchOrder(router.isReady, orderId));

  if (status === 'loading') {
    return (<div>Loading...</div>)
  }

  if (status === 'error') {
    return (<Error error={error} />);
  }

  if (!data) {
    return (<div>No data</div>)
  }

  const onPay = async () => {
    try {
      // redirect to the payment gateway
      const { url } = await getOrderPaymentUrl(data._id);
      router.push(url);
    }
    catch (err) {
      toast.error('Что-то пошло не так!');
    }
  }

  let sum = 0;
  let count = 0;
  const delivery = data.services.reduce((s, item) => s + item.price, 0);
  const content = (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <div className='order-2 lg:col-span-2 lg:order-1'>
        <div className='bg-white rounded mb-8 px-4 py-2'>
          <table className='w-full'>
            {data.items.map((item) => {
              count += item.qty;
              sum += item.qty * item.product.price;
              const src = item.product.images.find(i => i.type === 'big')?.url || '';

              return (
                <tr key={item.product._id} className='border-b last:border-b-0'>
                  <td className='hidden md:table-cell w-48 py-2'>
                    <Image
                      src={src}
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
                    {item.price} ₽
                  </td>
                  <td className='px-2 text-center whitespace-nowrap'>
                    {item.qty} шт
                  </td>
                  <td className='px-2 w-20 hidden ss-table-cell'>
                    {item.price * item.qty} ₽
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
      <div className='order-1 lg:col-span-1 lg:order-2'>
        <Summary
          btn={data.status === 'notPaid'
            ? { text: 'Оплатить', action: onPay }
            : undefined
          }
          details={{
            shortId: data.shortId,
            createdTime: data.createdTime,
            status: data.status,
            trackingNumber: data.trackingNumber,
          }}
          user={data.user}
          itemsCount={count}
          itemsPrice={sum}
          deliveryPrice={delivery}
        />
      </div>
    </div>
  );

  return (
    <PageWrapper
      title='Заказ - Darlingdove'
    >
      <div className='px-2'>
        <h1 className='text-3xl font-semibold mb-4'>Заказ</h1>
        {content}
      </div>
    </PageWrapper>
  )
}

export default OrderPage;
