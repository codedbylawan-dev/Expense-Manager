const express = require('express');
const auth    = require('../middleware/auth');
const db      = require('../database');

const router = express.Router();

const VALID_TYPES = ['income', 'expense'];

// GET all transactions
router.get('/', auth, (req, res) => {
  try {
    const transactions = db.prepare(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC'
    ).all(req.user.id);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
});

// GET summary — balance, totals, chart data
router.get('/summary', auth, (req, res) => {
  try {
    const transactions = db.prepare(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date ASC'
    ).all(req.user.id);

    const totalIncome  = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Expense by category (for pie chart)
    const expenseByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

    // Income by category
    const incomeByCategory = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    });

    // Monthly data (for line chart)
    const monthlyMap = {};
    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expense: 0 };
      monthlyMap[month][t.type] += t.amount;
    });

    const months      = Object.keys(monthlyMap).sort();
    const monthlyData = months.map(m => ({
      month:   m,
      income:  monthlyMap[m].income,
      expense: monthlyMap[m].expense,
    }));

    res.json({ totalIncome, totalExpense, balance, expenseByCategory, incomeByCategory, monthlyData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary.' });
  }
});

// POST add transaction
router.post('/', auth, (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type || !category || !date)
      return res.status(400).json({ error: 'Title, amount, type, category and date are required.' });

    if (!VALID_TYPES.includes(type))
      return res.status(400).json({ error: 'Type must be income or expense.' });

    if (isNaN(amount) || Number(amount) <= 0)
      return res.status(400).json({ error: 'Amount must be a positive number.' });

    const result = db.prepare(`
      INSERT INTO transactions (user_id, title, amount, type, category, date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, title.trim(), Number(amount), type, category, date, notes || '');

    const newTransaction = db.prepare('SELECT * FROM transactions WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add transaction.' });
  }
});

// PUT update transaction
router.put('/:id', auth, (req, res) => {
  try {
    const transaction = db.prepare(
      'SELECT id FROM transactions WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!transaction)
      return res.status(404).json({ error: 'Transaction not found.' });

    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type || !category || !date)
      return res.status(400).json({ error: 'All fields are required.' });

    db.prepare(`
      UPDATE transactions
      SET title = ?, amount = ?, type = ?, category = ?, date = ?, notes = ?
      WHERE id = ?
    `).run(title.trim(), Number(amount), type, category, date, notes || '', req.params.id);

    const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction.' });
  }
});

// DELETE transaction
router.delete('/:id', auth, (req, res) => {
  try {
    const transaction = db.prepare(
      'SELECT id FROM transactions WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!transaction)
      return res.status(404).json({ error: 'Transaction not found.' });

    db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
    res.json({ message: 'Transaction deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction.' });
  }
});

module.exports = router;
