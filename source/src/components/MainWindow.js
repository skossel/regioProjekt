import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
const MainWindow = () => {
    const [workouts, setWorkouts] = useState([{ id: 1, name: 'Workout A', start: '2023-03-15T09:00', end: '2023-03-15T10:00' }, { id: 2, name: 'Workout B', start: '2023-03-16T10:00', end: '2023-03-16T11:30' }])
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)
    const calculateDuration = (start, end) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diff = endDate - startDate
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return hours + 'h ' + remainingMinutes + 'm'
    }
    const handleDelete = (id) => {
        const updatedWorkouts = workouts.filter(workout => workout.id !== id)
        setWorkouts(updatedWorkouts)
    }
    const handleRowClick = (id) => {
        setSelectedWorkoutId(id)
    }
    const handleAddWorkout = () => {
        alert('Add Workout')
    }
    const handleEditWorkout = () => {
        if (selectedWorkoutId === null) return
        alert('Edit Workout ' + selectedWorkoutId)
    }
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Workout Tracker
                    </Typography>
                    <Button color="inherit" onClick={() => {}}>
                        Exercises
                    </Button>
                    <Button color="inherit" onClick={() => {}}>
                        Templates
                    </Button>
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: '20px' }}>
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
                            {workouts.map(workout => (
                                <TableRow key={workout.id} selected={workout.id === selectedWorkoutId} onClick={() => handleRowClick(workout.id)}>
                                    <TableCell>{workout.name}</TableCell>
                                    <TableCell>{new Date(workout.start).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(workout.end).toLocaleString()}</TableCell>
                                    <TableCell>{calculateDuration(workout.start, workout.end)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(workout.id) }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleAddWorkout}>
                        Add Workout
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleEditWorkout} disabled={selectedWorkoutId === null}>
                        Edit Workout
                    </Button>
                </div>
            </Container>
        </div>
    )
}
export default MainWindow
