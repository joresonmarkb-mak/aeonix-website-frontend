
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import AllWatches from "./pages/AllWatches";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App (){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/allwatches" element={<AllWatches/>} />
                <Route path="/contact" element={<Contact/>} />
            </Routes>
        </BrowserRouter>
        
    )
}
export default App