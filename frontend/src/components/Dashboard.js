import { useState, useEffect } from "react";
import AddTransaction from "./AddTransaction";
import TransactionCard from "./TransactionCard";
import Charts from "./Charts";
import { exportToCSV } from "../utils/exportCSV";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const EMPTY_SUMMARY = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  expenseByCategory: {},
  incomeByCategory: {},
  monthlyData: []
};

function Dashboard() {

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");

  // Redirect if token missing
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const fetchAll = async () => {
    try {

      const [transactionsRes, summaryRes] = await Promise.all([
        fetch(`${API}/transactions`, { headers }),
        fetch(`${API}/transactions/summary`, { headers })
      ]);

      const transactionsData = await transactionsRes.json();
      const summaryData = await summaryRes.json();

      if (Array.isArray(transactionsData)) {
        setTransactions(transactionsData);
      }

      if (summaryData.totalIncome !== undefined) {
        setSummary(summaryData);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchAll();
      setLoading(false);
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const filteredTransactions = transactions
    .filter(t => filter === "all" || t.type === filter)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );

  const incomeCount = transactions.filter(t => t.type === "income").length;
  const expenseCount = transactions.filter(t => t.type === "expense").length;

  if (loading) {
    return (
      <div style={styles.loading}>
        <div>
          <div style={{ fontSize: 40 }}>⏳</div>
          <p>Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <span style={styles.logo}>💰 Expense Manager</span>

        <div style={styles.navRight}>
          <span>Hi, <strong>{username}</strong></span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>

        {/* KPI Cards */}
        <div style={styles.kpiRow}>

          <KpiCard label="Total Income" value={summary.totalIncome} color="#059669" />
          <KpiCard label="Total Expenses" value={summary.totalExpense} color="#EF4444" />
          <KpiCard label="Balance" value={summary.balance} color="#3B82F6" />
          <KpiCard label="Transactions" value={transactions.length} color="#8B5CF6" />

        </div>

        {/* Charts */}
        {showCharts && transactions.length > 0 && (
          <Charts summary={summary} />
        )}

        {/* Top Bar */}
        <div style={styles.topBar}>

          <h2>Transactions</h2>

          <div style={styles.actions}>

            <button
              style={styles.toggleBtn}
              onClick={() => setShowCharts(p => !p)}
            >
              {showCharts ? "Hide Charts" : "Show Charts"}
            </button>

            <button
              style={styles.exportBtn}
              onClick={() => exportToCSV(transactions)}
            >
              Export CSV
            </button>

            <button
              style={styles.addBtn}
              onClick={() => setShowAdd(true)}
            >
              + Add Transaction
            </button>

          </div>
        </div>

        {/* Search */}
        <input
          style={styles.search}
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Filters */}
        <div style={styles.filterRow}>

          <FilterBtn
            label="All"
            active={filter === "all"}
            onClick={() => setFilter("all")}
            count={transactions.length}
          />

          <FilterBtn
            label="Income"
            active={filter === "income"}
            onClick={() => setFilter("income")}
            count={incomeCount}
          />

          <FilterBtn
            label="Expense"
            active={filter === "expense"}
            onClick={() => setFilter("expense")}
            count={expenseCount}
          />

        </div>

        {/* Transaction List */}

        {filteredTransactions.length === 0 ? (

          <div style={styles.empty}>
            <p style={{ fontSize: 40 }}>📭</p>
            <p>No transactions found</p>
          </div>

        ) : (

          filteredTransactions.map(t => (
            <TransactionCard
              key={t.id}
              transaction={t}
              headers={headers}
              onUpdate={fetchAll}
            />
          ))

        )}

      </div>

      {showAdd && (
        <AddTransaction
          headers={headers}
          onClose={() => setShowAdd(false)}
          onAdd={() => {
            fetchAll();
            setShowAdd(false);
          }}
        />
      )}

    </div>
  );
}

function KpiCard({ label, value, color }) {
  return (
    <div style={{ ...styles.kpiCard, borderTop: `4px solid ${color}` }}>
      <div style={{ ...styles.kpiValue, color }}>
        ₹{value.toLocaleString("en-IN")}
      </div>
      <div style={styles.kpiLabel}>{label}</div>
    </div>
  );
}

function FilterBtn({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.filterBtn,
        background: active ? "#064E3B" : "white",
        color: active ? "white" : "#374151"
      }}
    >
      {label}
      <span style={styles.countBadge}>{count}</span>
    </button>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F3F4F6" },

  navbar: {
    background: "white",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
  },

  logo: { fontWeight: 800, fontSize: 20 },

  navRight: { display: "flex", gap: 16, alignItems: "center" },

  logoutBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer"
  },

  container: { maxWidth: 1100, margin: "0 auto", padding: 24 },

  kpiRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },

  kpiCard: { background: "white", padding: 20, borderRadius: 12 },

  kpiValue: { fontSize: 22, fontWeight: 800 },

  kpiLabel: { color: "#6B7280", fontSize: 13 },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20
  },

  actions: { display: "flex", gap: 10 },

  addBtn: {
    padding: "8px 16px",
    background: "#059669",
    color: "white",
    border: "none",
    borderRadius: 6
  },

  toggleBtn: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    background: "#EEF2FF"
  },

  exportBtn: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    background: "#ECFDF5"
  },

  search: {
    width: "100%",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    border: "1px solid #E5E7EB"
  },

  filterRow: { display: "flex", gap: 8, marginTop: 12 },

  filterBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #E5E7EB",
    cursor: "pointer",
    display: "flex",
    gap: 6
  },

  countBadge: {
    background: "#F3F4F6",
    padding: "2px 6px",
    borderRadius: 8,
    fontSize: 12
  },

  empty: {
    textAlign: "center",
    padding: 60
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

export default Dashboard;