import { useState } from 'react';
import { Sparkles, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

export default function AIAdvisor() {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');
    setAnalysis('');

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
    const token = localStorage.getItem('pocket-money-token');

    try {
      const response = await fetch(`${baseUrl}/ai/analyze`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to get analysis');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
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
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
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
            <p className="text-xs text-secondary">Powered by Gemini AI</p>
          </div>
        </div>
        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : analysis ? 'Refresh' : 'Analyze'}
        </button>
      </div>

      {!analysis && !loading && !error && (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-secondary mb-1">Get personalized investment advice</p>
          <p className="text-sm text-muted">
            Click Analyze to get AI-powered insights based on your transactions
          </p>
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
