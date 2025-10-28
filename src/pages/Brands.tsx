import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Tag, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Brand,
  BrandFormData,
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/services/brandService";

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    title: "",
    icon: null,
  });

  // Load brands from API
  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBrands();
      console.log("Loaded brands data:", data);
      console.log("Brands array:", data.brands);
      setBrands(data.brands || []);
    } catch (err) {
      console.error("Failed to load brands", err);
      toast({
        title: "Error",
        description: "Failed to load brands",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      title: brand.title,
      icon: brand.icon || null,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: "", icon: null });
    setEditingBrand(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, formData);
        toast({
          title: "Success",
          description: "Brand updated successfully",
        });
      } else {
        await createBrand(formData);
        toast({
          title: "Success",
          description: "Brand created successfully",
        });
      }

      await loadBrands();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to save brand",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!confirm(`Delete brand "${brand.title}"?`)) return;

    setIsLoading(true);
    try {
      await deleteBrand(brand.id);
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      });
      await loadBrands();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete brand",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Brands
          </h1>
          <p className="text-muted-foreground mt-1">Manage product brands</p>
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
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="px-6 pt-6 flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </DialogTitle>
              <DialogDescription>
                {editingBrand
                  ? "Update the brand details below."
                  : "Add a new brand to your product catalog."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
              <form
                id="brand-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Brand Name *</Label>
                  <Input
                    id="title"
                    placeholder="Anchor"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (optional)</Label>
                  <Input
                    id="icon"
                    placeholder="icon-name or url"
                    value={formData.icon || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value || null })
                    }
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter an icon identifier or URL (max 64 characters)
                  </p>
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
                form="brand-form"
                className="bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                {editingBrand ? (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Brand
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Brand
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
                placeholder="Search brands..."
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
                <TableHead className="font-semibold">Brand Name</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No brands found
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand) => (
                  <TableRow
                    key={brand.id}
                    className="border-b border-border hover:bg-muted/30 transition-smooth"
                  >
                    <TableCell className="font-medium">{brand.title}</TableCell>
                    <TableCell>{brand.product_count ?? "-"}</TableCell>
                    <TableCell>
                      <Badge className="bg-success text-success-foreground">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
                          title="Edit brand"
                          onClick={() => handleEdit(brand)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                          title="Delete brand"
                          onClick={() => handleDelete(brand)}
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
