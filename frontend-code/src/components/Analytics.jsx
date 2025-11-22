// import { useState, useEffect } from 'react';
// import { transactionsAPI } from '../services/api';
// import { 
//   BarChart3, 
//   TrendingUp, 
//   TrendingDown, 
//   PieChart as PieChartIcon,
//   Calendar,
//   DollarSign,
//   Filter,
//   Download,
//   FileText,
//   FileSpreadsheet,
//   ChevronDown
// } from 'lucide-react';
// import { 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer, 
//   BarChart, 
//   Bar, 
//   PieChart, 
//   Pie, 
//   Cell,
//   AreaChart,
//   Area,
//   Legend
// } from 'recharts';

// const Analytics = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState('6months');
//   const [selectedChart, setSelectedChart] = useState('trends');
//   const [exportStatus, setExportStatus] = useState('');
//   const [showExportDropdown, setShowExportDropdown] = useState(false);

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showExportDropdown && !event.target.closest('.relative')) {
//         setShowExportDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showExportDropdown]);

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);
//       const response = await transactionsAPI.getAll();
//       setTransactions(response.data);
//     } catch (err) {
//       console.error('Failed to fetch transactions:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter transactions by time range
//   const getFilteredTransactions = () => {
//     const now = new Date();
//     const filterDate = new Date();
    
//     switch (timeRange) {
//       case '1month':
//         filterDate.setMonth(now.getMonth() - 1);
//         break;
//       case '3months':
//         filterDate.setMonth(now.getMonth() - 3);
//         break;
//       case '6months':
//         filterDate.setMonth(now.getMonth() - 6);
//         break;
//       case '1year':
//         filterDate.setFullYear(now.getFullYear() - 1);
//         break;
//       default:
//         return transactions;
//     }
    
//     return transactions.filter(t => new Date(t.date) >= filterDate);
//   };

//   const filteredTransactions = getFilteredTransactions();

//   // Calculate summary data
//   const totalIncome = filteredTransactions
//     .filter(t => t.type === 'income')
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalExpenses = filteredTransactions
//     .filter(t => t.type === 'expense')
//     .reduce((sum, t) => sum + t.amount, 0);

//   const netIncome = totalIncome - totalExpenses;

//   // Monthly trends data
//   const monthlyData = filteredTransactions.reduce((acc, transaction) => {
//     const date = new Date(transaction.date);
//     const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//     const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
//     if (!acc[monthKey]) {
//       acc[monthKey] = { 
//         month: monthName, 
//         income: 0, 
//         expense: 0, 
//         net: 0,
//         monthKey 
//       };
//     }
    
//     if (transaction.type === 'income') {
//       acc[monthKey].income += transaction.amount;
//     } else {
//       acc[monthKey].expense += transaction.amount;
//     }
    
//     acc[monthKey].net = acc[monthKey].income - acc[monthKey].expense;
//     return acc;
//   }, {});

//   const chartData = Object.values(monthlyData).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

//   // Category breakdown for expenses
//   const expenseCategories = filteredTransactions
//     .filter(t => t.type === 'expense')
//     .reduce((acc, transaction) => {
//       if (!acc[transaction.category]) {
//         acc[transaction.category] = 0;
//       }
//       acc[transaction.category] += transaction.amount;
//       return acc;
//     }, {});

//   const pieData = Object.entries(expenseCategories)
//     .map(([category, amount]) => ({ name: category, value: amount }))
//     .sort((a, b) => b.value - a.value);

//   // Income categories
//   const incomeCategories = filteredTransactions
//     .filter(t => t.type === 'income')
//     .reduce((acc, transaction) => {
//       if (!acc[transaction.category]) {
//         acc[transaction.category] = 0;
//       }
//       acc[transaction.category] += transaction.amount;
//       return acc;
//     }, {});

