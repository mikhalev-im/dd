import { List, Datagrid, TextField, DateField, BooleanField } from 'react-admin';

export const CartList = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <DateField source="createdTime" />
    </Datagrid>
  </List>
);
