import api from '../api';
import { useState, useEffect } from 'react';
import LeaveRequestRow from './LeaveRequestRow';

const AdminDashboard = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pending');
      if (res.data.success) {
        setPendingLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending leaves. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchPendingLeaves();
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Admin Dashboard - Pending Leave Requests</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Admin Dashboard - Pending Leave Requests</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      {pendingLeaves.length === 0 ? (
        <div className="empty-state">
          <p>No pending leave requests.</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Leave ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Applied On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingLeaves.map((leave) => (
              <LeaveRequestRow 
                key={leave.leave_id} 
                leave={leave} 
                onUpdate={handleUpdate}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;

