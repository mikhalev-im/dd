import { Record, List, Datagrid, TextField, DateField, FunctionField, ShowButton, EditButton, linkToRecord } from 'react-admin';

const getUserName = (record: any) => {
  const parts = [];

  if (record.user.firstName) parts.push(record.user.firstName);
  if (record.user.lastName) parts.push(record.user.lastName);

  return parts.join(' ');
};

const getTotalPrice = (record: any) => {
  return record.items.reduce((sum: number, item: { price: number, qty: number }) => {
    sum += item.price * item.qty;
    return sum;
  }, 0);
}

const Actions = ({ record }: { record?: Record }) => {
  return (
    <div className='flex'>
      <ShowButton record={record} label='' />
      <EditButton record={record} label='' />
    </div>
  );
}

export const OrderList = (props: any) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="shortId" />
        <DateField source="createdTime" />
        <TextField source="user.user.email" label='Email' />
        <FunctionField label='User name' render={getUserName} />
        <FunctionField label='Sum' render={getTotalPrice} />
        <TextField source="status" />
        <TextField source="trackingNumber" />
        <Actions />
      </Datagrid>
    </List>

  );
};
