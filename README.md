# Mahajana Dash Pro

A modern, feature-rich admin dashboard for Mahajana Supermarket chain management system.

## Project Overview

Mahajana Dash Pro is a comprehensive admin dashboard built with cutting-edge technologies for managing supermarket operations including products, categories, branches, brands, promotions, and notifications.

## Tech Stack

- **Vite** - Next generation frontend tooling
- **TypeScript** - Type-safe JavaScript
- **React 18.3** - UI component library with hooks
- **React Router** - Client-side routing
- **shadcn-ui** - Re-usable component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Tanstack Query** - Data fetching and caching

## Features

### Core Features

- 🔐 **Authentication System** - Login/Register with role-based access (Admin, Staff, Delivery)
- 👤 **User Profile Management** - View and edit profile with API integration
- 📊 **Dashboard** - Overview of key metrics and statistics
- 🛍️ **Product Management** - Full CRUD operations for products
- 📁 **Category Management** - Hierarchical category organization
- 🏢 **Branch Management** - Manage multiple store locations
- 🏷️ **Brand Management** - Product brand administration
- 🎁 **Promotions** - Create offers (discounts & BOGO deals) and vouchers
- 🔔 **Notifications** - Send push, email, and SMS notifications to customers

### UI/UX Features

- 🎨 **Dark/Light Theme** - Toggle between themes with smooth transitions
- 📱 **Responsive Design** - Mobile-first, works on all screen sizes
- 🎯 **Custom Scrollbars** - Theme-aware custom scrollbars
- ⚡ **Smooth Animations** - 200ms transitions for all interactions
- 🔵 **Color-coded Actions** - Blue for Edit, Red for Delete
- 💬 **Toast Notifications** - Real-time feedback for user actions
- 🔍 **Search Functionality** - Quick search across products and categories

### Technical Features

- ✅ **Type Safety** - Full TypeScript implementation
- 🔄 **State Management** - React Context API for auth and theme
- 🎭 **Protected Routes** - Authentication-based route protection
- 📦 **Code Organization** - Clean component structure with separation of concerns
- 🚀 **Optimized Builds** - Production-ready with Vite bundling
- 🎪 **Hot Module Replacement** - Fast development with instant updates

## Project Structure

```
mahajana-dash-pro/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppSidebar.tsx      # Navigation sidebar
│   │   │   ├── Header.tsx          # Top header with search & profile
│   │   │   └── DashboardLayout.tsx # Main layout wrapper
│   │   ├── ui/                     # shadcn-ui components
│   │   ├── ProtectedRoute.tsx      # Route authentication guard
│   │   └── ThemeToggle.tsx         # Dark/Light mode toggle
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Authentication state management
│   │   └── ThemeContext.tsx        # Theme state management
│   ├── pages/
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── Products.tsx            # Product management
│   │   ├── Categories.tsx          # Category management
│   │   ├── Branches.tsx            # Branch management
│   │   ├── Brands.tsx              # Brand management
│   │   ├── Promotions.tsx          # Offers & vouchers
│   │   ├── Notifications.tsx       # Notification center
│   │   ├── Profile.tsx             # User profile
│   │   ├── Login.tsx               # Login page
│   │   ├── Register.tsx            # Registration page
│   │   └── NotFound.tsx            # 404 page
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utility functions
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
└── README.md
```

## API Integration

### Profile Management

#### Get Profile

```typescript
GET / api / admin / profile;
Response: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "Admin" | "Staff" | "Delivery";
}
```

#### Update Profile

```typescript
PUT /api/admin/profile
Body: {
  fullName: string;  // Editable
  email: string;     // Editable
  phone: string;     // Editable
}
Note: 'id' and 'role' are read-only fields
```

### Coming Soon

- Product API endpoints
- Category API endpoints
- Branch API endpoints
- Brand API endpoints
- Promotion API endpoints
- Notification API endpoints

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd mahajana-dash-pro

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Development

Run the development server with auto-reloading:

```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages & Routes

| Route            | Page          | Description                   |
| ---------------- | ------------- | ----------------------------- |
| `/login`         | Login         | User authentication           |
| `/register`      | Register      | New user registration         |
| `/`              | Dashboard     | Main dashboard with metrics   |
| `/products`      | Products      | Product inventory management  |
| `/categories`    | Categories    | Category hierarchy management |
| `/branches`      | Branches      | Store location management     |
| `/brands`        | Brands        | Brand administration          |
| `/promotions`    | Promotions    | Offers and vouchers           |
| `/notifications` | Notifications | Customer notifications        |
| `/profile`       | Profile       | User profile & settings       |

## User Roles

- **Admin** - Full access to all features
- **Staff** - Limited access to operational features
- **Delivery** - Access to delivery-related features

## Recent Updates

### v1.2.0 (Latest)

- ✨ Added Profile page with edit functionality
- 🔗 Connected Profile menu item to profile route
- 📝 Updated README with comprehensive documentation
- 🎨 Enhanced sidebar logo size (64px expanded, 56px collapsed)
- ✅ All API endpoints documented for profile management

### v1.1.0

- ✅ Implemented functional Edit buttons across all admin pages
- 🎨 Applied UI improvements (custom scrollbars, color-coded buttons)
- 🔧 Fixed dialog headers and footers with proper borders
- ⚡ Added smooth 200ms transitions for all interactions

### v1.0.0

- 🎉 Initial release with core features
- 🔐 Authentication system
- 📊 Dashboard with statistics
- 🛍️ Product management
- 📁 Category management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software for Mahajana Supermarket.

## Support

For support, email support@mahajana.com or contact the development team.

---

**Built with ❤️ for Mahajana Supermarket**
