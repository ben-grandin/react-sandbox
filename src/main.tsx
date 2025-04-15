import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./home";
import Axios from "./pages/http/axios";
import { SimpleTernary } from "./pages/ternary-or-and/SimpleTernary";
import TestTernaryOrAndOperator from "./pages/ternary-or-and/TestTernaryOrAndOperator";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} path="*" />
                <Route path="http">
                    <Route path="axios" element={<Axios />} />
                </Route>

                <Route path="ternary">
                    <Route path="SimpleTernary" element={<SimpleTernary />} />
                    <Route path="ternaryOrAnd" element={<TestTernaryOrAndOperator />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