//   const incomePieData = Object.entries(incomeCategories)
//     .map(([category, amount]) => ({ name: category, value: amount }))
//     .sort((a, b) => b.value - a.value);

//   // Export to CSV
//   const exportToCSV = () => {
//     setExportStatus('Generating CSV report...');
//     setShowExportDropdown(false);
//     const analyticsData = {
//       summary: {
//         timeRange,
//         totalIncome,
//         totalExpenses,
//         netIncome,
//         transactionCount: filteredTransactions.length,
//         generatedOn: new Date().toISOString()
//       },
//       monthlyTrends: chartData,
//       expenseCategories: pieData,
//       incomeCategories: incomePieData,
//       transactions: filteredTransactions.map(t => ({
//         date: t.date,
//         type: t.type,
//         category: t.category,
//         amount: t.amount,
//         note: t.note || ''
//       }))
//     };

//     // Create CSV content
//     let csvContent = "Analytics Report - Pocket Money Manager\n";
//     csvContent += `Generated on: ${new Date().toLocaleString()}\n`;
//     csvContent += `Time Range: ${timeRange}\n\n`;
    
//     // Summary
//     csvContent += "SUMMARY\n";
//     csvContent += `Total Income,₹${totalIncome.toLocaleString()}\n`;
//     csvContent += `Total Expenses,₹${totalExpenses.toLocaleString()}\n`;
//     csvContent += `Net Income,₹${netIncome.toLocaleString()}\n`;
//     csvContent += `Total Transactions,${filteredTransactions.length}\n\n`;
    
//     // Monthly Trends
//     csvContent += "MONTHLY TRENDS\n";
//     csvContent += "Month,Income,Expenses,Net\n";
//     chartData.forEach(month => {
//       csvContent += `${month.month},₹${month.income.toLocaleString()},₹${month.expense.toLocaleString()},₹${month.net.toLocaleString()}\n`;
//     });
//     csvContent += "\n";
    
//     // Expense Categories
//     csvContent += "EXPENSE CATEGORIES\n";
//     csvContent += "Category,Amount,Percentage\n";
//     pieData.forEach(category => {
//       const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
//       csvContent += `${category.name},₹${category.value.toLocaleString()},${percentage}%\n`;
//     });
//     csvContent += "\n";
    
//     // Income Categories
//     csvContent += "INCOME CATEGORIES\n";
//     csvContent += "Category,Amount,Percentage\n";
//     incomePieData.forEach(category => {
//       const percentage = ((category.value / totalIncome) * 100).toFixed(1);
//       csvContent += `${category.name},₹${category.value.toLocaleString()},${percentage}%\n`;
//     });
//     csvContent += "\n";
    
//     // All Transactions
//     csvContent += "ALL TRANSACTIONS\n";
//     csvContent += "Date,Type,Category,Amount,Note\n";
//     filteredTransactions
//       .sort((a, b) => new Date(b.date) - new Date(a.date))
//       .forEach(t => {
//         csvContent += `${new Date(t.date).toLocaleDateString()},${t.type},${t.category},₹${t.amount.toLocaleString()},"${t.note || ''}"\n`;
//       });

//     // Download CSV
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     setExportStatus('CSV report exported successfully!');
//     setTimeout(() => setExportStatus(''), 3000);
//   };

//   // Export to Excel (XLSX format)
//   const exportToExcel = () => {
//     setExportStatus('Generating Excel report...');
//     setShowExportDropdown(false);

//     // Create Excel-compatible CSV with proper formatting
//     let excelContent = "Analytics Report - Pocket Money Manager\n";
//     excelContent += `Generated on,${new Date().toLocaleString()}\n`;
//     excelContent += `Time Range,${timeRange}\n\n`;
    
//     // Summary Sheet
//     excelContent += "SUMMARY\n";
//     excelContent += "Metric,Amount\n";
//     excelContent += `Total Income,${totalIncome}\n`;
//     excelContent += `Total Expenses,${totalExpenses}\n`;
//     excelContent += `Net Income,${netIncome}\n`;
//     excelContent += `Total Transactions,${filteredTransactions.length}\n\n`;
    
