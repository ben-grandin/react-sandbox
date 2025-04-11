import { useState } from "react";

/**
 * `TestTernaryOrAndOperator` is a React functional component that demonstrates
 * the practical usage of logical operators `&&` and `!!` and the ternary (`? :`)
 * operator in various scenarios.
 *
 * Warning : It's a WIP
 */
const TestTernaryOrAndOperator = () => {
    return (
        <div className="p-6 mx-auto bg-gray-50 rounded-xl shadow-lg text-gray-800">
            <div className="mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4 text-indigo-700">JavaScript Logical Operators Demo</h1>
                    <p className="mb-4 text-lg max-w-3xl mx-auto">
                        A comprehensive guide to understanding the practical usage of ternary operators (?:),
                        logical AND (&&), and double negation (!!) in React applications.
                    </p>
                </div>

                {/* Operator Comparison Section */}
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">Operator Comparison</h2>

                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="font-bold text-indigo-700">Scenario</div>
                        <div className="font-bold text-indigo-700">Ternary (?:)</div>
                        <div className="font-bold text-indigo-700">Logical AND (&&)</div>
                        <div className="font-bold text-indigo-700">Double Negation (!!)</div>
                    </div>

                    {/* Scenario 1: Boolean Truthy Value */}
                    <ComparisonRow
                        scenario="Boolean true"
                        code="const isLoggedIn = true;"
                        values={[
                            {
                                code: "isLoggedIn ? 'Welcome!' : 'Log in'",
                                result: true ? 'Welcome!' : 'Log in',
                                isGood: true
                            },
                            {
                                code: "isLoggedIn && 'Welcome!'",
                                result: true && 'Welcome!',
                                isGood: true
                            },
                            {
                                code: "!!isLoggedIn",
                                result: !!true ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 2: Boolean Falsy Value */}
                    <ComparisonRow
                        scenario="Boolean false"
                        code="const isLoggedIn = false;"
                        values={[
                            {
                                code: "isLoggedIn ? 'Welcome!' : 'Log in'",
                                result: false ? 'Welcome!' : 'Log in',
                                isGood: true
                            },
                            {
                                code: "isLoggedIn && 'Welcome!'",
                                result: false && 'Welcome!',
                                isGood: false,
                                note: "Returns false which may render unexpectedly"
                            },
                            {
                                code: "!!isLoggedIn",
                                result: !!false ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 3: Numeric Truthy Value */}
                    <ComparisonRow
                        scenario="Number &gt; 0"
                        code="const count = 5;"
                        values={[
                            {
                                code: "count ? 'Has value' : 'No value'",
                                result: 5 ? 'Has value' : 'No value',
                                isGood: true
                            },
                            {
                                code: "count && 'Has value'",
                                result: 5 && 'Has value',
                                isGood: true
                            },
                            {
                                code: "!!count",
                                result: !!5 ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 4: Numeric Falsy Value (0) */}
                    <ComparisonRow
                        scenario="Number = 0"
                        code="const count = 0;"
                        values={[
                            {
                                code: "count ? 'Has value' : 'No value'",
                                result: 0 ? 'Has value' : 'No value',
                                isGood: true
                            },
                            {
                                code: "count && 'Has value'",
                                result: 0 && 'Has value',
                                isGood: false,
                                note: "Returns 0 which renders as '0'"
                            },
                            {
                                code: "!!count",
                                result: !!0 ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 5: String Truthy Value */}
                    <ComparisonRow
                        scenario="Non-empty string"
                        code="const name = 'John';"
                        values={[
                            {
                                code: "name ? `Hello ${name}` : 'No name'",
                                result: 'John' ? `Hello John` : 'No name',
                                isGood: true
                            },
                            {
                                code: "name && `Hello ${name}`",
                                result: 'John' && `Hello John`,
                                isGood: true
                            },
                            {
                                code: "!!name",
                                result: !!'John' ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 6: String Falsy Value (empty string) */}
                    <ComparisonRow
                        scenario="Empty string"
                        code="const name = '';"
                        values={[
                            {
                                code: "name ? `Hello ${name}` : 'No name'",
                                result: '' ? `Hello ` : 'No name',
                                isGood: true
                            },
                            {
                                code: "name && `Hello ${name}`",
                                result: '' && `Hello `,
                                isGood: false,
                                note: "Returns empty string which renders as nothing"
                            },
                            {
                                code: "!!name",
                                result: !!'' ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 7: Null/Undefined */}
                    <ComparisonRow
                        scenario="Null value"
                        code="const user = null;"
                        values={[
                            {
                                code: "user ? user.name : 'Guest'",
                                result: null ? 'User name' : 'Guest',
                                isGood: true
                            },
                            {
                                code: "user && user.name",
                                result: null && 'User name',
                                isGood: true,
                                note: "Safe because null is falsy and stops evaluation"
                            },
                            {
                                code: "!!user",
                                result: !!null ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 8: Array Length */}
                    <ComparisonRow
                        scenario="Array with items"
                        code="const items = ['Apple', 'Banana'];"
                        values={[
                            {
                                code: "items.length ? 'Has items' : 'Empty'",
                                result: 2 ? 'Has items' : 'Empty',
                                isGood: true
                            },
                            {
                                code: "items.length && 'Has items'",
                                result: 2 && 'Has items',
                                isGood: false,
                                note: "Works but could render '2' if length is 2"
                            },
                            {
                                code: "!!items.length",
                                result: !!2 ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 9: Empty Array */}
                    <ComparisonRow
                        scenario="Empty array"
                        code="const items = [];"
                        values={[
                            {
                                code: "items.length ? 'Has items' : 'Empty'",
                                result: 0 ? 'Has items' : 'Empty',
                                isGood: true
                            },
                            {
                                code: "items.length && 'Has items'",
                                result: 0 && 'Has items',
                                isGood: false,
                                note: "Returns 0 which renders as '0'"
                            },
                            {
                                code: "!!items.length",
                                result: !!0 ? <BooleanValue value={true}/> : <BooleanValue value={false}/>,
                                isGood: true
                            }
                        ]}
                    />

                    {/* Scenario 10: Conditional Rendering */}
                    <ComparisonRow
                        scenario="Conditional rendering"
                        code="const isAdmin = true;"
                        values={[
                            {
                                code: "isAdmin ? <AdminPanel /> : null",
                                result: true ? <span className="text-green-600 font-semibold">AdminPanel rendered</span> : null,
                                isGood: true,
                                note: "Explicitly returns null when false"
                            },
                            {
                                code: "isAdmin && <AdminPanel />",
                                result: true && <span className="text-green-600 font-semibold">AdminPanel rendered</span>,
                                isGood: true,
                                note: "Shorter but beware with falsy values"
                            },
                            {
                                code: "!!isAdmin && <AdminPanel />",
                                result: !!true && <span className="text-green-600 font-semibold">AdminPanel rendered</span>,
                                isGood: true,
                                note: "Most explicit about boolean intention"
                            }
                        ]}
                    />
                </div>

                {/* Best Practices Section */}
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">Best Practices</h2>

                    <div className="space-y-6">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="font-bold text-lg text-green-800 mb-2">Recommended Approach for Each Scenario</h3>

                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <span className="text-green-600 text-xl mr-2">✓</span>
                                    <div>
                                        <span className="font-semibold">Basic conditionals:</span> Use ternary <code className="text-sm bg-green-100 px-1 rounded">condition ? valueIfTrue : valueIfFalse</code> for clearest intent
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-green-600 text-xl mr-2">✓</span>
                                    <div>
                                        <span className="font-semibold">Conditional rendering:</span> <code className="text-sm bg-green-100 px-1 rounded">condition && element</code> is fine for boolean values, <code className="text-sm bg-green-100 px-1 rounded">!!value && element</code> is safer for other types
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-green-600 text-xl mr-2">✓</span>
                                    <div>
                                        <span className="font-semibold">Numeric or string checks:</span> Be explicit with <code className="text-sm bg-green-100 px-1 rounded">value &gt; 0</code> or <code className="text-sm bg-green-100 px-1 rounded">value.length &gt; 0</code> rather than relying on truthy/falsy behavior
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-green-600 text-xl mr-2">✓</span>
                                    <div>
                                        <span className="font-semibold">Type conversion:</span> Use <code className="text-sm bg-green-100 px-1 rounded">!!</code> when you explicitly want to convert to boolean
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h3 className="font-bold text-lg text-yellow-800 mb-2">Common Pitfalls to Avoid</h3>

                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <span className="text-yellow-600 text-xl mr-2">⚠️</span>
                                    <div>
                                        <span className="font-semibold">Using && with non-boolean values:</span> Can lead to rendering unwanted values like 0, empty strings
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-yellow-600 text-xl mr-2">⚠️</span>
                                    <div>
                                        <span className="font-semibold">Complex nested ternaries:</span> Can become hard to read and maintain
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-yellow-600 text-xl mr-2">⚠️</span>
                                    <div>
                                        <span className="font-semibold">Forgetting null/undefined checks:</span> Always verify that objects exist before accessing their properties
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-bold text-lg text-blue-800 mb-2">Real-World Example</h3>

                            <div className="bg-gray-900 text-gray-100 p-3 rounded mb-3 overflow-x-auto">
                                <pre className="font-mono text-xs whitespace-pre">{`// Combining operators in a real-world React component
function UserProfile({ user, isLoading }) {
  return (
    <div>
      {isLoading 
        ? <LoadingSpinner /> 
        : (
          <>
            {user ? (
              <div>
                <h2>{user.name}</h2>
                {/* Safe usage of && with boolean */}
                {user.isAdmin && <AdminBadge />}
                
                {/* Better practice with potentially non-boolean */}
                {!!user.notifications.length && <NotificationBell />}
                
                {/* Clear ternary for conditional rendering */}
                {user.posts.length > 0 
                  ? <UserPosts posts={user.posts} /> 
                  : <NoPosts />}
              </div>
            ) : <NotLoggedIn />}
          </>
        )}
    </div>
  );
}`}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestTernaryOrAndOperator;

// BooleanValue component for rendering boolean values nicely
const BooleanValue = ({ value }: { value: boolean }) => (
    <span className={`font-semibold ${value ? 'text-green-600' : 'text-red-600'}`}>
        {value.toString()}
    </span>
);

interface ComparisonValue {
    code: string;
    result: any;
    isGood: boolean;
    note?: string;
}

interface ComparisonRowProps {
    scenario: string;
    code: string;
    values: ComparisonValue[];
}

// Component for a row in the comparison table
const ComparisonRow = ({ scenario, code, values }: ComparisonRowProps) => {
    return (
        <div className="grid grid-cols-4 gap-4 mb-6 border-b pb-4">
            {/* Scenario Column */}
            <div>
                <div className="font-semibold text-sm mb-1">{scenario}</div>
                <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                    {code}
                </div>
            </div>

            {/* Value Columns (Ternary, &&, !!) */}
            {values.map((value, index) => (
                <div key={index} className={`p-2 rounded-lg ${value.isGood ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-gray-800 text-white p-1.5 rounded text-xs font-mono w-full">
                            {value.code}
                        </div>
                        <span className={`ml-1 px-1 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${value.isGood ? 
                            'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                            {value.isGood ? '✓' : '⚠️'}
                        </span>
                    </div>

                    <div className="my-2">
                        <span className="text-xs font-semibold">Result: </span>
                        <span className="px-2 py-1 bg-white rounded border inline-block min-h-[1.5rem]">
                            {value.result !== undefined ? (
                                typeof value.result === 'boolean' ?
                                    value.result.toString() :
                                    value.result
                            ) : "undefined"}
                        </span>
                    </div>

                    {value.note && (
                        <div className="text-xs italic mt-1 text-gray-700">
                            Note: {value.note}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
