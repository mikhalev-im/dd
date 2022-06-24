import { List, Datagrid, TextField, DateField, BooleanField } from 'react-admin';

export const UserList = (props: any) => (
  <List {...props} sort={{ field: 'createdAt', order: 'desc' }} >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="email" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <TextField source="postalCode" />
      <TextField source="address" />
      <DateField source="createdAt" locales='ru-RU' />
      <BooleanField source="isAdmin" />
    </Datagrid>
  </List>
);
