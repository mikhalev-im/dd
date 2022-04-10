import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';

const statusOptions = [
  { id: 'notPaid', name: 'Not paid' },
  { id: 'paid', name: 'Paid' },
  { id: 'shipped', name: 'Shipped' },
  { id: 'done', name: 'Done' },
];

export const OrderEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled label="Id" source="id" />
      <TextInput disabled source="shortId" />
      <TextInput disabled source="user.user.email" label='Email' />
      <SelectInput source="status" choices={statusOptions} />
      <TextInput source="trackingNumber" />
    </SimpleForm>
  </Edit>
);
