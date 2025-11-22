// import { useState, useEffect, useRef } from 'react';
// import { transactionsAPI } from '../services/api';
// import { 
//   Plus, 
//   Search, 
//   Filter, 
//   Edit, 
//   Trash2, 
//   Calendar,
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   X,
//   Check
// } from 'lucide-react';

// const Transactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     type: 'all',
//     category: 'all',
//     dateFrom: '',
//     dateTo: ''
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [editingTransaction, setEditingTransaction] = useState(null);
//   const [formData, setFormData] = useState({
//     type: 'expense',
//     category: '',
//     amount: '',
//     date: new Date().toISOString().split('T')[0],
//     note: ''
//   });

//   // Refs for text inputs
//   const noteRef = useRef(null);
//   const searchRef = useRef(null);
//   const amountRef = useRef(null);

//   // Handle note input change with cursor position preservation
//   const handleNoteChange = (e) => {
//     const { value } = e.target;
//     const cursorPosition = e.target.selectionStart;

//     setFormData(prev => ({
//       ...prev,
//       note: value
//     }));

//     // Preserve cursor position and ensure focus is maintained
//     setTimeout(() => {
//       if (noteRef.current) {
//         noteRef.current.focus();
//         // Ensure cursor is visible by setting selection range after focus
//         const newPosition = Math.min(cursorPosition, value.length);
//         noteRef.current.setSelectionRange(newPosition, newPosition);
//       }
//     }, 0);
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     const cursorPosition = e.target.selectionStart;
    
//     setSearchTerm(value);
    
//     // Use requestAnimationFrame for better timing
//     requestAnimationFrame(() => {
//       if (searchRef.current) {
//         searchRef.current.setSelectionRange(cursorPosition, cursorPosition);
//       }
//     });
//   };

//   const categories = [
//     'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 
//     'Healthcare', 'Education', 'Salary', 'Freelance', 'Investment', 'Other'
//   ];

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);
//       const response = await transactionsAPI.getAll();
//       setTransactions(response.data);
//     } catch (err) {
//       setError('Failed to fetch transactions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate form data
//     if (!formData.amount || !formData.category || !formData.date) {
//       setError('Please fill in all required fields');
//       return;
//     }
    
//     if (parseFloat(formData.amount) <= 0) {
//       setError('Amount must be greater than 0');
//       return;
//     }
    
//     try {
//       setSubmitting(true);
//       setError('');
      
//       // Prepare data for API
//       const transactionData = {
//         ...formData,
//         amount: parseFloat(formData.amount)
//       };
      
//       console.log('Submitting transaction:', transactionData);
      
//       if (editingTransaction) {
//         const response = await transactionsAPI.update(editingTransaction._id, transactionData);
//         console.log('Update response:', response);
//       } else {
//         const response = await transactionsAPI.create(transactionData);
//         console.log('Create response:', response);
//       }
      
//       await fetchTransactions();
//       setShowModal(false);
//       setEditingTransaction(null);
//       resetForm();
      
//       console.log('Transaction saved successfully');
//     } catch (err) {
//       console.error('Transaction save error:', err);
//       setError(err.response?.data?.message || 'Failed to save transaction');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this transaction?')) {
//       try {
//         await transactionsAPI.delete(id);
//         await fetchTransactions();
//       } catch (err) {
//         setError('Failed to delete transaction');
//       }
//     }
//   };

//   const handleEdit = (transaction) => {
//     setEditingTransaction(transaction);
//     setFormData({
//       type: transaction.type,
//       category: transaction.category,
//       amount: transaction.amount.toString(),
//       date: new Date(transaction.date).toISOString().split('T')[0],
//       note: transaction.note || ''
//     });
//     setShowModal(true);
//   };

//   const resetForm = () => {
//     setFormData({
//       type: 'expense',
//       category: '',
//       amount: '',
//       date: new Date().toISOString().split('T')[0],
//       note: ''
//     });
//   };

//   const openModal = () => {
//     setEditingTransaction(null);
//     resetForm();
//     setShowModal(true);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilters({
//       type: 'all',
//       category: 'all',
//       dateFrom: '',
//       dateTo: ''
//     });
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingTransaction(null);
//     resetForm();
//   };

//   // Filter transactions
//   const filteredTransactions = transactions.filter(transaction => {
//     const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          transaction.note?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType = filters.type === 'all' || transaction.type === filters.type;
//     const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
//     const matchesDateFrom = !filters.dateFrom || new Date(transaction.date) >= new Date(filters.dateFrom);
//     const matchesDateTo = !filters.dateTo || new Date(transaction.date) <= new Date(filters.dateTo);
    
