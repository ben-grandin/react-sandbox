import { useEffect } from "react";
import type React from "react";
import { Link } from "react-router";
import { API_ORIGIN } from "./lib/api";
import { sandboxes } from "./sandbox-registry";

export const Home: React.FC = () => {
    useEffect(() => {
        document.title = "React Sandbox";
    }, []);

    return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
                React Sandbox
            </h1>

            <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-4">
                A collection of interactive examples and patterns to explore React concepts, syntax variations, and
                component implementations.
            </p>

            <a
                href={`${API_ORIGIN}/api/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
            >
                📄 API Platform Swagger UI <span aria-hidden="true">↗</span>
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sandboxes.map((sandbox) => (
                <Link
                    key={sandbox.path}
                    to={sandbox.path.replace(/\/\*$/, "")}
                    className="block group bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-indigo-200"
                >
                    <div className="flex items-start space-x-4">
                        <div
                            className="flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-lg text-2xl">
                            {sandbox.icon}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2 gap-2">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    {sandbox.title}
                                </h3>
                                <div className="flex items-center gap-2 shrink-0">
                                    {sandbox.apiDomain && (
                                        <span
                                            className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                            API · {sandbox.apiDomain}
                                        </span>
                                    )}
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                        {sandbox.category}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600">
                                {sandbox.description}
                            </p>

                            <div className="mt-4 flex justify-end">
                  <span
                      className="text-indigo-500 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Explore example <span className="ml-1">→</span>
                  </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
            <p>
                Built with React and TypeScript • Styled with Tailwind CSS
            </p>
        </div>
    </div>
    );
};
