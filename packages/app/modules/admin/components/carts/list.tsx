import { List, Datagrid, TextField, DateField, FunctionField } from 'react-admin';

const getNumberOfItems = (record: any) => {
  return record.items.reduce((count: number, item: { price: number, qty: number }) => {
    count += item.qty;
    return count;
  }, 0);
};

const getTotalPrice = (record: any) => {
  return record.items.reduce((sum: number, item: { price: number, qty: number }) => {
    sum += item.price * item.qty;
    return sum;
  }, 0);
};

export const CartList = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <DateField source="createdTime" />
      <FunctionField label='Qty' render={getNumberOfItems} />
      <FunctionField label='Sum' render={getTotalPrice} />
    </Datagrid>
  </List>
);
