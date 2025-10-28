import { useState, useEffect } from "react";
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
import { toast } from "@/hooks/use-toast";
import {
  Category,
  CategoryFormData,
  fetchCategories,
  fetchRootCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    title: "",
    titleTamil: "",
    icon: "",
    color: "",
    parent: null,
    level: 1,
    orderBy: 0,
    margin: 0,
  });

  // Load categories from API
  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategories();
      console.log("Loaded categories:", data);
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load parent categories for dropdown
  const loadParentCategories = async () => {
    try {
      const roots = await fetchRootCategories();
      setParentCategories(roots);
    } catch (err) {
      console.error("Failed to load parent categories", err);
    }
  };

  useEffect(() => {
    loadCategories();
    loadParentCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      titleTamil: category.title_tamil || "",
      icon: category.icon || "",
      color: category.color || "",
      parent: category.parent || null,
      level: category.level,
      orderBy: category.order_by || 0,
      margin: category.margin || 0,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleTamil: "",
      icon: "",
      color: "",
      parent: null,
      level: 1,
      orderBy: 0,
      margin: 0,
    });
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await createCategory(formData);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      await loadCategories();
      await loadParentCategories();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete category "${category.title}"?`)) return;

    setIsLoading(true);
    try {
      await deleteCategory(category.id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      await loadCategories();
      await loadParentCategories();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getParentCategoryName = (parentId: number | null) => {
    if (!parentId) return "Top Level";
    const parent = categories.find((c) => c.id === parentId);
    return parent?.title || "Unknown";
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
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
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
                    <Label htmlFor="title">Category Name *</Label>
                    <Input
                      id="title"
                      placeholder="Dairy Products"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleTamil">Tamil Name</Label>
                    <Input
                      id="titleTamil"
                      placeholder="பால் பொருட்கள்"
                      value={formData.titleTamil}
                      onChange={(e) =>
                        setFormData({ ...formData, titleTamil: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    <Select
                      value={formData.level.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, level: Number(value) })
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1 (Top)</SelectItem>
                        <SelectItem value="2">Level 2 (Sub)</SelectItem>
                        <SelectItem value="3">Level 3 (Sub-sub)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                      id="icon"
                      placeholder="icon-name"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      disabled={isLoading}
                      maxLength={24}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      placeholder="#FF5733"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      disabled={isLoading}
                      maxLength={24}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Category</Label>
                  <Select
                    value={formData.parent?.toString() || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        parent: value === "none" ? null : Number(value),
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderBy">Display Order</Label>
                    <Input
                      id="orderBy"
                      type="number"
                      placeholder="0"
                      value={formData.orderBy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orderBy: Number(e.target.value),
                        })
                      }
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower numbers appear first
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="margin">Profit Margin (%)</Label>
                    <Input
                      id="margin"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.margin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          margin: Number(e.target.value),
                        })
                      }
                      disabled={isLoading}
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
                {editingCategory ? (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Category
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
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
                <TableHead className="font-semibold">Level</TableHead>
                <TableHead className="font-semibold">Parent Category</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
                <TableHead className="font-semibold">Margin</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="border-b border-border hover:bg-muted/30 transition-all duration-200"
                  >
                    <TableCell className="font-medium">
                      {category.title}
                      {category.title_tamil && (
                        <span className="text-xs text-muted-foreground block">
                          {category.title_tamil}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Level {category.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {getParentCategoryName(category.parent || null)}
                      </span>
                    </TableCell>
                    <TableCell>{category.product_count ?? "-"}</TableCell>
                    <TableCell>
                      {category.margin ? `${category.margin}%` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                          title="Edit category"
                          onClick={() => handleEdit(category)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                          title="Delete category"
                          onClick={() => handleDelete(category)}
                          disabled={isLoading}
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
