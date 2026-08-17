import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./home";
import Axios from "./pages/http/axios";
import { SimpleTernary } from "./pages/ternary-or-and/SimpleTernary";
import TestTernaryOrAndOperator from "./pages/ternary-or-and/TestTernaryOrAndOperator";
import { ZustandPage } from "./pages/zustand/ZustandPage";
import { FlexShrinkDemo } from "./pages/css/FlexShrinkDemo";
import { ContextPage } from "./pages/context/ContextPage";
import { ReactQueryPage } from "./pages/react-query/ReactQueryPage";
import { NavDemoApp } from "./pages/react-query/nav-demo/NavDemoApp";

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

                <Route path="zustand" element={<ZustandPage />} />

                <Route path="css">
                    <Route path="flex-shrink" element={<FlexShrinkDemo />} />
                </Route>

                <Route path="context" element={<ContextPage />} />

                <Route path="react-query/nav-demo/*" element={<NavDemoApp />} />
                <Route path="react-query" element={<ReactQueryPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
