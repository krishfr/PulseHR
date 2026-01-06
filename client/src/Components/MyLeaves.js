import api from '../api';
import { useState, useEffect } from 'react';

const MyLeaves = ({ empId }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyLeaves();
  }, [empId]);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/my/${empId}`);
      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch leaves. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (statusName) => {
    const status = statusName.toLowerCase();
    if (status === 'pending') return 'status-pending';
    if (status === 'approved') return 'status-approved';
    if (status === 'rejected') return 'status-rejected';
    if (status === 'cancelled') return 'status-cancelled';
    return '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <h2>My Leaves</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Leaves</h2>
      {error && <div className="alert alert-error">{error}</div>}
      
      {leaves.length === 0 ? (
        <div className="empty-state">
          <p>No leaves applied yet.</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Leave ID</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Approved On</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.leave_id}>
                <td>{leave.leave_id}</td>
                <td>{leave.type_name}</td>
                <td>{formatDate(leave.start_date)}</td>
                <td>{formatDate(leave.end_date)}</td>
                <td>{leave.no_of_days || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(leave.status_name)}`}>
                    {leave.status_name}
                  </span>
                </td>
                <td>{formatDate(leave.applied_on)}</td>
                <td>{formatDate(leave.approved_on)}</td>
                <td>{leave.approved_by_name || '—'}</td>

<td>
  {leave.approved_on
    ? new Date(leave.approved_on).toLocaleDateString('en-IN')
    : '—'}
</td>

                <td>{leave.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyLeaves;

