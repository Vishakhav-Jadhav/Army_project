
import React, { useState } from 'react';
import { Users, FileText, GraduationCap, TrendingUp, ChevronDown } from 'lucide-react';

// --- 1. TypeScript Interfaces & Types ---

interface DashboardStats {
    totalStudents: number;
    totalTests: number;
    activeBatches: number;
    averageScore: number;
}

interface ChartDataPoint {
    month?: string;
    tests?: number;
    students?: number;
    range?: string;
    count?: number;
    [key: string]: any; // Allows dynamic data key access
}

interface TestResult {
    studentName: string;
    testId: number;
    score: number;
    totalScore: number;
    completedAt: number;
}

interface BatchOption {
    value: string;
    label: string;
}

interface TableColumn<T> {
    key: keyof T | string; // keyof T for strict typing if T is known, string for dynamic
    header: string;
    render?: (row: T) => React.ReactNode;
}

// --- 2. Mock Data (Internal Definition) ---

const dashboardStats: DashboardStats = {
    totalStudents: 1450,
    totalTests: 18,
    activeBatches: 5,
    averageScore: 78.5,
};

const chartData: ChartDataPoint[] = [
    { month: 'Jan', tests: 4, students: 200 },
    { month: 'Feb', tests: 7, students: 350 },
    { month: 'Mar', tests: 12, students: 600 },
    { month: 'Apr', tests: 15, students: 850 },
    { month: 'May', tests: 17, students: 1000 },
    { month: 'Jun', tests: 18, students: 1250 },
];

const scoreDistribution: ChartDataPoint[] = [
    { range: '0-20%', count: 50 },
    { range: '21-40%', count: 150 },
    { range: '41-60%', count: 400 },
    { range: '61-80%', count: 650 },
    { range: '81-100%', count: 200 },
];

const testResults: TestResult[] = [
    { studentName: 'Alex Johnson', testId: 101, score: 92, totalScore: 100, completedAt: Date.now() - 86400000 * 2 },
    { studentName: 'Mia Chen', testId: 103, score: 75, totalScore: 100, completedAt: Date.now() - 86400000 * 1 },
    { studentName: 'Ben Davis', testId: 102, score: 88, totalScore: 100, completedAt: Date.now() - 86400000 * 3 },
    { studentName: 'Sara Lee', testId: 101, score: 64, totalScore: 100, completedAt: Date.now() - 86400000 * 5 },
    { studentName: 'Chris Wong', testId: 103, score: 78, totalScore: 100, completedAt: Date.now() - 86400000 * 6 },
    { studentName: 'Laura Smith', testId: 102, score: 95, totalScore: 100, completedAt: Date.now() - 86400000 * 7 },
];


// --- 3. UI Components (Card, StatCard, Table, Chart) ---

