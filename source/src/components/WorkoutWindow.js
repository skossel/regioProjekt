import React, { useState } from 'react'
import { Container, TextField, Button, Typography, Box } from '@mui/material'
const WorkoutWindow = () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    const [name, setName] = useState(params.get('name') || '')
    const [start, setStart] = useState(params.get('start') || '')
    const [end, setEnd] = useState(params.get('end') || '')
    const handleSave = () => {
        if(name.trim() === '' || start.trim() === '' || end.trim() === ''){
            alert("Bitte alle Felder ausfüllen")
            return
        }
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
        <Container maxWidth="sm" style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>{id ? 'Workout bearbeiten' : 'Workout hinzufügen'}</Typography>
            <Box component="form" noValidate autoComplete="off">
                <TextField label="Name" fullWidth margin="normal" value={name} onChange={e=>setName(e.target.value)} />
                <TextField label="Start (ISO)" fullWidth margin="normal" value={start} onChange={e=>setStart(e.target.value)} />
                <TextField label="End (ISO)" fullWidth margin="normal" value={end} onChange={e=>setEnd(e.target.value)} />
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={handleSave}>{id ? 'Update' : 'Add'}</Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
                </Box>
            </Box>
        </Container>
    )
}
export default WorkoutWindow
