import React, { useEffect, useState } from 'react';
import LeaveForm from '../components/LeaveForm';
import LeaveHistory from '../components/LeaveHistory';
import { getLeaveHistory, saveLeave } from '../services/LeaveService';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import LeaveBalance from '../components/LeaveBalance';

function Dashboard() {
  const user = localStorage.getItem('user') || 'User';   // gets username from browser
  const [leaves, setLeaves] = useState([])
  const MAX_LEAVES=10

  //handles how new leave applications get stored and displayed.
  const handleNewLeave = (newLeave) => {  
    const updatedLeaves = saveLeave(newLeave);
    setLeaves(updatedLeaves);
  };

  //handles approval/rejection of leave
  const handleStatusChange = (id, status) => {   
    const updatedLeaves = leaves.map(l => {
      if (l.id === id) {
        const updatedLeave = { ...l, status };  // add status
        return updatedLeave;
      }
      return l;  // when l.id != id return original leave object(l)
    });

    localStorage.setItem('leaves', JSON.stringify(updatedLeaves)); // convert updated list to json string
    setLeaves(updatedLeaves);
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="min-h-screen bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 p-4 md:p-8 flex flex-col items-center">
        <div className='w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>

          <h2 className="text-4xl font-extrabold text-white text-center  drop-shadow-lg mb-8  ">
            Welcome, <span className='text-pink-400 '>{user}</span>  
          </h2>

        {/* Leave Balance Section */}
        <section className="mb-8">
          <div className=" flex justify-center">
          <LeaveBalance setLeaves={setLeaves} MAX_LEAVES={MAX_LEAVES}></LeaveBalance>
          </div>
         </section>  

          {/* Apply for leave section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-100 mb-2 border-b border-white/30 inline-block pb-2">
              Apply for Leave
            </h3>
            <div className="mt-6 flex justify-center">
              <LeaveForm onSubmit={handleNewLeave} MAX_LEAVES={MAX_LEAVES} />
            </div>
          </section>

          {/* Leave History Section */}
          <section>
            <h3
              className="text-2xl font-bold text-gray-100 mb-2 border-b border-white/30 inline-block pb-2">
              Leave History
            </h3>
            <LeaveHistory
              leaves={leaves}
              onStatusChange={handleStatusChange}
              isAdmin={false}
            />
          </section>

        </div>
        <Footer></Footer>
      </div>
    </>
  );
}

export default Dashboard