import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { transactionsAPI } from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll();
      setTransactions(response.data || []);
      setError('');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial data
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Chart data for monthly trends
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    return acc;
  }, {});

  const chartData = Object.values(monthlyData).slice(-6); // Last 6 months

  // Category breakdown
  const categoryData = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
    }
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'accent-primary' }) => (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-accent-success' : 'text-accent-danger'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trendValue}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-secondary mb-1">{title}</h3>
      <p className="text-2xl font-bold text-primary">₹{value.toLocaleString()}</p>
    </div>
  );

  const TransactionItem = ({ transaction }) => (
    <div className="flex items-center justify-between p-3 bg-tertiary rounded-lg hover:bg-opacity-80 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          transaction.type === 'income' 
            ? 'bg-accent-success bg-opacity-10' 
            : 'bg-accent-danger bg-opacity-10'
        }`}>
          {transaction.type === 'income' ? (
            <TrendingUp className="w-4 h-4 text-accent-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-accent-danger" />
          )}
        </div>
        <div>
          <p className="font-medium text-primary">{transaction.category}</p>
          <p className="text-sm text-secondary">{transaction.note || 'No description'}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${
          transaction.type === 'income' ? 'text-accent-success' : 'text-accent-danger'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs text-muted">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-secondary">Here's your financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted" />
          <span className="text-sm text-secondary">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={balance}
          icon={DollarSign}
          color="accent-primary"
        />
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon={TrendingUp}
          color="accent-success"
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon={TrendingDown}
          color="accent-danger"
        />
        <StatCard
          title="Transactions"
          value={transactions.length}
          icon={CreditCard}
          color="accent-secondary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-primary mb-4">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="var(--accent-success)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--accent-success)', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="var(--accent-danger)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--accent-danger)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-primary mb-4">Expense Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">Recent Transactions</h3>
          <button className="btn btn-secondary btn-sm">
            <Filter className="w-4 h-4" />
            View All
          </button>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction._id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-secondary">No transactions yet</p>
            <p className="text-sm text-muted">Start by adding your first transaction</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
