import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { SimpleTernary } from "./pages/ternary-or-and/SimpleTernary";
import TestTernaryOrAndOperator from "./pages/ternary-or-and/TestTernaryOrAndOperator";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="ternary">
                    <Route path="SimpleTernary" element={<SimpleTernary />} />
                    <Route path="ternaryOrAnd" element={<TestTernaryOrAndOperator />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
