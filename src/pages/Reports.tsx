
import React, { useState } from 'react';
import { Download, ChevronDown, FileText } from 'lucide-react';

// --- Type Definitions ---
interface BatchOption {
    id: string;
    name: string;
}

interface CandidateResult {
    id: number;
    name: string;
    candidateId: string;
    score: number;
}

interface ChartDataItem {
    label: string;
    value: number;
    isHighlight: boolean;
}

interface ReportData {
    results: CandidateResult[];
    chart: ChartDataItem[];
}

// --- Dummy Data (Typed) ---
const batchOptions: BatchOption[] = [
    { id: 'b1', name: 'B1 Trainees' },
    { id: 'b2', name: 'B2 Cadets' },
];

const mockCandidateResults: CandidateResult[] = [
    { id: 1, name: 'Candidate 1', candidateId: '12345', score: 90 },
    { id: 2, name: 'Candidate 2', candidateId: '12345', score: 80 },
    { id: 3, name: 'Candidate 3', candidateId: '12345', score: 70 },
    { id: 4, name: 'Candidate 4', candidateId: '12345', score: 60 },
    { id: 5, name: 'Candidate 5', candidateId: '12345', score: 50 },
];

const mockChartData: ChartDataItem[] = [
    { label: 'Sat', value: 50, isHighlight: false },
    { label: 'Sun', value: 20, isHighlight: false },
    { label: 'Mon', value: 40, isHighlight: false },
    { label: 'Tue', value: 10, isHighlight: false },
    { label: 'Wed', value: 30, isHighlight: false },
    { label: 'Thu', value: 5, isHighlight: false },
    { label: 'Fri', value: 100, isHighlight: true }, // Highlighted bar
    { label: 'Sat', value: 65, isHighlight: false },
    { label: 'Sun', value: 40, isHighlight: false },
    { label: 'Mon', value: 30, isHighlight: false },
    { label: 'Tue', value: 15, isHighlight: false },
    { label: 'Wed', value: 55, isHighlight: false },
    { label: 'Thu', value: 20, isHighlight: false },
    { label: 'Fri', value: 35, isHighlight: false },
];

// --- Simple Utility Components (Replicating imported UI components) ---

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 ${className}`}>
        {children}
    </div>
);

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-semibold transition-colors shadow-lg shadow-teal-500/50 hover:shadow-teal-600/60 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
        {children}
    </button>
);

interface TableProps {
    data: CandidateResult[];
}

const Table: React.FC<TableProps> = ({ data }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">
                        #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
                        ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
                        Score
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.candidateId}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold">
                            <span className={item.score >= 80 ? 'text-teal-600' : 'text-gray-700 dark:text-gray-200'}>
                                {item.score}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

interface SimpleBarChartProps {
    data: ChartDataItem[];
}

// Simple Bar Chart Simulation (Matching the visual style of the screenshot)
const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
    // const maxValue = Math.max(...data.map(d => d.value)); // Unused, but keep for context

    return (
        <Card className="p-4 pt-12 relative overflow-hidden h-72">
            {/* Title and Dropdown */}
            <div className="absolute top-0 left-0 right-0 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                 <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Reports</h2>
                 <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>

            {/* Y-Axis Labels (Simulated) */}
            <div className="absolute left-2 top-8 bottom-4 w-8 text-xs text-gray-500 dark:text-gray-400 flex flex-col justify-between pt-6 pb-6">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
            </div>

            {/* Chart Area */}
            <div className="h-full flex items-end ml-10 space-x-4">
                {data.map((d, index) => (
                    <div key={index} className="flex flex-col items-center justify-end h-full flex-grow group">
                        {/* Bar */}
                        <div
                            className={`w-4 rounded-t-sm transition-all duration-300 ${
                                d.isHighlight ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-teal-400'
                            }`}
                            style={{ height: `${(d.value / 100) * 80}%`, minHeight: '5px' }}
                            title={`${d.label}: ${d.value}%`}
                        ></div>
                        {/* X-Axis Label */}
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{d.label}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// --- Main Reports Component ---

const Reports: React.FC = () => {
    // State initialization with explicit types
    const [selectedBatch, setSelectedBatch] = useState<BatchOption | null>(null);
    const [showBatchOptions, setShowBatchOptions] = useState<boolean>(false);
    const [reportData, setReportData] = useState<ReportData | null>(null);

    // Function with typed parameter
    const handleSelectBatch = (batch: BatchOption) => {
        setSelectedBatch(batch);
        setShowBatchOptions(false);
        setReportData(null); // Clear data when batch changes
    };

    const handleShowReport = () => {
        if (selectedBatch) {
            // Simulate loading data based on the selected batch
            console.log(`Loading report for batch: ${selectedBatch.name}`);
            setReportData({
                results: mockCandidateResults,
                chart: mockChartData
            });
        }
    };
    
    const handleDownloadReport = () => {
        // Simulate download
        // NOTE: Replaced original 'alert()' with console.log for compliance.
        console.log(`[DOWNLOAD SIMULATION] Triggering download for Batch: ${selectedBatch?.name || 'N/A'}`);
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-10 min-h-screen font-inter">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Reports</h1>
                
                {/* 1. Batch Selection Area (Top Card) */}
                <Card>
                    <div className="relative z-10">
                        {/* Select Dropdown Button */}
                        <button
                            onClick={() => setShowBatchOptions(!showBatchOptions)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left flex items-center justify-between hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                        >
                            <span className={selectedBatch ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}>
                                {selectedBatch ? selectedBatch.name : 'Select Batch'}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${showBatchOptions ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Options */}
                        {showBatchOptions && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-20">
                                {batchOptions.map((batch: BatchOption) => (
                                    <button
                                        key={batch.id}
                                        onClick={() => handleSelectBatch(batch)}
                                        className="w-full px-4 py-3 text-left hover:bg-teal-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0 text-gray-900 dark:text-white transition-colors"
                                    >
                                        {batch.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Show Report Button */}
                <Button
                    onClick={handleShowReport}
                    className={`text-white w-full ${!selectedBatch ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-teal-600 hover:bg-teal-700'}`}
                    disabled={!selectedBatch}
                >
                    <FileText className="w-5 h-5" />
                    <span>Show Report</span>
                </Button>

                {/* Report Content (Visible after clicking Show Report) */}
                {reportData && (
                    <div className="space-y-8">
                        {/* 2. Detailed Results Table (Matches screenshot table style) */}
                        <Card className="p-0 overflow-hidden">
                             <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Candidate Scores</h2>
                            </div>
                            <Table data={reportData.results} />
                        </Card>

                        {/* 3. Performance Chart (Matches screenshot chart style) */}
                        <SimpleBarChart data={reportData.chart} />

                        {/* 4. Download Button (Bottom of the page) */}
                        <Button
                            onClick={handleDownloadReport}
                            className="bg-teal-600 text-white w-full"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Comprehensive Report</span>
                        </Button>
                    </div>
                )}
                
                {!reportData && selectedBatch && (
                     <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                         Report generated for **{selectedBatch.name}**. Click "Show Report" above to display the results.
                     </div>
                )}
                
                {!reportData && !selectedBatch && (
                    <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                        Select a batch from the dropdown to begin viewing performance metrics.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;

