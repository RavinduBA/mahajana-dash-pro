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
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: number;
  title: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  unit: string;
  image?: string;
  category?: {
    id: number;
    title: string;
  };
  brand?: {
    id: number;
    title: string;
  };
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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    unit: "",
    stock: "",
    minStock: "",
    maxStock: "",
    barcode: "",
    image: null as File | null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{ data: { products: Product[]; pagination: any } }>("/products");
      console.log("Products fetched:", response);
      setProducts(response.data?.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalStock = (product: Product) => {
    if (!product.branches || product.branches.length === 0) return 0;
    return product.branches.reduce((total, branch) => total + branch.stock, 0);
  };

  const getStockStatus = (product: Product) => {
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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.title,
      sku: product.sku,
      description: product.description || "",
      category: product.category?.id.toString() || "",
      brand: product.brand?.id.toString() || "",
      price: product.price.toString(),
      unit: product.unit,
      stock: getTotalStock(product).toString(),
      minStock: product.branches?.[0]?.minStock.toString() || "",
      maxStock: product.branches?.[0]?.maxStock.toString() || "",
      barcode: product.barcode || "",
      image: null,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await apiClient.delete(`/admin/products/${productId}`);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
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
        // Update existing product
        await apiClient.put(`/admin/products/${editingProduct.id}`, {
          title: formData.name,
          sku: formData.sku,
          description: formData.description,
          categoryId: formData.category ? Number(formData.category) : undefined,
          brandId: formData.brand ? Number(formData.brand) : undefined,
          price: Number(formData.price),
          unit: formData.unit,
          barcode: formData.barcode || undefined,
        });

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Create new product
        await apiClient.post("/admin/products", {
          title: formData.name,
          sku: formData.sku,
          description: formData.description,
          categoryId: formData.category ? Number(formData.category) : undefined,
          brandId: formData.brand ? Number(formData.brand) : undefined,
          price: Number(formData.price),
          unit: formData.unit,
          barcode: formData.barcode || undefined,
        });

        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setIsAddDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
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
      description: "",
      category: "",
      brand: "",
      price: "",
      unit: "",
      stock: "",
      minStock: "",
      maxStock: "",
      barcode: "",
      image: null,
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.brand?.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                description: "",
                category: "",
                brand: "",
                price: "",
                unit: "",
                stock: "",
                minStock: "",
                maxStock: "",
                barcode: "",
                image: null,
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="oils">Oils</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
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
                        <SelectItem value="anchor">Anchor</SelectItem>
                        <SelectItem value="araliya">Araliya</SelectItem>
                        <SelectItem value="harischandra">
                          Harischandra
                        </SelectItem>
                        <SelectItem value="crysbro">Crysbro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (LKR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="250.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) =>
                        setFormData({ ...formData, unit: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="L">Liter (L)</SelectItem>
                        <SelectItem value="ml">Milliliter (ml)</SelectItem>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="100"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock Level</Label>
                    <Input
                      id="minStock"
                      type="number"
                      placeholder="10"
                      value={formData.minStock}
                      onChange={(e) =>
                        setFormData({ ...formData, minStock: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxStock">Max Stock Level</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      placeholder="500"
                      value={formData.maxStock}
                      onChange={(e) =>
                        setFormData({ ...formData, maxStock: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    placeholder="1234567890123"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                  />
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
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Brand</TableHead>
                <TableHead className="font-semibold">Price (LKR)</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
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
                    <TableCell className="font-medium">{product.sku}</TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.category?.title || "-"}</TableCell>
                    <TableCell>{product.brand?.title || "-"}</TableCell>
                    <TableCell>Rs. {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {getTotalStock(product)} {product.unit}
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
