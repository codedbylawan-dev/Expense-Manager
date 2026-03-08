import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Filler
} from 'chart.js';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Filler
);

const COLORS = ['#059669','#3B82F6','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316'];

function Charts({ summary }) {
  const { expenseByCategory, monthlyData } = summary;

  const expenseLabels = Object.keys(expenseByCategory || {});
  const expenseValues = Object.values(expenseByCategory || {});

  const months = (monthlyData || []).map(m => {
    const [y, mo] = m.month.split('-');
    return new Date(y, mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
  });

  const pieData = {
    labels:   expenseLabels,
    datasets: [{
      data:            expenseValues,
      backgroundColor: COLORS,
      borderColor:     'white',
      borderWidth:     3,
    }]
  };

  const lineData = {
    labels:   months,
    datasets: [
      {
        label:           'Income',
        data:            (monthlyData || []).map(m => m.income),
        borderColor:     '#059669',
        backgroundColor: 'rgba(5,150,105,0.1)',
        tension:         0.4,
        fill:            true,
        pointBackgroundColor: '#059669',
      },
      {
        label:           'Expense',
        data:            (monthlyData || []).map(m => m.expense),
        borderColor:     '#EF4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension:         0.4,
        fill:            true,
        pointBackgroundColor: '#EF4444',
      }
    ]
  };

  return (
    <div style={s.wrapper}>
      <div style={s.chartBox}>
        {expenseLabels.length > 0 ? (
          <Pie data={pieData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title:  { display: true, text: 'Expenses by Category', font: { size: 14, weight: '600' } }
            }
          }} />
        ) : (
          <div style={s.empty}>
            <p style={{ fontSize: '32px' }}>🥧</p>
            <p>No expense data yet</p>
          </div>
        )}
      </div>

      <div style={s.chartBox}>
        {months.length > 0 ? (
          <Line data={lineData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title:  { display: true, text: 'Income vs Expense (Monthly)', font: { size: 14, weight: '600' } }
            },
            scales: { y: { beginAtZero: true } }
          }} />
        ) : (
          <div style={s.empty}>
            <p style={{ fontSize: '32px' }}>📈</p>
            <p>Add transactions to see trends</p>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  wrapper:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  chartBox: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  empty:    { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#9CA3AF', gap: '8px' },
};

export default Charts;
