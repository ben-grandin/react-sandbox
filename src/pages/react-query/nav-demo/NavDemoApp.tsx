import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createNavDemoRouter } from "./router";

function createDemoQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
    });
}

export function NavDemoApp() {
    const [queryClient] = useState(createDemoQueryClient);
    const [router] = useState(() => createNavDemoRouter(queryClient));

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-1">
                            Navigation avec loader
                        </h1>
                        <p className="text-gray-600 text-sm">
                            ensureQueryData vs fetchQuery dans un loader TanStack Router
                        </p>
                    </div>

                    <RouterProvider router={router} />
                </div>
            </div>

            <ReactQueryDevtools initialIsOpen={false} />
            <TanStackRouterDevtools router={router} initialIsOpen={false} />
        </QueryClientProvider>
    );
}
