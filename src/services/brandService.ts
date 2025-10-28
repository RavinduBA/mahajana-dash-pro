import { apiClient } from "@/lib/api";

// Type definitions matching backend response
export interface Brand {
  id: number;
  title: string;
  icon?: string | null;
  product_count?: number;
  created?: string;
  updated?: string;
}

export interface BrandFormData {
  title: string;
  icon?: string | null;
}

export interface ListBrandsResponse {
  brands: Brand[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch all brands with optional pagination and search
 */
export const fetchBrands = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ListBrandsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);

  const query = queryParams.toString();
  const endpoint = query ? `/brands?${query}` : "/brands";

  const response = await apiClient.get<any>(endpoint);
  
  // Backend wraps response in { data: { brands: [...], pagination: {...} } }
  console.log("API Response:", response);
  
  if (response.data) {
    return {
      brands: response.data.brands || [],
      pagination: response.data.pagination,
    };
  }
  
  // Fallback for different response structures
  return { brands: response.brands || [] };
};

/**
 * Get a single brand by ID
 */
export const getBrand = async (id: number): Promise<{ brand: Brand }> => {
  const response = await apiClient.get<any>(`/brands/${id}`);
  
  // Backend wraps response in { data: { brand: {...} } }
  return response.data || response;
};

/**
 * Create a new brand (Admin only)
 */
export const createBrand = async (
  formData: BrandFormData
): Promise<{ brand: Brand; message: string }> => {
  if (!formData.title || !formData.title.trim()) {
    throw new Error("Brand name is required");
  }

  const payload: any = {
    title: formData.title.trim(),
  };

  if (formData.icon) {
    payload.icon = formData.icon;
  }

  const response = await apiClient.post<any>("/admin/brands", payload);
  
  // Backend wraps response in { data: { brand: {...}, message: "..." } }
  console.log("Create brand response:", response);
  
  return response.data || response;
};

/**
 * Update an existing brand (Admin only)
 */
export const updateBrand = async (
  id: number,
  formData: Partial<BrandFormData>
): Promise<{ brand: Brand; message: string }> => {
  const payload: any = {};

  if (formData.title) {
    payload.title = formData.title.trim();
  }

  if (formData.icon !== undefined) {
    payload.icon = formData.icon;
  }

  const response = await apiClient.put<any>(`/admin/brands/${id}`, payload);
  
  // Backend wraps response in { data: { brand: {...}, message: "..." } }
  console.log("Update brand response:", response);
  
  return response.data || response;
};

/**
 * Delete a brand (Admin only)
 */
export const deleteBrand = async (
  id: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<any>(`/admin/brands/${id}`);
  
  // Backend wraps response in { data: { message: "..." } }
  return response.data || response;
};
