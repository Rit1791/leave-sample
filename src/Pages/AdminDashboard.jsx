import React, { useEffect, useState } from "react";
import LeaveHistory from "../components/LeaveHistory";
import { getLeaveHistory , clearLeaves  } from "../services/LeaveService";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import toast from 'react-hot-toast'; 



 function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
 

  useEffect(() => {
    const existingLeaves = getLeaveHistory() || []; 
    setLeaves(existingLeaves);
  }, []);

  const handleStatusChange = (id, status) => { // Triggered from LeaveHistory component on Approve or Reject
    const updatedLeaves = leaves.map((l) =>
      l.id === id ? { ...l, status } : l     //If the id matches the one clicked by admin creates a new updated object { ...l, status }
    );
    localStorage.setItem("leaves", JSON.stringify(updatedLeaves)); //Overwrites the old data in localStorage
    setLeaves(updatedLeaves);
  };

  return (
    <>
      <Navbar />

      {/* Main admin dashboard layout */}
      <div className="min-h-screen bg-gradient-to-l from-blue-700 via-indigo-800 to-purple-900  flex flex-col items-center p-8">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-extrabold text-white text-center mb-6 drop-shadow-md">Admin Dashboard</h2>
          <p className="text-center text-gray-300 mb-10 text-sm tracking-wide">Manage and review employee leave requests below</p>

            {/* Leave record section */}
          <div className="flex flex-row justify-between">
            <h3 className="text-2xl font-bold text-gray-100 mb-2 border-b border-white/30 inline-block pb-2">
              Employee Leave Records
            </h3>

            {/* clear button */}
            <button 
            onClick={() => { 
            clearLeaves() ;
            toast.success("All leave records cleared!") ;
            setLeaves([]); // reset UI
            }} className="px-4 py-1  rounded-lg text-sm font-medium bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 transition-all text-white shadow-md hover:shadow-red-400/50 cursor-pointer">
               Clear All Leave History
            </button>
          </div>

           {/* Leave history table component */}
            <LeaveHistory
              leaves={leaves}
              onStatusChange={handleStatusChange}
              isAdmin={true} 
            />
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}

export default AdminDashboard