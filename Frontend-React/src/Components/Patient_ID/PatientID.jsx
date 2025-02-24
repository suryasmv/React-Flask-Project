/* eslint-disable */
import React, { useState } from 'react';
import './patient_id.css'

import Data from '../../Conditions/Generated_output.json';
import { Navigate, DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors, arrayMove, sortableKeyboardCoordinates, SortableContext, Button, useSortable, CSS, SvgImage, image } from '../Libraries/Libraries';

const Conditions = () => {
    const [gotoConditions, setgotoConditions] = useState(false)
    const [goback, setgoback] = useState(false);
    const [logout,setlogout]=useState(false);

    if (gotoConditions) {
        return <Navigate to="/conditions" />;
    }
    const handle_patientsubmit = () => {
        setgotoConditions(true)
    }
    if (goback) {
        return <Navigate to="/home" />
    }
    const handlegoback = () => {
        setgoback(true);
    }
    if(logout)
    {
      return <Navigate to="/" />;
    }
    const handleLogout = () => {
        // Clear authentication-related cookies
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
        // Redirect to login page
        setlogout(true);
      };
    return (

        <div className="doctor_selection">
            <div className="user_img_patient">
                
                <Button label='Home' className='goback_button' onClick={handlegoback} />
                <Button label="Logout" onClick={handleLogout} />
            </div>


            <div className="doctor_navbar">
                <img src={SvgImage} alt='logo' />
            </div>
                            <div class="cont">
                    <h2>Select Patient ID or Name:</h2>
                    <div class="search-box">
                        <input type="text" class="search-input" placeholder="Search.." />

                    </div>
                    <Button label='Patient Selected' className='Patient_submit' onClick={handle_patientsubmit} />
                </div>
        </div>
    )
}

export default Conditions