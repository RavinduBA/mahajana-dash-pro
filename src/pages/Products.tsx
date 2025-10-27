import { useState } from "react";
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

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Fresh Milk 1L",
    sku: "DRY001",
    category: "Dairy",
    brand: "Anchor",
    price: 250,
    stock: 120,
    unit: "L",
    status: "active",
  },
  {
    id: 2,
    name: "Bread Loaf",
    sku: "BKY001",
    category: "Bakery",
    brand: "Harischandra",
    price: 80,
    stock: 45,
    unit: "pcs",
    status: "active",
  },
  {
    id: 3,
    name: "Rice 5kg",
    sku: "GRN001",
    category: "Grains",
    brand: "Araliya",
    price: 1200,
    stock: 200,
    unit: "kg",
    status: "active",
  },
  {
    id: 4,
    name: "Chicken 1kg",
    sku: "MET001",
    category: "Meat",
    brand: "Crysbro",
    price: 650,
    stock: 8,
    unit: "kg",
    status: "low_stock",
  },
  {
    id: 5,
    name: "Cooking Oil 2L",
    sku: "OIL001",
    category: "Oils",
    brand: "Fortune",
    price: 890,
    stock: 0,
    unit: "L",
    status: "out_of_stock",
  },
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof mockProducts[0] | null>(null);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success text-success-foreground">Active</Badge>
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

  const handleEdit = (product: typeof mockProducts[0]) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: "",
      category: product.category.toLowerCase(),
      brand: product.brand.toLowerCase(),
      price: product.price.toString(),
      unit: product.unit,
      stock: product.stock.toString(),
      minStock: "",
      maxStock: "",
      barcode: "",
      image: null,
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      console.log("Updating product:", editingProduct.id, formData);
      // API call: PUT /admin/products/:id
    } else {
      console.log("Creating product:", formData);
      // API call: POST /admin/products
    }
    setIsAddDialogOpen(false);
    setEditingProduct(null);
    // Reset form
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
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
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
        }}>
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
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Product
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
              {mockProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-b border-border hover:bg-muted/30 transition-smooth"
                >
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {product.stock} {product.unit}
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
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
                        onClick={() => console.log("Delete product:", product.id)}
                        className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
