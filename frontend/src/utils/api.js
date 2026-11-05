export async function apiFetch(input, init = {}) {
  const token = localStorage.getItem('fleetops_token');
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(input, { ...init, headers });
  if (response.status === 401 && token && window.location.pathname !== '/login') {
    localStorage.removeItem('fleetops_token');
    localStorage.removeItem('fleetops_user');
    window.location.assign('/login');
  }
  return response;
}
