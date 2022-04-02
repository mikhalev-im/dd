import { AuthProvider, fetchUtils } from 'react-admin';

const { fetchJson } = fetchUtils;

const authProvider: AuthProvider = {
  async login({ username, password }) {
    const user = await fetchJson('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
    }).then(({ json }) => json);

    if (!user.isAdmin) {
      throw new Error('Not allowed');
    }
  },
  async logout() {
    await fetchJson('/api/users/logout', {
      method: 'POST',
      body: '{}',
    });
  },
  async checkAuth() {
    const user = await fetchJson('/api/users/me').then(({ json }) => json);
    if (!user.isAdmin) {
      throw new Error('Not allowed');
    }
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

export default authProvider;
