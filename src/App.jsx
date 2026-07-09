
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import AllWatches from "./pages/AllWatches";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import AdminRoute from './pages/admin/AdminRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminReviews from './pages/admin/AdminReviews.jsx';
import Profile from './pages/Profile.jsx';
import AdminMessages from './pages/admin/AdminMessage.jsx';



function App (){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/allwatches" element={<AllWatches/>} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/watches/:id" element={<ProductDetail />} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
                <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
        
    )
}
export default App