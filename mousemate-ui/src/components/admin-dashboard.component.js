import * as React from 'react';
import { withRouter } from '../common/with-router';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, BottomNavigation, BottomNavigationAction, Box, Button, Checkbox, Dialog, FormControl, FormLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Snackbar, SnackbarContent, TextField, Tooltip, Typography } from '@mui/material';
import Title from './title.component';
import CageService from '../services/cage.service';
import {breederRooms} from '../common/rooms';
import {strains} from '../common/strains';
import {statuses} from '../common/status';
import {adultGenders} from '../common/genders';
import SaveAdultCage from './admin-saveAdultCage.component';
import SaveBreederCage from './admin-saveBreederCage.component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { breederStrains } from '../common/strains';
import { today } from '../common/today';
import MouseService from '../services/mouse.service';
import { convertDateToSlash } from '../common/validateEvents';
import ActionService from '../services/action.service';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LaunchIcon from '@mui/icons-material/Launch';
import TaskService from '../services/task.service';
import AddHomeIcon from '@mui/icons-material/AddHome';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { DataGrid } from '@mui/x-data-grid';
import { adminActionColumns, convertToShortDate } from '../common/actions';

const convertRows = (rows) => {
    let _rows = [];
    rows.forEach((row) => {
        row.date = convertToShortDate(row.createdAt);
        _rows.push(row);
    });
    return _rows
}

    

