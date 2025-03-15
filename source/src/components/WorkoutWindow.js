import React, { useState } from 'react'
const WorkoutWindow = () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    const [name, setName] = useState(params.get('name') || '')
    const [start, setStart] = useState(params.get('start') || '')
    const [end, setEnd] = useState(params.get('end') || '')
    const handleSave = () => {
        if(id){
            const workout = { id: parseInt(id), name, start, end }
            window.workoutApi.updateWorkout(workout).then(()=>{
                window.workoutApi.closeWindow()
            })
        }else{
            const workout = { name, start, end }
            window.workoutApi.addWorkout(workout).then(()=>{
                window.workoutApi.closeWindow()
            })
        }
    }
    const handleCancel = () => {
        window.workoutApi.closeWindow()
    }
    return (
        <div style={{ padding:'20px' }}>
            <h2>{id ? 'Edit Workout' : 'Add Workout'}</h2>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
                <label>Start (ISO):</label>
                <input type="text" value={start} onChange={e=>setStart(e.target.value)} />
            </div>
            <div>
                <label>End (ISO):</label>
                <input type="text" value={end} onChange={e=>setEnd(e.target.value)} />
            </div>
            <div style={{ marginTop:'20px' }}>
                <button onClick={handleSave}>{id ? 'Update' : 'Add'}</button>
                <button onClick={handleCancel} style={{ marginLeft:'10px' }}>Cancel</button>
            </div>
        </div>
    )
}
export default WorkoutWindow
