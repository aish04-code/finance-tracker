import { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        amount,
        type,
        category,
        note,
        date,
      });
      setAmount('');
      setType('expense');
      setCategory('');
      setNote('');
      setDate('');
      fetchTransactions(); // refresh list
    } catch (err) {
      alert('Failed to add transaction');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">My Transactions</h1>

      {/* Add Transaction Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          className="border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Note"
          className="border p-2 rounded md:col-span-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-2"
        >
          Add Transaction
        </button>
      </form>

      {/* Transaction List */}
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
                borderColor: tx.type === 'income' ? '#22c55e' : '#ef4444',
              }}
            >
              <div>
                <p className="text-xl font-semibold">${tx.amount}</p>
                <p className="text-gray-600">
                  {tx.category} • {tx.note}
                </p>
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
