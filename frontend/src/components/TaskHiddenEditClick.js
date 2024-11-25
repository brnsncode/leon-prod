import React, { useState } from 'react'
import AddTaskModal from './AddTaskModal'

const DropdownMenu = ({ taskId, projectId, setRenderChange }) => {
    const [isEditTaskModalOpen, setEditTaskModal] = useState(false);

    const refreshData = () => {
        setRenderChange(true)
    }
    const handleSetEditModal = (e) => {
        e.stopPropagation();
        setEditTaskModal(true)
    }

    return (
        <>
                    <div className="w-40 bg-white rounded-md border shadow select-none p-1 divide-y">
                        <div className='py-[3px]'>
                            <button onlLoad={(e) => handleSetEditModal(e)} className='transition-colors duration-75 flex w-full items-center rounded-md px-2.5 py-2 text-sm space-x-2.5 text-slate-500 hover:bg-indigo-500 hover:text-gray-100'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' width={15} viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                                <h2 className='leading-none text-sm '>Edit</h2>
                            </button>
                            {/* <button className='transition-colors duration-75 flex w-full items-center rounded-md px-2.5 py-2 text-sm space-x-2.5 text-slate-500 hover:bg-indigo-500 hover:text-gray-100'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' width={15} viewBox="0 0 512 512"><path d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64H64V224h64V160H64z" /></svg>
                                <h2 className='leading-none text-sm '>Clone</h2>
                            </button> */}
                        </div>
                    </div>
            <AddTaskModal isAddTaskModalOpen={isEditTaskModalOpen} setAddTaskModal={setEditTaskModal} projectId={projectId} taskId={taskId} edit={true} refreshData={refreshData} />
        </>
    )
}

export default DropdownMenu
