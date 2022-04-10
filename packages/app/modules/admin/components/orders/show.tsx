import { CSSProperties, LegacyRef, useRef } from 'react';
import { Show, SimpleShowLayout, TopToolbar, EditButton, Button, Record } from 'react-admin';
import { useReactToPrint } from 'react-to-print';
import { MdPrint } from 'react-icons/md';

const styles = {
  container: {
    width: "800px",
    margin: "0 auto",
    padding: '32px'
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    borderTop: "1px solid #DDDDDD",
    borderLeft: "1px solid #DDDDDD",
    marginBottom: "20px"
  } as CSSProperties,
  td: {
    fontSize: "12px",
    borderRight: "1px solid #DDDDDD",
    borderBottom: "1px solid #DDDDDD",
    padding: "7px"
  },
  tdHeader: {
    backgroundColor: "#EFEFEF",
    fontWeight: "bold",
    color: "#222222"
  },
  footer: {
    display: "table-row-group"
  }
};

const ORDER_STATUS_MAP = {
  notPaid: 'Ожидает оплаты',
  paid: 'Оплачен',
  shipped: 'Отправлен',
  done: 'Завершен',
};


interface OrderItem {
  product: {
    _id: string;
    name: string;
    sku: string;
  };
  price: number;
  qty: number;
}

interface OrderService {
  type: string;
  price: number;
}

interface OrderPromocode {
  promocode: {};
  code: string;
  discount: {
    total: number;
  };
}

interface OrderUser {
  user: {
    email: string;
  };
  lastName: string;
  firstName: string;
  postalCode: string;
  address: string;
  country: string;
}

interface Order {
  status: 'notPaid' | 'paid' | 'shipped' | 'done';
  items: OrderItem[];
  services: OrderService[];
  promocodes: OrderPromocode[];
  shortId: string;
  total: number;
  user: OrderUser;
  comment: string;
  createdTime: string;
}

const Order = (props: { record?: Order, containerRef: LegacyRef<HTMLDivElement> }) => {
  const order = props.record;

  if (!order) return null;
  const { promocodes = [], items = [], services = [] } = order;

  return (
    <div ref={props.containerRef} style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <td style={{ ...styles.td, ...styles.tdHeader }} colSpan={2}>
              Детализация заказа
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>
              <b>ID заказа:</b> {order.shortId}
              <br />
              <b>Дата заказа:</b> {new Date(order.createdTime).toLocaleString()}
              <br />
              <b>Способ оплаты:</b> Онлайн
            </td>
            <td style={styles.td}>
              <b>Клиент:</b> {`${order.user.lastName} ${order.user.firstName}`}
              <br />
              <b>E-mail:</b> {order.user?.user?.email}
              <br />
              <b>Статус заказа:</b> {ORDER_STATUS_MAP[order.status]}
              <br />
            </td>
          </tr>
        </tbody>
      </table>
      {order.comment && (
        <table style={styles.table}>
          <thead>
            <tr>
              <td style={{ ...styles.td, ...styles.tdHeader }}>
                Комментарий к заказу
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>{order.comment}</td>
            </tr>
          </tbody>
        </table>
      )}
      <table style={styles.table}>
        <thead>
          <tr>
            <td style={{ ...styles.td, ...styles.tdHeader }}>
              Адрес доставки
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={styles.td}
            >{`${order.user.postalCode}, ${order.user.country}, ${order.user.address}`}</td>
          </tr>
        </tbody>
      </table>
      <table style={styles.table}>
        <thead>
          <tr>
            <td style={{ ...styles.td, ...styles.tdHeader }}>Товар</td>
            <td style={{ ...styles.td, ...styles.tdHeader }}>Модель</td>
            <td style={{ ...styles.td, ...styles.tdHeader }} align="right">
              Количество
            </td>
            <td style={{ ...styles.td, ...styles.tdHeader }} align="right">
              Цена
            </td>
            <td style={{ ...styles.td, ...styles.tdHeader }} align="right">
              Итого:
            </td>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.product._id}>
              <td style={styles.td}>{item.product.name}</td>
              <td style={styles.td}>{item.product.sku}</td>
              <td style={styles.td} align="right">
                {item.qty}
              </td>
              <td style={styles.td} align="right">
                {item.price}
              </td>
              <td style={styles.td} align="right">
                {item.price * item.qty}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot style={styles.footer}>
          {promocodes.map(promocode => (
            <tr key={promocode.code}>
              <td style={styles.td} colSpan={4}>
                <b>Промокод {promocode.code}</b>
              </td>
              <td style={styles.td}>
                {promocode.discount.total && "-"} {promocode.discount.total}
              </td>
            </tr>
          ))}
          {services.map(service => (
            <tr key={service.type}>
              <td style={styles.td} colSpan={4} align="right">
                <b>Доставка:</b>
              </td>
              <td style={styles.td}>{service.price}</td>
            </tr>
          ))}
          <tr>
            <td style={styles.td} colSpan={4} align="right">
              <b>Итого:</b>
            </td>
            <td style={styles.td}>{order.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const TopActions = ({ basePath, data, onPrint }: { basePath?: string, data?: Record, onPrint: () => void }) => {
  return (
    <TopToolbar>
      <EditButton basePath={basePath} record={data} />
      <Button label='PRINT' onClick={onPrint} ><MdPrint /></Button>
    </TopToolbar>
  );
};

export const OrderShow = (props: any) => {
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentRef.current
  });

  return (
    <Show {...props} actions={<TopActions onPrint={handlePrint} />} >
      <SimpleShowLayout>
        <Order containerRef={contentRef} />
      </SimpleShowLayout>
    </Show>
  );
};
