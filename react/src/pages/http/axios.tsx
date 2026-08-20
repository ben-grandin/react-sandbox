import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

const HTTP_CODE_LIST = [
    200,
    400,
    401,
    403,
    404,
    500,
    "TIMEOUT" // Special case for timeout testing
];

// Function to determine color based on HTTP code
const getStatusColor = (httpCode: number | string) => {
    if (httpCode === "TIMEOUT") return "bg-purple-50 border-purple-200 text-purple-700";
    if (typeof httpCode === "number") {
        if (httpCode >= 200 && httpCode < 300) return "bg-emerald-50 border-emerald-200 text-emerald-700";
        if (httpCode >= 300 && httpCode < 400) return "bg-blue-50 border-blue-200 text-blue-700";
        if (httpCode >= 400 && httpCode < 500) return "bg-amber-50 border-amber-200 text-amber-700";
        if (httpCode >= 500) return "bg-rose-50 border-rose-200 text-rose-700";
    }
    return "bg-gray-50 border-gray-200 text-gray-700";
};

// Group HTTP codes by their series (2xx, 3xx, etc.)
const groupHttpCodes = (codes: (number | string)[]) => {
    const groups: Record<string, (number | string)[]> = {};

    codes.forEach(code => {
        if (code === "TIMEOUT") {
            if (!groups["special"]) {
                groups["special"] = [];
            }
            groups["special"].push(code);
        } else if (typeof code === "number") {
            const series = Math.floor(code / 100);
            if (!groups[series]) {
                groups[series] = [];
            }
            groups[series].push(code);
        }
    });

    return groups;
};

// Get series title based on the first digit
const getSeriesTitle = (series: string | number) => {
    if (series === "special") return "Special Cases";

    switch (Number(series)) {
        case 2: return "Success Responses (2xx)";
        case 3: return "Redirection Messages (3xx)";
        case 4: return "Client Error Responses (4xx)";
        case 5: return "Server Error Responses (5xx)";
        default: return `${series}xx Status Codes`;
    }
};

export default function Axios() {
    const groupedCodes = groupHttpCodes(HTTP_CODE_LIST);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
                        Axios HTTP Status Explorer
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Visualizing responses and errors for different HTTP status codes
                    </p>
                </div>

                <div className="space-y-12">
                    {Object.entries(groupedCodes).map(([series, codes]) => (
                        <div key={series} className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-md">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                                {getSeriesTitle(series)}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {codes.map((httpCode) => (
                                    <FetchHttpCode key={String(httpCode)} httpCode={httpCode} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

type FetchHttpCodeProps = {
    httpCode: number | string;
};

const FetchHttpCode: React.FC<FetchHttpCodeProps> = ({ httpCode }) => {
    const [res, setRes] = useState<AxiosResponse>();
    const [error, setError] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (httpCode === "TIMEOUT") {
                    // For timeout test, we use a non-existent URL with a small timeout
                    const data = await axios.get('https://this-url-will-timeout.example', {
                        timeout: 1000 // 1 second timeout for quick testing
                    });
                    setRes(data);
                    setError(undefined);
                } else {
                    const data = await axios.get(`https://httpstat.us/${httpCode}`);
                    setRes(data);
                    setError(undefined);
                }
            } catch (e) {
                setError(e);
                setRes(undefined);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [httpCode]);

    const statusColorClass = getStatusColor(httpCode);

    // Display appropriate title based on the HTTP code or timeout
    const getTitle = () => {
        if (httpCode === "TIMEOUT") return "Timeout Test";
        return `Status ${httpCode}`;
    };

    return (
        <div className={`border rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${statusColorClass}`}>
            <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{getTitle()}</h3>
                    {loading ? (
                        <div className="animate-pulse h-6 w-6 rounded-full bg-current opacity-30"></div>
                    ) : (
                        <div className={`h-6 w-6 rounded-full ${error ? "bg-red-500" : "bg-green-500"}`}></div>
                    )}
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-current opacity-20 rounded w-3/4"></div>
                        <div className="h-4 bg-current opacity-20 rounded w-1/2"></div>
                    </div>
                ) : (
                    <div>
                        {error ? (
                            <div className="space-y-2">
                                <p className="font-medium">Error:</p>
                                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-32">
                                    {JSON.stringify(error, null, 2)}
                                </pre>
                                {httpCode === "TIMEOUT" && (
                                    <p className="text-sm italic mt-2">
                                        Request exceeded timeout limit (1000ms)
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="font-medium">Response:</p>
                                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-32">
                                    {JSON.stringify(res, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
