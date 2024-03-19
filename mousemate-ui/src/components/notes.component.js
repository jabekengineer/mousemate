import * as React from 'react';
import {Button, Dialog, DialogActions, DialogContentText, DialogContent, Typography, TextField, DialogTitle, Box} from '@mui/material';



export default function Notes(props) {
    const [open, setOpen] = React.useState(false);
    let note = props.note;

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }
    const handleSubmit = () => {
        setOpen(false);
        props.onSubmit(note)
    }

    const handleChange = (event) => {
        props.onChange(event.target.value);
    }

    return (
        <>
        { !note && 
                <Button size='small' variant='outlined' onClick={handleClickOpen} sx={{height: '40px', marginTop: 2.5}}>
                    <Typography>add notes</Typography>
                </Button> 
        }
        { note &&
            <Box maxWidth='100' sx={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                <Typography paddingTop={'15px'} paddingRight={'5px'}>{note}</Typography>
                <Button 
                variant='text'
                onClick={handleClickOpen} 
                sx={{
                    textDecoration: 'underline',
                    color: (theme) => theme.palette.grey[500]}}> edit </Button>
            </Box>
        }
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                id='note'
                value={props.note}
                onChange={handleChange}
                margin='dense'
                type='text'
                fullWidth
                multiline
                variant='standard'/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}