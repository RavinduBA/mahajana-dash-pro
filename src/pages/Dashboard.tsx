import { Package, FolderTree, Building2, Tag } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    console.log("📊 Dashboard component mounted!");
  }, []);

  console.log("📊 Dashboard rendering...");

  const stats = [
    {
      title: "Total Products",
      value: "2,543",
      icon: Package,
      trend: { value: "12.5% from last month", isPositive: true },
      color: "primary" as const,
    },
    {
      title: "Categories",
      value: "48",
      icon: FolderTree,
      trend: { value: "3 new this week", isPositive: true },
      color: "success" as const,
    },
    {
      title: "Branches",
      value: "12",
      icon: Building2,
      trend: { value: "2% from last month", isPositive: false },
      color: "warning" as const,
    },
    {
      title: "Active Brands",
      value: "156",
      icon: Tag,
      trend: { value: "8 new this month", isPositive: true },
      color: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your supermarket
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for charts and additional widgets */}
        <div className="col-span-2 rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Recent Activity
          </h3>
          <p className="text-muted-foreground">
            Activity data will be displayed here
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Quick Actions
          </h3>
          <p className="text-muted-foreground">
            Quick action buttons will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
