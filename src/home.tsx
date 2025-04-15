import React from "react";
import { Link } from "react-router";

type DemoLink = {
    path: string;
    title: string;
    description: string;
    category: "HTTP" | "Syntax" | "Components";
    icon: string;
};

const DEMO_LINKS: DemoLink[] = [
    {
        path: "/http/axios",
        title: "HTTP Status Explorer",
        description: "Interactive visualization of HTTP status codes and responses",
        category: "HTTP",
        icon: "🌐",
    },
    {
        path: "/ternary/SimpleTernary",
        title: "Simple Ternary Examples",
        description: "Demonstrating basic conditional rendering with ternary operators",
        category: "Syntax",
        icon: "⁉️",
    },
    {
        path: "/ternary/ternaryOrAnd",
        title: "Ternary vs Logical Operators",
        description: "Comparing ternary, AND, and OR operators for conditional logic",
        category: "Syntax",
        icon: "🔀",
    },
];

export const Home: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
                React Sandbox
            </h1>

            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                A collection of interactive examples and patterns to explore React concepts, syntax variations, and
                component implementations.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEMO_LINKS.map((demo) => (
                <Link
                    key={demo.path}
                    to={demo.path}
                    className="block group bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-indigo-200"
                >
                    <div className="flex items-start space-x-4">
                        <div
                            className="flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-lg text-2xl">
                            {demo.icon}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    {demo.title}
                                </h3>
                                <span
                                    className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                    {demo.category}
                  </span>
                            </div>

                            <p className="text-gray-600">
                                {demo.description}
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
