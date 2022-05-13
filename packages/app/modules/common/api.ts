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
    const querystr = Object.entries(query).reduce((result, [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(value => result.append(key, value));
      } else if (typeof value == 'string' || typeof value == 'number') {
        result.append(key, value.toString());
      }

      return result;
    }, new URLSearchParams());

    const url = `/api${path}?${querystr.toString()}`;

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
  sortBy?: 'createdTime' | 'ordersCount' | 'name' | 'price' | 'random';
  order?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
  tags?: string[];
  search?: string;
}

interface ProductImage {
  width: number;
  height: number;
  type: 'card' | 'big';
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  sku: string;
  qty: number;
  price: number;
  oldPrice?: number;
  tags: string[];
  images: ProductImage[];
  createdTime: string;
}

export interface GetProductsResponse {
  data: Product[];
  total: number;
}

export const getProducts = async (query: ProductsFilters): Promise<GetProductsResponse> => {
  return api.get(`/products`, { query });
};

export const getProductBySku = async (sku: string): Promise<Product> => {
  return api.get(`/products/sku/${sku}`);
}

export const getProductTags = async (): Promise<string[]> => {
  return api.get('/products/tags');
}

export default api;
