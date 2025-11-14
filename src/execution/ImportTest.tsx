

import React, { useState, useRef } from 'react';
import { ChevronDown, Upload, FileText, X } from 'lucide-react';

// --- Type Definitions ---
type OptionType = { 
    value: string; 
    label: string; 
};

type ModalState = { 
    isOpen: boolean; 
    title: string; 
    message: string; 
};

type ReportContext = { 
    selectedQPaper: string; 
    selectedBatch: string; 
    fileCount: number; 
};

type Stage = 'import' | 'processing' | 'report';


// --- Custom Components ---

interface CustomModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

// Reusable Modal Component to replace alert()
const CustomModal: React.FC<CustomModalProps> = ({ isOpen, title, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

interface CustomDropdownProps {
    label: string;
    options: OptionType[];
    selectedValue: string;
    onSelect: (option: OptionType) => void;
    isOpen: boolean;
    onToggle: () => void;
}

// Custom Dropdown for aesthetic consistency
const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, options, selectedValue, onSelect, isOpen, onToggle }) => (
    <div className="relative z-20">
        <button
            onClick={onToggle}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left flex items-center justify-between hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
        >
            <span className={selectedValue ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}>
                {selectedValue || label}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-30 overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => onSelect(option)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
);


// --- View Components ---

interface ImportTestViewProps {
    qPaperOptions: OptionType[];
    batchOptions: OptionType[];
    onGenerateReport: (context: ReportContext) => void;
}

// 1. Import Test View
const ImportTestView: React.FC<ImportTestViewProps> = ({ qPaperOptions, batchOptions, onGenerateReport }) => {
    const [selectedQPaper, setSelectedQPaper] = useState<string>('');
    const [selectedBatch, setSelectedBatch] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const [showQPaperOptions, setShowQPaperOptions] = useState<boolean>(false);
    const [showBatchOptions, setShowBatchOptions] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [modal, setModal] = useState<ModalState>({ isOpen: false, title: '', message: '' });

    const selectQPaper = (option: OptionType) => {
        setSelectedQPaper(option.label);
        setShowQPaperOptions(false);
    };

    const selectBatch = (option: OptionType) => {
        setSelectedBatch(option.label);
        setShowBatchOptions(false);
    };

    // File Drag/Drop Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files) as File[];
            setUploadedFiles(prev => [...prev, ...files]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Ensure e.target.files is not null before converting to Array
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploadedFiles(prev => [...prev, ...files]);
        }
    };

    const handleBrowseFiles = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    const handleGenerate = () => {
        if (!selectedQPaper || !selectedBatch || uploadedFiles.length === 0) {
            setModal({
                isOpen: true,
                title: 'Missing Requirements',
                message: 'Please select a Question Set, a Batch, and upload at least one file to generate the report.'
            });
            return;
        }

        // Pass selected context to the main app component
        const context: ReportContext = { selectedQPaper, selectedBatch, fileCount: uploadedFiles.length };
        onGenerateReport(context);
    };

    const handleCancel = () => {
        setSelectedQPaper('');
        setSelectedBatch('');
        setShowQPaperOptions(false);
        setShowBatchOptions(false);
        setUploadedFiles([]);
    };

    return (
        <div className="max-w-xl mx-auto">
            <CustomModal 
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, isOpen: false })}
            />
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">
                Import Test Files
            </h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
                <div className="space-y-6 mb-8">
                    {/* Select Question Set */}
                    <CustomDropdown
                        label="Select Question Set"
                        options={qPaperOptions}
                        selectedValue={selectedQPaper}
                        onSelect={selectQPaper}
                        isOpen={showQPaperOptions}
                        onToggle={() => {
                            setShowQPaperOptions(!showQPaperOptions);
                            setShowBatchOptions(false);
                        }}
                    />

                    {/* Select Batch */}
                    <CustomDropdown
                        label="Select Batch"
                        options={batchOptions}
                        selectedValue={selectedBatch}
                        onSelect={selectBatch}
                        isOpen={showBatchOptions}
                        onToggle={() => {
                            setShowBatchOptions(!showBatchOptions);
                            setShowQPaperOptions(false);
                        }}
                    />
                </div>

                {/* Drag and Drop File Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-6 ${
                        dragActive 
                            ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20' 
                            : 'border-teal-300 bg-gray-50 dark:bg-gray-800'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <Upload className="w-10 h-10 text-teal-500 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Drag And Drop Answer Files Here
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Or</p>
                    <button
                        onClick={handleBrowseFiles}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md shadow-teal-500/50"
                    >
                        Browse Files
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                    />
                </div>

                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                            Uploaded Files ({uploadedFiles.length}):
                        </h3>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded-lg">
                                    <span>• {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                    <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 ml-3">
                                        <X className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-8">
                    <button
                        onClick={handleGenerate}
                        className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg shadow-lg shadow-teal-500/50"
                    >
                        Generate Report
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ProcessingViewProps {
    onReportsReady: () => void;
}

// 2. Processing Screen View
const ProcessingView: React.FC<ProcessingViewProps> = ({ onReportsReady }) => {
    return (
        <div className="max-w-md mx-auto text-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
            {/* Hourglass Icon - using a placeholder for the animated image */}
            <div className="mx-auto w-16 h-16 mb-6">
                <div className="relative w-full h-full">
                    {/* Animated Spinner Placeholder */}
                    <svg className="animate-spin w-full h-full text-teal-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" strokeDasharray="282.74 282.74" strokeDashoffset="282.74" strokeLinecap="round" transform="rotate(-90 50 50)"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-teal-700" />
                    </div>
                </div>
            </div>

            <p className="text-xl font-medium text-gray-900 dark:text-white">
                Processing Files...
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Generating Reports...
            </p>

            <button
                onClick={onReportsReady}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-lg shadow-teal-500/50 text-lg"
            >
                View Reports
            </button>
        </div>
    );
};

