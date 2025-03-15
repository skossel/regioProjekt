import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
const TemplatesWindow = () => {
    const [templates, setTemplates] = useState([])
    const [selectedTemplateId, setSelectedTemplateId] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [templateToDelete, setTemplateToDelete] = useState(null)
    const fetchTemplates = () => {
        window.api.getTemplates().then(data => {
            setTemplates(data)
        })
    }
    useEffect(() => {
        fetchTemplates()
        window.api.onRefreshTemplates(() => {
            fetchTemplates()
        })
    }, [])
    const handleDeleteClick = (id) => {
        setTemplateToDelete(id)
        setDeleteDialogOpen(true)
    }
    const confirmDelete = () => {
        window.api.deleteTemplate(templateToDelete).then(deletedId => {
            if (deletedId !== null) {
                setTemplates(templates.filter(t => t.id !== templateToDelete))
            }
        })
        setDeleteDialogOpen(false)
        setTemplateToDelete(null)
    }
    const cancelDelete = () => {
        setDeleteDialogOpen(false)
        setTemplateToDelete(null)
    }
    const handleRowClick = (id) => {
        setSelectedTemplateId(id)
    }
    const handleAddTemplate = () => {
        window.api.openTemplateWindow(null)
    }
    const handleEditTemplate = () => {
        if (selectedTemplateId === null) return
        const template = templates.find(t => t.id === selectedTemplateId)
        if (template) {
            window.api.openTemplateWindow(template)
        }
    }
    const handleWorkoutsNavigation = () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'workouts' }))
    }
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Templates
                    </Typography>
                    <Button color="inherit" onClick={handleWorkoutsNavigation}>
                        Workouts
                    </Button>
                    <Button color="inherit" onClick={()=>{ window.dispatchEvent(new CustomEvent('navigate', { detail: 'exercises' })) }}>
                        Exercises
                    </Button>
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: '20px' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {templates.map(template => (
                                <TableRow key={template.id} selected={template.id === selectedTemplateId} onClick={() => handleRowClick(template.id)}>
                                    <TableCell>{template.name}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={e => { e.stopPropagation(); handleEditTemplate() }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={e => { e.stopPropagation(); handleDeleteClick(template.id) }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={handleAddTemplate}>
                        Add Template
                    </Button>
                </div>
            </Container>
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Template löschen</DialogTitle>
                <DialogContent>Möchten Sie dieses Template wirklich löschen?</DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="secondary">Abbrechen</Button>
                    <Button onClick={confirmDelete} color="primary">Löschen</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default TemplatesWindow
