import { User } from "../../common/api";
import { statusLabels } from "../../common/translations";

interface SummaryProps {
  btn?: {
    text: string;
    tooltip?: string;
    disabled?: boolean;
    action: () => void;
  }
  details?: {
    shortId?: string;
    createdTime?: string;
    status?: 'notPaid' | 'paid' | 'shipped' | 'done';
    trackingNumber?: string;
  }
  user?: User;
  itemsCount: number;
  itemsPrice: number;
  deliveryPrice: number;
}

const Summary = ({ btn, user, details, itemsCount, itemsPrice, deliveryPrice}: SummaryProps) => {
  const sections = [];

  if (btn) {
    sections.push(
      <div key='button' className='py-4 border-b'>
        <button
          className='bg-green-500 hover:bg-green-600 text-white text-center py-4 w-full rounded font-semibold disabled:cursor-not-allowed disabled:bg-green-400'
          title={btn.tooltip}
          disabled={btn.disabled}
          onClick={btn.action}
        >
          {btn.text}
        </button>
      </div>
    );
  }

  if (details) {
    sections.push(
      <div key='details' className='border-b py-4'>
        <p className='font-semibold mb-2 text-lg'>Детали</p>
        {details.shortId && (
          <p className='flex justify-between'>
            <span>ID</span>
            <span>{details.shortId}</span>
          </p>
        )}
        {details.createdTime && (
          <p className='flex justify-between'>
            <span>Дата заказа</span>
            <span>{new Date(details.createdTime).toLocaleDateString('ru-RU')}</span>
          </p>
        )}
        {details.status && (
          <p className='flex justify-between'>
            <span>Статус</span>
            <span>{statusLabels[details.status]}</span>
          </p>
        )}
        {details.trackingNumber && (
          <p className='flex justify-between'>
            <span>Трек номер</span>
            <span>{details.trackingNumber}</span>
          </p>
        )}
      </div>
    );
  }

  if (user) {
    sections.push(
      <div key='delivery' className='border-b py-4'>
        <p className='font-semibold mb-2 text-lg'>Доставка</p>
        <p className='flex justify-between'>
          <span>{`${user.firstName} ${user.lastName}`}</span>
        </p>
        <p className='flex justify-between'>
          <span>{`${user.postalCode}, ${user.country}, ${user.address}`}</span>
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded py-2 px-6'>
      {sections}
      <div className='border-b py-4'>
        <p className='font-semibold mb-2 text-lg'>Всего</p>
        <p className='flex justify-between'>
          <span>Товары ({itemsCount})</span>
          <span>{itemsPrice} ₽</span>
        </p>
        <p className='flex justify-between'>
          <span>Доставка</span>
          <span>{deliveryPrice} ₽</span>
        </p>
      </div>
      <div className='py-4 font-semibold flex justify-between text-lg'>
        <span>Общая стоимость</span>
        <span>{itemsPrice + deliveryPrice} ₽</span>
      </div>
    </div>
  );
}

export default Summary;
