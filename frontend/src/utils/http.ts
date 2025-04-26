interface HttpOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = '', timeout: number = 30000) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.timeout = timeout;
  }

  private async request<T>(
    url: string,
    method: string,
    body?: any,
    options?: HttpOptions
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout || this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  async get<T>(url: string, options?: HttpOptions): Promise<T> {
    return this.request<T>(url, 'GET', undefined, options);
  }

  async post<T>(url: string, data?: any, options?: HttpOptions): Promise<T> {
    return this.request<T>(url, 'POST', data, options);
  }

  async put<T>(url: string, data?: any, options?: HttpOptions): Promise<T> {
    return this.request<T>(url, 'PUT', data, options);
  }

  async delete<T>(url: string, options?: HttpOptions): Promise<T> {
    return this.request<T>(url, 'DELETE', undefined, options);
  }
}

export const http = new HttpClient();
