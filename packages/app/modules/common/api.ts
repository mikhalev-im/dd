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
    const options: RequestInit = { method };

    if (body) {
      options.body = JSON.stringify(body);
      options.headers = {
        'Content-Type': 'application/json',
      };
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

export interface User {
  _id: string;
}

export const getUser = async (): Promise<User> => {
  return api.get('/users/me');
}

export const login = async (email: string, password: string): Promise<User> => {
  return api.post('/users/login', { body: { email, password } });
}

export const logout = async (): Promise<void> => {
  return api.post('/users/logout', {});
}

export const register = async (email: string, password: string, passwordConfirm: string): Promise<User> => {
  return api.post('/users/register', { body: { email, password, passwordConfirm } });
}

export const restorePassword = async (email: string): Promise<void> => {
  return api.post('/users/restore', { body: { email } });
}

export const restorePasswordByToken = async (token: string): Promise<User> => {
  return api.get('/users/restore', { query: { token } });
}

export const changePassword = async (userId: string, password: string) => {
  return api.patch(`/users/${userId}`, { body: { password } });
}

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

interface CartItem {
  product: Product;
  qty: number;
}

interface CartService {
  type: 'FREE_DELIVERY' | 'PAID_DELIVERY';
  price: number;
}

export interface Cart {
  items: CartItem[];
  services: CartService[];
}

export const getCart = async (): Promise<Cart> => {
  return api.get(`/carts/current`);
}

export const addItemToCart = async (productId: string, qty: number = 1): Promise<Cart> => {
  return api.post(`/carts/items/${productId}`, { body: { qty } });
}

export const removeCartItem = async (productId: string): Promise<Cart> => {
  return api.delete(`/carts/items/${productId}`, {});
}

export const changeCartItemQty = async (productId: string, qty: number): Promise<Cart> => {
  return api.patch(`/carts/items/${productId}/qty`, { body: { qty } });
}

interface OrderItem {
  product: Product;
  qty: number;
  price: number;
}

interface OrderService {
  type: 'FREE_DELIVERY' | 'PAID_DELIVERY';
  price: number;
}

interface OrderUser {
  user: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  services: OrderService[];
  total: number;
  user: OrderUser;
  comment: string;
  shortId: string;
  status: 'notPaid' | 'paid' | 'shipped' | 'done';
  trackingNumber: string;
  updatedTime: string;
  createdTime: string;
}

export interface GetOrdersResponse {
  data: Order[];
  total: number;
}

export const getOrders = async (offset: number = 0): Promise<GetOrdersResponse> => {
  return api.get('/orders', { query: { offset, sortBy: 'createdTime', order: 'desc' } });
};

export const getOrder = async (orderId: string): Promise<Order> => {
  return api.get(`/orders/${orderId}`);
}

export default api;