interface ReportViewProps {
    reportContext: ReportContext | null;
    onBackToImport: () => void;
}

// 3. Final Report View
const ReportView: React.FC<ReportViewProps> = ({ reportContext, onBackToImport }) => {
    // Mock Data and Assert that reportContext is not null
    const context = reportContext || { selectedQPaper: 'N/A', selectedBatch: 'N/A', fileCount: 0 };
    
    const mockData = [
        { id: '01', name: 'Candidate A', score: 85 },
        { id: '02', name: 'Candidate B', score: 72 },
        { id: '03', name: 'Candidate C', score: 91 },
        { id: '04', name: 'Candidate D', score: 68 },
    ];
    
    // Mock Chart Data for visualization
    const chartBars: number[] = [45, 60, 30, 80, 55, 70, 40, 65]; 

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
                Test Reports
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Results for **{context.selectedQPaper}** in **{context.selectedBatch}**
            </p>

            {/* Back Button */}
            <button
                onClick={onBackToImport}
                className="mb-6 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                ← Back to Import
            </button>

            {/* Report Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 space-y-8">
                
                {/* Score Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider rounded-tl-lg">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider rounded-tr-lg">ID</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {mockData.map((candidate, index) => (
                                <tr key={candidate.id} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{candidate.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{candidate.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-teal-600">{candidate.score}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">12345</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Score Chart Visualization */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Batch Performance Overview</h3>
                    <div className="h-64 flex items-end justify-around space-x-2 border-l border-b border-gray-300 dark:border-gray-500 pb-2">
                        {chartBars.map((height, index) => (
                            <div 
                                key={index} 
                                className="relative w-6 bg-teal-500 rounded-t-sm transition-all duration-500 hover:bg-teal-400"
                                style={{ height: `${height}%` }}
                                title={`${height}% score`}
                            >
                                {/* Mock Data Label */}
                                <span className="absolute -top-6 text-xs text-gray-700 dark:text-gray-300 transform -translate-x-1/2 left-1/2">{height}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-around text-xs text-gray-500 dark:text-gray-400 pt-1">
                        {['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'].map(label => (
                            <span key={label} className="w-6 text-center">{label}</span>
                        ))}
                    </div>
                </div>

                {/* Download Button */}
                <button
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-lg shadow-teal-500/50 text-lg mt-6"
                >
                    Download Full Report
                </button>
            </div>
        </div>
    );
};


// 4. Main App Component (Controller)
const AssessmentSystem: React.FC = () => {
    // Stage: 'import', 'processing', 'report'
    const [stage, setStage] = useState<Stage>('import');
    const [reportContext, setReportContext] = useState<ReportContext | null>(null); // Stores QPaper and Batch for report view

    const qPaperOptions: OptionType[] = [
        { value: 'set1', label: 'Set 1' },
        { value: 'set2', label: 'Set 2' },
    ];

    const batchOptions: OptionType[] = [
        { value: 'b1_trainees', label: 'B1 Trainees' },
        { value: 'b2_cadets', label: 'B2 Cadets' },
    ];

    const handleGenerateReport = (context: ReportContext) => {
        setReportContext(context);
        setStage('processing');
    };

    const handleReportsReady = () => {
        // This is where clicking "View Reports" transitions to the final view
        setStage('report');
    };

    const renderContent = () => {
        switch (stage) {
            case 'import':
                return (
                    <ImportTestView 
                        qPaperOptions={qPaperOptions}
                        batchOptions={batchOptions}
                        onGenerateReport={handleGenerateReport}
                    />
                );
            case 'processing':
                return (
                    <ProcessingView 
                        onReportsReady={handleReportsReady} 
                    />
                );
            case 'report':
                return (
                    <ReportView 
                        reportContext={reportContext}
                        onBackToImport={() => setStage('import')}
                    />
                );
            default:
                // Ensure exhaustive checking, though TypeScript Stage type prevents this normally
                return null;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-10 font-sans">
            {renderContent()}
        </div>
    );
};

export default AssessmentSystem;
