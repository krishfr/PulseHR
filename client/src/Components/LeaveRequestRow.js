import api from '../api';

const LeaveRequestRow = ({ leave, onUpdate }) => {
  const user = JSON.parse(localStorage.getItem('user')); // 👈 ADD

  const handleApprove = async () => {
    try {
     await api.put(`/update/${leave.leave_id}`, {
  status_id: 2,
  remarks: 'Approved'
      });
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to approve leave');
    }
  };

  const handleReject = async () => {
    const remarks = prompt('Enter rejection remarks');
    if (remarks === null) return;

    try {
      await api.put(`/update/${leave.leave_id}`, {
  status_id: 3,
  remarks
});
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to reject leave');
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN') : '—';

  return (
    <tr>
      <td>{leave.leave_id}</td>
      <td>{leave.emp_id}</td>
      <td>{leave.emp_name}</td>
      <td>{leave.leave_type_name}</td>
      <td>{formatDate(leave.start_date)}</td>
      <td>{formatDate(leave.end_date)}</td>
      <td>{leave.no_of_days || 'N/A'}</td>
      <td>{formatDate(leave.applied_on)}</td>
      <td>
        <div className="action-buttons">
          <button className="btn btn-success" onClick={handleApprove}>
            Approve
          </button>
          <button className="btn btn-danger" onClick={handleReject}>
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LeaveRequestRow;
