import React, { useState } from 'react';

function InputTaskModal({ isVisible, onClose, onSave }) {
  const [taskType, setTaskType] = useState(''); // State to hold input value

  if (!isVisible) return null;

  const handleSave = async () => {
    // Call onSave prop function, which is the actual logic to save changes
    const isSuccess = await onSave(taskType);
    if (isSuccess) {
      onClose(); // Close modal on success
      // Optionally reset form state here if the modal will be reused without unmounting
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Add Tasks</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
                <input type="text" className="form-control" style={{ width: '20rem', fontSize: '1rem'}} placeholder="Enter task here..."
                    value={taskType} onChange={(e) => setTaskType(e.target.value)} />
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default InputTaskModal;
