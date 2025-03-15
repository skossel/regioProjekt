import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
const MainWindow = () => {
    const [workouts, setWorkouts] = useState([])
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)
    const fetchWorkouts = () => {
        window.api.getWorkouts().then(data=>{
            setWorkouts(data)
        })
    }
    useEffect(()=>{
        fetchWorkouts()
        window.api.onRefreshWorkouts(()=>{
            fetchWorkouts()
        })
    },[])
    const calculateDuration = (start, end) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diff = endDate - startDate
        const minutes = Math.floor(diff/60000)
        const hours = Math.floor(minutes/60)
        const remainingMinutes = minutes % 60
        return hours+'h '+remainingMinutes+'m'
    }
    const handleDelete = (id) => {
        window.api.deleteWorkout(id).then(deletedId=>{
            if(deletedId!==null){
                setWorkouts(workouts.filter(workout=>workout.id!==id))
            }
        })
    }
    const handleRowClick = (id) => {
        setSelectedWorkoutId(id)
    }
    const handleAddWorkout = () => {
        window.api.openWorkoutWindow(null)
    }
    const handleEditWorkout = () => {
        if(selectedWorkoutId===null)return
        const workout = workouts.find(w=>w.id===selectedWorkoutId)
        if(workout){
            window.api.openWorkoutWindow(workout)
        }
    }
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow:1 }}>
                        Workout Tracker
                    </Typography>
                    <Button color="inherit" onClick={()=>{}}>
                        Exercises
                    </Button>
                    <Button color="inherit" onClick={()=>{}}>
                        Templates
                    </Button>
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop:'20px' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>End</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workouts.map(workout=>(
                                <TableRow key={workout.id} selected={workout.id===selectedWorkoutId} onClick={()=>handleRowClick(workout.id)}>
                                    <TableCell>{workout.name}</TableCell>
                                    <TableCell>{new Date(workout.start).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(workout.end).toLocaleString()}</TableCell>
                                    <TableCell>{calculateDuration(workout.start, workout.end)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={e=>{e.stopPropagation(); handleDelete(workout.id)}}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={e=>{e.stopPropagation(); setSelectedWorkoutId(workout.id); handleEditWorkout()}}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ marginTop:'20px', display:'flex', justifyContent:'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleAddWorkout}>
                        Add Workout
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleEditWorkout} disabled={selectedWorkoutId===null}>
                        Edit Workout
                    </Button>
                </div>
            </Container>
        </div>
    )
}
export default MainWindow
