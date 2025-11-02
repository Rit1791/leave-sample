import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { getLeaveHistory } from '../services/LeaveService'; 

// LeaveForm - form to apply for leave

function LeaveForm({ onSubmit ,MAX_LEAVES}) {

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    reason: ''
  });
  const userName = localStorage.getItem("user") || "Unknown User";


  const handleChange = (e) => {          // handleChnage called whenever user types something in the input field
    const { name, value } = e.target;    // e.target.name = (eg to , from , resason)  , e.target.value = the current value entered by the user
    setFormData({ ...formData, [name]: value });
  };

  // Submits the leave 
  function handleSubmit(e){
    e.preventDefault();
    if (!formData.from || !formData.to || !formData.reason) {  // give error if any field is empty
      toast.error("Please fill all fields before submitting!")
      return      
    };

    // cal invalid range
    const from = new Date(formData.from);      // "2025-11-02" => Sun Nov 02 2025 05:30:00 GMT+0530 (India Standard Time)
    const to = new Date(formData.to);          // "2025-11-05" => Wed Nov 05 2025 05:30:00 GMT+0530 (India Standard Time)
    const newLeaveDays = (to - from) / (1000 * 60 * 60 * 24) + 1; // to-from = 259200000 milliseconds
    if (newLeaveDays <= 0) {
      toast.error("Invalid date range!");
      return;
    }

    // calculate total leaves approved
    const existingLeaves = getLeaveHistory() || [];
    const approvedDays = existingLeaves.reduce((total, leave) => {
      if (leave.status === "Approved") {
        const from = new Date(leave.from);
        const to = new Date(leave.to);
        return total + ((to - from) / (1000 * 60 * 60 * 24) + 1);  
      }
      return total;
    }, 0);

    // hanle submiting more leaves than balance 
    const remainingBalance = MAX_LEAVES - approvedDays;   
    if (newLeaveDays > remainingBalance) {        
      toast.error("Not enough leave balance!");
      return;
    }

    onSubmit({       // Pass data up to parent (Dashboard) (handleNewLeave function comming from parent as onSubmit)
      ...formData,   // passes prev data + new data
      employeeName: userName,
      status: 'Pending',
      id: Date.now()
    });
    toast.success("Leave submitted successfully!");
    setFormData({ from: '', to: '', reason: '' });  // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-6 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl text-white space-y-6  transition-all duration-300 hover:shadow-blue-400/40 w-full max-w-lg mx-auto hover:scale-105 ">

      <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-lg shadow-pink-500/60 hover:shadow-blue-400/80 transition-all duration-300 mb-6 flex items-center gap-2">
        New Leave Request
      </h3>

      {/* From Date */}
      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> From Date: </label>
        <input
          type="date"
          name="from"
          value={formData.from}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-blue-400 focus:border-blue-400 transition "
          required
        />
      </div>

      {/* To Date */}
      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> To Date: </label>
        <input
          type="date"
          name="to"
          value={formData.to}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          required
        />
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> Reason: </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition resize-none"
          rows="4"
          placeholder="Enter reason for leave "
          required
        />
      </div>

      {/* apply leave button */}
      <button type="submit" className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:scale-105 hover:shadow-blue-400/50 transition-all duration-300 cursor-pointer">
        Apply Leave
      </button>

      {/* Note */}
      <p className="text-sm text-gray-300 text-center mb-4 ">
        <span className='font-bold'>Note:</span> For a single-day leave, please enter the same date in both <span className='font-bold'>From Date</span> and <span className='font-bold'>To Date</span> fields.
      </p>
    </form>
  );
}

export default LeaveForm
