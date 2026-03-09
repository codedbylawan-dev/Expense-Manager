import { useState } from 'react';

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Other'],
  expense: ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other']
};

const CAT_ICONS = {
  Salary: '💼', Freelance: '💻', Business: '🏢', Investment: '📈',
  Food: '🍔', Rent: '🏠', Transport: '🚗', Shopping: '🛍️',
  Entertainment: '🎬', Health: '💊', Education: '📚', Other: '📌'
};

function TransactionCard({ transaction: t, headers, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...t });
  const [loading, setLoading] = useState(false);

  const handle = e => {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'type') updated.category = CATEGORIES[e.target.value][0];
    setForm(updated);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/transactions/${t.id}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount) })
      });
      if (res.ok) { setEditing(false); onUpdate(); }
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${t.title}"?`)) return;
    await fetch(`${API}/transactions/${t.id}`, { method: 'DELETE', headers });
    onUpdate();
  };

  const isIncome = t.type === 'income';

  if (editing) {
    return (
      <div style={s.card}>
        <div style={s.editGrid}>
          <div>
            <label style={s.label}>Title</label>
            <input style={s.input} name="title" value={form.title} onChange={handle} />
          </div>
          <div>
            <label style={s.label}>Amount (₹)</label>
            <input style={s.input} type="number" name="amount" value={form.amount} onChange={handle} />
          </div>
          <div>
            <label style={s.label}>Type</label>
            <select style={s.input} name="type" value={form.type} onChange={handle}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label style={s.label}>Category</label>
            <select style={s.input} name="category" value={form.category} onChange={handle}>
              {CATEGORIES[form.type].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Date</label>
            <input style={s.input} type="date" name="date" value={form.date} onChange={handle} />
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <label style={s.label}>Notes</label>
          <textarea style={{ ...s.input, width: '100%', height: '60px', resize: 'vertical' }}
            name="notes" value={form.notes || ''} onChange={handle} />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button style={s.saveBtn} onClick={handleUpdate} disabled={loading}>
            {loading ? 'Saving...' : '✓ Save'}
          </button>
          <button style={s.cancelBtn} onClick={() => { setEditing(false); setForm({ ...t }); }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...s.card, borderLeft: `4px solid ${isIncome ? '#059669' : '#EF4444'}` }}>
      <div style={s.top}>
        <div style={s.iconBox}>
          <span style={{ fontSize: '22px' }}>{CAT_ICONS[t.category] || '📌'}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={s.titleText}>{t.title}</div>
          <div style={s.meta}>
            <span style={{
              ...s.badge,
              background: isIncome ? '#ECFDF5' : '#FEF2F2',
              color: isIncome ? '#065F46' : '#991B1B'
            }}>
              {t.category}
            </span>
            <span style={s.date}>📅 {t.date}</span>
          </div>
          {t.notes && <div style={s.notes}>📝 {t.notes}</div>}
        </div>
        <div style={s.right}>
          <div style={{ ...s.amount, color: isIncome ? '#059669' : '#EF4444' }}>
            {isIncome ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button style={s.editBtn} onClick={() => setEditing(true)}>Edit</button>
            <button style={s.deleteBtn} onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { background: 'white', borderRadius: '12px', padding: '16px 20px', marginBottom: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' },
  top: { display: 'flex', alignItems: 'flex-start', gap: '14px' },
  iconBox: { width: '44px', height: '44px', background: '#F9FAFB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  titleText: { fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '4px' },
  meta: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  badge: { padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
  date: { fontSize: '12px', color: '#9CA3AF' },
  notes: { fontSize: '13px', color: '#6B7280', marginTop: '4px' },
  right: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 },
  amount: { fontSize: '18px', fontWeight: 800 },
  editBtn: { padding: '5px 12px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' },
  deleteBtn: { padding: '5px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', cursor: 'pointer', color: '#DC2626', fontWeight: 600, fontSize: '12px' },
  editGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '4px' },
  input: { width: '100%', padding: '8px 10px', border: '1.5px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', outline: 'none' },
  saveBtn: { padding: '8px 20px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 },
  cancelBtn: { padding: '8px 16px', background: 'white', border: '1.5px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
};

export default TransactionCard;