// General Card Container
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 ${className}`}>
        {children}
    </div>
);

// Stat Card Component
const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, trend?: string }> = ({ title, value, icon, trend }) => (
    <Card className="hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                {trend && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">{trend}</p>
                )}
            </div>
            <div className={`p-4 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400`}>
                {icon}
            </div>
        </div>
    </Card>
);

// Generic Table Component
const Table: React.FC<{ columns: TableColumn<any>[], data: any[], title: string }> = ({ columns, data, title }) => (
    <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key as string}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {columns.map((col) => (
                            <td 
                                key={col.key as string}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                            >
                                {col.render ? col.render(row) : row[col.key as string]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


// Helper function for SVG Path generation (Line/Area Chart)
const generatePath = (data: ChartDataPoint[], dataKey: string, maxVal: number, svgHeight: number, svgWidth: number, type: 'area' | 'line'): string => {
    if (!data || data.length === 0) return '';
    const numPoints = data.length;
    const paddingX = 5;
    const stepX = (svgWidth - 2 * paddingX) / (numPoints - 1);

    const getCoord = (d: ChartDataPoint, index: number) => {
        const x = paddingX + index * stepX;
        // Map the data value to SVG y-coordinate (inverted scale)
        const value = d[dataKey] as number;
        const y = svgHeight - (value / maxVal) * svgHeight * 0.9; 
        return { x, y: y < 0 ? 0 : y }; 
    };

    let pathD = data.map((d, index) => {
        const { x, y } = getCoord(d, index);
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    if (type === 'area' && data.length > 0) {
        const first = getCoord(data[0], 0);
        const last = getCoord(data[data.length - 1], data.length - 1);
        pathD += ` L ${last.x.toFixed(2)} ${svgHeight.toFixed(2)} L ${first.x.toFixed(2)} ${svgHeight.toFixed(2)} Z`;
    }

    return pathD;
};


// Generic Chart Component (Mock Visualization using CSS/SVG)
const Chart: React.FC<{ type: 'bar' | 'line', data: ChartDataPoint[], dataKey: string, xAxisKey: string, height?: number }> = ({ type, data, dataKey, xAxisKey, height = 300 }) => {
    if (!data || data.length === 0) return <div className="text-center text-gray-500">No data available.</div>;

    const maxDataValue = Math.max(...data.map(d => d[dataKey] as number));
    const svgHeight = height - 20; // Adjusted for padding/labels

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <div className="relative h-full pt-4">
                {/* Y-Axis Labeling (Mock) */}
                <div className="absolute left-0 bottom-0 top-0 w-full flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500 pr-2">
                    <span>{maxDataValue}</span>
                    <span className="self-start">0</span>
                </div>
                
                <div className="absolute left-6 right-0 bottom-0 top-0 pb-4">
                    {/* Bar Chart Implementation */}
                    {type === 'bar' && (
                        <div className="h-full w-full flex items-end space-x-4 border-l border-b border-gray-300 dark:border-gray-600 pl-2">
                            {data.map((d, index) => {
                                const barHeight = ((d[dataKey] as number) / maxDataValue) * 90; // Max 90% of container height
                                return (
                                    <div key={index} className="flex-1 h-full flex flex-col justify-end items-center">
                                        <div 
                                            className="w-4 sm:w-6 bg-teal-500 dark:bg-teal-500 rounded-t-sm transition-all duration-500 hover:bg-teal-400 dark:hover:bg-teal-400"
                                            style={{ height: `${barHeight}%` }}
                                            title={`${d[xAxisKey]}: ${d[dataKey]}`}
                                        ></div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    {/* Line Chart Implementation (using SVG) */}
                    {type === 'line' && (
                        <div className="h-full w-full relative border-l border-b border-gray-300 dark:border-gray-600">
                            {/* The viewBox is relative, using 100 for width to allow proportional path generation */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox={`0 0 100 ${svgHeight}`} preserveAspectRatio="none">
                                <g transform={`translate(0, 0)`}>
                                    <path
                                        d={generatePath(data, dataKey, maxDataValue, svgHeight, 100, 'area')}
                                        fill="url(#areaGradient)"
                                        stroke="none"
                                        className="transition-opacity duration-1000"
                                        style={{ opacity: 0.7 }}
                                    />
                                    <path
                                        d={generatePath(data, dataKey, maxDataValue, svgHeight, 100, 'line')}
                                        fill="none"
                                        stroke="#10B981" // Teal color
                                        strokeWidth="3"
                                        className="transition-all duration-1000"
                                    />
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="100%">
                                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.6}/>
                                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.05}/>
                                        </linearGradient>
                                    </defs>
                                </g>
                            </svg>
                        </div>
                    )}

                    {/* X-Axis Labels */}
                    <div className="absolute bottom-0 left-6 right-0 flex justify-between text-xs text-gray-600 dark:text-gray-400 pt-1 px-1">
                        {data.map((d, index) => (
                            // transform-translate is used to center the label under the bar/point
                            <span key={index} className="flex-1 text-center truncate">{d[xAxisKey]}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- 4. Main App Component (Renamed from Dashboard) ---

const App: React.FC = () => {
    // Column definitions for the recent results table
    const recentResultsColumns: TableColumn<TestResult>[] = [
        { key: 'studentName', header: 'Student' },
        { key: 'testId', header: 'Test', render: (result) => `Test ${result.testId}` },
        {
            key: 'score',
            header: 'Score',
            render: (result) => <span className={`font-medium ${result.score > 80 ? 'text-teal-600 dark:text-teal-400' : 'text-orange-500 dark:text-orange-300'}`}>{`${result.score}/${result.totalScore}`}</span>
        },
        {
            key: 'completedAt',
            header: 'Completed',
            render: (result) => new Date(result.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
    ];

    // Mock state for the Batch selector
    const batchOptions: BatchOption[] = [
        { value: 'all', label: 'All Batches' },
        { value: 'b1', label: 'B1 Trainees' },
        { value: 'b2', label: 'B2 Cadets' },
    ];
    const [selectedBatch, setSelectedBatch] = useState<BatchOption>(batchOptions[0]);
    const [showBatchOptions, setShowBatchOptions] = useState<boolean>(false);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header and Controls */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        Student Analytics Dashboard
                    </h1>
                    
                    {/* Batch Selector */}
                    <div className="relative w-full sm:w-48 z-10">
                        <button
                            onClick={() => setShowBatchOptions(!showBatchOptions)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-teal-500 rounded-lg text-left flex items-center justify-between text-teal-600 font-semibold hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors shadow-md"
                        >
                            <span className="truncate">{selectedBatch.label}</span>
                            <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showBatchOptions ? 'rotate-180' : ''}`} />
                        </button>
                        {showBatchOptions && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                {batchOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => { setSelectedBatch(option); setShowBatchOptions(false); }}
                                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedBatch.value === option.value 
                                            ? 'bg-teal-50 dark:bg-teal-900 text-teal-600 dark:text-teal-400 font-bold' 
                                            : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Students"
                        value={dashboardStats.totalStudents.toLocaleString()}
                        icon={<Users className="w-6 h-6" />}
                        trend="+12% from last month"
                    />
                    <StatCard
                        title="Active Tests"
                        value={dashboardStats.totalTests}
                        icon={<FileText className="w-6 h-6" />}
                        trend="+8% from last month"
                    />
                    <StatCard
                        title="Active Batches"
                        value={dashboardStats.activeBatches}
                        icon={<GraduationCap className="w-6 h-6" />}
                        trend="+3% from last month"
                    />
                    <StatCard
                        title="Average Score"
                        value={`${dashboardStats.averageScore}%`}
                        icon={<TrendingUp className="w-6 h-6" />}
                        trend="+2.5% from last month"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Student Enrollment Growth
                        </h2>
                        <Chart
                            type="line"
                            data={chartData}
                            dataKey="students"
                            xAxisKey="month"
                            height={350}
                        />
                    </Card>

                    <Card>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Score Distribution (by Count)
                        </h2>
                        <Chart
                            type="bar"
                            data={scoreDistribution}
                            dataKey="count"
                            xAxisKey="range"
                            height={350}
                        />
                    </Card>
                </div>

                {/* Recent Results Table */}
                <Card className="col-span-full">
                    <Table
                        title="Recent Test Results"
                        columns={recentResultsColumns}
                        data={testResults}
                    />
                </Card>
            </div>
        </div>
    );
};

export default App;
