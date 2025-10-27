import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "Admin" | "Staff" | "Delivery" | "";
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { register, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone must be 10 digits and start with 0 (e.g., 0771234567)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await register({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role as "Admin" | "Staff" | "Delivery",
        });
      } catch (error) {
        // Error handling is done in AuthContext
      }
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img
              src="/MahajanaSuper.jpg"
              alt="Mahajana Super"
              className="h-24 w-24 rounded-lg object-cover shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Staff Registration
          </h1>
          <p className="text-muted-foreground">
            Staff accounts are managed by administrators
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-card">
          <div className="text-center space-y-4 py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Registration Restricted</h3>
              <p className="text-sm text-muted-foreground">
                Staff accounts can only be created by system administrators.
                Please contact your administrator to request an account.
              </p>
            </div>
          </div>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Login here
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © 2025 Mahajana Super. All rights reserved.
        </p>
      </div>
    </div>
  );
}