//     // Monthly Trends
//     excelContent += "MONTHLY TRENDS\n";
//     excelContent += "Month,Income,Expenses,Net\n";
//     chartData.forEach(month => {
//       excelContent += `${month.month},${month.income},${month.expense},${month.net}\n`;
//     });
//     excelContent += "\n";
    
//     // Categories
//     excelContent += "EXPENSE CATEGORIES\n";
//     excelContent += "Category,Amount,Percentage\n";
//     pieData.forEach(category => {
//       const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
//       excelContent += `${category.name},${category.value},${percentage}%\n`;
//     });
    
//     const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.xlsx`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     setExportStatus('Excel report exported successfully!');
//     setTimeout(() => setExportStatus(''), 3000);
//   };

//   // Export to PDF (HTML to PDF)
//   const exportToPDF = () => {
//     setExportStatus('Generating PDF report...');
//     setShowExportDropdown(false);

//     // Create HTML content for PDF
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Analytics Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           .header { text-align: center; margin-bottom: 30px; }
//           .section { margin-bottom: 25px; }
//           .section h2 { color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
//           table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//           th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//           th { background-color: #f8fafc; }
//           .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
//           .stat-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>Analytics Report - Pocket Money Manager</h1>
//           <p>Generated on: ${new Date().toLocaleString()}</p>
//           <p>Time Range: ${timeRange}</p>
//         </div>
        
//         <div class="section">
//           <h2>Summary</h2>
//           <div class="summary-grid">
//             <div class="stat-card">
//               <h3>Total Income</h3>
//               <p>₹${totalIncome.toLocaleString()}</p>
//             </div>
//             <div class="stat-card">
//               <h3>Total Expenses</h3>
//               <p>₹${totalExpenses.toLocaleString()}</p>
//             </div>
//             <div class="stat-card">
//               <h3>Net Income</h3>
//               <p>₹${netIncome.toLocaleString()}</p>
//             </div>
//             <div class="stat-card">
//               <h3>Total Transactions</h3>
//               <p>${filteredTransactions.length}</p>
//             </div>
//           </div>
//         </div>

//         <div class="section">
//           <h2>Monthly Trends</h2>
//           <table>
//             <thead>
//               <tr><th>Month</th><th>Income</th><th>Expenses</th><th>Net</th></tr>
//             </thead>
//             <tbody>
//               ${chartData.map(month => `
//                 <tr>
//                   <td>${month.month}</td>
//                   <td>₹${month.income.toLocaleString()}</td>
//                   <td>₹${month.expense.toLocaleString()}</td>
//                   <td>₹${month.net.toLocaleString()}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </div>

//         <div class="section">
//           <h2>Expense Categories</h2>
//           <table>
//             <thead>
//               <tr><th>Category</th><th>Amount</th><th>Percentage</th></tr>
//             </thead>
//             <tbody>
//               ${pieData.map(category => {
//                 const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
//                 return `
//                   <tr>
//                     <td>${category.name}</td>
//                     <td>₹${category.value.toLocaleString()}</td>
//                     <td>${percentage}%</td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//           </table>
//         </div>
//       </body>
//       </html>
//     `;

//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.html`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     setExportStatus('PDF report exported successfully! (HTML format - can be converted to PDF)');
//     setTimeout(() => setExportStatus(''), 4000);
//   };

//   // Export to Word (RTF format)
//   const exportToWord = () => {
//     setExportStatus('Generating Word document...');
//     setShowExportDropdown(false);

//     // Create RTF content for Word
//     let rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}`;
//     rtfContent += `\\f0\\fs24 `;
//     rtfContent += `{\\b\\fs32 Analytics Report - Pocket Money Manager}\\par\\par`;
//     rtfContent += `Generated on: ${new Date().toLocaleString()}\\par`;
//     rtfContent += `Time Range: ${timeRange}\\par\\par`;
    