function Admin (props) {
    const [nextCageId, setNextCageId] = React.useState(null);
    const [nextMouseId, setNextMouseId] = React.useState(null)
    // adult values
    const [adultStrain, setAdultStrain] = React.useState('');
    const [adultGender, setAdultGender] = React.useState('');
    const [adultCount, setAdultCount] = React.useState(1);
    const [adultRoom, setAdultRoom] = React.useState('');
    const [adultDOB, setAdultDOB] = React.useState(today);
    const [adultWeanDate, setAdultWeanDate] = React.useState(today);
    const [adultNotes, setAdultNotes] = React.useState('');
    

    const [reload, setReload] = React.useState(false);
    const [maleBreederChecked, setMaleBreederChecked] = React.useState(false);
    const [femaleBreederChecked, setFemaleBreederChecked] = React.useState(false);

    // breeder values
    const [maleStrain, setMaleStrain] = React.useState('');
    const [maleDob, setMaleDob] = React.useState(today);
    const [femaleDob, setFemaleDob] = React.useState(today);
    const [femaleWeanDate, setFemaleWeanDate] = React.useState(today);
    const [maleWeanDate, setMaleWeanDate] = React.useState(today);
    const [femaleStrain, setFemaleStrain] = React.useState('');
    const [pairDate, setPairDate] = React.useState(today);
    const [breederRoom, setBreederRoom] = React.useState(0);
    const [breederPairNotes, setBreederPairNotes] = React.useState('');
    const [breederStrain, setBreederStrain] = React.useState('');

    const [adultSaveOpen, setAdultSaveOpen] = React.useState(false);
    const [breederSaveOpen, setBreederSaveOpen] = React.useState(false);
    const [adultResponse, setAdultResponse] = React.useState({})
    const [breederResponse, setBreederResponse] = React.useState({})

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState('');

    const [adminPage, setAdminPage] = React.useState(1);
    const [actions, setActions] = React.useState([]);
    const [sortModel, setSortModel] = React.useState([
        {
          field: 'id',
          sort: 'desc',
        },
      ]);

    React.useEffect(() => {
        ActionService.getAllActions()
        .then((response) => {
            setActions(response.data)
        })
        .catch((err) => {
            console.log(err.message)
        })
    },[props.reload]);

    const rows = convertRows(actions);
    const navigate = useNavigate();
    const goToCage = (cageNumber) => {
        navigate('/event/' + cageNumber)
    }


    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    }

    const handleRoomSelection = (event) => {
        setAdultRoom(event.target.value);
    }

    const handleAdultStrainSelection = (event) => {
        setAdultStrain(event.target.value)
    }

    const handleGenderSelection = (event) => {
        setAdultGender(event.target.value)
    }

    const handleCountChange = (event) => {
        setAdultCount(event.target.value);
    }

    const handleAdultDobSelection = (event) => {
        setAdultDOB(event.target.value);
    }

    const handleAdultWeanDateSelection = (event) => {
        setAdultWeanDate(event.target.value)
    }

    const handleAdultNotesChange = (event) => {
        setAdultNotes(event.target.value)
    }

    const handleSaveClose = () => {
        setAdultSaveOpen(false);
        setBreederSaveOpen(false);
    }

    // Breeder form controls
    const handleFemaleDobSelection = (event) => {
        setFemaleDob(event.target.value);
    }

    const handleFemaleWeanDateSelection = (event) => {
        setFemaleWeanDate(event.target.value);
    }

    const handlePairNotesUpdate = (event) => {
        setBreederPairNotes(event.target.value);
    }

    const handleMaleDobSelection = (event) => {
        setMaleDob(event.target.value);
    }

    const handleMaleWeanDateSelection = (event) => {
        setMaleWeanDate(event.target.value);
    }

    const handlePairDateSelection = (event) => {
        setPairDate(event.target.value);
    }

    const handleAdultSaveOpen = React.useCallback(() => {
        CageService.getNextCage()
        .then((response) => {
            setNextCageId(response.data.id);
            // make all fields have been checked
            let responses = {
                id: response.data.id,
                roomId: adultRoom,
                strain: adultStrain,
                status: 'Adult',
                gender: adultGender,
                mouseCount: adultCount,
                generation: adultGeneration,
                dob: convertDateToSlash(adultDOB + 'T04:00:00'),
                weanDate: convertDateToSlash(adultWeanDate + 'T04:00:00'),
                notes: adultNotes
            };
            var responsesComplete = true;
            for(var key in responses) {
                if(Number(responses[key])){
                    let mouseCount = Number(responses[key]);
                    if(mouseCount <= 0 ){
                        responsesComplete = false;
                    }
                }
                if((responses[key] === '' || responses[key] === false) && key !== 'notes') {
                    responsesComplete = false;
                }
            }
            if(!responsesComplete){
                alert('All fields must be filled out and mouse count must be greater than 0.')
            }
            if(responsesComplete){
                // find the next available ids            
                setAdultResponse(responses);
                setAdultSaveOpen(true);
            }
            MouseService.getNextMouse()
            .then((response) => {
                setNextMouseId(response.data.id)
            })
            .catch((err) => {
                console.log({
                    message: err.message
                })
            })
        })
        .catch(err => {
            console.log(err || "couldn't retrieve cage number")
        })
         
    },[adultRoom, adultStrain, adultGender, adultCount, adultNotes, adultDOB, adultWeanDate])

    React.useEffect(() => {
        if((maleStrain && femaleStrain) && maleStrain !== femaleStrain){
            let strain = [femaleStrain, maleStrain].join(' x ');
            let strainTwo = [maleStrain, femaleStrain].join(' x ');
            if(strains.includes(strain)){
                setBreederStrain(strain);
            }
            else if(strains.includes(strainTwo)){
                setBreederStrain(strainTwo);
            }
            else {
                alert('Strain: ' + strain + ' not a supported strain.')
            }
        }
        if(!maleStrain && femaleStrain) {
            setBreederStrain(femaleStrain)
        }
    },[maleStrain, femaleStrain])

    const handleBreederSaveOpen = React.useCallback(() => {
        CageService.getNextCage()
        .then((response) => {
            setNextCageId(response.data.id);
            MouseService.getNextMouse()
            .then((response) => {
                setNextMouseId(response.data.id)
                    // collect form responses
                    let breederCage = {
                        female: {},
                        male: maleBreederChecked ? {} : false,
                    };

                    // breeder cage form validation
                    breederCage = {
                        id: nextCageId,
                        roomId: breederRoom,
                        strain: breederStrain,
                        status: 'Breeder',
                        gender: maleBreederChecked ? 'Pair': 'F',
                        mouseCount: maleBreederChecked ? 2 : 1,
                        dob: convertDateToSlash(femaleDob + 'T04:00:00'),
                        weanDate: convertDateToSlash(femaleWeanDate + 'T04:00:00'),
                        breederPairDate: convertDateToSlash(pairDate + 'T04:00:00'),
                        notes: breederPairNotes
                    }

                    // breeder cage female
                    breederCage.female = {
                        id: nextMouseId,
                        dob: breederCage.dob,
                        weanDate: breederCage.weanDate,
                        cageId: breederCage.id,
                        status: 'Breeder',
                        strain: femaleStrain,
                        gender: 'F',
                        generation: femaleBreederGeneration
                    }

                    if(maleBreederChecked){
                        breederCage.male = {
                            id: (nextMouseId + 1),
                            cageId: breederCage.id,
                            dob: convertDateToSlash(maleDob + "T04:00:00"),
                            weanDate: convertDateToSlash(maleWeanDate + "T04:00:00"),
                            strain: maleStrain,
                            status: 'Breeder',
                            gender: 'M',
                            generation: maleBreederGeneration
                        }
                    }

                    var responsesComplete = true;
                    for(var key in breederCage) {
                        if((breederCage[key] === '' || breederCage[key] === false) && key !== 'notes') {
                            responsesComplete = false;
                        }
                    }
                    if(maleBreederChecked){
                        for(var key in breederCage.male){
                            if((breederCage.male[key] === '' || breederCage.male[key] === false)){
                                responsesComplete = false;
                            }
                        }
                    }
                    if(!responsesComplete){
                        alert('All fields must be filled out.')
                    }
                    if(responsesComplete){
                        // find the next available ids            
                        setBreederResponse(breederCage);
                        setBreederSaveOpen(true);
                        setReload(!reload);
                    }
            })
            .catch((err) => {
                console.log({
                    message: err.message
                })
            })
        })
        .catch((err) => {
            console.log({
                message: err.message
            })
        })
    },[nextMouseId, breederRoom, breederStrain, femaleDob, femaleWeanDate, 
        pairDate, breederPairNotes, femaleStrain, maleStrain, maleDob, maleWeanDate, 
        maleBreederChecked, reload, nextCageId])

    const handleAdultSave = React.useCallback((adultResponse) => {
        CageService.addNew(adultResponse)
        .then(response => {
            let adultMouse = {
                dob: adultResponse.dob,
                weanDate: adultResponse.weanDate,
                cageId: adultResponse.id,
                status: 'Adult',
                strain: adultResponse.strain,
                gender: adultResponse.gender,
                generation: adultResponse.generation,
            }
            if( adultResponse.mouseCount >= 1){
                for(var i = 0; i < adultResponse.mouseCount; i++) {
                    adultMouse.id = nextMouseId + i;
                    CageService.addMouse(nextCageId, adultMouse)
                    .catch((err) => {
                        console.log({
                            message: err.message
                        })
                    })
                }
            }
            let action = {
                user: props.user,
                type: 'Cage Created',
                tagline: ('Cage created by admin.')
            }
            ActionService.addAction(adultResponse.id, action);
            handleAdultReset();
            handleSaveClose();
            let _message = 'Adult mice added to cage #' + adultResponse.id;
            setSnackMessage(_message);
            setSnackOpen(true);
        } 
        )
        .catch((err) => {
            console.log({
                message: err.message
            })
        })
        setReload(!reload);
    },[nextCageId, nextMouseId])

    const handleBreederSave = React.useCallback((breederCage) => {
        CageService.addNew(breederCage)
        .then(()=>{
            CageService.addMouse(breederCage.id, breederCage.female)
            .then(() => {
                if(breederCage.male){
                    CageService.addMouse(breederCage.id, breederCage.male)
                    .then(() => {
                        var snackDate = new Date(breederCage.breederPairDate);
                        snackDate.setDate(snackDate.getDate() + 17);
                        let task = {
                            roomId: breederCage.roomId,
                            cageId: breederCage.id,
                            type: 'Breeder Snax',
                            date: snackDate,
                            completed: false
                        };
                        TaskService.createTask(task);
                    })
                    .catch((err) => {
                        console.log({
                            message: err.message
                        })
                    })
                }
            })
            .catch((err) => {
                console.log({
                    message: err.message
                })
            })
        })
        .catch((err) => {
            console.log({
                message: err.message
            })
            // if next cage id is already taken
            CageService.getNextCage()
            .then((response) => {
                if(breederCage.id === response.data.id){

                }
            })
        })
        let action = {
            user: props.user,
            type: 'Cage Created',
            tagline: ('Cage created by admin.')
        }
        ActionService.addAction(breederCage.id, action);
        handleBreederReset();
        handleSaveClose();
        let _message = 'Breeder ' + (maleBreederChecked ? 'Mice' : 'Mouse') + ' added to cage #' + breederCage.id;
        setSnackMessage(_message);
        setSnackOpen(true);
        setReload(!reload);
    },[nextCageId, nextMouseId])

    const handleAdultReset = () => {
        setAdultRoom('');
        setAdultGender('');
        setAdultCount(1);
        setAdultStrain('');
        setAdultGender('');
        setAdultDOB(today);
        setAdultWeanDate(today);
        setAdultNotes('');
        setAdultResponse({})
        setAdultGeneration(1);
        setMaleBreederGeneration(1);
        setFemaleBreederGeneration(1);
    }

    const handleBreederReset = () => {
        setBreederRoom('');
        setBreederStrain('');
        setFemaleStrain('');
        setMaleStrain('');
        setMaleDob(today);
        setFemaleDob(today);
        setMaleWeanDate(today);
        setFemaleWeanDate(today);
        setPairDate(today);
        setBreederPairNotes('');
        setBreederResponse({});
        setFemaleBreederChecked(false);
        setMaleBreederChecked(false);
        setMaleBreederGeneration(1);
        setFemaleBreederGeneration(1);
    }


    const handleMaleAccordion = () => {
        setMaleBreederChecked((prev) => !prev);
    }
    const handleFemaleAccordion = () => {
        setFemaleBreederChecked((prev) => !prev);
        setReload(!reload);
    }

    const handleMaleStrainSelection = (event) => {
        setMaleStrain(event.target.value)
    }

    const handleFemaleStrainSelection = (event) => {
        setFemaleStrain(event.target.value);
    }

    const handleBreederRoomSelection = (event) => {
        setBreederRoom(event.target.value);
    }

    React.useEffect(() => {
        CageService.getNextCage()
        .then(response => {
            setNextCageId(response.data.id);
        })
        .catch(err => {
            console.log(err || "couldn't retrieve cage number")
        })
    },[reload, props.reload]);

    React.useEffect(() => {
        MouseService.getNextMouse()
        .then(response => {
            setNextMouseId(response.data.id)
        })
        .catch((err) => {
            console.log({
                message: err.message
            })
        })
    },[reload,props.reload])

    const canJumpFromSnackbar = (snackMessage) => {
        let searchString = 'to cage #';
        if(snackMessage.includes(searchString)){
        let cageNum = snackMessage.split(searchString)[1].replace(/^\D+/g, '');
        return cageNum
        }
    }

    const [adultGeneration, setAdultGeneration] = React.useState(1);

    const handleAdultGenerationSelection = (event) => {
        setAdultGeneration(event.target.value);
    }
    
    const [maleBreederGeneration, setMaleBreederGeneration] = React.useState(1);
    const [femaleBreederGeneration, setFemaleBreederGeneration] = React.useState(1);


    const handleMaleBreederGenerationSelection = (event) => {
        setMaleBreederGeneration(event.target.value);
    }

    const handleFemaleBreederGenerationSelection = (event) => {
        setFemaleBreederGeneration(event.target.value);
    }



    return (
        <>
        {
            adminPage === 0 && (
                <>
            <Grid item xs={12} md={4} lg={4} sx={{height: '725px'}}>
            <Box sx={{display: 'flex', alignItems: 'center', width: 'full', justifyContent: 'space-between'}}>
            <Title>Add Adult Cage</Title>
            <Typography variant='body2' color='gray'>*Purchased mice are gen 1</Typography>
            </Box>
            
            <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
            }}>
            <Box 
            sx={{
                p:1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                columnGap: 3,
                rowGap: 2,
            }}>
                <FormControl sx={{width: 150}} required>
                    <InputLabel>Room</InputLabel>
                    <Select
                    value={adultRoom}
                    onChange={handleRoomSelection}
                    >
                        {breederRooms && breederRooms.map((_num,index) => (
                            <MenuItem key={index} value={_num}>
                                {_num}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl required sx={{width: 150}}>
                    <InputLabel>Strain</InputLabel>
                    <Select
                    value={adultStrain}
                    onChange={handleAdultStrainSelection}
                    >
                        {strains && strains.map((_strain,index) => (
                            <MenuItem key={index} value={_strain}>
                                {_strain}
                            </MenuItem>
                        ))};
                    </Select>
                </FormControl>
                <FormControl required sx={{width: 150}}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                    value={adultGender}
                    onChange={handleGenderSelection}>
                        {adultGenders && adultGenders.map((_gender, index) => (
                            <MenuItem key={index} value={_gender}>
                                {_gender}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{width: 150}}>
                    <FormLabel>Mouse Count</FormLabel>
                    <TextField type='number' 
                    value={adultCount} 
                    onChange={handleCountChange}
                    size="small"
                    sx={{
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        height: '40px',
                        width: '200px'
                        }, 
                    }}/>
                </FormControl>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                <FormControl sx={{width: 150, mr:2}}>
                    <FormLabel>Date of Birth</FormLabel>
                    <TextField type='date' value={adultDOB} defaultValue={today} onChange={handleAdultDobSelection}/>
                </FormControl>
                <FormControl sx={{width: 150}}>
                    <FormLabel>Wean Date</FormLabel>
                    <TextField type='date' value={adultWeanDate} defaultValue={today} onChange={handleAdultWeanDateSelection}/>
                </FormControl>
                </Box>
                <FormControl sx={{width: 150}}>
                    <FormLabel>Generation</FormLabel>
                    <TextField type='number' 
                    value={adultGeneration} 
                    onChange={handleAdultGenerationSelection}
                    size='small'
                    sx={{
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        height: '40px',
                        width: '200px'
                        }, 
                    }}/>
                </FormControl>
                <TextField multiline  label='cage notes' onChange={handleAdultNotesChange} sx={{width: 150}}>
                </TextField>
            </Box>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                columnGap: 1.25,
                pt:3,
            }}>
                <Button variant='outlined' onClick={handleAdultReset}>Reset</Button>
                <Button variant='contained' style={{backgroundColor: '#1976d2', opacity: '90%'}} onClick={handleAdultSaveOpen}>Save</Button>
            </Box>
            </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 3,
                mb: 1
            }}>
                <Title>Add Breeder Cage</Title>
                 {
                ((femaleBreederChecked && maleBreederChecked)) && 
                <>
                <Button variant='contained' style={{backgroundColor: '#1976d2', opacity: '90%'}} onClick={handleBreederSaveOpen}>Save</Button>
                </>
            }
            </Box>
            <Accordion expanded={femaleBreederChecked} sx={{'&::before': {height: '0px'}, width: '100%'}}>
                <AccordionSummary
                onClick={handleFemaleAccordion}
                expandIcon={<Checkbox 
                    checked={femaleBreederChecked} 
                    sx={{
                        transform: "rotate(180deg)"
                    }}/>}
                    aria-controls="panel1a-content"
                    IconButtonProps={{
                    onClick: handleMaleAccordion
                    }}
                    >
                    <Title>Female Breeder</Title>
                </AccordionSummary>
                <AccordionDetails>
                <Box
                sx={{
                    p:2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    rowGap: 2
                }}>
                <FormControl sx={{width: 150}} required>
                    <InputLabel>Room</InputLabel>
                    <Select
                    value={breederRoom}
                    onChange={handleBreederRoomSelection}
                    >
                        {breederRooms && breederRooms.map((_num,index) => (
                            <MenuItem key={index} value={_num}>
                                {_num}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl required sx={{width: 150}}>
                    <InputLabel>Strain</InputLabel>
                    <Select
                    value={femaleStrain}
                    onChange={handleFemaleStrainSelection}
                    >
                        {breederStrains && breederStrains.map((_strain,index) => (
                            <MenuItem key={index} value={_strain}>
                                {_strain}
                            </MenuItem>
                        ))};
                    </Select>
                </FormControl>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                <FormControl sx={{mr: 2}}>
                    <FormLabel>Date of Birth</FormLabel>
                    <TextField type='date' value={femaleDob} defaultValue={today} onChange={handleFemaleDobSelection}/>
                </FormControl>
                <FormControl>
                    <FormLabel>Wean Date</FormLabel>
                    <TextField type='date' value={femaleWeanDate} defaultValue={today} onChange={handleFemaleWeanDateSelection}/>
                </FormControl>
                </Box>
                <FormControl sx={{width: 150}}>
                    <FormLabel>Generation</FormLabel>
                    <TextField type='number' 
                    value={femaleBreederGeneration} 
                    onChange={handleFemaleBreederGenerationSelection}
                    size='small'
                    sx={{
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        height: '40px',
                        width: '200px'
                        }, 
                    }}/>
                </FormControl>
                <FormControl sx={{width: 150}}>
                    <FormLabel>Pairing Date</FormLabel>
                    <TextField type='date' value={pairDate} defaultValue={today} onChange={handlePairDateSelection}/>
                </FormControl>
                <TextField multiline  label='pair notes' onChange={handlePairNotesUpdate} sx={{width: 150}}/>
                </Box>
                </AccordionDetails>
                </Accordion>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
            <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: 2,
                mt: 6
            }}>
                <Accordion expanded={maleBreederChecked} sx={{'&::before': {height: '0px'}, width: '100%'}}>
                <AccordionSummary
                onClick={handleMaleAccordion}
                expandIcon={<Checkbox 
                    checked={maleBreederChecked} 
                    sx={{
                        transform: "rotate(180deg)"
                    }}/>}
                    aria-controls="panel1a-content"
                    IconButtonProps={{
                    onClick: handleMaleAccordion
                    }}>
                    <Title>Male Breeder</Title>
                </AccordionSummary>
                    <AccordionDetails>
                    <Box
                    sx={{
                        p:2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        rowGap: 2
                    }}>
                    <FormControl sx={{width: 150}} required>
                    <InputLabel>Strain</InputLabel>
                    <Select
                    value={maleStrain}
                    onChange={handleMaleStrainSelection}
                    >
                        { breederStrains && breederStrains.map((_strain,index) => (
                            <MenuItem key={index} value={_strain}>
                                {_strain}
                            </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <FormControl sx={{width: 150, mr: 2}}>
                        <FormLabel>Date of Birth</FormLabel>
                        <TextField type='date' value={maleDob} defaultValue={today} onChange={handleMaleDobSelection}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Wean Date</FormLabel>
                        <TextField type='date' value={maleWeanDate} defaultValue={today} onChange={handleMaleWeanDateSelection}/>
                    </FormControl>
                    </Box>
                    <FormControl sx={{width: 150}}>
                    <FormLabel>Generation</FormLabel>
                    <TextField type='number' 
                    value={maleBreederGeneration} 
                    onChange={handleMaleBreederGenerationSelection}
                    size='small'
                    sx={{
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        height: '40px',
                        width: '200px'
                        }, 
                    }}/>
                </FormControl>
                </Box>
                </AccordionDetails>
            </Accordion>       
        </Box>
        </Grid>
                </>
            )
        }
        {
            adminPage === 1 && (
                <>
                <Grid item xs={12} md={12} lg={12} sx={{height: '725px'}}>
                    <Paper 
                    sx={{
                        display: 'flex',
                        justifyContent: 'row',
                        p:1
                    }}>
                        <DataGrid
            rows={rows}
            columns={adminActionColumns}
            onRowDoubleClick={(params) => {
                goToCage(params.row.cageId)
            }}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            sx={{
                maxWidth: '100%',
                maxHeight: '72vh',
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                    outline: "none !important",
                },
                "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
                    outline: "none"
                },
                "&.MuiDataGrid-root .MuiDataGrid-cell": {
                    whiteSpace: "normal !important",
                    wordWrap: "break-word !important"
                },
                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                    width: '0.5em'
                  },
                  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
                    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)'
                  },
                  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.2)',
                  }
            }}/>
        </Paper>

                </Grid>
                </>
            )
        }
        
        <Grid item xs={12} md={12} lg={12}>
        <Box sx={{ width: 'full', display: 'flex', justifyContent: 'center'}}>
        <BottomNavigation
            showLabels
            sx={{width: '500px'}}
            value={adminPage}
            onChange={(event, newValue) => {setAdminPage(newValue)}}
        >
            <BottomNavigationAction label="Add Cages" icon={<AddHomeIcon />} />
            <BottomNavigationAction label="All actions" icon={<ManageSearchIcon/>} />
        </BottomNavigation>
    </Box>
        </Grid>
        <>
        <Dialog open={adultSaveOpen} onClose={handleSaveClose}>
            <SaveAdultCage cage={adultResponse} nextCage={nextCageId} onSubmit={handleAdultSave} onClose={handleSaveClose}/>
        </Dialog>
        </>
        <>
        <Dialog open={breederSaveOpen} onClose={handleSaveClose}>
            <SaveBreederCage cage={breederResponse} nextCage={nextCageId} onSubmit={handleBreederSave} onClose={handleSaveClose}/>
        </Dialog>
        </>
        <>
        <Snackbar 
        open={snackOpen}
        autoHideDuration={7500}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        onClose={handleSnackClose}>
            <SnackbarContent style={{
            backgroundColor:'#357a38',
            }}
            message={
            <>
            <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 1
            }}>
            <CheckCircleOutlineIcon/>
            {snackMessage}
            {
                canJumpFromSnackbar(snackMessage) && 
                <Tooltip title='Jump to Cage' placement='top'>
                <IconButton onClick={() => {navigate('/event/' + canJumpFromSnackbar(snackMessage))}} sx={{m: 0, p: 0, ml: 1.5}}>
                <LaunchIcon sx={{color: 'white', transform: 'scale(0.8)'}} />
                </IconButton>
                </Tooltip>
            }
            </Box>
            </>}
        >
        
        </SnackbarContent>
        </Snackbar>
        </>
        </>
    )
}

export default withRouter(Admin)