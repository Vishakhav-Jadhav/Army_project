

import React, { useState } from 'react';
import { ChevronDown, FileText, X, Eye, EyeOff } from 'lucide-react'; // Added Eye and EyeOff

// Custom Modal component to replace the alert() function
const CustomModal = ({ isOpen, title, message, onClose }: { isOpen: boolean, title: string, message: string, onClose: () => void }) => {
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

// Custom Dropdown component to match the styling
const CustomDropdown = ({ label, options, selectedValue, onSelect, isOpen, onToggle }: { label: string, options: {value: string, label: string}[], selectedValue: string, onSelect: (option: {value: string, label: string}) => void, isOpen: boolean, onToggle: () => void }) => (
    <div className="relative z-20">
        <button
            onClick={onToggle}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left flex items-center justify-between hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
        >
            <span className={selectedValue ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}>
                {selectedValue || label}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-30 overflow-hidden">
                <p className="px-4 pt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                <div className="divide-y divide-gray-100 dark:divide-gray-700 mt-1 pb-1">
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


const GenerateTest: React.FC = () => {
    const [selectedQPaper, setSelectedQPaper] = useState<string>('');
    const [selectedBatch, setSelectedBatch] = useState<string>('');
    const [masterPassword, setMasterPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false); // New state for password visibility

    // Dropdown state
    const [showQPaperOptions, setShowQPaperOptions] = useState<boolean>(false);
    const [showBatchOptions, setShowBatchOptions] = useState<boolean>(false);

    // Modal state for error/success messages
    const [modal, setModal] = useState<{isOpen: boolean, title: string, message: string}>({ isOpen: false, title: '', message: '' });


    const qPaperOptions = [
        { value: 'test1', label: 'Set 1' },
        { value: 'test2', label: 'Set 2' },
    ];

    const batchOptions = [
        { value: 'b1 trainees', label: 'B1 Trainees' },
        { value: 'b2 cadets', label: 'B2 Cadets' },
    ];

    const selectQPaper = (option: {value: string, label: string}) => {
        setSelectedQPaper(option.label);
        setShowQPaperOptions(false);
    };

    const selectBatch = (option: {value: string, label: string}) => {
        setSelectedBatch(option.label);
        setShowBatchOptions(false);
    };

    const handleDownload = () => {
        if (!selectedQPaper || !selectedBatch || !masterPassword) {
            setModal({
                isOpen: true,
                title: 'Missing Information',
                message: 'Please select a Question Set, a Batch, and enter the Master Password to proceed.'
            });
            return;
        }

        // Simulating the file download process
        setModal({
            isOpen: true,
            title: 'Download Initiated',
            message: `The test file for Question Set: ${selectedQPaper} and Batch: ${selectedBatch} is now downloading.`
        });
        
        // In a real application, you would trigger a file download API here.
        console.log(`Downloading test for Q Paper: ${selectedQPaper}, Batch: ${selectedBatch}`);
    };

    const handleCancel = () => {
        setSelectedQPaper('');
        setSelectedBatch('');
        setMasterPassword('');
        setShowQPaperOptions(false);
        setShowBatchOptions(false);
        setShowPassword(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-10 font-sans min-h-screen">
            <CustomModal 
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, isOpen: false })}
            />

            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">
                    Generate Test File
                </h1>

                {/* Main Card Container */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 border border-gray-100 dark:border-gray-700">
                    <div className="space-y-6">
                        
                        {/* Select Question Set Dropdown */}
                        <CustomDropdown
                            label="Select Question Set"
                            options={qPaperOptions}
                            selectedValue={selectedQPaper}
                            onSelect={selectQPaper}
                            isOpen={showQPaperOptions}
                            onToggle={() => {
                                setShowQPaperOptions(!showQPaperOptions);
                                setShowBatchOptions(false); // Close other dropdown
                            }}
                        />

                        {/* Select Batch Dropdown */}
                        <CustomDropdown
                            label="Select Batch"
                            options={batchOptions}
                            selectedValue={selectedBatch}
                            onSelect={selectBatch}
                            isOpen={showBatchOptions}
                            onToggle={() => {
                                setShowBatchOptions(!showBatchOptions);
                                setShowQPaperOptions(false); // Close other dropdown
                            }}
                        />

                        {/* Master Password Input - MODIFIED */}
                        <div className="relative"> {/* Added relative container */}
                            <input
                                // Toggle between 'password' and 'text'
                                type={showPassword ? "text" : "password"} 
                                value={masterPassword}
                                onChange={(e) => setMasterPassword(e.target.value)}
                                placeholder="Enter Master Password"
                                // Added pr-12 padding for the icon
                                className="w-full pr-12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                            />
                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-8">
                        <button
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-lg shadow-teal-500/50"
                        >
                            <FileText className="w-5 h-5 mr-2" />
                            Download Test
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateTest;
