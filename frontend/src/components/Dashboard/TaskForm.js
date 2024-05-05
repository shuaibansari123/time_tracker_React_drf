import React, { useState, useCallback, useEffect } from 'react';
import DigitalClock from './DigitalClock';
import { postTaskForm, getAllTasks } from '../../services/dashboardService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import '../../styles/TaskForm.css';


const TaskForm = ({ onDateChange }) => {
    const [tasks, setTasks] = useState([]);
    const [activeTypeId, setActiveTypeId] = useState(null);
    const [formValues, setFormValues] = useState({
        date: new Date().toISOString().split('T')[0],
        start_time: '',
        end_time: '',
        task_type: '',
        task_name: '',
        notes: ''
    });

    // Fetch all tasks when the component mounts
    const fetchData = useCallback(async () => {
        try {
            const data = await getAllTasks();
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error('Error fetching task list:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const handleFormSubmission = async () => {
        try {
            await postTaskForm(formValues);
            onDateChange(formValues.date);
        } catch (error) {
            console.error("Error during form submission:", error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectType = (event) => {
        const selectedType = event.target.value;
        const selectedTask = tasks.find(task => task.type === selectedType);
        setActiveTypeId(selectedTask ? selectedTask.id : null);
        setFormValues(prevValues => ({
            ...prevValues,
            task_type: selectedType,
            task_name: '' // Reset task name when task type changes
        }));
    };

    const handleTimeAdjustment = (addMinutes = 30) => {
        let baseTime = formValues.end_time || formValues.start_time;
        if (!baseTime) {
            console.log("Base time is not set. Cannot add time.");
            return;
        }
        try {
            const baseDateTime = new Date(`2000-01-01T${baseTime}`);
            if (isNaN(baseDateTime.getTime())) {
                throw new Error("Invalid base time.");
            }
            const newEndTime = new Date(baseDateTime.getTime() + addMinutes * 60000).toTimeString().slice(0, 5);
            setFormValues(prev => ({ ...prev, end_time: newEndTime }));
        } catch (error) {
            console.error("Error adjusting time:", error);
        }
    };

    const taskOptions = tasks.filter(task => task.id === activeTypeId).flatMap(task => task.act_names);

    return (
        <div className='container task-form-container'>
            <form className="taskForm rounded-3" onSubmit={e => { e.preventDefault(); handleFormSubmission(); }}>
                <div className="row taskForm-row btn-row">
                    <div className="col-6"><DigitalClock /></div>
                    <div className="col-3">
                        {formValues.start_time && (
                            <button className="taskform-btn copy-btn" type="button" onClick={() => handleChange({ target: { name: 'start_time', value: formValues.end_time } })}>
                                Copy
                            </button>
                        )}
                    </div>
                    <div className="col-3">
                        {formValues.start_time && (
                            <button className="taskform-btn" type='button' onClick={() => handleTimeAdjustment()}>
                                <span className='btnImgText'>+30min</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="row taskForm-row">
                    <input type="date" name="date" className="col-4 form-control date-input" value={formValues.date} onChange={handleChange} />
                    <input type="time" name="start_time" className="col-4 form-control" value={formValues.start_time} onChange={handleChange} />
                    <input type="time" name="end_time" className="col-4 form-control" value={formValues.end_time} onChange={handleChange} />
                </div>
                <div className="row taskForm-row">
                    <select name="task_type" className="form-control col-6 task-input" value={formValues.task_type} onChange={handleSelectType}>
                        <option value="">Select Task Type...</option>
                        {tasks.map((type) => (
                            <option key={type.id} value={type.type}>{type.type}</option>
                        ))}
                    </select>
                    <select name="task_name" className="form-control col-6 task-input" value={formValues.task_name} onChange={handleChange}>
                        <option value="">Select Task Name...</option>
                        {taskOptions.map(option => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                        ))}
                    </select>
                </div>
                <div className="row taskForm-row">
                    <textarea name="notes" placeholder="Notes..." className="form-control rounded-4 notes-input" rows="11" value={formValues.notes} onChange={handleChange}></textarea>
                </div>
                <div className="row taskForm-row submit-btn-row">
                    {formValues.date && 
                    formValues.start_time && 
                    formValues.end_time && 
                    formValues.task_name && 
                    formValues.task_type && 
                    <button type="submit" className="small-btn submit-btn">
                        <FontAwesomeIcon icon={ faCheck } size='lg' />
                    </button>
                    }
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
