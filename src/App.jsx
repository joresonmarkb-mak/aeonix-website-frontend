
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import AllWatches from "./pages/AllWatches";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';

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
            </Routes>
        </BrowserRouter>
        
    )
}
export default App