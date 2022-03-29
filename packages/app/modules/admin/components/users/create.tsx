import { Create, SimpleForm, TextInput } from 'react-admin';

export const UserCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" required options={{ type: 'email' }} />
      <TextInput source="password" required options={{ type: 'password' }} />
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <TextInput source="country" />
      <TextInput source="postalCode" />
      <TextInput source="address" />
    </SimpleForm>
  </Create>
);
