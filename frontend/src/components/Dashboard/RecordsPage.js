import React, { useState, useEffect } from 'react';
import '../../styles/Records.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { postRecordFilter, deleteRecord } from '../../services/dashboardService';

function RecordsPage({ filterDate }) {
    const today = new Date().toISOString().split('T')[0];
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [records, setRecords] = useState([]);

    const fetchRecords = async (filterData) => {
        try {
            const response = await postRecordFilter(filterData);
            setRecords(response);
            setCheckedItems(new Set()); // Reset checkboxes when new data is fetched
        } catch (error) {
            console.error("Error fetching records:", error);
        }
    };

    const handleFilterSubmit = async () => {
        const filterStartDate = document.querySelector('input[name="filterStartDate"]').value;
        const filterEndDate = document.querySelector('input[name="filterEndDate"]').value;
        const filterTaskType = document.querySelector('select[name="filterTaskType"]').value;
        const filterTaskName = document.querySelector('select[name="filterTaskName"]').value;

        const filterData = {
            filterStartDate,
            filterEndDate,
            filterTaskType,
            filterTaskName
        };
        fetchRecords(filterData);
    };

    useEffect(() => {
        handleFilterSubmit();
    }, []);

    useEffect(() => {
        const filterData = {
            filterStartDate: filterDate.filterDate,
            filterEndDate: filterDate.filterDate,
            filterTaskType: document.querySelector('select[name="filterTaskType"]').value,
            filterTaskName: document.querySelector('select[name="filterTaskName"]').value
        };
        fetchRecords(filterData);
    }, [filterDate]);

    const handleCheckboxChange = (index, isChecked) => {
        setCheckedItems(prevItems => {
            const newItems = new Set(prevItems);
            if (isChecked) {
                newItems.add(index);
            } else {
                newItems.delete(index);
            }
            return newItems;
        });
    };

    const handleDeleteRecords = async () => {
        const recordsToDelete = [...checkedItems].map(index => records[index].id);
        try {
            await deleteRecord({ record_ids: recordsToDelete });
            setRecords(currentRecords => currentRecords.filter((_, index) => !checkedItems.has(index)));
            setCheckedItems(new Set());
        } catch (error) {
            console.error("Error deleting records:", error);
        }
    };

    return (
        <div className="container-sm record-container-main rounded-3">
            <div className="row filter-row">
                <div className="col-md-3">
                    <label className="form-label-date rounded-4">Start Date</label>
                    <input type="date" name="filterStartDate" className="form-control filter-date" defaultValue={today} />
                </div>
                <div className="col-md-3">
                    <label className="form-label-date rounded-4">End Date</label>
                    <input type="date" name="filterEndDate" className="form-control filter-date" defaultValue={today} />
                </div>
                <div className="col-md-2">
                    <label className="form-label-task rounded-4">Task Type</label>
                    <select name="filterTaskType" className="form-control filter-task">
                        <option value="all_types">All Types</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <label className="form-label-task rounded-4">Task Name</label>
                    <select name="filterTaskName" className="form-control filter-task">
                        <option value="all_names">All Names</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <button className="small-btn filterBtn" type="button" onClick={handleFilterSubmit}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>

            <div className="table-container rounded-3">
                <table className="table table-striped rounded-3">
                    <thead className="thead-dark">
                        <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Task Type</th>
                            <th>Task Name</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        name={`record-${index}`}
                                        id={`checkbox-${index}`}
                                        checked={checkedItems.has(index)}
                                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                    />
                                </td>
                                <td><label className="form-check-label" htmlFor={`checkbox-${index}`}>{record.date_value}</label></td>
                                <td>{record.start_time}</td>
                                <td>{record.end_time}</td>
                                <td>{record.act_type}</td>
                                <td>{record.act_name}</td>
                                <td>{record.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {checkedItems.size > 0 && (
                <div className='col-2 offset-md-10'>
                    <button className="small-btn deleteBtn" type="button" onClick={handleDeleteRecords}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default RecordsPage;
