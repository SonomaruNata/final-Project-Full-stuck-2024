import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Import Authentication Context
import { AuthProvider } from "./context/AuthContext";

// ✅ Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Import Public Pages
import Home from "./pages/Home/Home";
import AboutMe from "./pages/AboutMe/AboutMe";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart/Cart";
import ShoppingSchool from "./pages/ShoppingSchool/ShoppingSchool";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ProductDetails from "./pages/Products/ProductDetails";
import ArticleDetail from "./pages/ShoppingSchool/ArticleDetail";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";

// ✅ Import Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageProducts from "./pages/Admin/ManageProducts";
import ManageOrders from "./pages/Admin/ManageOrders";
import ManageUsers from "./pages/Admin/ManageUsers";

// ✅ Import User Pages
import UserDashboard from "./pages/User/UserDashboard"; 
import Profile from "./pages/User/Profile";
import Orders from "./pages/User/Orders";
import EditInfo from "./pages/User/EditInfo";
import Payment from "./pages/User/Payment";
import UserCart from "./pages/User/UserCart";

const App = () => {
  return (
    <Router>
      <AuthProvider> {/* ✅ AuthProvider inside Router */}
        <Navbar />
        <main className="py-4">
          <Routes>
            {/* 🌐 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/shopping-school" element={<ShoppingSchool />} />
            <Route path="/shop/:id" element={<ProductDetails />} />
            <Route path="/shopping-school/:id" element={<ArticleDetail />} />
            <Route path="/contact" element={<Contact />} />

            {/* 🔐 Admin Routes (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-products"
              element={
                <ProtectedRoute adminOnly>
                  <ManageProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-orders"
              element={
                <ProtectedRoute adminOnly>
                  <ManageOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-users"
              element={
                <ProtectedRoute adminOnly>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />

            {/* 👤 User Routes (Protected) */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/edit-info"
              element={
                <ProtectedRoute>
                  <EditInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/cart"
              element={
                <ProtectedRoute>
                  <UserCart />
                </ProtectedRoute>
              }
            />

            {/* 🚫 Catch-All Route for Undefined Paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
