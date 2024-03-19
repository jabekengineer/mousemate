import * as  React from 'react';
import { Button, TextField, DialogActions, DialogContent, DialogTitle, 
    FormControl, FormLabel, Box, InputLabel, Select, MenuItem, 
    FormControlLabel, FormGroup, Checkbox } from '@mui/material';
import { withRouter } from '../common/with-router';
import { today } from '../common/today';
import { breederRooms}  from '../common/rooms';
import Notes from './notes.component';
import { convertDateToSlash } from '../common/validateEvents';

function twoDaysLater(dateString) {
    if(!dateString){
        return null
    }
    let dateObj = new Date(dateString);
    let _later = new Date(dateObj.setDate(dateObj.getDate() + 3));
    var dd = String(_later.getDate()).padStart(2, '0');
    var mm = String(_later.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = _later.getFullYear();

    _later = yyyy + '-' + mm + '-' + dd;
    return _later
}

function thirtyFiveDaysOld(dateString) {
    if(!dateString){
        return null
    }
    let dateObj = new Date(dateString);
    let _later = new Date(dateObj.setDate(dateObj.getDate() + 35));
    var dd = String(_later.getDate()).padStart(2, '0');
    var mm = String(_later.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = _later.getFullYear();

    _later = yyyy + '-' + mm + '-' + dd;
    return _later
}

function Wean(props){
    const [note, setNote] = React.useState('');

    const handleNoteSubmit = React.useCallback((newNote) => {
        setNote(newNote);
    },[]);

    const [weanDate, setWeanDate] = React.useState(today);
    const [cageId, setCageId] = React.useState(props.nextCage);
    const [roomId, setRoomId] = React.useState(props.roomId);
    const [gender, setGender] = React.useState('M');
    const [finished, setFinished] = React.useState(false);
    
    const [checkSex, setCheckSex] = React.useState(false);
    const [checkSexDate, setCheckSexDate] = React.useState(thirtyFiveDaysOld(props.dob));

    const [checkWeight, setCheckWeight] = React.useState(false);
    const [checkWeightDate, setCheckWeightDate] = React.useState(twoDaysLater(today))

    const handleSubmit = () => {
        let wean = {
            'count': props.count,
            'cage': cageId,
            'room': roomId,
            'gender': gender,
            'date': (weanDate + 'T04:00:00'),
            'checkSexDate': checkSex ? convertDateToSlash(checkSexDate + 'T04:00:00') : '',
            'checkWeightDate': checkWeight ? convertDateToSlash(checkWeightDate + 'T04:00:00') : '',
            'finished': finished,
            'note': note
        }
        props.onSubmit(wean);
        if(!finished) {
            props.drop();
        }
        props.onClose();

    }

    const handleDateSelection = (event) => {
        setWeanDate(event.target.value);
    }
    
    const handleCageSelection = (event) => {
        setCageId(event.target.value);
    }

    const handleRoomSelection = (event) => {
        setRoomId(event.target.value);
    };

    const handleGenderSelection = (event) => {
        setGender(event.target.value);
    }
    const title = "Weaning " + (props.count) + (props.count === 1 ? " mouse" : " mice") + " from cage " + (props.cageId);
    const genders = ['M','F'];

    const handleCheckSexDateSelection = (event) => {
        setCheckSexDate(event.target.value)
    }  
    
    const handleCheckWeightDateSelection = (event) => {
        setCheckWeightDate(event.target.value)
    }  
    return(
        <>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: 1
            }}>
                <div id='fields'>
                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        maxWidth: 400,
                        flexWrap: 'wrap',
                        columnGap: 5,
                        rowGap: 2,
                    }}>
                        <div id='date'>
                        <FormControl sx={{width: '150px'}}>
                        <FormLabel>Enter Date </FormLabel>
                        <TextField type='date' defaultValue={today} onChange={handleDateSelection}></TextField>
                        </FormControl>
                        </div>
                        <div id='cage'>
                            <FormControl sx={{maxWidth: '150px'}}>
                                <FormLabel>Cage</FormLabel>
                                <TextField type='number' defaultValue={props.nextCage} onChange={handleCageSelection}/>
                            </FormControl>
                        </div>
                        <div id='room'>
                        <FormControl sx={{width: 150}} required>
                            <InputLabel>Room</InputLabel>
                            <Select
                            value={roomId}
                            onChange={handleRoomSelection}
                            >
                                {breederRooms && breederRooms.map((_num,index) => (
                                    <MenuItem key={index} value={_num}>
                                        {_num}
                                    </MenuItem>
                                ))}
                            </Select>
                    </FormControl>
                        </div>
                        <div id='gender'>
                        <FormControl sx={{width: 150}} required>
                            <InputLabel>Gender</InputLabel>
                            <Select
                            value={gender}
                            onChange={handleGenderSelection}
                            >
                                {genders && genders.map((_gender,index) => (
                                    <MenuItem key={index} value={_gender}>
                                        {_gender}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </div>                        
                    </Box>
                    <FormControl sx={{display:'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'left', maxWidth: 400, mt: 2, ml: 5}}>
                        <FormGroup>
                                <FormControlLabel control={<Checkbox onClick={() => setFinished(!finished)} />} label="Litter finished?"/>
                        </FormGroup>
                        <FormGroup>
                            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <FormControlLabel control={<Checkbox onClick={() => setCheckSex((prev) => !prev)}/>} label="Check sex task?"/>
                            {
                                checkSex &&
                                <>
                                <TextField size='small' type='date' defaultValue={checkSexDate} onChange={handleCheckSexDateSelection}/>
                                </>
                            }
                            </Box>
                        </FormGroup>
                        <FormGroup>
                            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'end', mt:.5}}>
                            <FormControlLabel control={<Checkbox onClick={() => setCheckWeight((prev) => !prev)}/>} label="Check weight?"/>
                            {
                                checkWeight &&
                                <>
                                <TextField sx={{ml:1.65}} size='small' type='date' defaultValue={checkWeightDate} onChange={handleCheckWeightDateSelection}/>
                                </>
                            }
                            </Box>
                        </FormGroup>
                    </FormControl>
                </div>
                <div id="notes">
                    <Notes title="Append notes about weaning to litter notes" note={note} onChange={setNote} onSubmit={handleNoteSubmit}/>
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
export default withRouter(Wean)
