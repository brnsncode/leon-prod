import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import AddTaskModal from "./AddTaskModal";
import BtnPrimary from './BtnPrimary'
import DropdownMenu from "./DropdownMenu";
// import TaskModal from "./TaskModal";
import { useParams, useNavigate } from "react-router";
import ProjectDropdown from "./ProjectDropdown"
import axios from "axios";
import toast from "react-hot-toast";
import TaskModal from "./TaskModal";

const serverUrl = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.181:9000'

const user = localStorage.getItem("token"); // Check if user is logged in

//added authentication for frontend validation to pass to backend middleware
const authHeaders = {
  headers: {
    Authorization: `Bearer ${user}`,
  },
};

function Task() {

    // const itemsFromBackend = [
    //     { _id: uuid(), content: "First task" },
    //     { _id: uuid(), content: "Second task" },
    //     { _id: uuid(), content: "Third task" },
    //     { _id: uuid(), content: "Forth task" }
    // ];

    // const columnsFromBackend = {
    //     [uuid()]: {
    //         name: "Requested",
    //         items: []
    //     },
    //     [uuid()]: {
    //         name: "To do",
    //         items: []
    //     },
    //     [uuid()]: {
    //         name: "In Progress",
    //         items: []
    //     },
    //     [uuid()]: {
    //         name: "Done",
    //         items: []
    //     }
    // };

    const getBadgeStyles = (column) => {
        const capacityReachingLimit = sumCapacity(column.items) >= 60;
        const capacityExceedsLimit = sumCapacity(column.items) >= 100;
        const isColumnInProgress = column.name === "In Progress";
        const isColumnUnderReview = column.name === "Waiting For Review";
      
        if (column.items.length < 1) {
          return 'invisible';
        }
        if (capacityExceedsLimit && isColumnInProgress) {
            return 'text-white bg-red-500';
        }
        if (capacityReachingLimit && isColumnInProgress) {
          return 'text-white bg-yellow-500';
        }
        
        if (capacityExceedsLimit && isColumnUnderReview) {
            return 'text-white bg-red-500';
        }
        if (capacityReachingLimit && isColumnUnderReview) {
            return 'text-white bg-yellow-500';
        }

      
        return 'text-gray-500 border-gray-300';
      };
      

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
        let data = {}
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);

            // Prevent drop if the destination is "In Progress" and already has 10 items
            if (destColumn.name === "In Progress" && destColumn.items.length >= 10) {
                toast.error("Cannot add more tasks to 'In Progress' - limit reached!");
                return;
            }
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
            data = {
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            }
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
            data = {
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            }

        }

        updateTodo(data)
    };

    const [isAddTaskModalOpen, setAddTaskModal] = useState(false);

    // const [columns, setColumns] = useState(columnsFromBackend);
    const [columns, setColumns] = useState({});
    const [isRenderChange, setRenderChange] = useState(false);
    const [isTaskOpen, setTaskOpen] = useState(false);
    const [taskId, setTaskId] = useState(false);
    const [title, setTitle] = useState('');
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [isEditTaskModalOpen, setEditTaskModal] = useState(false);

    const refreshData = () => {
        setRenderChange(true)
    }

    useEffect(() => {
        if (!isAddTaskModalOpen || isRenderChange) {
            axios.get(`${serverUrl}/project/${projectId}`, authHeaders)
                .then((res) => {
                    setTitle(res.data[0].title)
                    setColumns({
                        [uuid()]: {
                            name: "Requested",
                            items: res.data[0].task.filter((task) => task.stage === "Requested").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "In Progress",
                            items: res.data[0].task.filter((task) => task.stage === "In Progress").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "Waiting For Review",
                            items: res.data[0].task.filter((task) => task.stage === "Waiting For Review").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "On Hold",
                            items: res.data[0].task.filter((task) => task.stage === "On Hold").sort((a, b) => {
                                return a.order - b.order;
                            })
                        },
                        [uuid()]: {
                            name: "Done",
                            items: res.data[0].task.filter((task) => task.stage === "Done").sort((a, b) => {
                                return a.order - b.order;
                            })
                        }
                    })
                    setRenderChange(false)
                }).catch((error) => {
                    toast.error('Something went wrong')
                })
        }
    }, [projectId, isAddTaskModalOpen, isRenderChange]);

    const updateTodo = (data) => {
        axios.put(`${serverUrl}/project/${projectId}/todo`, data, authHeaders)
            .then((res) => {
            }).catch((error) => {
                toast.error('Something went wrong')
            })
    }

    const handleDelete = (e, taskId) => {
        e.stopPropagation();
        axios.delete(`${serverUrl}/project/${projectId}/task/${taskId}`, authHeaders)
            .then((res) => {
                toast.success('Task is deleted')
                setRenderChange(true)
            }).catch((error) => {

                toast.error('Something went wrong')
            })
    }

    const handleTaskDetails = (id) => {
        setTaskId({ projectId, id });
        setTaskOpen(true);
    }

    const handleSetEditModal = (id) => {
        //  id.stopPropagation();
        isEditTaskModalOpen(true)
        setEditTaskModal(true)
    }

    function sumCapacity(items) {
        return items.reduce((total, item) => {
            return total + (item.capacity || 0); // Add capacity if it exists, otherwise add 0
        }, 0);
    }

    return (
        <div className='px-12 py-6 w-full'>
            <div className="flex items-center justify-between mb-6">
                <h1 className='text-xl text-gray-800 flex justify-start items-center space-x-2.5'>
                    <span>{title.slice(0, 25)}{title.length > 25 && '...'}</span>
                    <ProjectDropdown id={projectId} navigate={navigate} />
                </h1>
                <BtnPrimary onClick={() => setAddTaskModal(true)}>Add ToDo</BtnPrimary>
            </div>
            <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
            >
                <div className="flex gap-5">
                    {Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <div
                                className="w-3/12 h-[580px]"
                                key={columnId}
                            >
                                <div className="pb-2.5 w-full flex justify-between">
                                    <div className="inline-flex items-center space-x-2">
                                        <h2 className=" text-[#1e293b] font-medium text-sm uppercase leading-3">{column.name}</h2>
                                        <span className={`h-5 inline-flex items-center justify-center px-2 mb-[2px] leading-none rounded-full text-xs font-semibold text-gray-500 border border-gray-300 ${column.items.length < 1 && 'invisible'}`}>{column.items?.length}</span>
                                        

                                    </div>
                                    {/* <span className={`h-5 inline-flex items-center justify-center px-2 mb-[2px] leading-none rounded-full text-xs font-semibold ${sumCapacity(column.items) >= 60 ? 'text-white bg-red-500' : 'text-gray-500 border-gray-300'} border ${column.items.length < 1 && 'invisible'}`}>{sumCapacity(column.items)}</span> */}
                                    <span className={`h-5 inline-flex items-center justify-center px-2 mb-[2px] leading-none rounded-full text-xs font-semibold ${getBadgeStyles(column)} border`}>
                                        {sumCapacity(column.items)}
                                    </span>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={15} className="text-[#9ba8bc]" viewBox="0 0 448 512"><path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" /></svg> */}
                                </div>
                                <div>
                                    <Droppable droppableId={columnId} key={columnId}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`min-h-[530px] pt-4 duration-75 transition-colors border-t-2 border-indigo-400 ${snapshot.isDraggingOver && 'border-indigo-600'}`}
                                                >
                                                    {column.items.map((item, index) => {
                                                        return (
                                                            <Draggable
                                                                key={item._id}
                                                                draggableId={item._id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{ ...provided.draggableProps.style }}
                                                                            // onClick={() => handleTaskDetails(item._id)}
                                                                            // onClick={() => handleSetEditModal(item._id)}
                                                                            className={`select-none px-3.5 pt-3.5 pb-2.5 mb-2 border border-gray-200 rounded-lg shadow-sm bg-white relative ${snapshot.isDragging && 'shadow-md'}`}
                                                                        >
                                                                            <div className="pb-2">
                                                                                <div className="flex item-center justify-between">
                                                                                    <h3 className="text-[#1e293b] font-medium text-sm capitalize">Requestor: {item.requestor}</h3>
                                                                                    <DropdownMenu taskId={item._id} handleDelete={handleDelete} projectId={projectId} setRenderChange={setRenderChange} />
                                                                                </div>

                                                                                <div className="flex item-center justify-between">
                                                                                    <h3 className="text-[#1e293b] font-medium text-sm capitalize pb-2">{item.title.slice(0, 60)}{item.title.length > 60 && '...'}</h3>
                                                                                    {/* <DropdownMenu taskId={item._id} handleDelete={handleDelete} projectId={projectId} setRenderChange={setRenderChange} /> */}
                                                                                </div>
                                                                                

                                                                                <p className="text-xs text-slate-500 leading-4 -tracking-tight">{item.description.slice(0, 60)}{item.description.length > 60 && '...'}</p>
                                                                                <span className="py-1 px-2.5 bg-indigo-100 text-indigo-600 rounded-md text-xs font-medium mt-1 inline-block">Capacity: {item.capacity}</span>
                                                                               
                                                                                <span
                                                                                    className={`py-1 px-2.5 ${(new Date() - new Date(item.updatedAt)) / (1000 * 60 * 60 * 24) > 2
                                                                                            ? 'bg-red-100 text-red-600'
                                                                                            : 'bg-indigo-100 text-indigo-600'
                                                                                        } rounded-md text-xs font-medium mt-1 inline-block`}
                                                                                >
                                                                                    Updated: {new Date(item.updatedAt).toISOString().split('T')[0]}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            );
                                        }}
                                    </Droppable>

                                </div>
                            </div>
                        );
                    })}
                </div >
            </DragDropContext >
            <AddTaskModal isAddTaskModalOpen={isAddTaskModalOpen} setAddTaskModal={setAddTaskModal} projectId={projectId} />
            <AddTaskModal isAddTaskModalOpen={isEditTaskModalOpen} setAddTaskModal={setEditTaskModal} projectId={projectId} taskId={taskId} edit={true} refreshData={refreshData} />
            {/* <AddTaskModal isAddTaskModalOpen={isEditTaskModalOpen} setAddTaskModal={setEditTaskModal} projectId={projectId} taskId={taskId} edit={true} refreshData={refreshData} /> */}
            <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
        </div >
    );
}

export default Task;