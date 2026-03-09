import { useState } from 'react';

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Other'],
  expense: ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other']
};

function AddTransaction({ headers, onClose, onAdd }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'type') updated.category = CATEGORIES[e.target.value][0];
    setForm(updated);
  };

  const setType = type => {
    setForm({ ...form, type, category: CATEGORIES[type][0] });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.date)
      return setError('Title, amount and date are required.');
    if (isNaN(form.amount) || Number(form.amount) <= 0)
      return setError('Amount must be a positive number.');

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount) })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      onAdd(data);
    } catch {
      setError('Failed to add transaction. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <h3 style={s.title}>Add Transaction</h3>
          <button style={s.close} onClick={onClose}>✕</button>
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}

        {/* Type toggle */}
        <div style={s.typeRow}>
          {['expense', 'income'].map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              ...s.typeBtn,
              background: form.type === t
                ? (t === 'income' ? '#059669' : '#EF4444')
                : '#F3F4F6',
              color: form.type === t ? 'white' : '#374151'
            }}>
              {t === 'income' ? '⬆ Income' : '⬇ Expense'}
            </button>
          ))}
        </div>

        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Title *</label>
            <input style={s.input} name="title"
              placeholder={form.type === 'income' ? 'e.g. Monthly Salary' : 'e.g. Grocery Shopping'}
              value={form.title} onChange={handle} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Amount (₹) *</label>
            <input style={s.input} name="amount" type="number" min="1"
              placeholder="e.g. 5000" value={form.amount} onChange={handle} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Category</label>
            <select style={s.input} name="category" value={form.category} onChange={handle}>
              {CATEGORIES[form.type].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Date *</label>
            <input style={s.input} type="date" name="date" value={form.date} onChange={handle} />
          </div>
        </div>

        <div style={{ ...s.field, marginTop: '4px' }}>
          <label style={s.label}>Notes (optional)</label>
          <textarea style={{ ...s.input, height: '72px', resize: 'vertical' }}
            name="notes" placeholder="Any additional notes..."
            value={form.notes} onChange={handle} />
        </div>

        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{
            ...s.submitBtn,
            background: form.type === 'income'
              ? 'linear-gradient(135deg, #064E3B, #059669)'
              : 'linear-gradient(135deg, #991B1B, #EF4444)',
            opacity: loading ? 0.7 : 1
          }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#064E3B', fontSize: '20px', fontWeight: 700 },
  close: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF' },
  typeRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
  typeBtn: { padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
  input: { padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  cancelBtn: { padding: '10px 20px', border: '1.5px solid #D1D5DB', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' },
  submitBtn: { padding: '10px 24px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' },
  error: { background: '#FEF2F2', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
};

export default AddTransaction;
