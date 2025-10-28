import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import {
  Product,
  ProductFormData,
  fetchProducts as fetchProductsService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "@/services/productService";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    supplierCode: "",
    description: "",
    category: "",
    brand: "",
    company: "",
    dept: "",
    status: "1",
    weighted: "0",
    expiry: "",
    trackInventory: "1",
    discount: "1",
    points: "1",
    isReturnable: "1",
    spec: "",
    warranty: "",
    tags: "",
    image: null,
    // Legacy fields
    price: "",
    unit: "",
    stock: "",
    minStock: "",
    maxStock: "",
    barcode: "",
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const productsData = await fetchProductsService();
      console.log("✅ Products loaded successfully:", productsData);
      console.log("📦 First product sample:", productsData[0]);
      setProducts(productsData);
    } catch (error: any) {
      console.error("❌ Error loading products:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiClient.get<any>("/categories");
      console.log("Categories loaded:", response);

      // Extract categories from response
      const categoriesData =
        response.data?.categories || response.categories || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast({
        title: "Warning",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const loadBrands = async () => {
    try {
      const response = await apiClient.get<any>("/brands");
      console.log("Brands loaded:", response);

      // Extract brands from response
      const brandsData = response.data?.brands || response.brands || [];
      setBrands(brandsData);
    } catch (error) {
      console.error("Failed to load brands:", error);
      toast({
        title: "Warning",
        description: "Failed to load brands",
        variant: "destructive",
      });
    }
  };

  const getTotalStock = (product: Product) => {
    if (!product.branches || product.branches.length === 0) return 0;
    return product.branches.reduce((total, branch) => total + branch.stock, 0);
  };

  const getStockStatus = (product: Product) => {
    // If no branch data, show as "No Stock Data" instead of "Out of Stock"
    if (!product.branches || product.branches.length === 0) {
      return "no_data";
    }

    const totalStock = getTotalStock(product);
    const minStock = product.branches?.[0]?.minStock || 10;

    if (totalStock === 0) return "out_of_stock";
    if (totalStock <= minStock) return "low_stock";
    return "active";
  };

  const getStatusBadge = (product: Product) => {
    const status = getStockStatus(product);

    switch (status) {
      case "active":
        return (
          <Badge className="bg-success text-success-foreground">In Stock</Badge>
        );
      case "low_stock":
        return (
          <Badge className="bg-warning text-warning-foreground">
            Low Stock
          </Badge>
        );
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      case "no_data":
        return <Badge variant="secondary">No Stock Data</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.title,
      sku: product.uiCode || product.sku || "",
      supplierCode: product.supplierCode || "",
      description: product.genericName || product.description || "",
      category: product.category?.id?.toString() || "",
      brand: product.brand?.id?.toString() || "",
      company: product.company?.id?.toString() || "",
      dept: product.dept?.toString() || "",
      status: product.status?.toString() || "1",
      weighted: product.weighted?.toString() || "0",
      expiry: product.expiry?.toString() || "",
      trackInventory: product.trackInventory?.toString() || "1",
      discount: product.discount?.toString() || "1",
      points: product.points?.toString() || "1",
      isReturnable: product.isReturnable?.toString() || "1",
      spec: product.spec || "",
      warranty: product.warranty || "",
      tags: product.tags || "",
      image: null,
      // Legacy fields
      price: product.price?.toString() || "",
      unit: product.unit || "",
      stock: getTotalStock(product).toString(),
      minStock: product.branches?.[0]?.minStock.toString() || "",
      maxStock: product.branches?.[0]?.maxStock.toString() || "",
      barcode: product.barcode || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This will also remove the image from Cloudinary."
      )
    ) {
      return;
    }

    try {
      await deleteProductService(productId);

      toast({
        title: "Success",
        description: "Product and associated image deleted successfully",
      });

      await loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingProduct) {
        await updateProductService(editingProduct.id, formData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await createProductService(formData);
        toast({
          title: "Success",
          description: formData.image
            ? "Product created successfully with image"
            : "Product created successfully",
        });
      }

      setIsAddDialogOpen(false);
      setEditingProduct(null);
      resetForm();

      // Refresh product list
      await loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      supplierCode: "",
      description: "",
      category: "",
      brand: "",
      company: "",
      dept: "",
      status: "1",
      weighted: "0",
      expiry: "",
      trackInventory: "1",
      discount: "1",
      points: "1",
      isReturnable: "1",
      spec: "",
      warranty: "",
      tags: "",
      image: null,
      // Legacy fields
      price: "",
      unit: "",
      stock: "",
      minStock: "",
      maxStock: "",
      barcode: "",
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.uiCode || product.sku || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.category?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.brand?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingProduct(null);
              setFormData({
                name: "",
                sku: "",
                supplierCode: "",
                description: "",
                category: "",
                brand: "",
                company: "",
                dept: "",
                status: "1",
                weighted: "0",
                expiry: "",
                trackInventory: "1",
                discount: "1",
                points: "1",
                isReturnable: "1",
                spec: "",
                warranty: "",
                tags: "",
                image: null,
                // Legacy fields
                price: "",
                unit: "",
                stock: "",
                minStock: "",
                maxStock: "",
                barcode: "",
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="px-6 pt-6 flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update the product information below."
                  : "Create a new product in your inventory. Fill in all required fields."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
              <form
                id="product-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="Fresh Milk 1L"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      placeholder="DRY001"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <SelectItem value="0" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : (
                          categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) =>
                        setFormData({ ...formData, brand: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.length === 0 ? (
                          <SelectItem value="0" disabled>
                            Loading brands...
                          </SelectItem>
                        ) : (
                          brands.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Supplier/Manufacturer</Label>
                    <Select
                      value={formData.company}
                      onValueChange={(value) =>
                        setFormData({ ...formData, company: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Supplier A</SelectItem>
                        <SelectItem value="2">Supplier B</SelectItem>
                        <SelectItem value="3">Supplier C</SelectItem>
                        <SelectItem value="4">Manufacturer A</SelectItem>
                        <SelectItem value="5">Manufacturer B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierCode">Supplier Code</Label>
                    <Input
                      id="supplierCode"
                      placeholder="SUP-2024-001"
                      value={formData.supplierCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supplierCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept">Department</Label>
                    <Select
                      value={formData.dept}
                      onValueChange={(value) =>
                        setFormData({ ...formData, dept: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Groceries</SelectItem>
                        <SelectItem value="2">Beverages</SelectItem>
                        <SelectItem value="3">Dairy</SelectItem>
                        <SelectItem value="4">Bakery</SelectItem>
                        <SelectItem value="5">Household</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weighted">Sold by Weight</Label>
                    <Select
                      value={formData.weighted}
                      onValueChange={(value) =>
                        setFormData({ ...formData, weighted: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No (Unit-based)</SelectItem>
                        <SelectItem value="1">Yes (By weight)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Alert (Days)</Label>
                    <Input
                      id="expiry"
                      type="number"
                      placeholder="365"
                      value={formData.expiry}
                      onChange={(e) =>
                        setFormData({ ...formData, expiry: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before expiry to trigger alert
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trackInventory">Track Inventory</Label>
                    <Select
                      value={formData.trackInventory}
                      onValueChange={(value) =>
                        setFormData({ ...formData, trackInventory: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes (Track stock)</SelectItem>
                        <SelectItem value="0">No (Don't track)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Allow Discounts</Label>
                    <Select
                      value={formData.discount}
                      onValueChange={(value) =>
                        setFormData({ ...formData, discount: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes (Allow)</SelectItem>
                        <SelectItem value="0">No (Fixed price)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points">Loyalty Points</Label>
                    <Select
                      value={formData.points}
                      onValueChange={(value) =>
                        setFormData({ ...formData, points: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes (Earn points)</SelectItem>
                        <SelectItem value="0">No (No points)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isReturnable">Returnable</Label>
                    <Select
                      value={formData.isReturnable}
                      onValueChange={(value) =>
                        setFormData({ ...formData, isReturnable: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes (Can return)</SelectItem>
                        <SelectItem value="0">No (Final sale)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spec">Product Specifications</Label>
                  <Textarea
                    id="spec"
                    placeholder="Size, dimensions, ingredients, nutritional info, etc."
                    rows={3}
                    value={formData.spec}
                    onChange={(e) =>
                      setFormData({ ...formData, spec: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Technical specifications, ingredients, or detailed product
                    information (max 2048 chars)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Warranty Information</Label>
                    <Input
                      id="warranty"
                      placeholder="1 year warranty, 30 days return policy"
                      value={formData.warranty}
                      onChange={(e) =>
                        setFormData({ ...formData, warranty: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Product Tags</Label>
                    <Input
                      id="tags"
                      placeholder="organic, gluten-free, vegan"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated tags for search and filtering
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.files?.[0] || null,
                        })
                      }
                      className="cursor-pointer"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload product image (JPG, PNG, WebP). Max 10MB.
                  </p>
                </div>

                {/* Note about branch-specific fields */}
                <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20 p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Price, stock quantity, and other
                    inventory fields are managed per branch. After creating the
                    product, you can set branch-specific pricing and inventory
                    in the Branch Management section.
                  </p>
                </div>
              </form>
            </div>
            <DialogFooter className="px-6 pb-6 pt-4 border-t border-border flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="hover:bg-accent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="product-form"
                className="bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Saving..."
                ) : editingProduct ? (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Product
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-input transition-smooth focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              variant="outline"
              className="border-border hover:bg-accent transition-smooth"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-muted/50">
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="font-semibold">Product Name</TableHead>
                <TableHead className="font-semibold">Supplier Code</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Brand</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Flags</TableHead>
                <TableHead className="font-semibold">Stock Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="space-y-2">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "No products found matching your search"
                          : "No products available"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-border hover:bg-muted/30 transition-smooth"
                  >
                    <TableCell className="font-medium">
                      {product.uiCode || product.sku || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.img && (
                          <img
                            src={product.img}
                            alt={product.title}
                            className="w-8 h-8 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        <div>
                          <div>{product.title}</div>
                          {product.genericName && (
                            <div className="text-xs text-muted-foreground">
                              {product.genericName}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.supplierCode || "-"}</TableCell>
                    <TableCell>{product.category?.title || "-"}</TableCell>
                    <TableCell>{product.brand?.title || "-"}</TableCell>
                    <TableCell>{product.company?.title || "-"}</TableCell>
                    <TableCell>
                      {product.status === 1 ? (
                        <Badge className="bg-green-500 text-white">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.weighted === 1 && (
                          <Badge variant="outline" className="text-xs">
                            Weight
                          </Badge>
                        )}
                        {product.discount === 0 && (
                          <Badge variant="outline" className="text-xs">
                            No Discount
                          </Badge>
                        )}
                        {product.points === 0 && (
                          <Badge variant="outline" className="text-xs">
                            No Points
                          </Badge>
                        )}
                        {product.isReturnable === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Final Sale
                          </Badge>
                        )}
                        {product.trackInventory === 0 && (
                          <Badge variant="outline" className="text-xs">
                            No Tracking
                          </Badge>
                        )}
                        {product.expiry && (
                          <Badge variant="outline" className="text-xs">
                            Exp: {product.expiry}d
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                          title="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
