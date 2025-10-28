import { apiClient } from "@/lib/api";

export interface Product {
  id: number;
  uiCode: string;      // Backend sends as 'sku' in serializer
  sku?: string;        // Legacy field
  supplierCode?: string;
  title: string;
  genericName?: string;
  img?: string;        // Backend sends as 'image' in serializer
  
  // Relations - Always objects with id and title from backend JOIN
  category: {
    id: number;
    title: string;
  } | null;
  brand: {
    id: number;
    title: string;
  } | null;
  company: {
    id: number;
    title: string;
  } | null;
  
  dept?: number;
  status: number;
  weighted: number;
  expiry?: number;
  trackInventory: number;
  discount: number;
  points: number;
  isReturnable: number;
  added: string;
  updated?: string;
  
  // Additional backend fields
  spec?: string;
  warranty?: string;
  tags?: string;
  
  // Translations
  titleTamil?: string;
  titleSinhala?: string;
  
  // Legacy fields for compatibility
  description?: string;
  price?: number;
  unit?: string;
  barcode?: string;
  branches?: Array<{
    id: number;
    branch: {
      id: number;
      title: string;
    };
    stock: number;
    minStock: number;
    maxStock: number;
  }>;
}

export interface ProductFormData {
  name: string;
  sku: string;
  supplierCode: string;  // Supplier's product code
  description: string;   // Maps to genericName
  category: string;
  brand: string;
  company: string;       // Supplier/Manufacturer
  dept: string;          // Department ID
  status: string;        // Active (1) or Inactive (0)
  weighted: string;      // Sold by weight (1=Yes, 0=No)
  expiry: string;        // Days until expiry alert
  trackInventory: string; // Track stock levels (1=Yes, 0=No)
  discount: string;      // Allow discounts (1=Yes, 0=No)
  points: string;        // Earn loyalty points (1=Yes, 0=No)
  isReturnable: string;  // Can be returned (1=Yes, 0=No)
  spec: string;          // Product specifications
  warranty: string;      // Warranty information
  tags: string;          // Product tags (comma-separated)
  image: File | null;
  // Legacy fields kept for compatibility
  price: string;
  unit: string;
  stock: string;
  minStock: string;
  maxStock: string;
  barcode: string;
}

export interface CreateProductPayload {
  uiCode: string;
  title: string;
  supplierCode?: string;
  genericName?: string;
  category: number;
  brand?: number;
  company?: number;      // Supplier/Manufacturer ID
  dept?: number;         // Department ID
  image?: string;
  status: number;
  weighted: number;
  expiry?: number;       // Days until expiry alert
  trackInventory: number;
  discount: number;
  points: number;
  isReturnable: number;
  // Additional optional fields from backend validator
  description?: string;
  spec?: string;         // Product specifications
  warranty?: string;     // Warranty information
  tags?: string;         // Product tags
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: any;
  };
}

export interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

/**
 * Converts a File object to base64 string
 */
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Fetches all products from the API
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<{ data: { products: Product[]; pagination: any } }>("/products");
    console.log("Products API Response:", response);
    console.log("Products data:", response.data?.products);
    
    // Backend returns: { data: { products: [...], pagination: {...} } }
    const productsData = response.data?.products || [];
    return Array.isArray(productsData) ? productsData : [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to load products");
  }
};

/**
 * Creates a new product
 */
