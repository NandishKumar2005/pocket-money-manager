import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon,
  Calendar,
  DollarSign,
  Filter,
  Download
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedChart, setSelectedChart] = useState('trends');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll();
      setTransactions(response.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by time range
  const getFilteredTransactions = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeRange) {
      case '1month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.date) >= filterDate);
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate summary data
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  // Monthly trends data
  const monthlyData = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { 
        month: monthName, 
        income: 0, 
        expense: 0, 
        net: 0,
        monthKey 
      };
    }
    
    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount;
    } else {
      acc[monthKey].expense += transaction.amount;
    }
    
    acc[monthKey].net = acc[monthKey].income - acc[monthKey].expense;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  // Category breakdown for expenses
  const expenseCategories = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseCategories)
    .map(([category, amount]) => ({ name: category, value: amount }))
    .sort((a, b) => b.value - a.value);

  // Income categories
  const incomeCategories = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {});

  const incomePieData = Object.entries(incomeCategories)
    .map(([category, amount]) => ({ name: category, value: amount }))
    .sort((a, b) => b.value - a.value);

  const COLORS = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', 
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color = 'accent-primary' }) => (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${
            trend > 0 ? 'text-accent-success' : 'text-accent-danger'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-secondary mb-1">{title}</h3>
      <p className="text-2xl font-bold text-primary">${value.toLocaleString()}</p>
    </div>
  );

  const ChartCard = ({ title, children, className = '' }) => (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
          <p className="text-secondary">Insights into your financial patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="Net Income"
          value={netIncome}
          icon={DollarSign}
          color={netIncome >= 0 ? 'accent-success' : 'accent-danger'}
        />
        <StatCard
          title="Transactions"
          value={filteredTransactions.length}
          icon={BarChart3}
          color="accent-secondary"
        />
      </div>

      {/* Chart Toggle */}
      <div className="flex gap-2 p-1 bg-tertiary rounded-lg w-fit">
        <button
          onClick={() => setSelectedChart('trends')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedChart === 'trends'
              ? 'bg-accent-primary text-white'
              : 'text-secondary hover:text-primary'
          }`}
        >
          Trends
        </button>
        <button
          onClick={() => setSelectedChart('categories')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedChart === 'categories'
              ? 'bg-accent-primary text-white'
              : 'text-secondary hover:text-primary'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setSelectedChart('comparison')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedChart === 'comparison'
              ? 'bg-accent-primary text-white'
              : 'text-secondary hover:text-primary'
          }`}
        >
          Comparison
        </button>
      </div>

      {/* Charts */}
      {selectedChart === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Income vs Expenses Over Time">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="var(--accent-success)"
                    fill="var(--accent-success)"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stackId="1"
                    stroke="var(--accent-danger)"
                    fill="var(--accent-danger)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Net Income Trend">
            <div className="h-80">
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
                    dataKey="net"
                    stroke="var(--accent-primary)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--accent-primary)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {selectedChart === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Expense Categories">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Income Sources">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incomePieData.map((entry, index) => (
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {selectedChart === 'comparison' && (
        <div className="grid grid-cols-1 gap-6">
          <ChartCard title="Monthly Comparison">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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
                  <Legend />
                  <Bar dataKey="income" fill="var(--accent-success)" name="Income" />
                  <Bar dataKey="expense" fill="var(--accent-danger)" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {/* Category Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top Expense Categories">
          <div className="space-y-3">
            {pieData.slice(0, 5).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-primary font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">${item.value.toLocaleString()}</p>
                  <p className="text-sm text-secondary">
                    {((item.value / totalExpenses) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top Income Sources">
          <div className="space-y-3">
            {incomePieData.slice(0, 5).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-primary font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">${item.value.toLocaleString()}</p>
                  <p className="text-sm text-secondary">
                    {totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
