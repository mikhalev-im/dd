import { List, Datagrid, TextField, DateField, BooleanField } from 'react-admin';

export const ProductList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="sku" />
      <TextField source="qty" />
      <TextField source="price" />
      <TextField source="ordersCount" />
      <DateField source="createdTime" />
    </Datagrid>
  </List>
);
