enum RequestMethods {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

interface RequestOptions {
  query?: any;
  body?: any;
}

const api = {
  async request(
    method: RequestMethods,
    path: string,
    { query = {}, body }: RequestOptions = {}
  ) {
    const url = `/api${path}?${new URLSearchParams(query).toString()}`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // we can't parse json if there is no content
    let data = null;
    if (response.status !== 204) {
      data = await response.json();
    }

    if (!response.ok && !response.redirected) throw data;

    return data;
  },

  async get(path: string, options?: RequestOptions) {
    return api.request(RequestMethods.GET, path, options);
  },

  async post(path: string, options: RequestOptions) {
    return api.request(RequestMethods.POST, path, options);
  },

  async patch(path: string, options: RequestOptions) {
    return api.request(RequestMethods.PATCH, path, options);
  },

  async delete(path: string, options: RequestOptions) {
    return api.request(RequestMethods.DELETE, path, options);
  },
};

export interface ProductsFilters {
  sortBy?: 'createdTime' | 'ordersCount' | 'name' | 'price';
  order?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  sku: string;
  qty: number;
  price: number;
  oldPrice?: number;
  createdTime: string;
}

export interface GetProductsResponse {
  data: Product[];
  total: number;
}

export const getProducts = async (query: ProductsFilters): Promise<GetProductsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 10000));
  return api.get(`/products`, { query });
};

export default api;