export const createProduct = async (
  formData: ProductFormData
): Promise<ProductResponse> => {
  try {
    // Validate required fields
    if (!formData.sku || !formData.name) {
      throw new Error("SKU and Product Name are required");
    }

    // Validate category (must be a positive number)
    const categoryNum = Number(formData.category);
    if (!categoryNum || categoryNum <= 0) {
      throw new Error("Please select a valid category");
    }

    let imageBase64: string | undefined;

    // Convert image to base64 if provided
    if (formData.image) {
      try {
        imageBase64 = await convertImageToBase64(formData.image);
        console.log("Image converted to base64, size:", imageBase64.length);
      } catch (error) {
        console.error("Image conversion error:", error);
        throw new Error("Failed to process image");
      }
    }

    // Prepare payload matching backend schema
    const payload: CreateProductPayload = {
      uiCode: formData.sku,
      title: formData.name,
      supplierCode: formData.supplierCode?.trim() || undefined,
      genericName: formData.description?.trim() || undefined,
      category: categoryNum,
      brand: formData.brand ? Number(formData.brand) : undefined,
      company: formData.company ? Number(formData.company) : undefined,
      dept: formData.dept ? Number(formData.dept) : undefined,
      image: imageBase64,
      status: formData.status ? Number(formData.status) : 1,
      weighted: formData.weighted ? Number(formData.weighted) : 0,
      expiry: formData.expiry ? Number(formData.expiry) : undefined,
      trackInventory: formData.trackInventory ? Number(formData.trackInventory) : 1,
      discount: formData.discount ? Number(formData.discount) : 1,
      points: formData.points ? Number(formData.points) : 1,
      isReturnable: formData.isReturnable ? Number(formData.isReturnable) : 1,
      // Additional optional fields
      spec: formData.spec?.trim() || undefined,
      warranty: formData.warranty?.trim() || undefined,
      tags: formData.tags?.trim() || undefined,
    };

    console.log("Creating product with payload:", {
      ...payload,
      image: imageBase64 ? `(base64 image - ${imageBase64.length} chars)` : undefined,
    });
    console.log("Supplier Code:", payload.supplierCode);
    console.log("Generic Name:", payload.genericName);

    const response = await apiClient.post<ProductResponse>(
      "/admin/products",
      payload
    );

    console.log("Create response:", response);
    return response;
  } catch (error: any) {
    console.error("Product creation error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);

    const errorMessage =
      error.response?.data?.message || error.message || "Failed to create product";
    const errorDetails =
      error.response?.data?.errors || error.response?.data?.details;

    if (errorDetails) {
      throw new Error(`${errorMessage}: ${JSON.stringify(errorDetails)}`);
    }

    throw new Error(errorMessage);
  }
};

/**
 * Updates an existing product
 */
export const updateProduct = async (
  productId: number,
  formData: ProductFormData
): Promise<ProductResponse> => {
  try {
    // Validate required fields
    if (!formData.sku || !formData.name) {
      throw new Error("SKU and Product Name are required");
    }

    // Validate category (must be a positive number)
    const categoryNum = Number(formData.category);
    if (!categoryNum || categoryNum <= 0) {
      throw new Error("Please select a valid category");
    }

    let imageBase64: string | undefined;

    // Convert image to base64 if provided
    if (formData.image) {
      try {
        imageBase64 = await convertImageToBase64(formData.image);
        console.log("Image converted to base64, size:", imageBase64.length);
      } catch (error) {
        console.error("Image conversion error:", error);
        throw new Error("Failed to process image");
      }
    }

    // Prepare payload matching backend schema
    const payload: CreateProductPayload = {
      uiCode: formData.sku,
      title: formData.name,
      supplierCode: formData.supplierCode?.trim() || undefined,
      genericName: formData.description?.trim() || undefined,
      category: categoryNum,
      brand: formData.brand ? Number(formData.brand) : undefined,
      company: formData.company ? Number(formData.company) : undefined,
      dept: formData.dept ? Number(formData.dept) : undefined,
      image: imageBase64,
      status: formData.status ? Number(formData.status) : 1,
      weighted: formData.weighted ? Number(formData.weighted) : 0,
      expiry: formData.expiry ? Number(formData.expiry) : undefined,
      trackInventory: formData.trackInventory ? Number(formData.trackInventory) : 1,
      discount: formData.discount ? Number(formData.discount) : 1,
      points: formData.points ? Number(formData.points) : 1,
      isReturnable: formData.isReturnable ? Number(formData.isReturnable) : 1,
      // Additional optional fields
      spec: formData.spec?.trim() || undefined,
      warranty: formData.warranty?.trim() || undefined,
      tags: formData.tags?.trim() || undefined,
    };

    console.log("Updating product with payload:", {
      ...payload,
      image: imageBase64 ? `(base64 image - ${imageBase64.length} chars)` : undefined,
    });
    console.log("Supplier Code:", payload.supplierCode);
    console.log("Generic Name:", payload.genericName);

    const response = await apiClient.put<ProductResponse>(
      `/admin/products/${productId}`,
      payload
    );

    console.log("Update response:", response);
    return response;
  } catch (error: any) {
    console.error("Product update error:", error);
    console.error("Error response:", error.response?.data);

    const errorMessage =
      error.response?.data?.message || error.message || "Failed to update product";
    const errorDetails =
      error.response?.data?.errors || error.response?.data?.details;

    if (errorDetails) {
      throw new Error(`${errorMessage}: ${JSON.stringify(errorDetails)}`);
    }

    throw new Error(errorMessage);
  }
};

/**
 * Deletes a product by ID
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    console.log("Deleting product:", productId);
    await apiClient.delete(`/admin/products/${productId}`);
    console.log("Product deleted successfully");
  } catch (error: any) {
    console.error("Delete error:", error);
    
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to delete product";
    
    throw new Error(errorMessage);
  }
};
