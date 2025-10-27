import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Upload,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
const mockBrands = [
  {
    id: 1,
    name: "Anchor",
    slug: "anchor",
    country: "New Zealand",
    productCount: 45,
    status: "active",
  },
  {
    id: 2,
    name: "Araliya",
    slug: "araliya",
    country: "Sri Lanka",
    productCount: 32,
    status: "active",
  },
  {
    id: 3,
    name: "Harischandra",
    slug: "harischandra",
    country: "Sri Lanka",
    productCount: 28,
    status: "active",
  },
  {
    id: 4,
    name: "Crysbro",
    slug: "crysbro",
    country: "Sri Lanka",
    productCount: 15,
    status: "active",
  },
  {
    id: 5,
    name: "Fortune",
    slug: "fortune",
    country: "India",
    productCount: 12,
    status: "inactive",
  },
];

export default function Brands() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    country: "",
    website: "",
    logo: null as File | null,
    contactEmail: "",
    contactPhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call will be implemented here: POST /admin/brands
    console.log("Brand form data:", formData);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      slug: "",
      description: "",
      country: "",
      website: "",
      logo: null,
      contactEmail: "",
      contactPhone: "",
    });
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                Add New Brand
              </DialogTitle>
              <DialogDescription>
                Add a new brand to your product catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
              <form
                id="brand-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name *</Label>
                    <Input
                      id="name"
                      placeholder="Anchor"
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
                      placeholder="anchor"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brand description..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country of Origin</Label>
                    <Input
                      id="country"
                      placeholder="Sri Lanka"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://brand.com"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Brand Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          logo: e.target.files?.[0] || null,
                        })
                      }
                      className="cursor-pointer"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square logo, PNG format
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-sm">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contact@brand.com"
                        value={formData.contactEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+94 11 234 5678"
                        value={formData.contactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
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
                form="brand-form"
                className="bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Brand
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
                <TableHead className="font-semibold">Slug</TableHead>
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBrands.map((brand) => (
                <TableRow
                  key={brand.id}
                  className="border-b border-border hover:bg-muted/30 transition-smooth"
                >
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {brand.slug}
                  </TableCell>
                  <TableCell>{brand.country}</TableCell>
                  <TableCell>{brand.productCount}</TableCell>
                  <TableCell>
                    {brand.status === "active" ? (
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
                        title="Edit brand"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
                        title="Delete brand"
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
