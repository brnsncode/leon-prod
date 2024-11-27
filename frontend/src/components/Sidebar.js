import React, { useCallback, useEffect, useState } from 'react';
import AddProjectModal from './AddProjectModal';
import axios from 'axios';
import { Link } from 'react-router-dom';


const serverUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9000';

const Sidebar = ({ isCollapsed }) => {
  const [isModalOpen, setModalState] = useState(false);
  const [projects, setProjects] = useState([]);
  const [paramsWindow, setParamsWindow] = useState(window.location.pathname.slice(1));

  const user = localStorage.getItem("token"); // Check if user is logged in

  useEffect(() => {
    if (user) {
      // Load project data if user is logged in
      projectData();
      document.addEventListener('projectUpdate', projectData);
      return () => {
        document.removeEventListener('projectUpdate', projectData);
      };
    }
  }, [user]);

  const handleLocation = (e) => {
    setParamsWindow(new URL(e.currentTarget.href).pathname.slice(1));
  };

  const openModal = useCallback(() => setModalState(true), []);
  const closeModal = useCallback(() => setModalState(false), []);

  const projectData = () => {
    axios.get(`${serverUrl}/projects/`)
      .then((res) => {
        setProjects(res.data);
      });
  };

  if (!user) {
    return null; // If no user, return nothing (or you could add a login prompt here)
  }

  return (
    <div className='py-5'>
      {/* Only show "Projects" title and add button if sidebar is not collapsed */}
      {!isCollapsed && (
        <div className="px-4 mb-3 flex items-center justify-between">
          <span>Projects</span>
          <button
            onClick={openModal}
            className='bg-indigo-200 rounded-full p-[2px] focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-offset-1'
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600">
              <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Projects List - hidden if sidebar is collapsed */}
      {!isCollapsed && (
        <ul className='border-r border-gray-300 pr-2'>
          {projects.map((project, index) => (
            <Link key={index} to={project._id} onClick={handleLocation}>
              <li className={`px-5 py-1.5 mb-1 text-gray-600 text-sm capitalize select-none hover:text-indigo-600 rounded transition-colors hover:bg-indigo-200/80 ${paramsWindow === project._id && 'text-indigo-600 bg-indigo-200/80'}`}>
                {project.title}
              </li>
            </Link>
          ))}
        </ul>
      )}

      <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default Sidebar;
