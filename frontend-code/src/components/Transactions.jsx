import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  Check
} from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const categories = [
    'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 
    'Healthcare', 'Education', 'Salary', 'Freelance', 'Investment', 'Other'
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll();
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.amount || !formData.category || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Prepare data for API
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      console.log('Submitting transaction:', transactionData);
      
      if (editingTransaction) {
        const response = await transactionsAPI.update(editingTransaction._id, transactionData);
        console.log('Update response:', response);
      } else {
        const response = await transactionsAPI.create(transactionData);
        console.log('Create response:', response);
      }
      
      await fetchTransactions();
      setShowModal(false);
      setEditingTransaction(null);
      resetForm();
      
      console.log('Transaction saved successfully');
    } catch (err) {
      console.error('Transaction save error:', err);
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsAPI.delete(id);
        await fetchTransactions();
      } catch (err) {
        setError('Failed to delete transaction');
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: new Date(transaction.date).toISOString().split('T')[0],
      note: transaction.note || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
  };

  const openModal = () => {
    setEditingTransaction(null);
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    resetForm();
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'all' || transaction.type === filters.type;
    const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
    const matchesDateFrom = !filters.dateFrom || new Date(transaction.date) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(transaction.date) <= new Date(filters.dateTo);
    
    return matchesSearch && matchesType && matchesCategory && matchesDateFrom && matchesDateTo;
  });

  const TransactionCard = ({ transaction }) => (
    <div className="card hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${
            transaction.type === 'income' 
              ? 'bg-accent-success bg-opacity-10' 
              : 'bg-accent-danger bg-opacity-10'
          }`}>
            {transaction.type === 'income' ? (
              <TrendingUp className="w-5 h-5 text-accent-success" />
            ) : (
              <TrendingDown className="w-5 h-5 text-accent-danger" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-primary">{transaction.category}</h3>
            <p className="text-sm text-secondary">
              {new Date(transaction.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            {transaction.note && (
              <p className="text-sm text-muted mt-1">{transaction.note}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`text-lg font-bold ${
              transaction.type === 'income' ? 'text-accent-success' : 'text-accent-danger'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
            </p>
            <p className="text-xs text-muted capitalize">{transaction.type}</p>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleEdit(transaction)}
              className="p-2 hover:bg-tertiary rounded-lg transition-colors"
              title="Edit transaction"
            >
              <Edit className="w-4 h-4 text-secondary" />
            </button>
            <button
              onClick={() => handleDelete(transaction._id)}
              className="p-2 hover:bg-accent-danger hover:bg-opacity-10 rounded-lg transition-colors"
              title="Delete transaction"
            >
              <Trash2 className="w-4 h-4 text-accent-danger" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-secondary rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-secondary" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-accent-danger bg-opacity-10 border border-accent-danger border-opacity-20 rounded-lg text-accent-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Type</label>
              <div className="flex bg-tertiary rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    formData.type === 'expense'
                      ? 'bg-accent-danger text-white'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    formData.type === 'income'
                      ? 'bg-accent-success text-white'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="input pl-10"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="input"
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Note (Optional)</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="input"
                rows="3"
                placeholder="Add a note..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 btn btn-primary"
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner" />
                    {editingTransaction ? 'Updating...' : 'Adding...'}
                  </div>
                ) : (
                  `${editingTransaction ? 'Update' : 'Add'} Transaction`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-secondary">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Transactions</h1>
          <p className="text-secondary">Manage your income and expenses</p>
        </div>
        <button onClick={openModal} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="input"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="flex gap-2">
            <input
              type="date"
              placeholder="From"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="input"
            />
            <input
              type="date"
              placeholder="To"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">No transactions found</h3>
            <p className="text-secondary mb-4">
              {searchTerm || filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo
                ? 'Try adjusting your filters'
                : 'Get started by adding your first transaction'
              }
            </p>
            {!searchTerm && filters.type === 'all' && filters.category === 'all' && !filters.dateFrom && !filters.dateTo && (
              <button onClick={openModal} className="btn btn-primary">
                <Plus className="w-5 h-5" />
                Add Transaction
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <Modal />}
    </div>
  );
};

export default Transactions;
