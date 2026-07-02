import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from './context/AuthContext.jsx';

import App from "./App";

import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <CartProvider>
                <App></App>
            </CartProvider>
        </AuthProvider>
    </StrictMode>
)

