import React, { useState, useEffect } from 'react'
import MainWindow from './components/MainWindow'
import ExercisesWindow from './components/ExerciseWindow'
const App = () => {
    const [page, setPage] = useState('workouts')
    useEffect(() => {
        const handleNavigation = (event) => {
            setPage(event.detail)
        }
        window.addEventListener('navigate', handleNavigation)
        return () => window.removeEventListener('navigate', handleNavigation)
    }, [])
    return (
        <>
            {page === 'workouts' && <MainWindow />}
            {page === 'exercises' && <ExercisesWindow />}
        </>
    )
}
export default App
