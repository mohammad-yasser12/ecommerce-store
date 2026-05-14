import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProducts from "./pages/admin/AdminProducts";
import { Navigate } from "react-router-dom";
import AdminUsers from "./pages/admin/AdminUsers";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import AdminOrders from "./pages/admin/AdminOrders";
import WishlistAnalytics from "./pages/admin/WishlistAnalytics";
import AdminPromotions from "./pages/admin/AdminPromotions";
import Offers from "./pages/user/Offers";
import UserWishlists from "./pages/user/UserWhishlists";
import UserHome from "./pages/user/UserHome";
import LandingPage from "./pages/user/LandingPage";





function App() {
  return (
    <BrowserRouter>
     <Routes>

  {/* Default */}
<Route path="/" element={<LandingPage />} />

  {/* Public */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/products" element={<Products />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<Orders />} />
  <Route path="/admin/orders" element={<AdminOrders />} />
  <Route path="/admin/promotions" element={<AdminPromotions />} />
  <Route path="/offers" element={<Offers />} />
  <Route path="/wishlist" element={<UserWishlists />} />
  <Route path="/home" element={<UserHome />} /> 
  <Route path="/" element={<LandingPage />} />
<Route
  path="/admin/wishlist-stats"
  element={
    <ProtectedRoute>
      <WishlistAnalytics />
    </ProtectedRoute>
  }
/>
  {/* Protected */}
  <Route
    path="/admin_dashboard"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/user_dashboard"
    element={
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    }
  />

  <Route
  path="/admin_products"
  element={
    <ProtectedRoute>
      <AdminProducts />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin_users"
  element={
    <ProtectedRoute>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

</Routes>
    </BrowserRouter>
  );
}

export default App;