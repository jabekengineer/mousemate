import * as  React from 'react';
import { Button, TextField, DialogActions, DialogContent, DialogTitle, 
    FormControl, FormLabel, Box, InputLabel, Select, MenuItem, 
    FormControlLabel, FormGroup, Checkbox } from '@mui/material';
import { withRouter } from '../common/with-router';
import { today } from '../common/today';
import { reasons } from '../common/pupDeathReasons';
import { convertDateToSlash } from '../common/validateEvents';
function PupDeath(props){
    const [note, setNote] = React.useState('');
    const [appendNote, setAppendNote] = React.useState(false);
    const [pupDeathDate, setPupDeathDate] = React.useState(new Date(today + "T04:00:00"));
    const [reason, setReason] = React.useState(reasons[0]);
    const [reasonDescription, setReasonDescription] = React.useState('');
    const [finished, setFinished] = React.useState(false);

    React.useEffect(() => {
        if(appendNote){
            let euthDescription = (reasonDescription && reason === "euthanized") ? (': ' + reasonDescription) : '';
            let _note = convertDateToSlash(pupDeathDate) + " - " + props.count + (props.count > 1 ? ' pups ' : ' pup ') + reason + euthDescription + '.';
            setNote(_note);
        }
        if(!appendNote){
            setNote('');
        }
    },[appendNote,reason,reasonDescription, props.count, pupDeathDate])

    const handleSubmit = () => {
        let pupDeath = {
            'count': props.count,
            'date': pupDeathDate,
            'finished': finished,
            'note': note
        }
        props.onSubmit(pupDeath);
        props.drop();
        props.onClose();
    };

    const handleDateSelection = (event) => {
        let _date = event.target.value;
        _date = new Date(_date + "T04:00:00");
        setPupDeathDate(_date);
    }
   
    const handleReasonDescription = (event) => {
        setReasonDescription(event.target.value);
        if(reason === "euthanized"){
            setAppendNote(true);
        }
    }

    const handleReasonSelection = (event) => {
        setReason(event.target.value);
    }
    const title = (props.count) + (props.count === 1 ? " pup" : " pups") + " reported dead in cage " + (props.cageId);
    return(
        <>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 3,
                p:1
            }}>
                <div id='fields'>
                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        rowGap: 2,
                    }}>
                        <div id='date'>
                            <FormControl sx={{width: 215}}>
                                <FormLabel>Enter Date </FormLabel>
                                <TextField type='date' defaultValue={today} onChange={handleDateSelection}></TextField>
                            </FormControl>
                        </div>
                        <div id='reason'>
                        <FormControl sx={{width: 215}} required>
                            <InputLabel>Reason</InputLabel>
                            <Select
                            value={reason}
                            onChange={handleReasonSelection}
                            >
                                {reasons && reasons.map((_reason,index) => (
                                    <MenuItem key={index} value={_reason}>
                                        {_reason}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </div>
                        <div id='euth description'>
                        {
                            reason === "euthanized" && 
                            <>
                                <FormControl sx={{width: 215}}>
                                    <TextField label='Euthanasia reason' value={reasonDescription} onChange={handleReasonDescription}/>
                                </FormControl>
                            </>
                        }
                        </div>
                        <div id='finished-checkbox'>
                        <FormControl >
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onClick={() => setFinished(!finished)} />} label="Litter finished?"/>
                        </FormGroup>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={appendNote} onClick={() => {setAppendNote(!appendNote)}} />} label="Add reason to litter notes?"/>
                        </FormGroup>
                        </FormControl>
                    </div>
                    </Box>
                </div>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
        </>
    )
}
export default withRouter(PupDeath)
