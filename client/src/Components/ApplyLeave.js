import axios from 'axios';
import { useState, useEffect } from "react";

const ApplyLeave = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveTypeId, setLeaveTypeId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [message, setMessage] = useState('');
    const [myLeaves, setMyLeaves] = useState([]);

    useEffect(()=>{
        const fetchLeaveTypes = async() => {
            try {
                const res = await axios.get("http://localhost:5000/leave-types");
                setLeaveTypes(res.data);
            } catch(err) {
                console.error(err.message);
            }
        };
        fetchLeaveTypes();
    },[]);


const handleSubmit = async (e) => {
    e.preventDefault();

    if(!leaveTypeId || !startDate || !endDate) {
        setMessage("Please fill the all required fields");
        return;
    }

    try {
        const empId = 1;  //Hardcoded for now
        const res = await axios.post("http://localhost:5000/apply", {
            emp_id:empId,
            leave_type_id:leaveTypeId,
            start_date:startDate,
            end_date:endDate,
            remarks
        });

        
        setMessage(`Leave applied successfully! Leave ID: ${res.data.leave.leave_id}, Status: Pending`);
        
        setLeaveTypeId('');
        setStartDate('');
        setEndDate('');
        setRemarks('');
    }catch(err) {
        console.error(err.response?.data || err.message);
        setMessage("Error applying leave. Please try again");
    }
}

return (
    <div className='container mt-4'>
            {message && <div className="alert alert-info">{message}</div>}
   
    <form onSubmit={handleSubmit}>
        <div>
            <label>Leave type</label>
            <select value={leaveTypeId} onChange={(e)=> setLeaveTypeId(e.target.value)}>
    <option value=''>Select Leave type</option>
    {leaveTypes?.map((lt) => (
        <option key={lt.leave_type_id} value={lt.leave_type_id}>
        {lt.type_name}
        </option>
    ))}
    </select>
        </div>

    <div>
        <label>Start Date</label>
        <input type='date' value={startDate} onChange={(e)=> setStartDate(e.target.value)}/>
    </div>

    <div>
        <label>End Date</label>
        <input type='date' value={endDate} onChange={(e)=> setEndDate(e.target.value)}/>
    </div>

    <div>
        <label>Remarks</label>
        <textarea value={remarks} onChange={(e)=> setRemarks(e.target.value)}></textarea>
    </div>

    <button type='submit'>Apply</button>
    </form>
    
     <h3>My Leaves</h3>
      {myLeaves.length === 0 ? (
        <p>No leaves applied yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Leave ID</th>
              <th>Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.map((l) => (
              <tr key={l.leave_id}>
                <td>{l.leave_id}</td>
                <td>{l.type_name}</td>
                <td>{l.start_date}</td>
                <td>{l.end_date}</td>
                <td>{l.status_name}</td>
                <td>{l.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplyLeave;