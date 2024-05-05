import React, { useEffect, useState, useCallback } from 'react';
import {
    getAllTasks,
    postActType,
    postActName,
    deleteActType,
    deleteActName,
} from '../../services/userPageServices';
import InputTaskModal from './inputTaskModal';
import '../../styles/userPage/editTask.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function EditTaskBlock() {
    const [types, setTypes] = useState([]);
    const [modalData, setModalData] = useState({ 
        isVisible: false, 
        taskType: false, 
        taskName: false, 
        activeTypeId: null,
    });

    // get All Tasks when the component mounts
    const fetchData = useCallback(async () => {
        try {
            const data = await getAllTasks();
            console.log("Data: ", data);
            if (Array.isArray(data)) {
                setTypes(data);
            } else {
                console.error('Fetched data is not an array:', data);
            }
        } catch (error) {
            console.error('Error fetching task list:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle click event on task type or task name to control modal
    const handleClick = (id) => {
        if (id === 'addTask') {
            setModalData({ ...modalData, isVisible: true, taskType: true });
        } else if (id === 'addName') {
            setModalData({ ...modalData, isVisible: true, taskName: true });
        } else {
            setModalData({ ...modalData, activeTypeId: id });
        }
    };

    useEffect(() => {
        setModalData(prev => ({ ...prev, isVisible: prev.taskType || prev.taskName }));
    }, [modalData.taskType, modalData.taskName]);

    const handleCloseModal = useCallback(() => {
        setModalData({ ...modalData, isVisible: false, taskType: false, taskName: false });
    }, [modalData]);

    const refreshTaskNames = useCallback(async (typeId) => {
        try {
            const updatedTypes = [...types];
            const index = updatedTypes.findIndex(t => t.id === typeId);
            if (index !== -1) {
                const updatedTypeData = await getAllTasks();
                updatedTypes[index] = updatedTypeData.find(t => t.id === typeId);
                setTypes(updatedTypes);
            }
        } catch (error) {
            console.error('Failed to refresh task names:', error);
        }
    }, [types]);

    const handleSaveChanges = useCallback(async (inputValue) => {
        try {
            if (modalData.taskType) {
                const response = await postActType({ type: inputValue });
                if (response) {
                    console.log("Task Type Saved Successfully:", response);
                    setTypes(prev => [...prev, response]);
                    handleCloseModal();
                    return true;
                }
            } else if (modalData.taskName && modalData.activeTypeId) {
                const response = await postActName({ name: inputValue, act_type: modalData.activeTypeId });
                if (response) {
                    console.log("Task Name Saved Successfully:", response);
                    await refreshTaskNames(modalData.activeTypeId);
                    handleCloseModal();
                    return true;
                }
            }
        } catch (error) {
            console.error("Error saving:", error);
            return false;
        }
    }, [modalData, handleCloseModal, refreshTaskNames]);

    
    const handleDelete = useCallback(async (id, type) => {
        try {
            const response = type === 'type' ? await deleteActType(id) : await deleteActName(id);
            if (response) {
                console.log(`Deleting Task ${type}:`, id);
                if (type === 'name') {
                    await refreshTaskNames(modalData.activeTypeId);
                } else {
                    setTypes(prevItems => prevItems.filter(it => it.id !== id));
                }
                return true;
            }
        } catch (error) {
            console.error("Error deleting:", error);
            return false;
        }
    }, [refreshTaskNames, modalData.activeTypeId]);
    
    const activeTasks = types.find(type => type.id === modalData.activeTypeId)?.act_names || [];
    
    return (
        <div className="container editTask-container">
            <h1 className="editTask-heading">Edit Tasks</h1>
            <div className="row">
                <div className="col">
                    <nav>
                        <h4 className="editTask-heading h4">Task Type</h4>
                        <ul className="list-group">
                            {types.map((type) => (
                                <li key={type.id}
                                    className={`list-group-item list-group-item-action ${type.id === modalData.activeTypeId ? 'active' : ''}`}
                                    onClick={() => handleClick(type.id)}>
                                    {type.type}
                                    <button
                                        className="btn btn-sm delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(type.id, 'type');
                                        }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                            
                                <li className="list-group-item list-group-item-action add"
                                    onClick={() => handleClick('addTask')}>
                                    <FontAwesomeIcon icon={faPlus} size='lg' />
                                </li>
                            
                        </ul>
                    </nav>
                </div>
                <div className="col">
                    <nav>
                        <h4 className="editTask-heading h4">Task Name</h4>
                        <ul className="list-group">
                            {activeTasks.map((act, index) => (
                                <li key={index}
                                    className="list-group-item list-group-item-action taskName">
                                    {act.name}
                                    <button
                                        className="btn btn-sm delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(act.id, 'name');
                                        }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                            {modalData.activeTypeId !== null &&
                                <li className="list-group-item list-group-item-action add"
                                    onClick={() => handleClick('addName')}>
                                    <FontAwesomeIcon icon={faPlus} size='lg' />
                                </li>
                            }
                        </ul>
                    </nav>
                </div>
            </div>
            <InputTaskModal
                isVisible={modalData.isVisible}
                onClose={handleCloseModal}
                onSave={handleSaveChanges}
            />
        </div>
    );
}

export default EditTaskBlock;
