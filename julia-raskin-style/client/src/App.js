import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Import Authentication Context
import { AuthProvider } from "./context/AuthContext";

// ✅ Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary"; // 🚨 New: Catches UI errors

// ✅ Lazy Load Public Pages for Faster Loading
const Home = lazy(() => import("./pages/Home/Home"));
const AboutMe = lazy(() => import("./pages/AboutMe/AboutMe"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const ShoppingSchool = lazy(() => import("./pages/ShoppingSchool/ShoppingSchool"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/SignUp"));
const ProductDetails = lazy(() => import("./pages/Products/ProductDetails"));
const ArticleDetail = lazy(() => import("./pages/ShoppingSchool/ArticleDetail"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// ✅ Lazy Load Admin Pages
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const ManageProducts = lazy(() => import("./pages/Admin/ManageProducts"));
const ManageOrders = lazy(() => import("./pages/Admin/ManageOrders"));
const ManageUsers = lazy(() => import("./pages/Admin/ManageUsers"));

// ✅ Lazy Load User Pages
const UserDashboard = lazy(() => import("./pages/User/UserDashboard"));
const Profile = lazy(() => import("./pages/User/Profile"));
const Orders = lazy(() => import("./pages/User/Orders"));
const EditInfo = lazy(() => import("./pages/User/EditInfo"));
const Payment = lazy(() => import("./pages/User/Payment"));
const UserCart = lazy(() => import("./pages/User/UserCart"));

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider> {/* ✅ AuthProvider inside Router */}
        <Navbar />
        <main className="py-4">
          <Suspense fallback={<div className="loading-spinner">⏳ Loading...</div>}>
            <ErrorBoundary>
              <Routes>
                {/* 🌐 Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutMe />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/shopping-school" element={<ShoppingSchool />} />
                <Route path="/product/:id" element={<ProductDetails />} />

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
            </ErrorBoundary>
          </Suspense>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