//     return matchesSearch && matchesType && matchesCategory && matchesDateFrom && matchesDateTo;
//   });

//   const TransactionCard = ({ transaction }) => (
//     <div className="card hover:shadow-md transition-all duration-200 group">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className={`p-3 rounded-lg ${
//             transaction.type === 'income' 
//               ? 'bg-accent-success bg-opacity-10' 
//               : 'bg-accent-danger bg-opacity-10'
//           }`}>
//             {transaction.type === 'income' ? (
//               <TrendingUp className="w-5 h-5 text-accent-success" />
//             ) : (
//               <TrendingDown className="w-5 h-5 text-accent-danger" />
//             )}
//           </div>
//           <div>
//             <h3 className="font-semibold text-primary">{transaction.category}</h3>
//             <p className="text-sm text-secondary">
//               {new Date(transaction.date).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric'
//               })}
//             </p>
//             {transaction.note && (
//               <p className="text-sm text-muted mt-1">{transaction.note}</p>
//             )}
//           </div>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <p className={`text-lg font-bold ${
//               transaction.type === 'income' ? 'text-accent-success' : 'text-accent-danger'
//             }`}>
//               {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
//             </p>
//             <p className="text-xs text-muted capitalize">{transaction.type}</p>
//           </div>
          
//           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//             <button
//               onClick={() => handleEdit(transaction)}
//               className="p-2 hover:bg-tertiary rounded-lg transition-colors"
//               title="Edit transaction"
//             >
//               <Edit className="w-4 h-4 text-secondary" />
//             </button>
//             <button
//               onClick={() => handleDelete(transaction._id)}
//               className="p-2 hover:bg-accent-danger hover:bg-opacity-10 rounded-lg transition-colors"
//               title="Delete transaction"
//             >
//               <Trash2 className="w-4 h-4 text-accent-danger" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const Modal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-secondary rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-primary">
//               {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
//             </h2>
//             <button
//               onClick={closeModal}
//               className="p-2 hover:bg-tertiary rounded-lg transition-colors"
//             >
//               <X className="w-5 h-5 text-secondary" />
//             </button>
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-accent-danger bg-opacity-10 border border-accent-danger border-opacity-20 rounded-lg text-accent-danger text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Type Toggle */}
//             <div>
//               <label className="block text-sm font-medium text-primary mb-2">Type</label>
//               <div className="flex bg-tertiary rounded-lg p-1">
//                 <button
//                   type="button"
//                   onClick={() => setFormData(prev => ({...prev, type: 'expense'}))}
//                   className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                     formData.type === 'expense'
//                       ? 'bg-accent-danger text-white'
//                       : 'text-secondary hover:text-primary'
//                   }`}
//                 >
//                   Expense
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setFormData(prev => ({...prev, type: 'income'}))}
//                   className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                     formData.type === 'income'
//                       ? 'bg-accent-success text-white'
//                       : 'text-secondary hover:text-primary'
//                   }`}
//                 >
//                   Income
//                 </button>
//               </div>
//             </div>

//             {/* Amount */}
//             <div>
//               <label className="block text-sm font-medium text-primary mb-2">Amount</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none font-semibold">₹</span>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   value={formData.amount}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     setFormData(prev => ({
//                       ...prev,
//                       amount: value
//                     }));
//                   }}
//                   className="input pl-10"
//                   placeholder="0.00"
//                   required
//                   style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'embed' }}
//                 />
//               </div>
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-sm font-medium text-primary mb-2">Category</label>
//               <select
//                 value={formData.category}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     setFormData(prev => ({
//                       ...prev,
//                       category: value
//                     }));
//                   }}
//                 className="input"
//                 required
//               >
//                 <option value="">Select category</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Date */}
//             <div>
//               <label className="block text-sm font-medium text-primary mb-2">Date</label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
//                 <input
//                   type="date"
//                   value={formData.date}
//                   onChange={(e) => {
//                     const { value } = e.target;
//                     setFormData(prev => ({
//                       ...prev,
//                       date: value
//                     }));
//                   }}
//                   className="input pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Note */}
//             <div>
//               <label className="block text-sm font-medium text-primary mb-2">Note (Optional)</label>
//               <textarea
//                 ref={noteRef}
//                 value={formData.note}
//                 onChange={handleNoteChange}
//                 className="input text-ltr"
//                 rows="3"
//                 placeholder="Add a note..."
//                 dir="ltr"
//                 spellCheck="false"
//                 autoComplete="off"
//               />
//             </div>

