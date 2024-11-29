import React from 'react'
import BtnPrimary from './BtnPrimary'

const Navbar = () => {

  const user = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (

    <div className='bg-white shadow h-14 pr-2 pt-2'>
      <div className="flex items-center justify-between mb-6">
        <h1 className='text-xl text-gray-800 flex justify-start items-center space-x-2.5'>
        </h1>
        {user ? (
          <BtnPrimary onClick={handleLogout}>Logout</BtnPrimary>
        ) : (
          <BtnPrimary onClick={() => (window.location.href = "/login")}>
            Login
          </BtnPrimary>
        )}
        {/* <BtnPrimary onClick={() => setAddTaskModal(true)}>Add ToDo</BtnPrimary> */}
      </div>
    </div>
  )
}

export default Navbar