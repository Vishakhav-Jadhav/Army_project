import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, X, AlertCircle, ChevronDown, CheckCircle, Radio, CheckSquare, ListPlus } from 'lucide-react'; 

// --- Type Definitions ---

type QuestionType = 'multiple-choice' | 'yes-no' | 'multi-select';

/** Structured option for a question. Note: isCorrect is removed as per user request for pattern creation. */
interface Option {
    text: string;
    isCorrect: boolean;
}

/** Structured question for a test. */
interface Question {
    id: number;
    text: string;
    type: QuestionType; // Added type property
    options: Option[];
}

/** Definition for a Test item stored in the bank. */
interface Test {
    id: number;
    title: string;
    questions?: Question[];
}

/** Definition for the notification system status message. */
interface StatusMessage {
    type: 'success' | 'error' | 'info';
    text: string;
}

/** Definition for the Table column structure. */
interface TableColumn {
    key: string;
    header: string;
    render?: (item: Test) => React.ReactNode;
}

/** Definition for the Table component props. */
interface TableProps {
    data: Test[];
    columns: TableColumn[];
}

/** Definition for the Button component props. */
interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary-teal' | 'ghost' | 'destructive' | 'outline-teal';
    size?: 'default' | 'sm';
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

/** Definition for the StatusAlert component props. */
interface StatusAlertProps {
    message: string | null | undefined;
    type: 'success' | 'error' | 'info' | undefined;
    onClose: () => void;
}


// --- Mock Data ---
const mockTests: Test[] = [
    { id: 1, title: 'Test Set 1' },
    { id: 2, title: 'Test Set 2' },
    { id: 3, title: 'Test Set 3' },
    { id: 4, title: 'Biology Exam Q4' },
    { id: 5, title: 'History Midterm' },
];

