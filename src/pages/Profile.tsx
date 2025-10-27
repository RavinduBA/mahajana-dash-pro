import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit,
  Save,
  X,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // API call will be implemented here: PUT /api/admin/profile
      console.log("Updating profile:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
    });
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-500 text-white";
      case "Staff":
        return "bg-blue-500 text-white";
      case "Delivery":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your account information
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <Badge className={getRoleBadgeColor(user?.role || "")}>
                  {user?.role}
                </Badge>
                <p className="text-sm text-muted-foreground">ID: {user?.id}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground break-all">
                  {user?.email}
                </span>
              </div>
              {user?.branch && (
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {user.branch.title}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {user?.role} Access
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Account Information</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your account details
                </p>
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* User ID (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="userId" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User ID
                  </Label>
                  <Input
                    id="userId"
                    value={user?.id || ""}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    This field cannot be edited
                  </p>
                </div>

                {/* Role (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={user?.role || ""}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact administrator to change role
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0771234567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                    required
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* API Information Card */}
      <Card>
        <CardHeader className="border-b border-border">
          <h3 className="text-lg font-semibold">API Endpoint Information</h3>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium">
                  GET /api/admin/profile
                </span>
                <Badge variant="outline">Fetch Profile</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Retrieves current user profile information including: id,
                fullName, email, phone, and role.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium">
                  PUT /api/admin/profile
                </span>
                <Badge variant="outline">Update Profile</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Updates user profile. Editable fields: fullName, email, phone.
                Read-only fields: id, role.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
