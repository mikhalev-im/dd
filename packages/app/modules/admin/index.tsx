import { Admin, Resource, ListGuesser } from 'react-admin';

import { UserList } from './components/users/list';
import { UserCreate } from './components/users/create';
import { UserEdit } from './components/users/edit';

import { ProductList } from './components/products/list';
import { ProductCreate } from './components/products/create';
import { ProductEdit } from './components/products/edit';

import { CartList } from './components/carts/list';

import { OrderList } from './components/orders/list';
import { OrderShow } from './components/orders/show';
import { OrderEdit } from './components/orders/edit';

import dataProvider from './data-provider';
import authProvider from './auth-provider';

const App = () => (
  <Admin disableTelemetry title='DarlingDove Admin' authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit} />
    <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} />
    <Resource name="orders" list={OrderList} show={OrderShow} edit={OrderEdit} />
    <Resource name="carts" list={CartList} />
  </Admin>
);

export default App;