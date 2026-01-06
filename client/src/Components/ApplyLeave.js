import api from '../api';
import { useState, useEffect } from 'react';

const ApplyLeave = ({ empId }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [myLeaves, setMyLeaves] = useState([]);
  const [balance, setBalance] = useState(null);


  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchLeaveTypes();
    fetchMyLeaves();
  }, [empId]);

  const fetchBalance = async () => {
  const res = await api.get('/leave-balance');
  setBalance(res.data);
};
useEffect(() => {
  fetchBalance();
}, []);   // 👈 EMPTY dependency



  const fetchLeaveTypes = async () => {
  try {
    const res = await api.get('/leave-types');
    setLeaveTypes(res.data);
  } catch (err) {
    console.error('LEAVE TYPES ERROR', err.message);
  }
};

const fetchMyLeaves = async () => {
  try {
    const res = await api.get(`/my/${empId}`);
    if (res.data.success) {
      setMyLeaves(res.data.leaves);
    }
  } catch (err) {
    console.error('MY LEAVES ERROR', err.message);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveTypeId || !startDate || !endDate) {
      setMessage('Please fill all required fields');
      setMessageType('error');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setMessage('End date must be after start date');
      setMessageType('error');
      return;
    }

    const payload = {
      emp_id: Number(empId),
      leave_type_id: Number(leaveTypeId),
      start_date: startDate,
      end_date: endDate,
      remarks: remarks || null
    };

    console.log('APPLY PAYLOAD', payload);

    try {
    const res = await api.post('/apply', payload);
      if (res.data.success) {
        setMessage('Leave applied successfully');
        setMessageType('success');
        setLeaveTypeId('');
        setStartDate('');
        setEndDate('');
        setRemarks('');
        fetchMyLeaves();
      }
    } catch (err) {
      console.error('APPLY ERROR', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Server error');
      setMessageType('error');
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN');

  const getStatusClass = (status) =>
    `status-${status.toLowerCase()}`;

  return (
    <div className="container">
      <h2>Apply for Leave</h2>

      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}

{balance && (
  <div className="alert alert-info">
    Remaining Leaves: <strong>{balance.remaining_leaves}</strong> /
    {balance.total_leaves}
  </div>
)}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leave Type *</label>
          <select
            value={leaveTypeId}
            onChange={(e) => setLeaveTypeId(e.target.value)}
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((lt) => (
              <option key={lt.leave_type_id} value={lt.leave_type_id}>
                {lt.type_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Start Date *</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date *</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <button type="submit" className="btn">
          Apply for Leave
        </button>
      </form>

      <h3 style={{ marginTop: '2rem' }}>Recent Leaves</h3>

      {myLeaves.length === 0 ? (
        <p>No leaves applied yet</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.map((l) => (
              <tr key={l.leave_id}>
                <td>{l.leave_id}</td>
                <td>{l.type_name}</td>
                <td>{formatDate(l.start_date)}</td>
                <td>{formatDate(l.end_date)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(l.status_name)}`}>
                    
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplyLeave;
