import * as React from 'react';
import { TextField, Button, FormControl, FormLabel, Box, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { withRouter } from '../common/with-router';
import { today } from '../common/today';
import { breederRooms } from '../common/rooms';
import { convertDateToSlash } from '../common/validateEvents';

function twentyOneDaysLater(dateString) {
    if(!dateString){
        return null
    }
    let dateObj = new Date(dateString);
    let _later = new Date(dateObj.setDate(dateObj.getDate() + 22));
    var dd = String(_later.getDate()).padStart(2, '0');
    var mm = String(_later.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = _later.getFullYear();

    _later = yyyy + '-' + mm + '-' + dd;
    return _later
}


function RetireBreeder(props) {
    const [retireMouse, setRetireMouse] = React.useState({});
    const [femaleSelected, setFemaleSelected] = React.useState(false);
    const [maleSelected, setMaleSelected] = React.useState(false);
    const [transferLabel, setTransferLabel] = React.useState('');
    const [euthMale, setEuthMale] = React.useState(true);
    const [roomId, setRoomId] = React.useState(props.cage.roomId)
    const [date, setDate] = React.useState(today);

    const [retireFemale, setRetireFemale] = React.useState(true);
    const [repairFemale, setRepairFemale] = React.useState(false);
    const [repairRotateFemale, setRepairRotateFemale] = React.useState(false);

    const [breeders,setBreeders] = React.useState([]);
    const [retireBreederId, setRetireBreederId] = React.useState('');
    const [notes, setNotes] = React.useState('');

    
    const handleBreederSelection = (event) => {
        let _breederSelection = breeders.filter(breeder => {
            return breeder.id === event.target.value
        })[0];
        setRetireMouse(_breederSelection);
        if(_breederSelection.gender === 'M'){
            setMaleSelected(true);
            setFemaleSelected(false);
        }
        else if(_breederSelection.gender === 'F'){
            setFemaleSelected(true);
            setMaleSelected(false);
        }
        setRetireBreederId(event.target.value);
    }

    const handleDateSelection = (event) => {
        setDate(event.target.value);
    }

    const handleMaleRetire = () => {
        let retireMale = {
            mouse: retireMouse,
            note: notes,
            date: convertDateToSlash(date + 'T04:00:00'),
            toCage: props.nextCage,
            toRoom: roomId
        }
        // euthanize the male
        if(euthMale){retireMale.type = "euth"}
        // transfer the male
        if(!euthMale){retireMale.type = "transfer"}
        props.onSubmit(retireMale)
        props.setReload(!props.reload)

        setMaleSelected(false);
        setFemaleSelected(false);
        setRetireBreederId('');
    }

    const handleSelectRetireFemale = () => {
        if(retireFemale){
            setRepairFemale(true);
            setRepairRotateFemale(false);
        }
        if(!retireFemale){
            setRepairFemale(false);
            setRepairRotateFemale(false);
        }
        setRetireFemale(!retireFemale);
    }

    const handleSelectRepairFemale = () => {
        if(repairFemale){
            setRetireFemale(false);
            setRepairRotateFemale(true);
        }
        if(!repairFemale){
            setRetireFemale(false);
            setRepairRotateFemale(false);
        }
        setRepairFemale(!repairFemale);
    }

    const handleSelectRepairRotateFemale = () => {
        if(repairRotateFemale){
            setRetireFemale(true);
            setRepairFemale(false);
        }
        if(!repairRotateFemale){
            setRetireFemale(false);
            setRepairFemale(false);
        }
        setRepairRotateFemale(!repairRotateFemale)
    }

    const handleFemaleRetire = () => {
        let retireFemale = {
            room: roomId,
            mouse: retireMouse,
            note: notes,
            date: convertDateToSlash(date + 'T04:00:00'),
            strain: props.cage.strain
        }
        // retire the female
        if(retireFemale){retireFemale.type = "retire"};
        // repair the female
        if(repairFemale){retireFemale.type = "repair"};
        // create reminder 
        if(repairRotateFemale){retireFemale.type = "reminder"};
        props.onSubmit(retireFemale);
        props.setReload(!props.reload);

        setMaleSelected(false);
        setFemaleSelected(false);
        setRetireBreederId('');
    }

    const handleRoomSelection = (event) => {
        setRoomId(event.target.value);
    }

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    }

    React.useEffect(() => {
        if(props.cage.mice){
            setBreeders(
                props.cage.mice.filter((breeder) => {
                    return breeder.status !== 'Inactive'
                })
            );
        }
    },[props.cage, props.reload])
    
    React.useEffect(() => {
        if(props.nextCage){
            setTransferLabel('Transfer to new cage #' + props.nextCage)
        }
    }, [props.nextCage])
    
    return (
        <>
        { !maleSelected && !femaleSelected && 
        <>
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            mt: 3.5
        }}>
        <FormControl sx={{width: '250px', margin: 1, marginBottom: .25}}>
            <InputLabel>Breeder</InputLabel>
            <Select
            value={retireBreederId}
            onChange={handleBreederSelection}
            >
                {breeders?.map((breeder, index) => (
                    <MenuItem key={index} value={breeder.id}>{breeder.strain} ({breeder.gender}) </MenuItem>
                ))}
            </Select>
        </FormControl>
        <Typography variant='h6' color="text.primary">
            Select breeder to get started
        </Typography>
        </Box>
        </>
        }
        {
            maleSelected && 
            <>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
            }}>
                 <FormControl sx={{width: '250px', margin: 1, marginBottom: .25}}>
                    <InputLabel>Breeder</InputLabel>
                        <Select
                        value={retireBreederId}
                        onChange={handleBreederSelection}
                        >
                            {breeders?.map((breeder, index) => (
                                <MenuItem key={index} value={breeder.id}>{breeder.strain} ({breeder.gender}) </MenuItem>
                            ))}
                        </Select>
                </FormControl>
                <Box
                sx={{
                    minWidth: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'baseline',
                    justifyContent: 'start'
                }}>
                <FormControl>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={euthMale} onClick={() => setEuthMale(!euthMale)}/>} label="Retire"/>
                        <FormControlLabel control={<Checkbox checked={!euthMale} onClick={() => setEuthMale(!euthMale)}/>} label={transferLabel}/>
                    </FormGroup>
                </FormControl>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 1
                }}>
                <FormControl sx={{width: 140, mt: 1}}>
                    <FormLabel>{euthMale?'Euthanize Date':'Transfer Date'}</FormLabel>
                    <TextField type='date' defaultValue={today} onChange={handleDateSelection}/>
                </FormControl>
                {
                    !euthMale &&
                    <>
                    <FormControl sx={{width: 125, mt: 3.70}} required>
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
                    </>
                }
                
                </Box>
                <TextField multiline label='retire notes' onChange={handleNotesChange} sx={{width: 272.5, mt: 1.75, mb: 1}}/>
                </Box>
            </Box>
                <Button onClick={handleMaleRetire}>Submit</Button>
            </>
        }
        {
            femaleSelected && 
            <>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
            }}>
                 <FormControl sx={{width: '250px', margin: 1, marginBottom: .25}}>
                    <InputLabel>Breeder</InputLabel>
                        <Select
                        value={retireBreederId}
                        onChange={handleBreederSelection}
                        >
                            {breeders?.map((breeder, index) => (
                                <MenuItem key={index} value={breeder.id}>{breeder.strain} ({breeder.gender}) </MenuItem>
                            ))}
                        </Select>
                </FormControl>
                <Box
                sx={{
                    minWidth: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'baseline',
                    justifyContent: 'start'
                }}>
                <FormControl>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={retireFemale} onClick={handleSelectRetireFemale}/>} label="Retire"/>
                        <FormControlLabel control={<Checkbox checked={repairFemale} onClick={handleSelectRepairFemale}/>} label="Repair"/>
                        <FormControlLabel control={<Checkbox checked={repairRotateFemale} onClick={handleSelectRepairRotateFemale}/>} label="Retire/Rotate in 21 days"/>
                    </FormGroup>
                </FormControl>
                <FormControl sx={{width: 190, mt: 1}}>
                    {
                        retireFemale &&
                        <>
                        <FormLabel>{'Retire Date'}</FormLabel> 
                        <TextField type='date' defaultValue={today} onChange={handleDateSelection}/>
                        </>
                    }
                    {
                        repairFemale && 
                        <>
                        <FormLabel>{'Repair Date'}</FormLabel> 
                        <TextField type='date' defaultValue={today} onChange={handleDateSelection}/>
                        </>
                    }
                    {
                        repairRotateFemale &&
                        <>
                        <FormLabel>{'Retire/Rotate Reminder Date'}</FormLabel>
                        <TextField sx={{mb: 2}} type='date' defaultValue={twentyOneDaysLater(today)} onChange={handleDateSelection}/>
                        </>
                    }
                </FormControl>
                {
                    !repairRotateFemale &&
                    <TextField multiline label='retire notes' onChange={handleNotesChange} sx={{width: 250, mt: 1.75, mb: 1}}/>
                }
                </Box>
            </Box>
                <Button onClick={handleFemaleRetire}>Submit</Button>
            </>
        }
       
        </>
    )
}

export default withRouter(RetireBreeder)