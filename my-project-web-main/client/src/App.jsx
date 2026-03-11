import { Routes, Route } from 'react-router-dom';
import './index.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import BookingDetail from "./pages/booking/BookingDetail";
import BookingCheckout from './components/BookingCheckout';
import BookingForm from './components/BookingForm';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword';
import BookingConfirm from './components/BookingConfirm';
import VnPayReturn from './components/VnPayReturn';
import Profile from './components/Profile';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import UserManagement from './admin/UserManagement';
import BookingManagement from './admin/BookingManagement';
import ShoppingManagement from './admin/ShoppingManagement';
function App() {
  
  return (
    <>
    <Navbar />
    <div className="main-content">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/booking/:location" element={<BookingDetail />} />
      <Route path="/booking/:location/checkout" element={<BookingCheckout />} />
      <Route path="/booking/:location/form" element={<BookingForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/booking/:location/confirm" element={<BookingConfirm />} />
      <Route path="/vnpay-return" element={<VnPayReturn />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/product" element={<ProductDetail />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:productId" element={<ProductDetail />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
      <Route path="user" element={<UserManagement />} />
      <Route path="booking" element={<BookingManagement />} />
      <Route path="shopping" element={<ShoppingManagement />} />
      </Route>
    </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App
