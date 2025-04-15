import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

const HTTP_CODE_LIST = [
    200,
    400,
    401,
    403,
    404,
    500,
];

// Function to determine color based on HTTP code
const getStatusColor = (httpCode: number) => {
    if (httpCode >= 200 && httpCode < 300) return "bg-emerald-50 border-emerald-200 text-emerald-700";
    if (httpCode >= 300 && httpCode < 400) return "bg-blue-50 border-blue-200 text-blue-700";
    if (httpCode >= 400 && httpCode < 500) return "bg-amber-50 border-amber-200 text-amber-700";
    if (httpCode >= 500) return "bg-rose-50 border-rose-200 text-rose-700";
    return "bg-gray-50 border-gray-200 text-gray-700";
};

// Group HTTP codes by their series (2xx, 3xx, etc.)
const groupHttpCodes = (codes: number[]) => {
    const groups: Record<string, number[]> = {};

    codes.forEach(code => {
        const series = Math.floor(code / 100);
        if (!groups[series]) {
            groups[series] = [];
        }
        groups[series].push(code);
    });

    return groups;
};

// Get series title based on the first digit
const getSeriesTitle = (series: number) => {
    switch (series) {
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
                                {getSeriesTitle(parseInt(series))}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {codes.map((httpCode) => (
                                    <FetchHttpCode key={httpCode} httpCode={httpCode} />
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
    httpCode: number;
};

const FetchHttpCode: React.FC<FetchHttpCodeProps> = ({ httpCode }) => {
    const [res, setRes] = useState<AxiosResponse>();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await axios.get(`https://httpstat.us/${httpCode}`);
                setRes(data);
                setError(undefined);
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
    const apiDescription = res?.data?.description || '';

    return (
        <div className={`border rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${statusColorClass}`}>
            <div className="p-4 border-b border-opacity-30">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        {httpCode}
                    </h2>
                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                        httpCode < 300 ? 'bg-emerald-100 text-emerald-600' :
                            httpCode < 400 ? 'bg-blue-100 text-blue-600' :
                                httpCode < 500 ? 'bg-amber-100 text-amber-600' :
                                    'bg-rose-100 text-rose-600'
                    }`}>
                        {httpCode < 400 ? '✓' : '✗'}
                    </span>
                </div>

                {!loading && apiDescription && (
                    <div className="mt-2 pt-2 border-t border-opacity-20">
                        <p className="text-sm font-medium">
                            {apiDescription}
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <>
                        {res && (
                            <div>
                                <h3 className="text-sm font-semibold opacity-75 uppercase tracking-wider mb-2">Response</h3>
                                <JsonStringify obj={res} />
                            </div>
                        )}
                        {error && (
                            <div>
                                <h3 className="text-sm font-semibold opacity-75 uppercase tracking-wider mb-2">Error</h3>
                                <JsonStringify obj={error} type="error" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const JsonStringify = ({ obj, type = "success" }: { obj?: Record<string, unknown> | AxiosResponse, type?: "success" | "error" }) => {
    return (
        <div className="relative rounded-lg overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-1 ${type === "error" ? "bg-gradient-to-r from-red-400 to-pink-500" : "bg-gradient-to-r from-blue-400 to-indigo-500"}`}></div>
            <pre
                className={`
                    text-xs font-mono p-4 pt-5 overflow-auto max-h-60 
                    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
                    ${type === "error" ? "bg-rose-50" : "bg-indigo-50"}
                `}
            >
                {JSON.stringify(obj, null, 2)}
            </pre>
        </div>
    );
};
