import React, { useContext, useState, useEffect } from 'react';
import '../../styles/dashboard.css';
// components
import TaskForm from './TaskForm';
import LoginPage from '../auth/Login';
import RecordsPage from './RecordsPage';
import Footer from '../footer';  
import Navbar from '../Navbar';
// Authentication 
import { AuthContext } from '../../services/authServices'; 

function Dashboard() {
    // Get the authentication state
    const { authState } = useContext(AuthContext);


    // Auto swtich the records to show in RecordsPage based on the input date in TaskForm
    const today = new Date().toISOString().split('T')[0];
    const [filterDate, setFilterDate] = useState(today); // Initialize state with useState
    // Use useEffect to perform side effects, reacting to changes in filterDate
    const [updateTrigger, setUpdateTrigger] = useState(0); // New state to force update
    useEffect(() => {
      if (filterDate !== today) {
        console.log("Action triggered by filterDate change or manual trigger:", filterDate);
        // Your action here
      }
    }, [updateTrigger]); // Depend on updateTrigger to re-run
  
    const handleDateChange = (newDate) => {
      setFilterDate(newDate); // Might not trigger re-render if the value is the same
      setUpdateTrigger(prev => prev + 1); // This will always trigger the effect
    };

    return (
        <div className="dashboard">
            <Navbar />
            {authState.isAuthenticated ? (
            <div className="container-lg dashboard-container-block">
                <div className='row'>
                    {/* Task Form */}
                    <div className="col-5 " data-aos="fade-up" data-aos-duration="300" data-aos-delay="50">
                        <TaskForm onDateChange={handleDateChange} />
                    </div>
                    {/* Records */}
                    <div className="col-7 " data-aos="fade-up" data-aos-duration="900" data-aos-delay="100">
                        <RecordsPage filterDate={filterDate} />
                    </div>
                </div>
            </div>
            ) : (
            <LoginPage /> 
            )}
            <Footer />
        </div>
    );
}

export default Dashboard;