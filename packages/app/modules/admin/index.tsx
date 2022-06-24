import { Admin, Resource } from 'react-admin';
import { HiLogin, HiShoppingCart, HiUser, HiTag, HiCube } from 'react-icons/hi';

import { HomeView } from './components/home';

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
    <Resource name="orders" icon={HiCube} list={OrderList} show={OrderShow} edit={OrderEdit} />
    <Resource name="products" icon={HiTag} list={ProductList} create={ProductCreate} edit={ProductEdit} />
    <Resource name="users" icon={HiUser} list={UserList} create={UserCreate} edit={UserEdit} />
    <Resource name="carts" icon={HiShoppingCart} list={CartList} />
    <Resource name="home" options={{ label: 'Back to website' }} icon={HiLogin} list={HomeView} />
  </Admin>
);

export default App;