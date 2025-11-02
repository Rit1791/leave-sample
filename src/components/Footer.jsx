import React from 'react'

function Footer() {
  return (
    <footer className="text-center text-white/70 py-4 mt-10 border-t border-white/20 text-sm ">
     © {new Date().getFullYear()} Leave Management System | Built by Ritesh
    </footer>
  )
}

export default Footer