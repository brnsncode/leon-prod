import AppLayout from "./components/AppLayout";
import { Routes, Route, Navigate} from "react-router-dom";
import Task from "./components/Task";
import { Toaster } from "react-hot-toast";

import Main from "./components/Main";
import Login from "./components/Login";

function App() {
  const user = localStorage.getItem("token");
  console.log('render app..')
  return (
    <AppLayout>
      <Toaster
        position="top-right"
        gutter={8}
      />
      <Routes>
  
        {user && <Route path="/:projectId" exact element={<Task />} />}
        <Route path="/login" exact element={<Login />} />
        {/* <Route 
          path="/" 
          element={user ? <Navigate replace to="/" /> : <Navigate replace to="/login" />} 
        /> */}
        <Route path="/:projectId"  element={<Navigate replace to="/login" />} />


        {user && <Route path="/:projectId" element={<Task />} />}
        <Route path="/" element={
          <div className="flex flex-col items-center w-full ">
            <img src="./image/welcome.svg" className="w-5/12" alt="" />
            <h1 className="text-lg text-gray-600">Select or create new project</h1>
          </div>
        } />
      </Routes>
    </AppLayout>
  );
}

export default App;
