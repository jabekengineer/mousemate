import * as React from 'react';
import { TextField, Button, FormControl, FormLabel, Box } from '@mui/material';
import { withRouter } from '../common/with-router';
import Notes from './notes.component';
import { today } from '../common/today';

function Birth(props) {
    const [notes, setNotes] = React.useState('');

    const handleNoteSubmit = React.useCallback((newNote) => {
        setNotes(newNote);
    },[]);

    const [birthDate, setBirthDate] = React.useState(today);

    const handleDateChange = (event) => {
        setBirthDate(event.target.value);
    }

    const handleSubmit = () => {
        
        let birth = {
            'date': (birthDate + 'T04:00:00'),
            'note': notes
        };
        props.onSubmit(birth)
    }

    return (
        <>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
            }}>
                <div id='fields'>
                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div id='date'>
                        <FormControl sx={{width: '200px', margin: 2}}>
                        <FormLabel>Enter Date </FormLabel>
                        <TextField type='date' defaultValue={today} onChange={handleDateChange}></TextField>
                        </FormControl>
                        </div>
                    </Box>
                </div>
                <div id="notes">
                    <Notes title="Add notes for new birth" note={notes} onChange={setNotes} onSubmit={handleNoteSubmit}/>
                </div>
            </Box>
            {
                props.cage.mice?.some(mouse => (mouse.gender === "F" && mouse.status === "Breeder")) && 
                (
                    <>
                    <Button onClick={handleSubmit} >Submit</Button>
                    </>
                )
            }
            
        </>
    )
}

export default withRouter(Birth);