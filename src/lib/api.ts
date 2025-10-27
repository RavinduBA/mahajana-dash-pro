import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mhjapi.up.railway.app/v1';

// API Client using Axios
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Load token from localStorage
    this.loadToken();

    // Setup request interceptor to add token to all requests
    this.setupInterceptors();
  }

  private loadToken() {
    this.token = localStorage.getItem('admin_token');
    if (this.token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add token to request if available
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        // Handle common errors
        if (error.response) {
          // Server responded with error status
          const errorMessage = (error.response.data as any)?.message || 
                              error.message || 
                              'An error occurred';
          
          // Handle 401 Unauthorized - token expired or invalid
          if (error.response.status === 401) {
            this.clearToken();
            // Optionally redirect to login
            // window.location.href = '/login';
          }

          throw new Error(errorMessage);
        } else if (error.request) {
          // Request made but no response received
          throw new Error('Network error: No response from server');
        } else {
          // Something else happened
          throw new Error(error.message || 'Request failed');
        }
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, config);
    return response.data;
  }

  // Upload file with multipart/form-data
  async uploadFile<T>(endpoint: string, formData: FormData, onUploadProgress?: (progressEvent: any) => void): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  }

  // Get the axios instance for advanced use cases
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
