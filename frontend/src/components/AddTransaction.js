import { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CATEGORIES = {
  income: ["Salary", "Freelance", "Business", "Investment", "Other"],
  expense: ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Health", "Education", "Other"]
};

function AddTransaction({ headers, onClose, onAdd }) {

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: new Date().toISOString().slice(0, 10),
    notes: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const updated = {
      ...form,
      [e.target.name]: e.target.value
    };

    if (e.target.name === "type") {
      updated.category = CATEGORIES[e.target.value][0];
    }

    setForm(updated);
  };

  const setType = (type) => {
    setForm({
      ...form,
      type,
      category: CATEGORIES[type][0]
    });
  };

  const handleSubmit = async () => {

    if (loading) return;

    if (!form.title || !form.amount || !form.date) {
      setError("Title, amount and date are required.");
      return;
    }

    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await fetch(`${API}/transactions`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to add transaction.");
        return;
      }

      onAdd(data);

    } catch (err) {

      console.error(err);
      setError("Failed to add transaction. Try again.");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >

      <div style={styles.modal}>

        <div style={styles.header}>
          <h3 style={styles.title}>Add Transaction</h3>
          <button style={styles.close} onClick={onClose}>✕</button>
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {/* Type Toggle */}
        <div style={styles.typeRow}>

          {["expense", "income"].map((type) => (

            <button
              key={type}
              onClick={() => setType(type)}
              style={{
                ...styles.typeBtn,
                background:
                  form.type === type
                    ? type === "income"
                      ? "#059669"
                      : "#EF4444"
                    : "#F3F4F6",
                color: form.type === type ? "white" : "#374151"
              }}
            >
              {type === "income" ? "⬆ Income" : "⬇ Expense"}
            </button>

          ))}

        </div>

        <div style={styles.grid}>

          <div style={styles.field}>
            <label style={styles.label}>Title *</label>
            <input
              style={styles.input}
              name="title"
              placeholder={
                form.type === "income"
                  ? "e.g. Monthly Salary"
                  : "e.g. Grocery Shopping"
              }
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Amount (₹) *</label>
            <input
              style={styles.input}
              name="amount"
              type="number"
              min="1"
              placeholder="e.g. 5000"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.input}
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES[form.type].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Date *</label>
            <input
              style={styles.input}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

        </div>

        <div style={{ ...styles.field, marginTop: "4px" }}>
          <label style={styles.label}>Notes (optional)</label>
          <textarea
            style={{ ...styles.input, height: "72px", resize: "vertical" }}
            name="notes"
            placeholder="Any additional notes..."
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <div style={styles.actions}>

          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={{
              ...styles.submitBtn,
              background:
                form.type === "income"
                  ? "linear-gradient(135deg, #064E3B, #059669)"
                  : "linear-gradient(135deg, #991B1B, #EF4444)",
              opacity: loading ? 0.7 : 1
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : `Add ${form.type === "income" ? "Income" : "Expense"}`}
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px"
  },

  modal: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    width: "100%",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflowY: "auto"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  title: {
    margin: 0,
    color: "#064E3B",
    fontSize: "20px",
    fontWeight: 700
  },

  close: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#9CA3AF"
  },

  typeRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "20px"
  },

  typeBtn: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px"
  },

  field: {
    display: "flex",
    flexDirection: "column"
  },

  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px"
  },

  input: {
    padding: "10px 12px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    width: "100%"
  },

  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px"
  },

  cancelBtn: {
    padding: "10px 20px",
    border: "1.5px solid #D1D5DB",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px"
  },

  submitBtn: {
    padding: "10px 24px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px"
  },

  error: {
    background: "#FEF2F2",
    color: "#DC2626",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px"
  }

};

export default AddTransaction;