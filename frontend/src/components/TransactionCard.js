import { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CATEGORIES = {
  income: ["Salary", "Freelance", "Business", "Investment", "Other"],
  expense: ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Health", "Education", "Other"]
};

const CAT_ICONS = {
  Salary: "💼",
  Freelance: "💻",
  Business: "🏢",
  Investment: "📈",
  Food: "🍔",
  Rent: "🏠",
  Transport: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Health: "💊",
  Education: "📚",
  Other: "📌"
};

function TransactionCard({ transaction: t, headers, onUpdate }) {

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...t });
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

  const handleUpdate = async () => {

    if (Number(form.amount) <= 0) {
      alert("Amount must be positive");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(`${API}/transactions/${t.id}`, {
        method: "PUT",
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
        alert(data?.error || "Failed to update transaction");
        return;
      }

      setEditing(false);
      onUpdate();

    } catch (err) {

      console.error(err);
      alert("Server error while updating");

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {

    if (!window.confirm(`Delete "${t.title}"?`)) return;

    try {

      const res = await fetch(`${API}/transactions/${t.id}`, {
        method: "DELETE",
        headers
      });

      if (!res.ok) {
        alert("Failed to delete transaction");
        return;
      }

      onUpdate();

    } catch (err) {

      console.error(err);
      alert("Server error while deleting");

    }
  };

  const isIncome = t.type === "income";

  if (editing) {
    return (
      <div style={styles.card}>

        <div style={styles.editGrid}>

          <Field label="Title">
            <input style={styles.input} name="title" value={form.title} onChange={handleChange} />
          </Field>

          <Field label="Amount (₹)">
            <input
              style={styles.input}
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
          </Field>

          <Field label="Type">
            <select style={styles.input} name="type" value={form.type} onChange={handleChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </Field>

          <Field label="Category">
            <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES[form.type].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Date">
            <input
              style={styles.input}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </Field>

        </div>

        <div style={{ marginTop: 10 }}>
          <label style={styles.label}>Notes</label>
          <textarea
            style={{ ...styles.input, width: "100%", height: 60 }}
            name="notes"
            value={form.notes || ""}
            onChange={handleChange}
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.saveBtn} onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving..." : "✓ Save"}
          </button>

          <button
            style={styles.cancelBtn}
            onClick={() => {
              setEditing(false);
              setForm({ ...t });
            }}
          >
            Cancel
          </button>
        </div>

      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `4px solid ${isIncome ? "#059669" : "#EF4444"}`
      }}
    >

      <div style={styles.top}>

        <div style={styles.iconBox}>
          <span style={{ fontSize: 22 }}>
            {CAT_ICONS[t.category] || "📌"}
          </span>
        </div>

        <div style={{ flex: 1 }}>

          <div style={styles.titleText}>{t.title}</div>

          <div style={styles.meta}>

            <span
              style={{
                ...styles.badge,
                background: isIncome ? "#ECFDF5" : "#FEF2F2",
                color: isIncome ? "#065F46" : "#991B1B"
              }}
            >
              {t.category}
            </span>

            <span style={styles.date}>📅 {t.date}</span>

          </div>

          {t.notes && (
            <div style={styles.notes}>📝 {t.notes}</div>
          )}

        </div>

        <div style={styles.right}>

          <div
            style={{
              ...styles.amount,
              color: isIncome ? "#059669" : "#EF4444"
            }}
          >
            {isIncome ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
          </div>

          <div style={styles.buttons}>

            <button style={styles.editBtn} onClick={() => setEditing(true)}>
              Edit
            </button>

            <button style={styles.deleteBtn} onClick={handleDelete}>
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 10,
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)"
  },

  top: {
    display: "flex",
    gap: 14
  },

  iconBox: {
    width: 44,
    height: 44,
    background: "#F9FAFB",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  titleText: {
    fontSize: 15,
    fontWeight: 600
  },

  meta: {
    display: "flex",
    gap: 10
  },

  badge: {
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600
  },

  date: {
    fontSize: 12,
    color: "#9CA3AF"
  },

  notes: {
    fontSize: 13,
    color: "#6B7280"
  },

  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },

  amount: {
    fontSize: 18,
    fontWeight: 800
  },

  buttons: {
    display: "flex",
    gap: 6,
    marginTop: 8
  },

  editBtn: {
    padding: "5px 12px",
    background: "#F3F4F6",
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    cursor: "pointer"
  },

  deleteBtn: {
    padding: "5px 12px",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 6,
    color: "#DC2626",
    cursor: "pointer"
  },

  editGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12
  },

  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: 4
  },

  input: {
    width: "100%",
    padding: "8px 10px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 6
  },

  actions: {
    display: "flex",
    gap: 8,
    marginTop: 12
  },

  saveBtn: {
    padding: "8px 20px",
    background: "#059669",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },

  cancelBtn: {
    padding: "8px 16px",
    background: "white",
    border: "1.5px solid #E5E7EB",
    borderRadius: 6
  }
};

export default TransactionCard;