//     rtfContent += `{\\b\\fs28 SUMMARY}\\par`;
//     rtfContent += `Total Income: ₹${totalIncome.toLocaleString()}\\par`;
//     rtfContent += `Total Expenses: ₹${totalExpenses.toLocaleString()}\\par`;
//     rtfContent += `Net Income: ₹${netIncome.toLocaleString()}\\par`;
//     rtfContent += `Total Transactions: ${filteredTransactions.length}\\par\\par`;
    
//     rtfContent += `{\\b\\fs28 MONTHLY TRENDS}\\par`;
//     chartData.forEach(month => {
//       rtfContent += `${month.month}: Income ₹${month.income.toLocaleString()}, Expenses ₹${month.expense.toLocaleString()}, Net ₹${month.net.toLocaleString()}\\par`;
//     });
//     rtfContent += `\\par`;
    
//     rtfContent += `{\\b\\fs28 EXPENSE CATEGORIES}\\par`;
//     pieData.forEach(category => {
//       const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
//       rtfContent += `${category.name}: ₹${category.value.toLocaleString()} (${percentage}%)\\par`;
//     });
    
//     rtfContent += `}`;

//     const blob = new Blob([rtfContent], { type: 'application/rtf' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.rtf`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     setExportStatus('Word document exported successfully!');
//     setTimeout(() => setExportStatus(''), 3000);
//   };

//   const COLORS = [
//     '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', 
//     '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
//   ];

//   const StatCard = ({ title, value, icon: Icon, trend, color = 'accent-primary', showCurrency = true }) => (
//     <div className="card hover:shadow-lg transition-all duration-300">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`p-3 rounded-lg bg-${color} bg-opacity-10`}>
//           <Icon className={`w-6 h-6 text-${color}`} />
//         </div>
//         {trend && (
//           <div className={`text-sm font-medium ${
//             trend > 0 ? 'text-accent-success' : 'text-accent-danger'
//           }`}>
//             {trend > 0 ? '+' : ''}{trend}%
//           </div>
//         )}
//       </div>
//       <h3 className="text-sm font-medium text-secondary mb-1">{title}</h3>
//       <p className="text-2xl font-bold text-primary">
//         {showCurrency ? `₹${value.toLocaleString()}` : value.toLocaleString()}
//       </p>
//     </div>
//   );

//   const ChartCard = ({ title, children, className = '' }) => (
//     <div className={`card ${className}`}>
//       <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
//       {children}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="spinner mx-auto mb-4" />
//           <p className="text-secondary">Loading analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
//           <p className="text-secondary">Insights into your financial patterns</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="input"
//           >
//             <option value="1month">Last Month</option>
//             <option value="3months">Last 3 Months</option>
//             <option value="6months">Last 6 Months</option>
//             <option value="1year">Last Year</option>
//           </select>
//           <div className="relative">
//             <button 
//               onClick={() => setShowExportDropdown(!showExportDropdown)}
//               className="btn btn-secondary"
//               disabled={exportStatus.includes('Generating')}
//             >
//               <Download className="w-4 h-4" />
//               {exportStatus.includes('Generating') ? 'Exporting...' : 'Export'}
//               <ChevronDown className="w-4 h-4 ml-1" />
//             </button>
            
