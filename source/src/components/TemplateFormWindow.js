import React, { useState } from 'react'
import { Container, TextField, Button, Typography, Box } from '@mui/material'
const TemplateFormWindow = () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    const [name, setName] = useState(params.get('name') || '')
    const handleSave = () => {
        if(name.trim() === ''){
            alert("Bitte den Namen ausfüllen")
            return
        }
        if(id){
            const template = { id: parseInt(id), name }
            window.templateApi.updateTemplate(template).then(()=>{
                window.templateApi.closeWindow()
            })
        } else {
            const template = { name }
            window.templateApi.addTemplate(template).then(()=>{
                window.templateApi.closeWindow()
            })
        }
    }
    const handleCancel = () => {
        window.templateApi.closeWindow()
    }
    return (
        <Container maxWidth="sm" style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>{id ? 'Template bearbeiten' : 'Template hinzufügen'}</Typography>
            <Box component="form" noValidate autoComplete="off">
                <TextField label="Name" fullWidth margin="normal" value={name} onChange={e=>setName(e.target.value)} />
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={handleSave}>{id ? 'Update' : 'Add'}</Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
                </Box>
            </Box>
        </Container>
    )
}
export default TemplateFormWindow
