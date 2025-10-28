import { apiClient } from "@/lib/api";

// Type definitions matching backend response
export interface Category {
  id: number;
  title: string;
  title_tamil?: string | null;
  icon?: string | null;
  color?: string | null;
  parent?: number | null;
  level: number; // 1, 2, or 3
  order_by?: number | null;
  margin?: number | null;
  updated?: string;
  product_count?: number; // Included when backend adds count
  children?: Category[]; // For tree structure
}

export interface CategoryFormData {
  title: string;
  titleTamil?: string;
  icon?: string;
  color?: string;
  parent?: number | null;
  level: number;
  orderBy?: number;
  margin?: number;
}

export interface ListCategoriesResponse {
  categories: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryTreeResponse {
  categories: Category[];
}

/**
 * Fetch all categories (flat list)
 * GET /v1/categories
 */
export const fetchCategories = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ListCategoriesResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const query = queryParams.toString();
  const endpoint = query ? `/categories?${query}` : "/categories";

  const response = await apiClient.get<any>(endpoint);

  console.log("API Response (categories):", response);

  // Backend wraps response in { data: { categories: [...] } }
  if (response.data) {
    return {
      categories: response.data.categories || response.data || [],
      pagination: response.data.pagination,
    };
  }

  // Fallback
  return { categories: response.categories || [] };
};

/**
 * Fetch category tree (hierarchical structure)
 * GET /v1/categories/tree
 */
export const fetchCategoryTree = async (): Promise<CategoryTreeResponse> => {
  const response = await apiClient.get<any>("/categories/tree");

  console.log("API Response (category tree):", response);

  // Backend wraps response in { data: { categories: [...] } }
  if (response.data) {
    return {
      categories: response.data.categories || response.data || [],
    };
  }

  return { categories: response.categories || [] };
};

/**
 * Get a single category by ID
 * GET /v1/categories/:id
 */
export const getCategory = async (
  id: number
): Promise<{ category: Category }> => {
  const response = await apiClient.get<any>(`/categories/${id}`);

  // Backend wraps response in { data: { category: {...} } }
  return response.data || response;
};

/**
 * Get root categories (level 1 only)
 * GET /v1/categories (filtered)
 */
export const fetchRootCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<any>("/categories");

  console.log("API Response (root categories):", response);

  // Extract categories and filter level 1
  const categories =
    response.data?.categories || response.categories || response.data || [];

  return categories.filter((cat: Category) => cat.level === 1 || !cat.parent);
};

/**
 * Create a new category (Admin only)
 * POST /v1/admin/categories
 */
export const createCategory = async (
  formData: CategoryFormData
): Promise<{ category: Category; message: string }> => {
  if (!formData.title || !formData.title.trim()) {
    throw new Error("Category title is required");
  }

  if (!formData.level || formData.level < 1 || formData.level > 3) {
    throw new Error("Category level must be 1, 2, or 3");
  }

  const payload: any = {
    title: formData.title.trim(),
    level: formData.level,
  };

  if (formData.titleTamil) {
    payload.titleTamil = formData.titleTamil.trim();
  }

  if (formData.icon) {
    payload.icon = formData.icon.trim();
  }

  if (formData.color) {
    payload.color = formData.color.trim();
  }

  if (formData.parent) {
    payload.parent = formData.parent;
  }

  if (formData.orderBy !== undefined) {
    payload.orderBy = formData.orderBy;
  }

  if (formData.margin !== undefined) {
    payload.margin = formData.margin;
  }

  const response = await apiClient.post<any>("/admin/categories", payload);

  console.log("Create category response:", response);

  // Backend wraps response in { data: { category: {...}, message: "..." } }
  return response.data || response;
};

/**
 * Update an existing category (Admin only)
 * PUT /v1/admin/categories/:id
 */
export const updateCategory = async (
  id: number,
  formData: Partial<CategoryFormData>
): Promise<{ category: Category; message: string }> => {
  const payload: any = {};

  if (formData.title) {
    payload.title = formData.title.trim();
  }

  if (formData.titleTamil !== undefined) {
    payload.titleTamil = formData.titleTamil?.trim() || null;
  }

  if (formData.icon !== undefined) {
    payload.icon = formData.icon?.trim() || null;
  }

  if (formData.color !== undefined) {
    payload.color = formData.color?.trim() || null;
  }

  if (formData.parent !== undefined) {
    payload.parent = formData.parent;
  }

  if (formData.level !== undefined) {
    payload.level = formData.level;
  }

  if (formData.orderBy !== undefined) {
    payload.orderBy = formData.orderBy;
  }

  if (formData.margin !== undefined) {
    payload.margin = formData.margin;
  }

  const response = await apiClient.put<any>(
    `/admin/categories/${id}`,
    payload
  );

  console.log("Update category response:", response);

  // Backend wraps response in { data: { category: {...}, message: "..." } }
  return response.data || response;
};

/**
 * Delete a category (Admin only)
 * DELETE /v1/admin/categories/:id
 */
export const deleteCategory = async (
  id: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<any>(`/admin/categories/${id}`);

  // Backend wraps response in { data: { message: "..." } }
  return response.data || response;
};
