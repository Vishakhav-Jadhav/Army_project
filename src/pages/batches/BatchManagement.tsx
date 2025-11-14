

import React, { useState, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Candidate {
  name: string;
  id: string;
  birthYear: string;
}

interface Batch {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  candidates: Candidate[];
}

interface StatusMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

// Defining a generic type for Table Columns to ensure type safety in props
interface Column<T> {
  key: keyof T | string; // keyof T for T's own properties, or string for computed/action columns
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
}

// --- Mock Data ---
const initialBatches: Batch[] = [
  {
    id: '1',
    name: 'B1 Trainees',
    description: 'First batch of trainees for 2024',
    status: 'active',
    createdAt: '2024-01-15',
    candidates: [{ name: 'John Doe', id: '1001', birthYear: '1998' }, { name: 'Jane Smith', id: '1002', birthYear: '1999' }]
  },
  {
    id: '2',
    name: 'B2 Cadets',
    description: 'Second batch of cadets for advanced training',
    status: 'active',
    createdAt: '2024-02-01',
    candidates: [{ name: 'Mike Johnson', id: '2001', birthYear: '2000' }]
  },
  {
    id: '3',
    name: 'B3 Captain',
    description: 'A mock entry to populate the list',
    status: 'active',
    createdAt: '2024-03-10',
    candidates: []
  }
];

// --- UI COMPONENTS ---

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'ghost' | 'destructive' | 'success';
  size?: 'default' | 'sm';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'default', size = 'default', className = '', disabled = false }) => {
  let baseStyle = 'px-4 py-2 font-semibold transition duration-150 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  if (variant === 'default') {
    baseStyle += ' bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-blue-100 dark:focus:ring-offset-gray-900';
  } else if (variant === 'ghost') {
    baseStyle += ' bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-blue-500';
  } else if (variant === 'destructive') {
    baseStyle += ' bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-red-100 dark:focus:ring-offset-gray-900';
  } else if (variant === 'success') {
    baseStyle += ' bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 focus:ring-offset-green-100 dark:focus:ring-offset-gray-900';
  }

  if (size === 'sm') {
    baseStyle = baseStyle.replace('px-4 py-2', 'px-3 py-1 text-sm');
  }

  if (disabled) {
    baseStyle = baseStyle + ' opacity-50 cursor-not-allowed hover:bg-opacity-50';
  }

  return (
    <button className={`${baseStyle} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

/**
 * Custom Table component for displaying data
 * It uses the generic Column<T> type for flexibility.
 */
const Table = <T extends { id?: string | number } | any>({ data, columns }: { data: T[], columns: Column<T>[] }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
      {/* Hidden header row for screen readers/accessibility (kept from original) */}
      <thead className="hidden">
        <tr>
          {columns.map((column) => (
            <th key={column.key as string} className="p-0"></th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
        {data.map((item, index) => (
          // Use item.id if available, otherwise fallback to index
          <tr key={(item as any).id || index} className='hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150'>
            {columns.map((column) => (
              <td
                key={column.key as string}
                className={`py-3 px-4 text-sm text-gray-900 dark:text-gray-200 ${column.key === 'name' ? 'font-medium' : (column.render ? '' : 'text-right')}`}
              >
                {column.render ? column.render(item, index) : (item as any)[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Custom Status Alert component (replacement for native alert/confirm)
 */
const StatusAlert: React.FC<{ message: string | null | undefined, type: StatusMessage['type'] | undefined, onClose: () => void }> = ({ message, type, onClose }) => {
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
        Icon = X;
        break;
      default: // info/warning/other
        colorClasses = 'bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300';
        Icon = AlertCircle; // Using AlertCircle for generic info/warning
        break;
    }

    return (
      <div className={`p-3 mb-4 rounded-lg border flex items-start justify-between ${colorClasses}`}>
        <div className='flex items-center flex-grow'>
          <Icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-1 ml-4 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };


const App: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [batchName, setBatchName] = useState<string>('');
  const [batchDescription, setBatchDescription] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateForm, setCandidateForm] = useState<Candidate>({ name: '', id: '', birthYear: '' });
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleAddCandidate = () => {
    setStatusMessage(null);
    const { name, id, birthYear } = candidateForm;

    if (!name.trim() || !id.trim() || !birthYear.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill all candidate fields (Name, ID, Birth Year).' });
      return;
    }
    
    // Simple validation: check if ID is unique within the *current* batch being created/edited
    if (candidates.some(c => c.id === id)) {
      setStatusMessage({ type: 'error', text: `Candidate ID ${id} already exists in this batch.` });
      return;
    }
    // Optional: check if ID is unique globally (more relevant for real systems)
    // if (batches.some(b => b.candidates.some(c => c.id === id && (b.id !== editingBatchId || !editingBatchId)))) {
    //   setStatusMessage({ type: 'warning', text: `Warning: Candidate ID ${id} exists in another batch. Adding anyway.` });
    // }

    setCandidates([...candidates, { ...candidateForm }]);
    // Reset candidate form fields
    setCandidateForm({ name: '', id: '', birthYear: '' });
  };

  const handleRemoveCandidate = (index: number) => {
    const candidateName = candidates[index].name;
    setCandidates(candidates.filter((_, i) => i !== index));
    setStatusMessage({ type: 'info', text: `Candidate '${candidateName}' removed from the list.` });
  };

  const resetForm = () => {
    setEditingBatchId(null);
    setBatchName('');
    setBatchDescription('');
    setCandidates([]);
    setCandidateForm({ name: '', id: '', birthYear: '' });
    // Keep status message until user dismisses it or triggers a new action
    // setStatusMessage(null); 
  };

  const handleSaveBatch = () => {
    setStatusMessage(null);

    if (!batchName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid Batch Name.' });
      return;
    }
    if (candidates.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please add at least one candidate before saving the batch.' });
      return;
    }

    if (editingBatchId) {
      // Update existing batch
      const updated = batches.map(b => {
        if (b.id === editingBatchId) {
          return {
            ...b,
            name: batchName,
            description: batchDescription,
            candidates: [...candidates]
          };
        }
        return b;
      });
      setBatches(updated);
      setStatusMessage({ type: 'success', text: `Batch "${batchName}" updated successfully!` });
    } else {
      // Create new batch
      const newBatch: Batch = {
        id: String(Date.now()), // Unique ID based on timestamp
        name: batchName,
        description: batchDescription,
        status: 'active',
        createdAt: new Date().toISOString().substring(0, 10), // Simple YYYY-MM-DD
        candidates: [...candidates]
      };
      setBatches([newBatch, ...batches]);
      setStatusMessage({ type: 'success', text: `Batch "${newBatch.name}" created successfully!` });
    }

    // Reset form and close
    resetForm();
    setShowCreateForm(false);
  };

  const handleDeleteBatch = (id: string) => {
    setStatusMessage(null);
    const batchToDelete = batches.find(b => b.id === id);
    if (!batchToDelete) return;

    setBatches(batches.filter(b => b.id !== id));
    setStatusMessage({ type: 'error', text: `Batch "${batchToDelete.name}" permanently deleted.` });
  };

  const handleEditBatch = (batch: Batch) => {
    setEditingBatchId(batch.id);
    setBatchName(batch.name);
    setBatchDescription(batch.description);
    setCandidates([...batch.candidates]);
    setStatusMessage(null);
    setShowCreateForm(true);
  };

  // Filter batches based on search term
  const filteredBatches = batches.filter(batch => 
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      batch.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define the columns for the batch list (Column<Batch>)
  const batchColumns: Column<Batch>[] = [
    {
      key: 'name',
      header: 'Batch Name',
      render: (batch: Batch) => (
        <div className="font-medium text-gray-900 dark:text-gray-100 flex flex-col items-start">
          {batch.name}
          <p className='text-xs text-gray-500 dark:text-gray-400 italic mt-0.5'>{batch.candidates.length} candidate{batch.candidates.length !== 1 ? 's' : ''}</p>
        </div>
      )
    },
    {
        key: 'created',
        header: 'Created On',
        render: (batch: Batch) => (
            <span className='text-gray-600 dark:text-gray-300 text-xs'>{batch.createdAt.substring(0, 10)}</span>
        )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (batch: Batch) => (
        <div className="flex items-center justify-end space-x-2 sm:space-x-4 pr-1 sm:pr-2">
          <Button variant="ghost" size="sm" className="p-1 sm:p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" onClick={() => handleEditBatch(batch)}>
            <Edit className='w-4 h-4 inline mr-0 sm:mr-1'/> <span className='hidden sm:inline'>Edit</span>
          </Button>
          <span className='text-gray-300 dark:text-gray-600'>|</span>
          <Button variant="ghost" size="sm" className="p-1 sm:p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => handleDeleteBatch(batch.id)}>
            <Trash2 className='w-4 h-4 inline mr-0 sm:mr-1'/> <span className='hidden sm:inline'>Delete</span>
          </Button>
        </div>
      )
    }
  ];

  // Define the columns for the candidate list within the form (Column<Candidate>)
  const candidateColumns: Column<Candidate>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (candidate: Candidate, index: number) => (
        <div className='flex flex-col items-start'>
          <span className='font-medium text-gray-900 dark:text-gray-100'>{index + 1}. {candidate.name}</span>
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            ID: {candidate.id} | Born: {candidate.birthYear}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (candidate: Candidate, index: number) => (
        <div className="flex items-center justify-end space-x-2 pr-2">
          <Button
            variant="destructive"
            size="sm"
            className="p-1 text-xs"
            onClick={() => handleRemoveCandidate(index)}
          >
            <X className='w-3 h-3 inline mr-1'/> Remove
          </Button>
        </div>
      )
    }
  ];
  
  return (
    // Outer container with responsive centered layout
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center py-10 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl w-full">
        <Card className="p-6 sm:p-8">
          
          {/* Header Row: Title, Search, and Create Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Batch Management</h1>
            
            <div className="flex items-center space-x-3 w-full sm:w-auto">
                {!showCreateForm && (
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Batches"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                )}
                <Button
                    className="flex items-center whitespace-nowrap min-w-[120px]"
                    onClick={() => {
                        if (showCreateForm) resetForm(); // Reset on cancel
                        setShowCreateForm(!showCreateForm);
                        setStatusMessage(null); // Clear status when toggling form
                    }}
                    variant={showCreateForm ? 'ghost' : 'default'}
                >
                    {showCreateForm ? (
                        <>
                            <X className="w-4 h-4 mr-2" />
                            <span>Cancel</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            <span>Create New Batch</span>
                        </>
                    )}
                </Button>
            </div>
          </div>
          
          {/* Notification Area */}
          <StatusAlert 
            message={statusMessage?.text} 
            type={statusMessage?.type} 
            onClose={() => setStatusMessage(null)} 
          />

          {/* Create/Edit Batch Form */}
          {showCreateForm ? (
            <Card className="p-6 mb-6 border-2 border-dashed border-blue-400 dark:border-blue-700 bg-blue-50 dark:bg-gray-700/50">
                <h2 className='text-xl font-bold mb-4 text-gray-800 dark:text-gray-100'>
                    {editingBatchId ? 'Edit Batch' : 'Define New Batch'}
                </h2>
                
              <div className="space-y-6">
                
                {/* Batch Details */}
                <div className='space-y-3'>
                    <div>
                        <label htmlFor="batchName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Batch Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="batchName"
                            type="text"
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
                            placeholder="E.g., B1 Trainees"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="batchDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Batch Description (Optional)
                        </label>
                        <textarea
                            id="batchDescription"
                            rows={2}
                            value={batchDescription}
                            onChange={(e) => setBatchDescription(e.target.value)}
                            placeholder="Brief description of the batch, e.g., Training period from Jan to March 2024."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                        />
                    </div>
                </div>

                {/* Add Candidate Form */}
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Add Candidate Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={candidateForm.name}
                            onChange={e => setCandidateForm({ ...candidateForm, name: e.target.value })}
                            className="col-span-2 md:col-span-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="text"
                            placeholder="ID Number"
                            value={candidateForm.id}
                            onChange={e => setCandidateForm({ ...candidateForm, id: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="text"
                            placeholder="Birth Year (YYYY)"
                            value={candidateForm.birthYear}
                            onChange={e => setCandidateForm({ ...candidateForm, birthYear: e.target.value.replace(/[^0-9]/g, '').slice(0, 4) })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <Button
                            onClick={handleAddCandidate}
                            variant='success'
                            className="w-full"
                            disabled={!candidateForm.name.trim() || !candidateForm.id.trim() || candidateForm.birthYear.length !== 4}
                        >
                            <Plus className='w-4 h-4 mr-1'/> Add
                        </Button>
                    </div>
                </div>

                {/* Candidate List */}
                {candidates.length > 0 && (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 flex justify-between items-center border-b dark:border-gray-600">
                            Candidates in this Batch ({candidates.length})
                        </div>
                        <Table
                            data={candidates}
                            columns={candidateColumns}
                        />
                    </div>
                )}
                
                {/* Save Button */}
                <div className='pt-2'>
                  <Button 
                    onClick={handleSaveBatch} 
                    className="w-full text-lg"
                    disabled={!batchName.trim() || candidates.length === 0}
                  >
                    {editingBatchId ? 'Update Batch' : 'Save New Batch'}
                  </Button>
                  <p className='text-xs text-center text-gray-500 dark:text-gray-400 mt-2'>* Batch Name and at least one candidate are required.</p>
                </div>
              </div>
            </Card>
          ) : (
            /* Batch List View */
            <div className="space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {searchTerm ? `Results for "${searchTerm}"` : "All Active Batches"}
                </div>
              <Table<Batch>
                data={filteredBatches}
                columns={batchColumns}
              />
              {filteredBatches.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed dark:border-gray-700">
                      No batches found matching your search.
                  </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default App;
