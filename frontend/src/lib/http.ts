import type { ApiErrorBody } from '../types/api.ts';

const baseURL = (import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3000/api').replace(
  /\/$/,
  '',
);

const TIMEOUT_MS = 15000;

// Menerima interface apa pun (StallQuery, MenuQuery, dst.) tanpa perlu index signature.
export type QueryParams = object;

export interface RequestOptions {
  params?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Error yang dilempar oleh http client.
 * - status: kode HTTP (0 jika request gagal sebelum ada respons)
 * - body: isi JSON error dari backend jika ada
 * - code: 'TIMEOUT' atau 'NETWORK' untuk kegagalan non-HTTP
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;
  readonly url: string;
  readonly code?: 'TIMEOUT' | 'NETWORK';

  constructor(options: {
    message: string;
    status: number;
    url: string;
    body?: ApiErrorBody | null;
    code?: 'TIMEOUT' | 'NETWORK';
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.status = options.status;
    this.url = options.url;
    this.body = options.body ?? null;
    this.code = options.code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function buildUrl(path: string, params?: QueryParams): string {
  const url = `${baseURL}${path.startsWith('/') ? path : `/${path}`}`;

  if (!params) return url;

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function notifyUnauthorized(path: string): void {
  const isSessionCheck = path.endsWith('/auth/me');
  const isLoginOrRegister = path.endsWith('/auth/login') || path.endsWith('/auth/register');

  if (!isSessionCheck && !isLoginOrRegister) {
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);

  const timeoutController = new AbortController();
  const timer = window.setTimeout(() => timeoutController.abort(), TIMEOUT_MS);

  // Gabungkan signal dari pemanggil (mis. cleanup useEffect) dengan timeout.
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeoutController.signal])
    : timeoutController.signal;

  const headers: Record<string, string> = { Accept: 'application/json' };
  let body: string | undefined;

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers,
      body,
      // Setara dengan withCredentials: true pada Axios. Wajib agar cookie HttpOnly terkirim.
      credentials: 'include',
      signal,
    });
  } catch (error) {
    // Dibatalkan oleh pemanggil: teruskan apa adanya agar bisa diabaikan.
    if (options.signal?.aborted) throw error;

    if (timeoutController.signal.aborted) {
      throw new ApiError({
        message: 'Request timeout',
        status: 0,
        url: path,
        code: 'TIMEOUT',
      });
    }

    throw new ApiError({
      message: 'Network error',
      status: 0,
      url: path,
      code: 'NETWORK',
    });
  } finally {
    window.clearTimeout(timer);
  }

  const payload = await parseBody(response);

  // Berbeda dengan Axios, fetch tidak melempar error untuk status 4xx/5xx.
  if (!response.ok) {
    if (response.status === 401) notifyUnauthorized(path);

    const errorBody =
      payload && typeof payload === 'object' ? (payload as ApiErrorBody) : null;

    throw new ApiError({
      message: errorBody?.message ?? `Request gagal dengan status ${response.status}`,
      status: response.status,
      url: path,
      body: errorBody,
    });
  }

  return payload as T;
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('DELETE', path, options),
};

const fieldLabels: Record<string, string> = {
  name: 'Nama',
  email: 'Email',
  password: 'Password',
  currentPassword: 'Password lama',
  newPassword: 'Password baru',
  role: 'Peran',
  ownerId: 'Pemilik warung',
  stallId: 'Warung',
  menuId: 'Menu',
  price: 'Harga',
  isAvailable: 'Ketersediaan menu',
  rating: 'Rating',
  comment: 'Komentar',
  reason: 'Alasan',
  status: 'Status',
  search: 'Pencarian',
  category: 'Kategori',
  location: 'Lokasi',
  description: 'Deskripsi',
};

function fieldLabel(field: string): string {
  if (fieldLabels[field]) return fieldLabels[field];

  const spaced = field.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function validationMessage(details: ApiErrorBody['errors']): string | null {
  if (!details || details.length === 0) return null;

  return details.map((item) => `${fieldLabel(item.field)}: ${item.message}`).join(' ');
}

export function getApiErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    return 'Terjadi kesalahan. Coba lagi.';
  }

  const { status, body, url } = error;

  if (status === 400) {
    return (
      validationMessage(body?.errors) ??
      (typeof body?.message === 'string' && body.message.trim() !== ''
        ? body.message
        : 'Data yang dikirim belum lengkap atau tidak valid.')
    );
  }

  if (status === 401) {
    if (url.endsWith('/auth/login')) {
      return 'Email atau password tidak cocok.';
    }

    return 'Sesi kamu sudah berakhir. Silakan masuk kembali.';
  }

  if (status === 403) {
    return 'Kamu tidak memiliki akses untuk melakukan tindakan ini.';
  }

  if (status === 404) {
    return 'Data yang kamu cari tidak ditemukan.';
  }

  if (status === 409) {
    return typeof body?.message === 'string' && body.message.trim() !== ''
      ? body.message
      : 'Data ini sudah ada.';
  }

  if (status === 429) {
    return 'Terlalu banyak percobaan. Coba lagi sebentar.';
  }

  if (status >= 500) {
    return 'Terjadi masalah pada server. Coba lagi beberapa saat.';
  }

  if (error.code === 'TIMEOUT') {
    return 'Permintaan memakan waktu terlalu lama. Coba lagi.';
  }

  if (error.code === 'NETWORK') {
    return 'Tidak dapat terhubung ke server. Periksa koneksimu lalu coba lagi.';
  }

  return 'Terjadi kesalahan. Coba lagi.';
}
