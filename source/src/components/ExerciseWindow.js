import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AssessmentIcon from '@mui/icons-material/Assessment'
const ExercisesWindow = () => {
    const [exercises, setExercises] = useState([])
    const [selectedExerciseId, setSelectedExerciseId] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [exerciseToDelete, setExerciseToDelete] = useState(null)
    const fetchExercises = () => {
        window.api.getExercises().then(data => {
            setExercises(data)
        })
    }
    useEffect(() => {
        fetchExercises()
        window.api.onRefreshExercises(() => {
            fetchExercises()
        })
    }, [])
    const handleDeleteClick = (id) => {
        setExerciseToDelete(id)
        setDeleteDialogOpen(true)
    }
    const confirmDelete = () => {
        window.api.deleteExercise(exerciseToDelete).then(deletedId => {
            if (deletedId !== null) {
                setExercises(exercises.filter(ex => ex.id !== exerciseToDelete))
            }
        })
        setDeleteDialogOpen(false)
        setExerciseToDelete(null)
    }
    const cancelDelete = () => {
        setDeleteDialogOpen(false)
        setExerciseToDelete(null)
    }
    const handleRowClick = (id) => {
        setSelectedExerciseId(id)
    }
    const handleAddExercise = () => {
        window.api.openExerciseWindow(null)
    }
    const handleEditExercise = () => {
        if (selectedExerciseId === null) return
        const exercise = exercises.find(ex => ex.id === selectedExerciseId)
        if (exercise) {
            window.api.openExerciseWindow(exercise)
        }
    }
    const handleMyProgress = (exercise) => {
        alert("Navigating to progress for " + exercise.name)
    }
    const handleWorkoutsNavigation = () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'workouts' }))
    }
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Exercises
                    </Typography>
                    <Button color="inherit" onClick={handleWorkoutsNavigation}>
                        Workouts
                    </Button>
                    <Button color="inherit" onClick={()=>{}}>
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
                                <TableCell>Description</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exercises.map(exercise => (
                                <TableRow key={exercise.id} selected={exercise.id === selectedExerciseId} onClick={() => handleRowClick(exercise.id)}>
                                    <TableCell>{exercise.name}</TableCell>
                                    <TableCell>{exercise.description}</TableCell>
                                    <TableCell>{exercise.type}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={e => { e.stopPropagation(); handleMyProgress(exercise) }}>
                                            <AssessmentIcon />
                                        </IconButton>
                                        <IconButton onClick={e => { e.stopPropagation(); setSelectedExerciseId(exercise.id); handleEditExercise() }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={e => { e.stopPropagation(); handleDeleteClick(exercise.id) }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleAddExercise}>
                        Add Exercise
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleEditExercise} disabled={selectedExerciseId === null}>
                        Edit Exercise
                    </Button>
                </div>
            </Container>
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Exercise löschen</DialogTitle>
                <DialogContent>Möchten Sie diese Übung wirklich löschen?</DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="secondary">Abbrechen</Button>
                    <Button onClick={confirmDelete} color="primary">Löschen</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default ExercisesWindow
