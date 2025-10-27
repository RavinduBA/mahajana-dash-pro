import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Megaphone,
  Percent,
  Gift,
  Ticket,
  Calendar,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
const mockPromotions = [
  {
    id: 1,
    title: "Weekend Sale",
    type: "discount",
    discountPercent: 20,
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "active",
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free",
    type: "bogo",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    status: "active",
  },
  {
    id: 3,
    title: "New Year Offer",
    type: "discount",
    discountPercent: 15,
    startDate: "2024-12-25",
    endDate: "2025-01-05",
    status: "expired",
  },
];

const mockVouchers = [
  {
    id: 1,
    code: "SAVE100",
    discount: 100,
    minPurchase: 1000,
    maxUses: 100,
    usedCount: 45,
    status: "active",
  },
  {
    id: 2,
    code: "WELCOME50",
    discount: 50,
    minPurchase: 500,
    maxUses: 200,
    usedCount: 180,
    status: "active",
  },
];

export default function Promotions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [offerType, setOfferType] = useState<"general" | "bogo">("general");

  const [offerFormData, setOfferFormData] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    applicableProducts: "",
    applicableCategories: "",
    // BOGO specific fields
    buyProductId: "",
    buyQuantity: "",
    getProductId: "",
    getQuantity: "",
  });

  const [voucherFormData, setVoucherFormData] = useState({
    code: "",
    discountType: "fixed",
    discountValue: "",
    minPurchase: "",
    maxUses: "",
    expiryDate: "",
    description: "",
  });

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call: POST /admin/offers or POST /admin/offers/bogo
    console.log("Offer form data:", offerFormData, "Type:", offerType);
    setIsOfferDialogOpen(false);
  };

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call: POST /admin/vouchers
    console.log("Voucher form data:", voucherFormData);
    setIsVoucherDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Promotions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage offers and vouchers
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isVoucherDialogOpen}
            onOpenChange={setIsVoucherDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Ticket className="mr-2 h-4 w-4" />
                Add Voucher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Create New Voucher
                </DialogTitle>
                <DialogDescription>
                  Generate a discount voucher code for customers.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleVoucherSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Voucher Code *</Label>
                  <Input
                    id="code"
                    placeholder="SAVE100"
                    value={voucherFormData.code}
                    onChange={(e) =>
                      setVoucherFormData({
                        ...voucherFormData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="voucherDiscountType">Discount Type *</Label>
                    <Select
                      value={voucherFormData.discountType}
                      onValueChange={(value) =>
                        setVoucherFormData({
                          ...voucherFormData,
                          discountType: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">
                          Fixed Amount (LKR)
                        </SelectItem>
                        <SelectItem value="percentage">
                          Percentage (%)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voucherDiscountValue">
                      Discount Value *
                    </Label>
                    <Input
                      id="voucherDiscountValue"
                      type="number"
                      placeholder="100"
                      value={voucherFormData.discountValue}
                      onChange={(e) =>
                        setVoucherFormData({
                          ...voucherFormData,
                          discountValue: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="voucherMinPurchase">
                      Min Purchase (LKR)
                    </Label>
                    <Input
                      id="voucherMinPurchase"
                      type="number"
                      placeholder="1000"
                      value={voucherFormData.minPurchase}
                      onChange={(e) =>
                        setVoucherFormData({
                          ...voucherFormData,
                          minPurchase: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUses">Max Uses</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      placeholder="100"
                      value={voucherFormData.maxUses}
                      onChange={(e) =>
                        setVoucherFormData({
                          ...voucherFormData,
                          maxUses: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voucherExpiryDate">Expiry Date</Label>
                  <Input
                    id="voucherExpiryDate"
                    type="date"
                    value={voucherFormData.expiryDate}
                    onChange={(e) =>
                      setVoucherFormData({
                        ...voucherFormData,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voucherDescription">Description</Label>
                  <Textarea
                    id="voucherDescription"
                    placeholder="Voucher terms and conditions..."
                    rows={2}
                    value={voucherFormData.description}
                    onChange={(e) =>
                      setVoucherFormData({
                        ...voucherFormData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsVoucherDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary">
                    Create Voucher
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Create New Offer
                </DialogTitle>
                <DialogDescription>
                  Create promotional offers - general discounts or BOGO deals.
                </DialogDescription>
              </DialogHeader>

              <Tabs
                value={offerType}
                onValueChange={(v) => setOfferType(v as "general" | "bogo")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2"
                  >
                    <Percent className="h-4 w-4" />
                    General Offer
                  </TabsTrigger>
                  <TabsTrigger value="bogo" className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    BOGO Offer
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleOfferSubmit}>
                  <TabsContent value="general" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Offer Title *</Label>
                      <Input
                        id="title"
                        placeholder="Weekend Sale"
                        value={offerFormData.title}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Offer details..."
                        rows={2}
                        value={offerFormData.description}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discountType">Discount Type *</Label>
                        <Select
                          value={offerFormData.discountType}
                          onValueChange={(value) =>
                            setOfferFormData({
                              ...offerFormData,
                              discountType: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">
                              Percentage (%)
                            </SelectItem>
                            <SelectItem value="fixed">
                              Fixed Amount (LKR)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountValue">Discount Value *</Label>
                        <Input
                          id="discountValue"
                          type="number"
                          placeholder="20"
                          value={offerFormData.discountValue}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              discountValue: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minPurchase">Min Purchase (LKR)</Label>
                        <Input
                          id="minPurchase"
                          type="number"
                          placeholder="1000"
                          value={offerFormData.minPurchase}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              minPurchase: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxDiscount">Max Discount (LKR)</Label>
                        <Input
                          id="maxDiscount"
                          type="number"
                          placeholder="500"
                          value={offerFormData.maxDiscount}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              maxDiscount: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="startDate"
                          className="flex items-center gap-1"
                        >
                          <Calendar className="h-3 w-3" />
                          Start Date *
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={offerFormData.startDate}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              startDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="endDate"
                          className="flex items-center gap-1"
                        >
                          <Calendar className="h-3 w-3" />
                          End Date *
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={offerFormData.endDate}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              endDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applicableProducts">
                        Applicable Products (comma-separated IDs)
                      </Label>
                      <Input
                        id="applicableProducts"
                        placeholder="1,2,3 or leave empty for all"
                        value={offerFormData.applicableProducts}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            applicableProducts: e.target.value,
                          })
                        }
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOfferDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-primary">
                        Create Offer
                      </Button>
                    </DialogFooter>
                  </TabsContent>

                  <TabsContent value="bogo" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bogoTitle">BOGO Offer Title *</Label>
                      <Input
                        id="bogoTitle"
                        placeholder="Buy 1 Get 1 Free"
                        value={offerFormData.title}
                        onChange={(e) =>
                          setOfferFormData({
                            ...offerFormData,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm">Buy Product</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="buyProductId">Product ID *</Label>
                          <Input
                            id="buyProductId"
                            placeholder="123"
                            value={offerFormData.buyProductId}
                            onChange={(e) =>
                              setOfferFormData({
                                ...offerFormData,
                                buyProductId: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="buyQuantity">Quantity *</Label>
                          <Input
                            id="buyQuantity"
                            type="number"
                            placeholder="1"
                            value={offerFormData.buyQuantity}
                            onChange={(e) =>
                              setOfferFormData({
                                ...offerFormData,
                                buyQuantity: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-semibold text-sm">
                        Get Product (Free/Discounted)
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="getProductId">Product ID *</Label>
                          <Input
                            id="getProductId"
                            placeholder="123"
                            value={offerFormData.getProductId}
                            onChange={(e) =>
                              setOfferFormData({
                                ...offerFormData,
                                getProductId: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="getQuantity">Quantity *</Label>
                          <Input
                            id="getQuantity"
                            type="number"
                            placeholder="1"
                            value={offerFormData.getQuantity}
                            onChange={(e) =>
                              setOfferFormData({
                                ...offerFormData,
                                getQuantity: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bogoStartDate">Start Date *</Label>
                        <Input
                          id="bogoStartDate"
                          type="date"
                          value={offerFormData.startDate}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              startDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bogoEndDate">End Date *</Label>
                        <Input
                          id="bogoEndDate"
                          type="date"
                          value={offerFormData.endDate}
                          onChange={(e) =>
                            setOfferFormData({
                              ...offerFormData,
                              endDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOfferDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-primary">
                        Create BOGO Offer
                      </Button>
                    </DialogFooter>
                  </TabsContent>
                </form>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="offers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          <Card className="shadow-card border-border">
            <CardHeader className="border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-muted/50">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Discount</TableHead>
                    <TableHead className="font-semibold">Start Date</TableHead>
                    <TableHead className="font-semibold">End Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPromotions.map((promo) => (
                    <TableRow
                      key={promo.id}
                      className="border-b border-border hover:bg-muted/30 transition-smooth"
                    >
                      <TableCell className="font-medium">
                        {promo.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {promo.type === "bogo" ? "BOGO" : "Discount"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {promo.type === "discount"
                          ? `${promo.discountPercent}%`
                          : "—"}
                      </TableCell>
                      <TableCell>{promo.startDate}</TableCell>
                      <TableCell>{promo.endDate}</TableCell>
                      <TableCell>
                        {promo.status === "active" ? (
                          <Badge className="bg-success text-success-foreground">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Expired</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
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
        </TabsContent>

        <TabsContent value="vouchers">
          <Card className="shadow-card border-border">
            <CardHeader className="border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search vouchers..."
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-muted/50">
                    <TableHead className="font-semibold">Code</TableHead>
                    <TableHead className="font-semibold">Discount</TableHead>
                    <TableHead className="font-semibold">
                      Min Purchase
                    </TableHead>
                    <TableHead className="font-semibold">Usage</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVouchers.map((voucher) => (
                    <TableRow
                      key={voucher.id}
                      className="border-b border-border hover:bg-muted/30 transition-smooth"
                    >
                      <TableCell className="font-mono font-medium">
                        {voucher.code}
                      </TableCell>
                      <TableCell>LKR {voucher.discount}</TableCell>
                      <TableCell>LKR {voucher.minPurchase}</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {voucher.usedCount} / {voucher.maxUses}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
