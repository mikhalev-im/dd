import { List, Datagrid, TextField, DateField } from 'react-admin';

export const ProductList = (props: any) => (
  <List {...props} sort={{ field: 'createdTime', order: 'desc' }} >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="sku" />
      <TextField source="qty" />
      <TextField source="price" />
      <TextField source="ordersCount" />
      <DateField source="createdTime" locales='ru-RU' />
    </Datagrid>
  </List>
);
