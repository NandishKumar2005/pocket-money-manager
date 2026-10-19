import { useState } from 'react';
import { Sparkles, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';
import { callAI } from '../services/aiService';
import { transactionsAPI } from '../services/api';

export default function AIAdvisor() {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const res = await transactionsAPI.getAll();
      const transactions = res.data || [];

      if (!transactions.length) {
        setAnalysis("You don't have any transactions yet. Add some income and expenses to get personalised investment advice!");
        setLoading(false);
        return;
      }

      const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const balance = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

      const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});

      const summary = `User Financial Summary:
- Total Income: Rs.${totalIncome.toLocaleString()}
- Total Expenses: Rs.${totalExpenses.toLocaleString()}
- Current Balance: Rs.${balance.toLocaleString()}
- Savings Rate: ${savingsRate}%
- Expense Breakdown: ${JSON.stringify(expenseByCategory)}
- Total Transactions: ${transactions.length}`;

      const systemPrompt = `You are a friendly personal finance and investment advisor AI for Indian users.
Analyze financial data and provide:
1. Brief assessment of financial health (2-3 sentences)
2. Top 3 actionable investment suggestions based on savings rate
3. One key area to reduce spending
4. Simple investment allocation (% in FD, SIP mutual funds, stocks, emergency fund)
Be encouraging. Use Indian context (Rs., FDs, SIPs). Use emojis for section headings.`;

      const result = await callAI(systemPrompt, [{ role: 'user', content: summary }]);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Could not fetch analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="mb-1">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">AI Investment Advisor</h3>
            <p className="text-xs text-secondary">Powered by OpenRouter AI</p>
          </div>
        </div>
        <button onClick={fetchAnalysis} disabled={loading} className="btn btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : analysis ? 'Refresh' : 'Analyze'}
        </button>
      </div>

      {!analysis && !loading && !error && (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-secondary mb-1">Get personalized investment advice</p>
          <p className="text-sm text-muted">Click Analyze to get AI-powered insights based on your transactions</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="spinner mx-auto mb-3" />
          <p className="text-secondary">Analyzing your financial data...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {analysis && (
        <div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-lg text-sm text-primary leading-relaxed">
            {renderAnalysis(analysis)}
          </div>
          <p className="text-xs text-muted mt-2">
            * AI-generated advice for educational purposes only. Consult a certified financial advisor for actual investment decisions.
          </p>
        </div>
      )}
    </div>
  );
}
