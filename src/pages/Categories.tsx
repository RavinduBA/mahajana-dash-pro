import { useState } from "react";
import { Plus, Search, Edit, Trash2, FolderTree } from "lucide-react";
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
const mockCategories = [
  {
    id: 1,
    name: "Dairy Products",
    slug: "dairy",
    parentId: null,
    productCount: 45,
    status: "active",
  },
  {
    id: 2,
    name: "Milk",
    slug: "milk",
    parentId: 1,
    productCount: 12,
    status: "active",
  },
  {
    id: 3,
    name: "Bakery",
    slug: "bakery",
    parentId: null,
    productCount: 32,
    status: "active",
  },
  {
    id: 4,
    name: "Fresh Produce",
    slug: "produce",
    parentId: null,
    productCount: 67,
    status: "active",
  },
  {
    id: 5,
    name: "Frozen Foods",
    slug: "frozen",
    parentId: null,
    productCount: 23,
    status: "inactive",
  },
];

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof mockCategories[0] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    description: "",
    displayOrder: "",
    metaTitle: "",
    metaDescription: "",
  });

  const handleEdit = (category: typeof mockCategories[0]) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId?.toString() || "",
      description: "",
      displayOrder: "",
      metaTitle: "",
      metaDescription: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      console.log("Updating category:", editingCategory.id, formData);
      // API call: PUT /admin/categories/:id
    } else {
      console.log("Creating category:", formData);
      // API call: POST /admin/categories
    }
    setIsAddDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      parentId: "",
      description: "",
      displayOrder: "",
      metaTitle: "",
      metaDescription: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage product categories hierarchy
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingCategory(null);
            setFormData({
              name: "",
              slug: "",
              parentId: "",
              description: "",
              displayOrder: "",
              metaTitle: "",
              metaDescription: "",
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="px-6 pt-6 flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update the category information below."
                  : "Create a new category for organizing products. You can set a parent category for subcategories."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
              <form
                id="category-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      placeholder="Dairy Products"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="dairy-products"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentId">Parent Category</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, parentId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      <SelectItem value="1">Dairy Products</SelectItem>
                      <SelectItem value="3">Bakery</SelectItem>
                      <SelectItem value="4">Fresh Produce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Category description..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    placeholder="0"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm">SEO Settings</h4>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      placeholder="Category meta title"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, metaTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="Category meta description"
                      rows={2}
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metaDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </form>
            </div>
            <DialogFooter className="px-6 pb-6 pt-4 border-t border-border flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="hover:bg-accent transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="category-form"
                className="bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Category
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
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-input transition-smooth focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Slug</TableHead>
                <TableHead className="font-semibold">Parent Category</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCategories.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-b border-border hover:bg-muted/30 transition-all duration-200"
                >
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell>
                    {category.parentId ? (
                      <span className="text-sm">
                        {
                          mockCategories.find((c) => c.id === category.parentId)
                            ?.name
                        }
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Top Level
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell>
                    {category.status === "active" ? (
                      <Badge className="bg-success text-success-foreground">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                        title="Edit category"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                        title="Delete category"
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
