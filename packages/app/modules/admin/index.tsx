import {
  Admin,
  Resource,
  Record,
  ListGuesser,
  DataProvider,
  AuthProvider,
  GetListParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  CreateParams,
  UpdateParams,
  UpdateManyParams,
  DeleteParams,
  DeleteManyParams,
  fetchUtils
} from 'react-admin';

import { UserList } from './components/users/list';
import { UserCreate } from './components/users/create';
import { UserEdit } from './components/users/edit';
import { ProductList } from './components/products/list';
import { ProductCreate } from './components/products/create';
import { ProductEdit } from './components/products/edit';

const { fetchJson } = fetchUtils;

const RECORD_1: Record = {
  id: 'id-01',
  name: 'test resource'
};

const DEFAULT_SORT_BY_RESOURCE: { [key: string]: string } = {
  users: 'createdAt',
  products: 'createdTime',
};

const dataProvider: DataProvider = {
  async getList(resource: string, params: GetListParams) {
    const { order } = params.sort;
    const { page, perPage } = params.pagination;

    const offset = perPage * (page - 1);
    const query = new URLSearchParams({
      sortBy: DEFAULT_SORT_BY_RESOURCE[resource],
      order: order.toLowerCase(),
      offset: offset.toString(),
      limit: perPage.toString(),
    }).toString();

    const json = await fetchJson(`/api/${resource}?${query}`).then(({ json }) => json);
    return {
      data: json.data.map((resource: Record) => ({ ...resource, id: resource._id })),
      total: json.total,
    };
  },
  async getOne(resource: string, params: GetOneParams) {
    const json = await fetchJson(`/api/${resource}/${params.id}`).then(({ json }) => json);
    return {
      data: { ...json, id: json._id },
    };
  },
  async getMany<RecordType extends Record>(resource: string, params: GetManyParams) {
    return {
      data: [RECORD_1 as RecordType],
    };
  },
  async getManyReference<RecordType extends Record>(resource: string, params: GetManyReferenceParams) {
    return {
      data: [RECORD_1 as RecordType],
      total: 1,
    };
  },
  async create(resource: string, params: CreateParams) {
    const json = await fetchJson(`/api/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => json);
    return {
      data: { ...json, id: json._id },
    };
  },
  async update(resource: string, params: UpdateParams) {
    const json = await fetchJson(`/api/${resource}/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(params.data),
    }).then(({ json }) => json);
    return {
      data: { ...json, id: json._id },
    };
  },
  async updateMany(resource: string, params: UpdateManyParams) {
    return {};
  },
  async delete<RecordType extends Record = Record>(resource: string, params: DeleteParams) {
    await fetchJson(`/api/${resource}/${params.id}`, {
      method: 'DELETE',
      body: '{}',
    });
    return {
      data: { id: params.id } as RecordType,
    };
  },
  async deleteMany(resource: string, params: DeleteManyParams) {
    await Promise.all(params.ids.map(async (id) => {
      await fetchJson(`/api/${resource}/${id}`, {
        method: 'DELETE',
        body: '{}',
      });
    }))
    return {
      data: [],
    };
  },
};

const authProvider: AuthProvider = {
  async login({ username, password }) {
    await fetchJson('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
    });
  },
  async logout() {
    await fetchJson('/api/users/logout', {
      method: 'POST',
      body: '{}',
    });
  },
  async checkAuth() {
    await fetchJson('/api/users/me');
  },
  async checkError() {
    return;
  },
  async getIdentity() {
    const user = await fetchJson('/api/users/me').then(({ json }) => json);
    return { id: user._id, fullName: user.firstName || 'Unknown' };
  },
  async getPermissions() {
    return;
  },
};

const App = () => (
  <Admin disableTelemetry title='DarlingDove Admin' authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit} />
    <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} />
    <Resource name="orders" list={ListGuesser} />
  </Admin>
);

export default App;