//             {showExportDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-secondary border border-color rounded-lg shadow-lg z-50">
//                 <div className="py-1">
//                   <button
//                     onClick={exportToCSV}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary hover:bg-tertiary transition-colors"
//                   >
//                     <FileSpreadsheet className="w-4 h-4" />
//                     Export as CSV
//                   </button>
//                   <button
//                     onClick={exportToExcel}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary hover:bg-tertiary transition-colors"
//                   >
//                     <FileSpreadsheet className="w-4 h-4 text-accent-success" />
//                     Export as Excel
//                   </button>
//                   <button
//                     onClick={exportToPDF}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary hover:bg-tertiary transition-colors"
//                   >
//                     <FileText className="w-4 h-4 text-accent-danger" />
//                     Export as PDF
//                   </button>
//                   <button
//                     onClick={exportToWord}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary hover:bg-tertiary transition-colors"
//                   >
//                     <FileText className="w-4 h-4 text-accent-primary" />
//                     Export as Word
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Export Status Notification */}
//       {exportStatus && (
//         <div className={`p-3 rounded-lg text-sm font-medium ${
//           exportStatus.includes('success') 
//             ? 'bg-accent-success bg-opacity-10 text-accent-success border border-accent-success border-opacity-20' 
//             : 'bg-accent-primary bg-opacity-10 text-accent-primary border border-accent-primary border-opacity-20'
//         }`}>
//           {exportStatus}
//         </div>
//       )}

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Income"
//           value={totalIncome}
//           icon={TrendingUp}
//           color="accent-success"
//         />
//         <StatCard
//           title="Total Expenses"
//           value={totalExpenses}
//           icon={TrendingDown}
//           color="accent-danger"
//         />
//         <StatCard
//           title="Net Income"
//           value={netIncome}
//           icon={DollarSign}
//           color={netIncome >= 0 ? 'accent-success' : 'accent-danger'}
//         />
//         <StatCard
//           title="Transactions"
//           value={filteredTransactions.length}
//           icon={BarChart3}
//           color="accent-secondary"
//           showCurrency={false}
//         />
//       </div>

//       {/* Chart Toggle */}
//       <div className="flex gap-2 p-1 bg-tertiary rounded-lg w-fit">
//         <button
//           onClick={() => setSelectedChart('trends')}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//             selectedChart === 'trends'
//               ? 'bg-accent-primary text-white'
//               : 'text-secondary hover:text-primary'
//           }`}
//         >
//           Trends
//         </button>
//         <button
//           onClick={() => setSelectedChart('categories')}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//             selectedChart === 'categories'
//               ? 'bg-accent-primary text-white'
//               : 'text-secondary hover:text-primary'
//           }`}
//         >
//           Categories
//         </button>
//         <button
//           onClick={() => setSelectedChart('comparison')}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//             selectedChart === 'comparison'
//               ? 'bg-accent-primary text-white'
//               : 'text-secondary hover:text-primary'
//           }`}
//         >
//           Comparison
//         </button>
//       </div>

//       {/* Charts */}
//       {selectedChart === 'trends' && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <ChartCard title="Income vs Expenses Over Time">
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
//                   <XAxis dataKey="month" stroke="var(--text-secondary)" />
//                   <YAxis stroke="var(--text-secondary)" />
//                   <Tooltip 
//                     contentStyle={{
//                       backgroundColor: 'var(--bg-secondary)',
//                       border: '1px solid var(--border-color)',
//                       borderRadius: 'var(--radius-md)',
//                       color: 'var(--text-primary)'
//                     }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="income"
//                     stackId="1"
//                     stroke="var(--accent-success)"
//                     fill="var(--accent-success)"
//                     fillOpacity={0.3}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="expense"
//                     stackId="1"
//                     stroke="var(--accent-danger)"
//                     fill="var(--accent-danger)"
//                     fillOpacity={0.3}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </ChartCard>

//           <ChartCard title="Net Income Trend">
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
//                   <XAxis dataKey="month" stroke="var(--text-secondary)" />
//                   <YAxis stroke="var(--text-secondary)" />
//                   <Tooltip 
//                     contentStyle={{
//                       backgroundColor: 'var(--bg-secondary)',
//                       border: '1px solid var(--border-color)',
//                       borderRadius: 'var(--radius-md)',
//                       color: 'var(--text-primary)'
//                     }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="net"
//                     stroke="var(--accent-primary)"
//                     strokeWidth={3}
//                     dot={{ fill: 'var(--accent-primary)', strokeWidth: 2, r: 4 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </ChartCard>
//         </div>
//       )}

