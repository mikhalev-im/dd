import { Edit, SimpleForm, TextInput, ArrayInput, SimpleFormIterator } from 'react-admin';

export const ProductEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="sku" required />
      <TextInput source="description" />
      <TextInput source="price" options={{ type: 'number' }} />
      <TextInput source="oldPrice" options={{ type: 'number' }} />
      <TextInput source="qty" options={{ type: 'number' }} />
      <ArrayInput source="tags">
        <SimpleFormIterator>
          <TextInput source="" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="images.sm" required />
      <TextInput source="images.md" required />
      <TextInput source="images.lg" required />
    </SimpleForm>
  </Edit>
);
