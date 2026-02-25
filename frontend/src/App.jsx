import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { FarmerAuthProvider } from './context/FarmerAuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Farmers from './pages/Farmers';
import CustomerForm from './pages/CustomerForm';
import Payments from './pages/Payments';
import PaymentForm from './pages/PaymentForm';
import Sales from './pages/Sales';
import SalesForm from './pages/SalesForm';
import Messages from './pages/Messages';
import Users from './pages/Users';

// Farmer Pages
import FarmerLogin from './pages/FarmerLogin';
import FarmerRegister from './pages/FarmerRegister';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProducts from './pages/FarmerProducts';
import FarmerSales from './pages/FarmerSales';

// Public Store Pages
import Home from './pages/Home';
import StoreProducts from './pages/StoreProducts';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

// Components
import Layout from './components/Layout';
import StoreLayout from './components/StoreLayout';
import FarmerLayout from './components/FarmerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteFarmer from './components/ProtectedRouteFarmer';

function App() {
  return (
    <AuthProvider>
      <FarmerAuthProvider>
        <CartProvider>
          <Router>
          <Routes>
            {/* Public Storefront Routes */}
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products-store" element={<StoreProducts />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Farmer Auth Routes */}
            <Route path="/farmer/login" element={<FarmerLogin />} />
            <Route path="/farmer/register" element={<FarmerRegister />} />
            
            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route element={<Layout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductForm />} />
                <Route path="/products/edit/:id" element={<ProductForm />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/new" element={<CategoryForm />} />
                <Route path="/categories/edit/:id" element={<CategoryForm />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/farmers" element={<Farmers />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/new" element={<CustomerForm />} />
                <Route path="/customers/edit/:id" element={<CustomerForm />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/payments/new" element={<PaymentForm />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/sales/new" element={<SalesForm />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>

            {/* Farmer Protected Routes */}
            <Route element={<ProtectedRouteFarmer />}>
              <Route element={<FarmerLayout />}>
                <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                <Route path="/farmer/products" element={<FarmerProducts />} />
                <Route path="/farmer/categories" element={<Categories />} />
                <Route path="/farmer/categories/new" element={<CategoryForm />} />
                <Route path="/farmer/categories/edit/:id" element={<CategoryForm />} />
                <Route path="/farmer/sales" element={<FarmerSales />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </FarmerAuthProvider>
  </AuthProvider>
  );
}

export default App;
