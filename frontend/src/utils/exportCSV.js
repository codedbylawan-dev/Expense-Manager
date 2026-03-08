export function exportToCSV(data) {
  if (!data || data.length === 0) {
    alert('No transactions to export.');
    return;
  }

  const headers = ['Title', 'Amount (₹)', 'Type', 'Category', 'Date', 'Notes'];

  const rows = data.map(t => [
    `"${t.title    || ''}"`,
    `"${t.amount   || ''}"`,
    `"${t.type     || ''}"`,
    `"${t.category || ''}"`,
    `"${t.date     || ''}"`,
    `"${(t.notes   || '').replace(/"/g, "'")}"`,
  ]);

  const csv  = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href     = url;
  link.download = `expense_manager_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
