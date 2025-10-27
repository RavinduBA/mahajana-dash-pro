# Staff User Registration Guide

## 🚫 Why Web Registration is Disabled

**Security & Access Control Reasons:**

1. **Security Risk**: Staff accounts have administrative privileges to manage inventory, orders, customers, and sensitive business data.

2. **Unauthorized Access**: If anyone could register, malicious actors could create admin accounts and access your system.

3. **Business Control**: Only authorized personnel should have staff accounts.

4. **Industry Standard**: Most admin panels don't allow public registration for these reasons.

---

## ✅ How to Create Staff Users (3 Methods)

### **Method 1: Direct Database Insert (Immediate Solution)**

If your backend doesn't have a staff creation endpoint yet, you can create the first admin user directly in the database:

#### Using Database Client (Recommended)

```sql
-- Connect to your PostgreSQL/MySQL database
-- Replace with your actual database connection details

-- 1. Insert a new staff user
INSERT INTO staff (name, email, password, role, branch_id, created_at, updated_at)
VALUES (
  'Admin User',
  'admin@supermarket.com',
  '$2b$10$hashed_password_here',  -- Use bcrypt to hash password
  'admin',
  1,  -- branch ID
  NOW(),
  NOW()
);

-- 2. Verify the user was created
SELECT id, name, email, role FROM staff WHERE email = 'admin@supermarket.com';
```

#### **How to Hash Password:**

**Option A: Using Node.js bcrypt**

```bash
# In your backend project (mhjapi)
cd mhjapi
node
```

```javascript
const bcrypt = require("bcrypt");
const password = "YourSecurePassword123!";
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
// Copy this hash and use it in the SQL INSERT above
```

**Option B: Using Online Tool** (not recommended for production)

- Go to: https://bcrypt-generator.com/
- Enter your password
- Copy the bcrypt hash
- Use in SQL INSERT statement

---

### **Method 2: Add Backend API Endpoint (Recommended Long-term)**

Create an admin-only endpoint in your backend to register staff users.

#### Step 1: Add Route in Backend (mhjapi)

Create file: `src/web/routes/admin.ts`

```typescript
import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import bcrypt from "bcrypt";

const router = Router();

// POST /admin/staff - Create new staff user (Admin only)
router.post("/staff", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Check if email already exists
    const existingUser = await db.query(
      "SELECT * FROM staff WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new staff user
    const result = await db.query(
      `INSERT INTO staff (name, email, password, role, branch_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, name, email, role, branch_id`,
      [name, email, hashedPassword, role, branchId]
    );

    res.status(201).json({
      data: result.rows[0],
      message: "Staff user created successfully",
    });
  } catch (error) {
    console.error("Error creating staff user:", error);
    res.status(500).json({
      error: "Failed to create staff user",
    });
  }
});

export default router;
```

#### Step 2: Add Frontend "Staff Management" Page

Create file: `src/pages/StaffManagement.tsx`

```typescript
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function StaffManagement() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    branchId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiClient.post("/admin/staff", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        branchId: Number(formData.branchId),
      });

      toast({
        title: "Success",
        description: "Staff user created successfully",
      });

      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        branchId: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Only admins can access this page
  if (user?.role !== "admin") {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">
          Only administrators can manage staff users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff User
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Staff User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchId">Branch ID *</Label>
              <Input
                id="branchId"
                type="number"
                value={formData.branchId}
                onChange={(e) =>
                  setFormData({ ...formData, branchId: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Create Staff User
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

#### Step 3: Add Route to App.tsx

```typescript
import StaffManagement from "./pages/StaffManagement";

// In your routes:
<Route
  path="/staff"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <StaffManagement />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>;
```

---

### **Method 3: Using Backend CLI Script**

Create a script in your backend to add staff users:

Create file: `mhjapi/scripts/create-staff.ts`

```typescript
import bcrypt from "bcrypt";
import { db } from "../src/db";

async function createStaff() {
  const staff = {
    name: process.argv[2] || "Admin User",
    email: process.argv[3] || "admin@supermarket.com",
    password: process.argv[4] || "admin123",
    role: process.argv[5] || "admin",
    branchId: Number(process.argv[6]) || 1,
  };

  try {
    const hashedPassword = await bcrypt.hash(staff.password, 10);

    const result = await db.query(
      `INSERT INTO staff (name, email, password, role, branch_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, name, email, role`,
      [staff.name, staff.email, hashedPassword, staff.role, staff.branchId]
    );

    console.log("✅ Staff user created successfully:");
    console.log(result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating staff user:", error);
    process.exit(1);
  }
}

createStaff();
```

**Usage:**

```bash
cd mhjapi
npx ts-node scripts/create-staff.ts "John Doe" "john@supermarket.com" "password123" "admin" 1
```

---

## 🎯 Recommended Workflow

### For Initial Setup (First Admin):

1. **Use Method 1 (Direct Database Insert)** to create the first admin account
2. Login with that admin account
3. Implement **Method 2 (Backend API Endpoint + Frontend Page)**
4. Use the admin panel to create additional staff users

### For Ongoing Operations:

1. Admin logs into the dashboard
2. Goes to "Staff Management" page
3. Clicks "Add Staff User"
4. Fills in the form (name, email, password, role, branch)
5. Submits the form
6. New staff user can now login

---

## 🔐 Security Best Practices

1. **Strong Passwords**: Require minimum 8 characters, mix of letters, numbers, symbols
2. **Email Verification**: Send verification email to new staff (optional)
3. **Role-Based Access**: Only admins can create staff accounts
4. **Audit Logging**: Log who created which staff account and when
5. **Password Reset**: Implement password reset functionality
6. **Two-Factor Auth**: Consider adding 2FA for admin accounts

---

## 📋 Summary

**Question:** Why registration not allowed?  
**Answer:** Security - prevents unauthorized admin access

**Question:** How to register users?  
**Answer:** Three ways:

1. ✅ **Quick:** Direct database insert (for first admin)
2. ✅ **Recommended:** Backend API + Admin panel page (for ongoing use)
3. ✅ **Alternative:** CLI script (for bulk operations)

**Current Status:**

- ❌ Public web registration: Disabled (intentionally)
- ✅ Admin-managed registration: Needs implementation
- ✅ Database insert: Available now

---

## 🚀 Next Steps

1. **Immediate:** Use database insert to create first admin
2. **Short-term:** Implement backend API endpoint for staff creation
3. **Medium-term:** Build Staff Management page in admin panel
4. **Long-term:** Add email verification, 2FA, and audit logging

Need help implementing any of these? I can help you with the code! 🎉
