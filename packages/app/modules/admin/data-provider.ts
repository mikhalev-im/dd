import {
  Record,
  DataProvider,
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

const RECORD_1: Record = {
  id: 'id-01',
  name: 'test resource'
};

const DEFAULT_SORT_BY_RESOURCE: { [key: string]: string } = {
  users: 'createdAt',
};

const { fetchJson } = fetchUtils;

const dataProvider: DataProvider = {
  async getList(resource: string, params: GetListParams) {
    const { order } = params.sort;
    const { page, perPage } = params.pagination;

    const offset = perPage * (page - 1);
    const query = new URLSearchParams({
      sortBy: DEFAULT_SORT_BY_RESOURCE[resource] || 'createdTime',
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

export default dataProvider;
