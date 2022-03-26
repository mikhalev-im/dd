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
  DeleteManyParams
} from 'react-admin';

const RECORD_1: Record = {
  id: 'id-01',
  name: 'test resource'
};

const dataProvider: DataProvider = {
  async getList<RecordType extends Record>(resource: string, params: GetListParams) {
    return {
      data: [RECORD_1 as RecordType],
      total: 1,
    };
  },
  async getOne<RecordType extends Record>(resource: string, params: GetOneParams) {
    return {
      data: RECORD_1 as RecordType,
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
  async create<RecordType extends Record>(resource: string, params: CreateParams) {
    return {
      data: RECORD_1 as RecordType,
    };
  },
  async update<RecordType extends Record>(resource: string, params: UpdateParams) {
    return {
      data: RECORD_1 as RecordType,
    };
  },
  async updateMany(resource: string, params: UpdateManyParams) {
    return {};
  },
  async delete<RecordType extends Record = Record>(resource: string, params: DeleteParams) {
    return {
      data: RECORD_1 as RecordType
    };
  },
  async deleteMany(resource: string, params: DeleteManyParams) {
    return {};
  },
};

const authProvider: AuthProvider = {
  async login() {
    return;
  },
  async logout() {
    return;
  },
  async checkAuth() {
    return;
  },
  async checkError() {
    return;
  },
  async getIdentity() {
    return { id: 'admin_1', fullName: 'Igor' };
  },
  async getPermissions() {
    return;
  },
};

const App = () => (
  <Admin disableTelemetry title='DarlingDove Admin' authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="users" list={ListGuesser} />
    <Resource name="orders" list={ListGuesser} />
    <Resource name="products" list={ListGuesser} />
  </Admin>
);

export default App;