//             <div className="flex gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="flex-1 btn btn-secondary"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="flex-1 btn btn-primary"
//               >
//                 {submitting ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="spinner" />
//                     {editingTransaction ? 'Updating...' : 'Adding...'}
//                   </div>
//                 ) : (
//                   `${editingTransaction ? 'Update' : 'Add'} Transaction`
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="spinner mx-auto mb-4" />
//           <p className="text-secondary">Loading transactions...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-primary mb-2">Transactions</h1>
//           <p className="text-secondary">Manage your income and expenses</p>
//         </div>
//         <button onClick={openModal} className="btn btn-primary">
//           <Plus className="w-5 h-5" />
//           Add Transaction
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="card">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-primary">Filters</h3>
//           <button
//             onClick={clearFilters}
//             className="text-sm text-secondary hover:text-primary transition-colors"
//           >
//             Clear All Filters
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//           {/* Search */}
//           <div className="lg:col-span-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
//               <input
//                 ref={searchRef}
//                 type="text"
//                 placeholder="Search transactions..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 className="input pl-10 text-ltr"
//                 dir="ltr"
//               />
//             </div>
//           </div>

//           {/* Type Filter */}
//           <div>
//             <select
//               value={filters.type}
//               onChange={(e) => setFilters({...filters, type: e.target.value})}
//               className="input"
//             >
//               <option value="all">All Types</option>
//               <option value="income">Income</option>
//               <option value="expense">Expense</option>
//             </select>
//           </div>

//           {/* Category Filter */}
//           <div>
//             <select
//               value={filters.category}
//               onChange={(e) => setFilters({...filters, category: e.target.value})}
//               className="input"
//             >
//               <option value="all">All Categories</option>
//               {categories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>

//           {/* Date Range */}
//           <div className="lg:col-span-2 grid grid-cols-2 gap-2">
//             <div>
//               <label className="block text-xs text-secondary mb-1">From Date</label>
//               <input
//                 type="date"
//                 value={filters.dateFrom}
//                 onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
//                 className="input text-ltr"
//                 dir="ltr"
//               />
//             </div>
//             <div>
//               <label className="block text-xs text-secondary mb-1">To Date</label>
//               <input
//                 type="date"
//                 value={filters.dateTo}
//                 onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
//                 className="input text-ltr"
//                 dir="ltr"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Transactions List */}
//       <div className="space-y-4">
//         {filteredTransactions.length > 0 ? (
//           filteredTransactions.map(transaction => (
//             <TransactionCard key={transaction._id} transaction={transaction} />
//           ))
//         ) : (
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl text-muted font-bold">₹</span>
//             </div>
//             <h3 className="text-lg font-semibold text-primary mb-2">No transactions found</h3>
//             <p className="text-secondary mb-4">
//               {searchTerm || filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo
//                 ? 'Try adjusting your filters'
//                 : 'Get started by adding your first transaction'
//               }
//             </p>
//             {!searchTerm && filters.type === 'all' && filters.category === 'all' && !filters.dateFrom && !filters.dateTo && (
//               <button onClick={openModal} className="btn btn-primary">
//                 <Plus className="w-5 h-5" />
//                 Add Transaction
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && <Modal />}
//     </div>
//   );
// };

// export default Transactions;


import React, { useState, useEffect, useRef } from 'react';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../services/api.js'; // Fixed import path
import { useAuth } from '../contexts/AuthContext.jsx'; // Fixed import path
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';

