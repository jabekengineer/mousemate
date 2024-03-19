import * as React from 'react';
import { TextField, Button, FormControl, FormLabel, Box} from '@mui/material';
import { withRouter } from '../common/with-router';
import Notes from './notes.component';
import { today } from '../common/today';
function Pregnancy() {
    const [note, setNote] = React.useState('');

    React.useEffect(() => {
    },[note]);

    return (
        <>
            <Box 
            sx={{
                display:'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>
                <FormControl sx={{minWidth: '175px', margin: 2}}>
                <FormLabel>Enter Date </FormLabel>
                <TextField type='date' defaultValue={today}></TextField>
            </FormControl>
            <Notes title="Add notes for reported pregnancy" saveNote={setNote}/>
            </Box>
            <Button>Submit</Button>
            
        </>
    )
}

export default withRouter(Pregnancy)
