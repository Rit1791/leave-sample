// storing, retrieving, and clearing leave data using the localStorage

// get leaves from local storage
export const getLeaveHistory = () => {
  const leaves = localStorage.getItem('leaves');   // get the stored leaves (if any)
  return leaves ? JSON.parse(leaves) : [];    // it parses the JSON string into a JavaScript array
};

// save a new leave request
export const saveLeave = (leave) => {
  const leaves = getLeaveHistory();    // Calls the function above function to read the current list of leaves from localStorage (returns [] if none)
  const updatedLeaves = [...leaves, leave ];  
  localStorage.setItem('leaves', JSON.stringify(updatedLeaves));   // Converts the updated array to a JSON string
  return updatedLeaves;  
};

// clear all leave data
export const clearLeaves = () => {
  localStorage.removeItem('leaves'); 
};
