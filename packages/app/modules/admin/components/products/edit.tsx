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
      <ArrayInput source="images">
        <SimpleFormIterator>
          <TextInput source="type" />
          <TextInput source="width" options={{ type: 'number' }} />
          <TextInput source="height" options={{ type: 'number' }} />
          <TextInput source="url" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