// AI Sparkle Icon
const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.454 3.385c-.646.633-.194 1.79.71 1.932l4.611.598 2.075 4.22c.32.648 1.408.648 1.729 0l2.075-4.22 4.611-.598c.904-.142 1.356-1.3.71-1.932l-3.454-3.385-4.753-.39-1.83-4.401z"
      clipRule="evenodd"
    />
  </svg>
);

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const Transactions = () => {
  console.log('Transactions component rendering');
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Other');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false); // For AI suggestion loading
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef(null);

  const expenseCategories = [
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Other',
  ];

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Investment',
    'Gift',
    'Other',
  ];

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  useEffect(() => {
    if (!user) return;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getTransactions();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to fetch transactions.');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  const refreshTransactions = async () => {
    try {
      setError('');
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to refresh transactions:', err);
      setError('Failed to refresh transactions.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) {
      setError('Please fill in both description and amount.');
      return;
    }

    const transactionData = {
      note: description, // Backend expects 'note', not 'description'
      amount: parseFloat(amount),
      type,
      category: category || (type === 'income' ? 'Other' : 'Other'), // Ensure category is always provided
      date: new Date().toISOString(),
      user: user._id,
    };

    try {
      if (editingId) {
        await updateTransaction(editingId, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      await refreshTransactions();
      resetForm();
    } catch (err) {
      setError('Failed to save transaction. Please try again.');
      console.error(err);
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory(expenseCategories[0] || 'Other');
    setEditingId(null);
    setError('');
  };

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Export functions
  const exportToPDF = () => {
    try {
      setShowExportDropdown(false);
      const doc = new jsPDF();
      let yPos = 20;
      
      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Transaction Report', 14, yPos);
      yPos += 10;
      
      // Header info
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, yPos);
      yPos += 7;
      doc.text(`Total Transactions: ${transactions.length}`, 14, yPos);
      yPos += 10;
      
      // Calculate totals
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const netBalance = totalIncome - totalExpense;
      
      // Summary Section
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Summary', 14, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const incomeText = `Total Income: Rs. ${totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      doc.text(incomeText, 14, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const expenseText = `Total Expenses: Rs. ${totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      doc.text(expenseText, 14, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const balanceText = `Net Balance: Rs. ${netBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      doc.text(balanceText, 14, yPos);
      yPos += 10;
      
      // Income Transactions Table
      const incomeTransactions = transactions.filter(t => t.type === 'income');
      if (incomeTransactions.length > 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Income Transactions', 14, yPos);
        yPos += 8;
        
        const incomeTableData = incomeTransactions.map(t => [
          new Date(t.date).toLocaleDateString('en-IN'),
          (t.note || t.description || 'N/A').substring(0, 30),
          t.category || 'N/A',
          `Rs. ${(t.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Date', 'Description', 'Category', 'Amount']],
          body: incomeTableData,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
        });
        
        yPos = doc.lastAutoTable?.finalY || yPos + 50;
        yPos += 10;
      }
      
      // Expense Transactions Table
      const expenseTransactions = transactions.filter(t => t.type === 'expense');
      if (expenseTransactions.length > 0) {
        // Add new page if needed
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Expense Transactions', 14, yPos);
        yPos += 8;
        
        const expenseTableData = expenseTransactions.map(t => [
          new Date(t.date).toLocaleDateString('en-IN'),
          (t.note || t.description || 'N/A').substring(0, 30),
          t.category || 'N/A',
          `Rs. ${(t.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Date', 'Description', 'Category', 'Amount']],
          body: expenseTableData,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
        });
        
        yPos = doc.lastAutoTable?.finalY || yPos + 50;
        yPos += 10;
      }
      
      // All Transactions Table
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('All Transactions', 14, yPos);
      yPos += 8;
      
      const allTableData = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(t => [
          new Date(t.date).toLocaleDateString('en-IN'),
          (t.note || t.description || 'N/A').substring(0, 25),
          t.category || 'N/A',
          t.type === 'income' ? 'Income' : 'Expense',
          `Rs. ${(t.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
        ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
        body: allTableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        margin: { left: 14, right: 14 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      
      // Save PDF
      doc.save(`transactions-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const exportToCSV = () => {
    setShowExportDropdown(false);
    let csvContent = 'Date,Description,Category,Type,Amount\n';
    transactions.forEach(t => {
      csvContent += `${new Date(t.date).toLocaleDateString()},${(t.note || t.description || 'N/A').replace(/,/g, ';')},${t.category || 'N/A'},${t.type},${t.amount || 0}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    setShowExportDropdown(false);
    // Excel-compatible CSV
    let csvContent = '\uFEFF'; // BOM for UTF-8
    csvContent += 'Transaction Report - Pocket Money Manager\n';
    csvContent += `Generated on,${new Date().toLocaleString()}\n`;
    csvContent += `Total Transactions,${transactions.length}\n\n`;
    
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    csvContent += `Total Income,Rs. ${totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Total Expenses,Rs. ${totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Net Balance,Rs. ${(totalIncome - totalExpense).toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n\n`;
    
    csvContent += 'Date,Description,Category,Type,Amount\n';
    transactions.forEach(t => {
      csvContent += `${new Date(t.date).toLocaleDateString()},${(t.note || t.description || 'N/A').replace(/,/g, ';')},${t.category || 'N/A'},${t.type},Rs. ${(t.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToWord = () => {
    setShowExportDropdown(false);
    // Create RTF content for Word
    let rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}`;
    rtfContent += `\\f0\\fs24 `;
    rtfContent += `{\\b\\fs32 Transaction Report - Pocket Money Manager}\\par\\par`;
    rtfContent += `Generated on: ${new Date().toLocaleString()}\\par`;
    rtfContent += `Total Transactions: ${transactions.length}\\par\\par`;
    
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    rtfContent += `Total Income: Rs. ${totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\\par`;
    rtfContent += `Total Expenses: Rs. ${totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\\par`;
    rtfContent += `Net Balance: Rs. ${(totalIncome - totalExpense).toLocaleString('en-IN', { maximumFractionDigits: 2 })}\\par\\par`;
    
    rtfContent += `{\\b\\fs28 TRANSACTIONS}\\par\\par`;
    transactions.forEach(t => {
      rtfContent += `Date: ${new Date(t.date).toLocaleDateString()}\\par`;
      rtfContent += `Description: ${t.note || t.description || 'N/A'}\\par`;
      rtfContent += `Category: ${t.category || 'N/A'}\\par`;
      rtfContent += `Type: ${t.type}\\par`;
      rtfContent += `Amount: Rs. ${(t.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}\\par\\par`;
    });
    
    rtfContent += `}`;
    
    const blob = new Blob([rtfContent], { type: 'application/msword' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.doc`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setDescription(transaction.note || transaction.description || '');
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    // Set category based on type
    const currentCategories = transaction.type === 'expense' ? expenseCategories : incomeCategories;
    setCategory(transaction.category || currentCategories[0] || 'Other');
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  const handleDelete = async (id) => {
    // Replaced window.confirm with a simple confirm for this environment
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        await refreshTransactions();
      } catch (err) {
        setError('Failed to delete transaction.');
        console.error(err);
      }
    }
  };

  // --- Gemini API Call ---
  const handleSuggestCategory = async () => {
    if (description.trim() === '') return;

    setIsSuggesting(true);
    const systemPrompt = `You are a transaction categorization bot. Your only job is to return a single category from this list: [${categories.join(
      ', '
    )}]. Do not add any other text, just the single best category name.`;
    const userQuery = `Description: "${description}"`;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (!apiKey) {
      setIsSuggesting(false);
      console.warn('Gemini API key not configured. Category suggestion disabled.');
      return;
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    };

    try {
      // Add exponential backoff for retries
      let response;
      let retries = 3;
      let delay = 1000;
      for (let i = 0; i < retries; i++) {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          break; // Success
        }
        if (response.status === 429 || response.status >= 500) {
          // Retry on rate limit or server error
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          break; // Don't retry
        }
      }

      if (!response.ok) {
        console.error(
          'Gemini API Error:',
          response.status,
          await response.text()
        );
        // Don't set error, just fail silently
        setIsSuggesting(false);
        return;
      }

      const result = await response.json();
      let suggestedCategory = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (suggestedCategory) {
        suggestedCategory = suggestedCategory.trim();
        // Validate if the suggested category is in our list
        if (categories.includes(suggestedCategory)) {
          setCategory(suggestedCategory);
        } else {
          console.warn(
            `Gemini suggested an invalid category: ${suggestedCategory}`
          );
          // Fallback if AI gives a weird response
          const lowerCaseSuggestion = suggestedCategory.toLowerCase();
          const found = categories.find((c) =>
            lowerCaseSuggestion.includes(c.toLowerCase())
          );
          setCategory(found || 'Other');
        }
      }
    } catch (error) {
      console.error('Error fetching category suggestion:', error);
    } finally {
      setIsSuggesting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view transactions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4" key="transactions-content">
      {/* Add/Edit Transaction Form */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {editingId ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          {error && (
            <div className="mb-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Coffee, Paycheck"
                />
                {type === 'expense' && (
                  <button
                    type="button"
                    onClick={handleSuggestCategory}
                    disabled={isSuggesting || !description}
                    className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Suggest Category"
                  >
                    {isSuggesting ? (
                      <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <SparkleIcon />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setType(newType);
                  // Reset category to first option of new type
                  const newCategories = newType === 'expense' ? expenseCategories : incomeCategories;
                  setCategory(newCategories[0] || 'Other');
                }}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                {editingId ? 'Update Transaction' : 'Add Transaction'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Transaction List */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Transaction History
            </h2>
            {transactions.length > 0 && (
              <div className="relative flex-shrink-0" ref={exportDropdownRef}>
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-red-600" />
                        Export as PDF
                      </button>
                      <button
                        onClick={exportToWord}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        Export as Word
                      </button>
                      <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        Export as CSV
                      </button>
                      <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        Export as Excel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 w-full"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {transaction.note || transaction.description || 'No description'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()} -{' '}
                      <span className="capitalize">
                        {transaction.category || transaction.type}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <p
                      className={`font-semibold whitespace-nowrap ${
                        transaction.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transform transition-all duration-200 hover:scale-110 active:scale-95 font-medium whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transform transition-all duration-200 hover:scale-110 active:scale-95 font-medium whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">
                No transactions yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;