// --- Mock UI Components (Typed) ---

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
        {children}
    </div>
);

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary-teal', size = 'default', className = '', disabled = false, type = 'button' }) => {
    let baseStyle = 'px-4 py-2 font-semibold transition duration-150 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    if (variant === 'primary-teal') { 
        baseStyle += ' bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 shadow-md';
    } else if (variant === 'ghost') {
        baseStyle += ' bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-teal-500';
    } else if (variant === 'destructive') {
        baseStyle += ' bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md';
    } else if (variant === 'outline-teal') { 
        baseStyle += ' border border-teal-600 text-teal-600 bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 focus:ring-teal-500 shadow-md';
    }

    if (size === 'sm') {
        baseStyle = baseStyle.replace('px-4 py-2', 'px-3 py-1 text-sm');
    }

    return (
        <button type={type} className={`${baseStyle} ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

const Table: React.FC<TableProps> = ({ data, columns }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            {/* The header is hidden but needed for structure */}
            <thead className="hidden">
                <tr>
                    {columns.map((column) => (
                        <th key={column.key} className="p-0"></th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {data.map((item) => (
                    <tr key={item.id} className='hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150'>
                        {columns.map((column) => (
                            <td
                                key={column.key}
                                className={`py-3 px-4 text-sm text-gray-900 dark:text-gray-200 ${column.key === 'title' ? 'font-medium' : 'text-right'}`}
                            >
                                {column.render ? column.render(item) : (item as any)[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const StatusAlert: React.FC<StatusAlertProps> = ({ message, type, onClose }) => {
    if (!message) return null;
    
    let colorClasses = '';
    let Icon = AlertCircle;
    
    switch (type) {
      case 'success':
        colorClasses = 'bg-green-100 text-green-800 border-green-400 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300';
        Icon = CheckCircle;
        break;
      case 'error':
        colorClasses = 'bg-red-100 text-red-800 border-red-400 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300';
        Icon = AlertCircle;
        break;
      default: // info
        colorClasses = 'bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300';
        Icon = Edit;
        break;
    }

    return (
      <div className={`p-3 mb-4 rounded-lg border flex items-center justify-between ${colorClasses}`}>
        <div className='flex items-center'>
          <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
};

// --- Question List Preview Component ---

const QuestionListPreview: React.FC<{ questions: Question[] }> = ({ questions }) => {
    // Fallback if no questions are added yet, showing a demo question
    const demoQuestion: Question[] = [{
        id: 0,
        text: 'Is the earth flat? (Yes/No Question Demo)',
        type: 'yes-no',
        options: [{ text: 'Yes', isCorrect: false }, { text: 'No', isCorrect: true }]
    }];

    const displayQuestions = questions.length > 0 ? questions : demoQuestion; 

    const renderInputType = (type: QuestionType) => {
        switch(type) {
            case 'yes-no':
            case 'multiple-choice':
                return <Radio className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
            case 'multi-select':
                return <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
            default:
                return <Radio className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
        }
    };

    const renderOptionIndicator = (type: QuestionType, isCorrect: boolean) => {
        const baseClasses = 'w-3 h-3 border mr-2 transition-colors';
        if (type === 'multi-select') {
            // Checkbox look
            return <div className={`${baseClasses} rounded-sm ${isCorrect ? 'bg-teal-600 border-teal-600' : 'border-gray-400 dark:border-gray-500'}`}></div>;
        } else {
            // Radio look
            return <div className={`${baseClasses} rounded-full ${isCorrect ? 'bg-teal-600 border-teal-600' : 'border-gray-400 dark:border-gray-500'}`}></div>;
        }
    }

    return (
        <div className="space-y-4">
            {displayQuestions.map((q, qIndex) => (
                <div key={q.id} className="text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex justify-between items-center mb-2">
                         <p className="font-medium">{q.id === 0 ? '1.' : `${qIndex + 1}.`} {q.text}</p>
                         <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 capitalize flex items-center">
                            {renderInputType(q.type)}
                            <span className="ml-1">{q.type.replace('-', ' ')}</span>
                         </span>
                    </div>
                   
                    <ul className="space-y-1 pl-4 pt-2 border-t border-gray-100 dark:border-gray-600/50">
                        {q.options.map((option, oIndex) => (
                            <li key={oIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                                {renderOptionIndicator(q.type, option.isCorrect)}
                                <span>{option.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

// --- Question Input Form Component ---

const QuestionInputForm: React.FC<{
    questionIndex: number;
    questionType: QuestionType;
    setQuestionType: React.Dispatch<React.SetStateAction<QuestionType>>;
    currentQuestionText: string;
    setCurrentQuestionText: React.Dispatch<React.SetStateAction<string>>;
    currentOptions: Option[];
    setCurrentOptions: React.Dispatch<React.SetStateAction<Option[]>>; // Pass setter for dynamic options
    handleAddQuestion: () => void;
    setStatusMessage: React.Dispatch<React.SetStateAction<StatusMessage | null>>;
}> = ({
    questionIndex,
    questionType,
    setQuestionType,
    currentQuestionText,
    setCurrentQuestionText,
    currentOptions,
    setCurrentOptions,
    handleAddQuestion,
    setStatusMessage
}) => {
    
    // Handler for option text changes
    const handleOptionChange = (index: number, text: string) => {
        setCurrentOptions(prev => {
            const newOptions = [...prev];
            // Ensure the option object exists before updating text
            if (newOptions[index]) {
                 newOptions[index] = { ...newOptions[index], text };
            } else {
                 newOptions[index] = { text, isCorrect: false };
            }
            return newOptions;
        });
    };

    // Handler for selecting correct answer (radio for single, checkbox for multi)
    const handleCorrectChange = (index: number, isCorrect: boolean) => {
        if (questionType === 'multi-select') {
            setCurrentOptions(prev => prev.map((opt, i) =>
                i === index ? { ...opt, isCorrect } : opt
            ));
        } else {
            setCurrentOptions(prev => prev.map((opt, i) =>
                ({ ...opt, isCorrect: i === index })
            ));
        }
    };

    // Handler for adding a new customizable option (for MC/MS)
    const handleAddOption = () => {
        if (currentOptions.length < 10) {
            setCurrentOptions(prev => [...prev, { text: '', isCorrect: false }]);
        } else {
            setStatusMessage({ type: 'info', text: 'Maximum of 10 options allowed.' });
        }
    };

    // Handler for removing a customizable option (for MC/MS)
    const handleRemoveOption = (index: number) => {
        if (currentOptions.length > 2) {
             setCurrentOptions(prev => prev.filter((_, i) => i !== index));
        } else {
            setStatusMessage({ type: 'info', text: 'At least two options are required for this question type.' });
        }
    };

    // Effect to manage options when question type changes
    React.useEffect(() => {
        setStatusMessage(null);
        if (questionType === 'yes-no') {
            setCurrentOptions([
                { text: 'Yes', isCorrect: false },
                { text: 'No', isCorrect: false },
            ]);
        } else if (questionType === 'multiple-choice') {
            setCurrentOptions([
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
            ]);
        } else if (currentOptions.length < 2) {
             // Ensure at least two empty options for MS when switching
            setCurrentOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
        }
    }, [questionType, setCurrentOptions, setStatusMessage]);

    // Determine the icon and type for option inputs
    const InputIcon = questionType === 'multi-select' ? CheckSquare : Radio;

    return (
        <div className="p-4 mt-4 bg-white dark:bg-gray-900 border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-lg shadow-inner">
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">Question {questionIndex}. Define the pattern</p>
            
            {/* Question Type Selector */}
            <div className="mb-4">
                <label htmlFor="question-type" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Select Question Type
                </label>
                <select
                    id="question-type"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-teal-500 focus:border-teal-500 text-sm"
                >
                    <option value="multiple-choice">Multiple Choice </option>
                    <option value="yes-no">Yes/No</option>
                    <option value="multi-select">Checkbox-Type</option>
                </select>
            </div>

            {/* Question Text Input */}
            <div className='mb-6'>
                 <label htmlFor="question-text" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Question Text
                </label>
                <input
                    id="question-text"
                    type="text"
                    value={currentQuestionText}
                    onChange={(e) => setCurrentQuestionText(e.target.value)}
                    placeholder="Enter your question text here"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-teal-500 focus:border-teal-500 text-sm"
                />
            </div>

            {/* Options Input - CONDITIONAL RENDERING */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                <InputIcon className="w-4 h-4 mr-2" />
                Define Options and Correct Answers
            </label>
            <div className="space-y-3">
                {currentOptions.map((option, index) => (
                    <div key={index} className="flex items-center">
                        {/* Correct Answer Selector */}
                        {questionType === 'multi-select' ? (
                            <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={(e) => handleCorrectChange(index, e.target.checked)}
                                className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 mr-2"
                            />
                        ) : (
                            <input
                                type="radio"
                                name="correct-answer"
                                checked={option.isCorrect}
                                onChange={() => handleCorrectChange(index, true)}
                                className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 mr-2"
                            />
                        )}

                        <span className="text-sm font-medium mr-2 w-6">{index + 1}.</span>

                        <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            disabled={questionType === 'yes-no'} // Lock options for Yes/No
                            className="ml-0 w-full text-sm text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none border-b border-gray-200 dark:border-gray-700 pb-1 disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                        />

                        {/* Remove Button for customizable types */}
                        {(questionType === 'multi-select' && currentOptions.length > 2) && (
                            <Button
                                variant='ghost'
                                size='sm'
                                className='p-1 ml-2 text-red-500 hover:bg-red-50'
                                onClick={() => handleRemoveOption(index)}
                            >
                                <Trash2 className='w-4 h-4' />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Add Option Button for customizable types */}
            {(questionType === 'multi-select') && (
                <div className="mt-4">
                    <Button
                        variant="outline-teal"
                        size="sm"
                        onClick={handleAddOption}
                        className='flex items-center text-sm'
                        disabled={currentOptions.length >= 10}
                    >
                        <ListPlus className='w-4 h-4 mr-2' />
                        Add Option
                    </Button>
                </div>
            )}

            {/* Add Question Button */}
            <div className="mt-6 flex justify-end">
                <Button variant="primary-teal" onClick={handleAddQuestion} className='px-6 py-2'>
                    Add Question
                </Button>
            </div>
        </div>
    );
};


// --- Create Test Form (Refactored to include Question Builder) ---

const CreateTestForm: React.FC<{
    newTestTitle: string;
    setNewTestTitle: React.Dispatch<React.SetStateAction<string>>;
    questions: Question[];
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
    handleSaveTest: () => void;
    handleCancelCreate: () => void;
    setStatusMessage: React.Dispatch<React.SetStateAction<StatusMessage | null>>;
}> = ({
    newTestTitle, 
    setNewTestTitle, 
    questions, 
    setQuestions, 
    handleSaveTest, 
    handleCancelCreate,
    setStatusMessage
}) => {
    
    // Accordion State
    const [isQuestionsOpen, setIsQuestionsOpen] = useState(true);
    const [isTimeSettingsOpen, setIsTimeSettingsOpen] = useState(false);

    // State for the question currently being drafted in the input form
    const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType>('multiple-choice');
    const [currentQuestionText, setCurrentQuestionText] = useState('');
    const [currentOptions, setCurrentOptions] = useState<Option[]>([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ]);
    // NOTE: The correctOptionIndex state is now removed, as the user only wants to define the pattern.

    // Handlers for Question Input Form
    const handleAddQuestion = () => {
        setStatusMessage(null);

        // 1. Validation
        if (!currentQuestionText.trim()) {
            setStatusMessage({ type: 'error', text: 'Please enter the question text.' });
            return;
        }

        const validOptions = currentOptions.filter(opt => opt.text.trim() !== '');

        if (validOptions.length < 2) {
            setStatusMessage({ type: 'error', text: 'Please ensure at least two options are filled out for this question type.' });
            return;
        }

        const hasCorrectAnswer = validOptions.some(opt => opt.isCorrect);
        if (!hasCorrectAnswer) {
            setStatusMessage({ type: 'error', text: 'Please select at least one correct answer.' });
            return;
        }


        // 2. Create new question object
        const newQuestion: Question = {
            id: Date.now(), // Simple unique ID
            text: currentQuestionText.trim(),
            type: currentQuestionType, // Use the selected type
            options: validOptions, // Only save non-empty options
        };

        // 3. Update parent state
        setQuestions([...questions, newQuestion]);

        // 4. Reset local state
        setCurrentQuestionText('');
        // Reset options based on the currently selected type for the *next* question
        if (currentQuestionType === 'yes-no') {
             setCurrentOptions([{ text: 'Yes', isCorrect: false }, { text: 'No', isCorrect: false }]);
        } else if (currentQuestionType === 'multiple-choice') {
             setCurrentOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
        } else {
             setCurrentOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
        }
       
        setStatusMessage({ type: 'success', text: `Question ${questions.length + 1} (${currentQuestionType.replace('-', ' ')}) added successfully.` });
    };

    // Index for the new question being drafted
    const nextQuestionIndex = questions.length + 1;


    return (
        <Card className="p-6 mb-6 border-2 border-dashed border-teal-300 dark:border-teal-700/50">
            <h2 className='text-xl font-bold mb-6 text-gray-900 dark:text-gray-100'>Create Test</h2>
            
            {/* Test Name Input */}
            <div className="mb-6">
                <label htmlFor="testTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Test Name
                </label>
                <div className="flex items-center border-b border-gray-300 dark:border-gray-600 pb-1">
                    <input
                        id="testTitle"
                        type="text"
                        value={newTestTitle}
                        onChange={(e) => setNewTestTitle(e.target.value)}
                        placeholder="E.g., Final Physics Exam"
                        className="w-full text-xl font-medium bg-transparent focus:outline-none text-gray-900 dark:text-gray-100"
                    />
                    <Edit className="w-5 h-5 text-gray-400 ml-2 cursor-pointer" />
                </div>
            </div>

            {/* Questions Accordion (Detailed Builder) */}
            <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <button 
                    className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg"
                    onClick={() => setIsQuestionsOpen(!isQuestionsOpen)}
                >
                    {/* Display current number of questions from state passed from App */}
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Questions ({questions.length})</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isQuestionsOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                
                {isQuestionsOpen && (
                    <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                        
                        {/* 1. Preview of Existing Questions */}
                        <QuestionListPreview questions={questions} />

                        {/* 2. Form for New Question Input */}
                        <QuestionInputForm
                            questionIndex={nextQuestionIndex}
                            questionType={currentQuestionType}
                            setQuestionType={setCurrentQuestionType}
                            currentQuestionText={currentQuestionText}
                            setCurrentQuestionText={setCurrentQuestionText}
                            currentOptions={currentOptions}
                            setCurrentOptions={setCurrentOptions}
                            handleAddQuestion={handleAddQuestion}
                            setStatusMessage={setStatusMessage}
                        />

                    </div>
                )}
            </div>
            
            {/* Time Settings Accordion */}
            <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                <button 
                    className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    onClick={() => setIsTimeSettingsOpen(!isTimeSettingsOpen)}
                >
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Time Settings</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isTimeSettingsOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                {isTimeSettingsOpen && (
                    <div className="p-4 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
                        {/* Placeholder content */}
                        <p>Total Test Duration: 60 minutes</p>
                        <p>Per Question Timer: Disabled</p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <Button 
                    variant="outline-teal"
                    onClick={handleCancelCreate}
                    className='w-full sm:w-auto'
                >
                    Cancel
                </Button>
                <Button 
                    variant="primary-teal"
                    onClick={handleSaveTest}
                    className='w-full sm:w-auto'
                    // Button is enabled if a title exists, allowing the save handler in App to show validation errors for missing questions
                    disabled={!newTestTitle.trim()} 
                >
                    Save Test
                </Button>
            </div>
        </Card>
    );
}

// --- Main Application Component ---

export const TestManagement: React.FC = () => {
    // State initialization
    const [tests, setTests] = useState<Test[]>(mockTests);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredTests, setFilteredTests] = useState<Test[]>(mockTests);
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    // States for Manual Creation Form
    const [newTestTitle, setNewTestTitle] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]); 

    // Typed function parameters and return type
    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        const filtered = tests.filter(test =>
            test.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTests(filtered);
    }, [tests]);


    const handleSaveTest = () => {
        setStatusMessage(null); 

        if (!newTestTitle.trim()) {
            setStatusMessage({ type: 'error', text: 'Please enter a valid test name.' });
            return;
        }
        // Validation now checks against the actual questions state
        if (questions.length === 0) {
            setStatusMessage({ type: 'error', text: 'The test must contain at least one question. Please add questions using the form.' });
            return;
        }

        // Simulate saving the new test and updating the list
        const newTest: Test = {
            id: Date.now(),
            title: newTestTitle.trim(),
            questions: questions // Store the created questions
        };
        
        const updatedTests = [newTest, ...tests];
        setTests(updatedTests);
        // Re-apply search filter to the new list
        setFilteredTests(updatedTests.filter(test => test.title.toLowerCase().includes(searchTerm.toLowerCase()))); 

        setStatusMessage({ type: 'success', text: `Test "${newTest.title}" saved successfully with ${questions.length} questions!` });
        
        // Reset form and close it
        setNewTestTitle('');
        setQuestions([]);
        
        setTimeout(() => {
            setShowCreateForm(false);
            setStatusMessage(null);
        }, 2000);
    };

    const handleCancelCreate = () => {
        setNewTestTitle('');
        setQuestions([]);
        setStatusMessage(null);
        setShowCreateForm(false);
    }


    const handleDeleteTest = (testId: number) => {
        setStatusMessage(null);
        const testToDelete = tests.find(t => t.id === testId);
        if (!testToDelete) return;

        const updatedTests = tests.filter(test => test.id !== testId);
        setTests(updatedTests);
        setFilteredTests(updatedTests.filter(test => test.title.toLowerCase().includes(searchTerm.toLowerCase())));
        setStatusMessage({ type: 'error', text: `Test "${testToDelete.title}" deleted successfully.` });
        setTimeout(() => setStatusMessage(null), 2000);
    };

    const handleEditTest = (testId: number) => {
        setStatusMessage({ type: 'info', text: `Simulating edit action for test ID: ${testId}` });
        setTimeout(() => setStatusMessage(null), 2000);
    };

    // Define the columns with explicit types
    const columns: TableColumn[] = [
        { 
            key: 'title', 
            header: 'Test Title' 
        },
        {
            key: 'actions',
            header: '', 
            render: (test: Test) => (
                <div className="flex items-center justify-end space-x-4 pr-2">
                    <Button variant="ghost" size="sm" className="p-0 text-teal-600 dark:text-teal-400 hover:text-teal-700" onClick={() => handleEditTest(test.id)}>
                        <span className='font-medium text-sm'>Edit</span>
                    </Button>
                    <span className='text-gray-300 dark:text-gray-600'>|</span>
                    <Button variant="ghost" size="sm" className="p-0 text-red-600 hover:text-red-700" onClick={() => handleDeleteTest(test.id)}>
                        <span className='font-medium text-sm'>Delete</span>
                    </Button>
                </div>
            )
        }
    ];
    
    return (
        // Outer container with responsive centered layout
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl w-full">
                <Card className="p-8">
                    
                    {/* Header Row: Test Bank Title, Search, and Create Button */}
                    {!showCreateForm && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Test Bank</h1>
                            
                            <div className="flex items-center space-x-3 w-full sm:w-auto">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                <Button
                                    variant="primary-teal"
                                    className="flex items-center whitespace-nowrap"
                                    onClick={() => {
                                        setShowCreateForm(true);
                                        setStatusMessage(null); // Clear status when toggling form
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    <span>Create New Test</span>
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {/* Notification Area */}
                    <StatusAlert 
                        message={statusMessage?.text} 
                        type={statusMessage?.type} 
                        onClose={() => setStatusMessage(null)} 
                    />

                    {/* Create New Test Form (Manual Question Builder) */}
                    {showCreateForm ? (
                        <CreateTestForm 
                            newTestTitle={newTestTitle}
                            setNewTestTitle={setNewTestTitle}
                            questions={questions}
                            setQuestions={setQuestions}
                            handleSaveTest={handleSaveTest}
                            handleCancelCreate={handleCancelCreate}
                            setStatusMessage={setStatusMessage}
                        />
                    ) : (
                        // Test List Table
                        <>
                            <Table
                                data={filteredTests}
                                columns={columns}
                            />
                            {filteredTests.length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                                    No tests found matching your search criteria.
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default TestManagement;

