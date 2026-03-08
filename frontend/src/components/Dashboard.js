import { useState, useEffect } from 'react';
import AddTransaction from './AddTransaction';
import TransactionCard from './TransactionCard';
import Charts from './Charts';
import { exportToCSV } from '../utils/exportCSV';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API = `${API_URL}/api`;

const EMPTY_SUMMARY = {
  totalIncome: 0, totalExpense: 0, balance: 0,
  expenseByCategory: {}, incomeByCategory: {}, monthlyData: []
};

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem('username') || 'there';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    try {
      const [tRes, sRes] = await Promise.all([
        fetch(`${API}/transactions`, { headers }),
        fetch(`${API}/transactions/summary`, { headers }),
      ]);
      const tData = await tRes.json();
      const sData = await sRes.json();
      setTransactions(Array.isArray(tData) ? tData : []);
      if (sData.totalIncome !== undefined) setSummary(sData);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    (async () => { await fetchAll(); setLoading(false); })();
  }, []);

  const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };

  const filtered = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );

  const balance = summary.balance || 0;
  const income = summary.totalIncome || 0;
  const expense = summary.totalExpense || 0;

  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
      <div style={{ textAlign: 'center', color: '#6B7280' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
        <p>Loading your data...</p>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <span style={s.logo}>💰 Expense Manager</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={s.greeting}>Hi, <strong>{username}</strong></span>
          <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={s.container}>

        {/* KPI Cards */}
        <div style={s.kpiRow}>
          <div style={{ ...s.kpiCard, borderTop: '4px solid #059669' }}>
            <div style={{ ...s.kpiValue, color: '#059669' }}>
              ₹{income.toLocaleString('en-IN')}
            </div>
            <div style={s.kpiLabel}>Total Income</div>
          </div>
          <div style={{ ...s.kpiCard, borderTop: '4px solid #EF4444' }}>
            <div style={{ ...s.kpiValue, color: '#EF4444' }}>
              ₹{expense.toLocaleString('en-IN')}
            </div>
            <div style={s.kpiLabel}>Total Expenses</div>
          </div>
          <div style={{ ...s.kpiCard, borderTop: `4px solid ${balance >= 0 ? '#3B82F6' : '#F59E0B'}` }}>
            <div style={{ ...s.kpiValue, color: balance >= 0 ? '#3B82F6' : '#F59E0B' }}>
              {balance < 0 ? '-' : ''}₹{Math.abs(balance).toLocaleString('en-IN')}
            </div>
            <div style={s.kpiLabel}>{balance >= 0 ? '✅ Balance' : '⚠️ Overspent'}</div>
          </div>
          <div style={{ ...s.kpiCard, borderTop: '4px solid #8B5CF6' }}>
            <div style={{ ...s.kpiValue, color: '#8B5CF6' }}>{transactions.length}</div>
            <div style={s.kpiLabel}>Total Transactions</div>
          </div>
        </div>

        {/* Charts */}
        {showCharts && transactions.length > 0 && <Charts summary={summary} />}

        {/* Top bar */}
        <div style={s.topBar}>
          <h2 style={s.heading}>Transactions</h2>
          <div style={s.actions}>
            <button style={s.toggleBtn} onClick={() => setShowCharts(p => !p)}>
              {showCharts ? '📊 Hide Charts' : '📊 Show Charts'}
            </button>
            <button style={s.exportBtn} onClick={() => exportToCSV(transactions)}>
              ⬇ Export CSV
            </button>
            <button style={s.addBtn} onClick={() => setShowAdd(true)}>
              + Add Transaction
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div style={s.controls}>
          <input style={s.search}
            placeholder="🔍  Search by title or category..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <div style={s.filterRow}>
            {[
              { key: 'all', label: 'All', count: transactions.length },
              { key: 'income', label: '⬆ Income', count: incomeCount },
              { key: 'expense', label: '⬇ Expense', count: expenseCount },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                ...s.filterBtn,
                background: filter === f.key ? '#064E3B' : 'white',
                color: filter === f.key ? 'white' : '#374151',
                borderColor: filter === f.key ? '#064E3B' : '#E5E7EB',
              }}>
                {f.label}
                <span style={{
                  ...s.countBadge,
                  background: filter === f.key ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                  color: filter === f.key ? 'white' : '#6B7280',
                }}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction list */}
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <p style={{ fontSize: '48px' }}>📭</p>
            <p style={{ fontWeight: 600, color: '#374151', fontSize: '16px' }}>
              {transactions.length === 0 ? 'No transactions yet' : 'No results found'}
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
              {transactions.length === 0
                ? 'Click "+ Add Transaction" to get started'
                : 'Try a different search or filter'}
            </p>
          </div>
        ) : (
          filtered.map(t => (
            <TransactionCard key={t.id} transaction={t}
              headers={headers} onUpdate={fetchAll} />
          ))
        )}
      </div>

      {showAdd && (
        <AddTransaction headers={headers}
          onClose={() => setShowAdd(false)}
          onAdd={() => { fetchAll(); setShowAdd(false); }} />
      )}
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#F3F4F6' },
  navbar: { background: 'white', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontWeight: 800, fontSize: '20px', color: '#064E3B' },
  greeting: { color: '#6B7280', fontSize: '14px' },
  logoutBtn: { padding: '7px 16px', border: '1.5px solid #E5E7EB', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '28px 20px' },
  kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  kpiCard: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  kpiValue: { fontSize: '24px', fontWeight: 800, marginBottom: '6px' },
  kpiLabel: { fontSize: '13px', color: '#6B7280', fontWeight: 500 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
  heading: { margin: 0, color: '#111827', fontSize: '20px', fontWeight: 700 },
  actions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  toggleBtn: { padding: '8px 14px', background: '#EEF2FF', color: '#4338CA', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' },
  exportBtn: { padding: '8px 14px', background: '#ECFDF5', color: '#065F46', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' },
  addBtn: { padding: '8px 18px', background: 'linear-gradient(135deg, #064E3B, #059669)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' },
  controls: { marginBottom: '16px' },
  search: { width: '100%', padding: '12px 16px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '15px', marginBottom: '12px', background: 'white', outline: 'none' },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterBtn: { padding: '7px 14px', borderRadius: '8px', border: '1.5px solid', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' },
  countBadge: { borderRadius: '10px', padding: '1px 7px', fontSize: '12px', fontWeight: 700 },
  empty: { textAlign: 'center', padding: '70px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
};

export default Dashboard;
