import React, { useState } from 'react';
import './Preferences.css';
import Data from '../../Conditions/Generated_output.json';
import {
    Navigate,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    closestCorners,
    useSensor,
    useSensors,
    arrayMove,
    sortableKeyboardCoordinates,
    SortableContext,
    Button,
    useSortable,
    CSS,
    SvgImage
} from '../Libraries/Libraries';

const Task = ({ id, title, icon }) => {
    const formattedTitle = title.replace(/_/g, ' ');

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div className='task'>
            <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
                {formattedTitle}
                <img src={icon} />
            </div>
        </div>
    );
};

const Conditions = () => {
    const [preferences, setPreferences] = useState(
        Data.conditions.map((condition, index) => ({
            id: index + 1,
            title: condition.name,
            icon: condition.icon,
        }))
    );
    const [gotoColumns, setGotoColumns] = useState(false);
    const [logout, setLogout] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (logout) {
        return <Navigate to="/" />;
    }

    if (gotoColumns) {
        return <Navigate to="/columns_selection" />;
    }

    const handleDragEnd = (e) => {
        const { active, over } = e;
        if (active.id === over.id) return;
        setPreferences((preferences) => {
            const originalPos = preferences.findIndex((task) => task.id === active.id);
            const newPos = preferences.findIndex((task) => task.id === over.id);
            return arrayMove(preferences, originalPos, newPos);
        });
    };

    const handleLogout = () => {
        // Clear authentication-related cookies
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        setLogout(true);
    };

    const handleSubmit = () => {
        localStorage.setItem('preferences', JSON.stringify(preferences));
        setGotoColumns(true);
    };

    return (
        <div className="doctor_selection">
            <div className="user_img_pref">
                <Button label="Logout" onClick={handleLogout} />
            </div>

            <div className="doctor_navbar">
                <img src={SvgImage} alt="logo" />
            </div>

            <div className="preferences">
                <div className='pref_heading'>
                    <h1>PREFERENCES</h1>
                    <p>All conditions are selected by default. Drag and drop to reorder.</p>
                </div>

                <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <div className='column'>
                        <SortableContext items={preferences}>
                            {preferences.map((task) => (
                                <Task id={task.id} title={task.title} key={task.id} icon={task.icon}/>
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>

                <Button className="submitbutton" label="Submit" type="submit" icon="pi pi-check" onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default Conditions;
