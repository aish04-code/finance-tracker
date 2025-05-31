import { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">My Transactions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="grid gap-4">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="p-4 bg-white rounded-xl shadow flex justify-between items-center border-l-4"
              style={{
                borderColor: tx.type === 'income' ? '#22c55e' : '#ef4444'
              }}
            >
              <div>
                <p className="text-xl font-semibold">${tx.amount}</p>
                <p className="text-gray-600">{tx.category} • {tx.note}</p>
                <p className="text-sm text-gray-400">
                  {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  tx.type === 'income'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {tx.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
