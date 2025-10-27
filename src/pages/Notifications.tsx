import { useState } from "react";
import {
  Plus,
  Search,
  Send,
  Bell,
  Users,
  Filter,
  Trash2,
  Eye,
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
import { Checkbox } from "@/components/ui/checkbox";

// Mock data
const mockNotifications = [
  {
    id: 1,
    title: "Weekend Sale Alert",
    message: "Get 20% off on all products this weekend!",
    type: "promotion",
    sentTo: "all",
    sentAt: "2025-01-15 10:30",
    recipients: 1250,
    status: "sent",
  },
  {
    id: 2,
    title: "New Products Available",
    message: "Check out our new fresh produce section",
    type: "announcement",
    sentTo: "customers",
    sentAt: "2025-01-14 14:20",
    recipients: 850,
    status: "sent",
  },
  {
    id: 3,
    title: "Order Delivered",
    message: "Your order #12345 has been delivered",
    type: "order",
    sentTo: "individual",
    sentAt: "2025-01-16 09:15",
    recipients: 1,
    status: "sent",
  },
];

export default function Notifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "announcement",
    targetAudience: "all",
    scheduledDate: "",
    scheduledTime: "",
    sendPush: true,
    sendEmail: false,
    sendSMS: false,
    imageUrl: "",
    actionUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call: POST /admin/notifications
    console.log("Notification form data:", formData);
    setIsComposeDialogOpen(false);
    setFormData({
      title: "",
      message: "",
      type: "announcement",
      targetAudience: "all",
      scheduledDate: "",
      scheduledTime: "",
      sendPush: true,
      sendEmail: false,
      sendSMS: false,
      imageUrl: "",
      actionUrl: "",
    });
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      promotion: "bg-orange-500 text-white",
      announcement: "bg-blue-500 text-white",
      order: "bg-green-500 text-white",
      alert: "bg-red-500 text-white",
    };
    return (
      <Badge className={colors[type] || "bg-gray-500 text-white"}>{type}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Send notifications to users
          </p>
        </div>
        <Dialog
          open={isComposeDialogOpen}
          onOpenChange={setIsComposeDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth">
              <Plus className="mr-2 h-4 w-4" />
              Compose Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Compose New Notification
              </DialogTitle>
              <DialogDescription>
                Create and send notifications to your customers via push, email,
                or SMS.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title *</Label>
                <Input
                  id="title"
                  placeholder="Weekend Sale Alert"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Your notification message here..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.message.length} / 500 characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Notification Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="order">Order Update</SelectItem>
                      <SelectItem value="alert">Alert/Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="targetAudience"
                    className="flex items-center gap-1"
                  >
                    <Users className="h-3 w-3" />
                    Target Audience *
                  </Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetAudience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="customers">Customers Only</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                      <SelectItem value="newUsers">New Users</SelectItem>
                      <SelectItem value="inactive">Inactive Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-semibold text-sm">Delivery Channels</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendPush"
                      checked={formData.sendPush}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          sendPush: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="sendPush" className="cursor-pointer">
                      Push Notification (App)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendEmail"
                      checked={formData.sendEmail}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          sendEmail: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="sendEmail" className="cursor-pointer">
                      Email Notification
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendSMS"
                      checked={formData.sendSMS}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          sendSMS: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="sendSMS" className="cursor-pointer">
                      SMS Notification
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-sm">Advanced Options</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">
                      Schedule Date (Optional)
                    </Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Schedule Time</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actionUrl">Action URL (Optional)</Label>
                  <Input
                    id="actionUrl"
                    type="url"
                    placeholder="https://mahajana.lk/promotions"
                    value={formData.actionUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, actionUrl: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    URL to open when notification is clicked
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsComposeDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary"
                  disabled={
                    !formData.sendPush &&
                    !formData.sendEmail &&
                    !formData.sendSMS
                  }
                >
                  <Send className="mr-2 h-4 w-4" />
                  {formData.scheduledDate ? "Schedule" : "Send Now"}
                </Button>
              </DialogFooter>
            </form>
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
                placeholder="Search notifications..."
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
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Message</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Recipients</TableHead>
                <TableHead className="font-semibold">Sent At</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockNotifications.map((notification) => (
                <TableRow
                  key={notification.id}
                  className="border-b border-border hover:bg-muted/30 transition-smooth"
                >
                  <TableCell className="font-medium">
                    {notification.title}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                    {notification.message}
                  </TableCell>
                  <TableCell>{getTypeBadge(notification.type)}</TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {notification.recipients}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {notification.sentAt}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-success text-success-foreground">
                      Sent
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-accent transition-smooth"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 transition-smooth"
                        title="Delete"
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