//       {selectedChart === 'categories' && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <ChartCard title="Expense Categories">
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={120}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip 
//                     contentStyle={{
//                       backgroundColor: 'var(--bg-secondary)',
//                       border: '1px solid var(--border-color)',
//                       borderRadius: 'var(--radius-md)',
//                       color: 'var(--text-primary)'
//                     }}
//                   />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </ChartCard>

//           <ChartCard title="Income Sources">
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={incomePieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={120}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {incomePieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip 
//                     contentStyle={{
//                       backgroundColor: 'var(--bg-secondary)',
//                       border: '1px solid var(--border-color)',
//                       borderRadius: 'var(--radius-md)',
//                       color: 'var(--text-primary)'
//                     }}
//                   />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </ChartCard>
//         </div>
//       )}

//       {selectedChart === 'comparison' && (
//         <div className="grid grid-cols-1 gap-6">
//           <ChartCard title="Monthly Comparison">
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
//                   <XAxis dataKey="month" stroke="var(--text-secondary)" />
//                   <YAxis stroke="var(--text-secondary)" />
//                   <Tooltip 
//                     contentStyle={{
//                       backgroundColor: 'var(--bg-secondary)',
//                       border: '1px solid var(--border-color)',
//                       borderRadius: 'var(--radius-md)',
//                       color: 'var(--text-primary)'
//                     }}
//                   />
//                   <Legend />
//                   <Bar dataKey="income" fill="var(--accent-success)" name="Income" />
//                   <Bar dataKey="expense" fill="var(--accent-danger)" name="Expenses" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </ChartCard>
//         </div>
//       )}

//       {/* Category Details */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartCard title="Top Expense Categories">
//           <div className="space-y-3">
//             {pieData.slice(0, 5).map((item, index) => (
//               <div key={item.name} className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div 
//                     className="w-4 h-4 rounded-full"
//                     style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                   />
//                   <span className="text-primary font-medium">{item.name}</span>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-semibold text-primary">₹{item.value.toLocaleString()}</p>
//                   <p className="text-sm text-secondary">
//                     {((item.value / totalExpenses) * 100).toFixed(1)}%
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ChartCard>

//         <ChartCard title="Top Income Sources">
//           <div className="space-y-3">
//             {incomePieData.slice(0, 5).map((item, index) => (
//               <div key={item.name} className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div 
//                     className="w-4 h-4 rounded-full"
//                     style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                   />
//                   <span className="text-primary font-medium">{item.name}</span>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-semibold text-primary">₹{item.value.toLocaleString()}</p>
//                   <p className="text-sm text-secondary">
//                     {totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(1) : 0}%
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ChartCard>
//       </div>
//     </div>
//   );
// };

// export default Analytics;


import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getTransactions } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

// AI Sparkle Icon
const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
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

const Analytics = () => {
  console.log('Analytics component rendering');
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getTransactions();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load analytics data:', err);
        setError('Unable to load analytics data right now.');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'expense'),
    [transactions]
  );

  const categoryData = useMemo(() => {
    const categories = {};
    expenseTransactions.forEach((transaction) => {
      const category = transaction.category || 'Other';
      if (categories[category]) {
        categories[category] += transaction.amount;
      } else {
        categories[category] = transaction.amount;
      }
    });
    return categories;
  }, [expenseTransactions]);

  const data = useMemo(() => {
    const labels = Object.keys(categoryData);
    const values = Object.values(categoryData);
    
    if (labels.length === 0 || values.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Expenses by Category',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        }],
      };
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Expenses by Category',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
          ].slice(0, labels.length),
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(150, 150, 150, 1)',
          ].slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  }, [categoryData]);

  const options = useMemo(() => {
    const isDark = typeof window !== 'undefined' && 
      (document.documentElement.classList.contains('dark') || 
       document.body.classList.contains('dark'));
    
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: isDark ? '#FFF' : '#333',
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += formatCurrency(context.parsed);
              }
              return label;
            },
          },
        },
      },
    };
  }, []);

  // --- Gemini API Call ---
  const handleGetAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysis('');

    if (expenseTransactions.length === 0) {
      setAnalysis(
        "You don't have any expense data to analyze yet. Try adding some transactions!"
      );
      setIsAnalyzing(false);
      return;
    }

    // Format the data for the prompt
    const expenseData = expenseTransactions
      .map(
        (t) =>
          `- ${t.description} (Category: ${t.category}): ${formatCurrency(
            t.amount
          )}`
      )
      .join('\n');

    const systemPrompt =
      "You are a friendly, encouraging financial advisor for a user of a 'Pocket Money Manager' app. Your goal is to provide a very short, simple, and actionable analysis based on their spending data. Speak directly to the user.";
    const userQuery = `Here is my recent spending:\n${expenseData}\n\nBased on this, please give me a 2-3 sentence analysis of my spending habits and one actionable tip to help me save money. Be friendly and positive!`;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (!apiKey) {
      setIsAnalyzing(false);
      setAnalysis("I'm sorry, but the Gemini API key is not configured. Please add your API key to the .env file as VITE_GEMINI_API_KEY. You can get a free API key from https://aistudio.google.com/app/apikey");
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
        setAnalysis(
          "Sorry, I couldn't generate an analysis right now. Please try again later."
        );
        setIsAnalyzing(false);
        return;
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setAnalysis(text);
      } else {
        setAnalysis(
          "Sorry, I couldn't generate an analysis. No response from AI."
        );
      }
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      setAnalysis(
        'An error occurred while analyzing your spending. Please check your connection.'
      );
    } finally {
      setIsAnalyzing(false);
    }
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
      doc.text('Analytics Report', 14, yPos);
      yPos += 10;
      
      // Header info
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, yPos);
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
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Total Transactions: ${transactions.length}`, 14, yPos);
      yPos += 10;
      
      // Expense Category Breakdown
      if (Object.keys(categoryData).length > 0 && totalExpense > 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Expense Category Breakdown', 14, yPos);
        yPos += 8;
        
        const categoryTableData = Object.entries(categoryData)
          .sort((a, b) => b[1] - a[1])
          .map(([category, amount]) => [
            category,
            `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            `${((amount / totalExpense) * 100).toFixed(1)}%`
          ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Category', 'Amount', 'Percentage']],
          body: categoryTableData,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
        });
        
        yPos = doc.lastAutoTable?.finalY || yPos + 50;
        yPos += 10;
      }
      
      // Income by Category
      const incomeCategoryData = {};
      transactions.filter(t => t.type === 'income').forEach(t => {
        const category = t.category || 'Other';
        incomeCategoryData[category] = (incomeCategoryData[category] || 0) + (t.amount || 0);
      });
      
      if (Object.keys(incomeCategoryData).length > 0 && totalIncome > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Income Category Breakdown', 14, yPos);
        yPos += 8;
        
        const incomeTableData = Object.entries(incomeCategoryData)
          .sort((a, b) => b[1] - a[1])
          .map(([category, amount]) => [
            category,
            `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            `${((amount / totalIncome) * 100).toFixed(1)}%`
          ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Category', 'Amount', 'Percentage']],
          body: incomeTableData,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
        });
        
        yPos = doc.lastAutoTable?.finalY || yPos + 50;
        yPos += 10;
      }
      
      // Recent Transactions
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Recent Transactions (Last 20)', 14, yPos);
      yPos += 8;
      
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20)
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
        body: recentTransactions,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        margin: { left: 14, right: 14 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      
      // Save PDF
      doc.save(`analytics-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const exportToCSV = () => {
    setShowExportDropdown(false);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    
    let csvContent = 'Analytics Report - Pocket Money Manager\n';
    csvContent += `Generated on,${new Date().toLocaleString()}\n\n`;
    csvContent += 'Summary\n';
    csvContent += `Total Income,Rs. ${totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Total Expenses,Rs. ${totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Net Balance,Rs. ${(totalIncome - totalExpense).toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Total Transactions,${transactions.length}\n\n`;
    csvContent += 'Category Breakdown\n';
    csvContent += 'Category,Amount,Percentage\n';
    
    Object.entries(categoryData).forEach(([category, amount]) => {
      csvContent += `${category},Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })},${((amount / totalExpense) * 100).toFixed(1)}%\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    setShowExportDropdown(false);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    
    let csvContent = '\uFEFF'; // BOM for UTF-8
    csvContent += 'Analytics Report - Pocket Money Manager\n';
    csvContent += `Generated on,${new Date().toLocaleString()}\n\n`;
    csvContent += 'Summary\n';
    csvContent += `Total Income,Rs. ${totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Total Expenses,Rs. ${totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Net Balance,Rs. ${(totalIncome - totalExpense).toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    csvContent += `Total Transactions,${transactions.length}\n\n`;
    csvContent += 'Category Breakdown\n';
    csvContent += 'Category,Amount,Percentage\n';
    
    Object.entries(categoryData).forEach(([category, amount]) => {
      csvContent += `${category},Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })},${((amount / totalExpense) * 100).toFixed(1)}%\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToWord = () => {
    setShowExportDropdown(false);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    
    let rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}`;
    rtfContent += `\\f0\\fs24 `;
    rtfContent += `{\\b\\fs32 Analytics Report - Pocket Money Manager}\\par\\par`;
    rtfContent += `Generated on: ${new Date().toLocaleString()}\\par\\par`;
    
    rtfContent += `{\\b\\fs28 SUMMARY}\\par`;
    rtfContent += `Total Income: Rs. ${totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\\par`;
    rtfContent += `Total Expenses: Rs. ${totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\\par`;
    rtfContent += `Net Balance: Rs. ${(totalIncome - totalExpense).toLocaleString('en-IN', { maximumFractionDigits: 2 })}\\par`;
    rtfContent += `Total Transactions: ${transactions.length}\\par\\par`;
    
    rtfContent += `{\\b\\fs28 CATEGORY BREAKDOWN}\\par\\par`;
    Object.entries(categoryData).forEach(([category, amount]) => {
      rtfContent += `${category}: Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (${((amount / totalExpense) * 100).toFixed(1)}%)\\par`;
    });
    
    rtfContent += `}`;
    
    const blob = new Blob([rtfContent], { type: 'application/msword' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.doc`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view analytics.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" key="analytics-content">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Spending Analytics
        </h2>
        {expenseTransactions.length > 0 && Object.keys(categoryData).length > 0 && (
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

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {expenseTransactions.length > 0 && Object.keys(categoryData).length > 0 ? (
          <div className="flex justify-center items-center" style={{ minHeight: '400px' }}>
            <div className="w-full max-w-md">
              <Pie data={data} options={options} />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            You have no expenses to analyze. Add some transactions to see your
            spending breakdown.
          </p>
        )}
      </div>

      {/* AI Analysis Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            AI Spending Analysis
          </h3>
          <button
            onClick={handleGetAnalysis}
            disabled={isAnalyzing}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg disabled:transform-none"
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <SparkleIcon />
                <span className="ml-2">
                  ✨ Get AI Analysis
                </span>
              </>
            )}
          </button>
        </div>

        {/* Analysis Result */}
        {isAnalyzing && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>PocketPal is analyzing your spending habits...</p>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {analysis ? (
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line leading-relaxed">
              {analysis}
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Ask PocketPal for a quick insight into your spending patterns.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;