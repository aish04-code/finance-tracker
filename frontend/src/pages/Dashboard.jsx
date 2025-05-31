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

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

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
      if (isEditing && editId) {
        await api.put(`/transactions/${editId}`, {
          amount,
          type,
          category,
          note,
          date,
        });
      } else {
        await api.post('/transactions', {
          amount,
          type,
          category,
          note,
          date,
        });
      }

      // Reset form
      setAmount('');
      setType('expense');
      setCategory('');
      setNote('');
      setDate('');
      setIsEditing(false);
      setEditId(null);

      fetchTransactions();
    } catch (err) {
      alert('Failed to save transaction');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      alert('Failed to delete transaction');
      console.error(err);
    }
  };

  const handleEdit = (tx) => {
    setIsEditing(true);
    setEditId(tx._id);
    setAmount(tx.amount);
    setType(tx.type);
    setCategory(tx.category);
    setNote(tx.note);
    setDate(tx.date.split('T')[0]); // For input type="date"
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">My Transactions</h1>

      {/* Form */}
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
          {isEditing ? 'Update Transaction' : 'Add Transaction'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditId(null);
              setAmount('');
              setType('expense');
              setCategory('');
              setNote('');
              setDate('');
            }}
            className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500 md:col-span-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Transactions */}
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
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    tx.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {tx.type}
                </span>
                <button
                  onClick={() => handleEdit(tx)}
                  className="text-blue-500 hover:text-blue-700 font-bold text-lg"
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(tx._id)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
