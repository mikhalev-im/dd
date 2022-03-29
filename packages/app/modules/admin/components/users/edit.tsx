import { Edit, SimpleForm, TextInput } from 'react-admin';

export const UserEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled label="Id" source="id" />
      <TextInput disabled source="email" />
      <TextInput source="password" options={{ type: 'password' }} />
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <TextInput source="country" />
      <TextInput source="postalCode" />
      <TextInput source="address" />
    </SimpleForm>
  </Edit>
);
