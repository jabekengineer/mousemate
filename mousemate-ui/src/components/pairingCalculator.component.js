import * as React from 'react';
import { withRouter } from '../common/with-router';
import { Box, Button, Collapse, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Snackbar, SnackbarContent, TextField, Tooltip, Typography } from '@mui/material';
import Title from './title.component';
import {breederStrains, strains} from '../common/strains';
import { breederRooms } from '../common/rooms';
import { DataGrid } from '@mui/x-data-grid';
import MouseService from '../services/mouse.service';
import CageService from '../services/cage.service';
import ActionService from '../services/action.service';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { today } from '../common/today';
import { calculateGeneration, convertDateToSlash } from '../common/validateEvents';
import TaskService from '../services/task.service';
import ageFromDate from '../common/ageFromDate';


function PairingCalculator(props) {

    const [maleStrain, setMaleStrain] = React.useState('');
    const [femaleStrain, setFemaleStrain] = React.useState('');
    const [maleMice, setMaleMice] = React.useState([]);
    const [femaleMice, setFemaleMice] = React.useState([]);
    const [maleMouse, setMaleMouse] = React.useState({});
    const [femaleMouse, setFemaleMouse] = React.useState({});
    const [maleRows, setMaleRows] = React.useState([]);
    const [femaleRows, setFemaleRows] = React.useState([]);
    const [maleConfirm, setMaleConfirm] = React.useState(false);
    const [femaleConfirm, setFemaleConfirm] = React.useState(false);
    const [nextCageId, setNextCageId] = React.useState(null);
    const [room, setRoom] = React.useState('');
    const [pairText, setPairText] = React.useState('');
    const [newStrain, setNewStrain] = React.useState('');
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState('');
    const [pairDate, setPairDate] = React.useState(today);


const columns = [
    { field: 'id', headerName: 'ID', width: 75},
    { field: 'cageId', headerName: 'Cage', width: 75},
    { field: 'age', headerName: 'Age', width: 75},
    { field: 'dob', headerName: 'DOB', width: 100},
    { field: 'weanDate', headerName: 'Wean Date', width: 100},
    { field: 'generation', headerName: 'Gen #', width: 100},
    { field: 'strain', headerName: 'Strain', width: 150},
    { field: 'notes', 
    headerName: 'Notes', 
    width: 165,
    editable: false, 
    renderCell: (params) => {
        return (
            <>
            <Box
            sx={{
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center',
                flexGrow: 1
            }}>
            {params.value}
            </Box>
            </>
            )
        }
    }

];

function createRows(mice) {
    if(!mice){
        return []
    }
    let rows = [];
    mice.forEach((mouse) => {
        if(mouse.status !== "Inactive") {
            rows.push({
                id: mouse.id, 
                cageId: mouse.cageId,
                age: ageFromDate(mouse.dob),
                dob: mouse.dob,
                weanDate: mouse.weanDate,
                generation: mouse.generation ?? "",
                strain: mouse.strain, 
                notes: mouse.notes
            })
        }
    })
    return rows
}

const handleNewPairing = React.useCallback(() => {
    // update the male mouse, update the female mouse, calculate the new strain, make the new cage
    
    let _pairDate = convertDateToSlash(pairDate + 'T04:00:00')
    let newCage = {
        id: nextCageId,
        roomId: room,
        strain: newStrain,
        status: "Breeder",
        gender: "Pair",
        breederPairDate: _pairDate
    };
    CageService.addNew(newCage)
    .then(() => {
        MouseService.makeBreeder(maleMouse.id, nextCageId, maleMouse.cageId);
        MouseService.makeBreeder(femaleMouse.id, nextCageId, femaleMouse.cageId);
    })
    var action = {
        user: props.user, 
        type: 'Pairing',
        tagline: 'Male mouse ' + maleMouse.id + ' from cage ' + maleMouse.cageId + ' paired with female mouse ' + femaleMouse.id + ' from cage ' + femaleMouse.cageId + ' to cage #' + nextCageId
    };
    setSnackMessage(action.tagline);
    ActionService.addAction(nextCageId, action)
    // male breeder trail
    action.tagline = 'Male mouse ' + maleMouse.id + ' became breeder in cage ' + nextCageId + '.';
    ActionService.addAction(maleMouse.cageId, action);
    // female breeder trail
    action.tagline = 'Female mouse ' + femaleMouse.id + ' became breeder in cage ' + nextCageId + '.';
    ActionService.addAction(femaleMouse.cageId, action);
    // create breeder snacks task
    var snackDate = new Date(newCage.breederPairDate);
    snackDate.setDate(snackDate.getDate() + 17);
    let task = {
        roomId: newCage.roomId,
        cageId: newCage.id,
        type: 'Breeder Snax',
        date: snackDate,
        completed: false
    };
    TaskService.createTask(task);
    setSnackOpen(true);
    handleMaleReset();
    handleFemaleReset();
    props.setReload(props.reload);

});
const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

const handleRoomSelection = (event) => {
    setRoom(event.target.value);
}

React.useEffect(() => {
    if(maleMice.length > 0) {
        setMaleRows(createRows(maleMice));
    }
    else {
        setMaleRows([])
    }
}, [maleMice]);

React.useEffect(() => {
    if(femaleMice.length > 0) {
        setFemaleRows(createRows(femaleMice));
    }
    else {
        setFemaleRows([])
    }
}, [femaleMice]);

React.useEffect(() => {
    if(maleStrain) {
        MouseService.strainPairings(maleStrain,'M')
        .then((response) => {
            setMaleMice(response.data)
        })
    }
},[maleStrain, props.reload]);

React.useEffect(() => {
    if(femaleStrain) {
        MouseService.strainPairings(femaleStrain,'F')
        .then((response) => {
            setFemaleMice(response.data)
        })
    }
},[femaleStrain, props.reload]);

React.useEffect(() => {
    CageService.getNextCage()
    .then((response) => {
      setNextCageId(response.data.id);  
    })
},[props.reload]);

React.useEffect(() => {
    if(maleMouse.strain !== femaleMouse.strain){
        let strain = [femaleMouse.strain, maleMouse.strain].join(' x ');
        let strainTwo = [maleMouse.strain, femaleMouse.strain].join(' x ');
        if(strains.includes(strain)){
            setNewStrain(strain);
            let text = 'Make new ' + strain + ' breeder cage ' + nextCageId + ' in room ' + room + '?';
            setPairText(text);
        }
        else if(strains.includes(strainTwo)){
            setNewStrain(strainTwo);
            let text = 'Make new ' + strain + ' breeder cage ' + nextCageId + ' in room ' + room + '?';
            setPairText(text);
        }
        else {
            if(maleMouse.strain && femaleMouse.strain){
                alert('Strain: ' + strain + ' not a supported strain.')
                setMaleConfirm(false)
                setFemaleConfirm(false)
            }
        }
    }
    else {
        setNewStrain(maleMouse.strain);
        let text = 'Make new ' + maleMouse.strain + ' breeder cage ' + nextCageId + ' in room ' + room + '?';
        setPairText(text);
    }
    
},[room])


const handleMaleReset = () => {
    setMaleStrain('');
    setMaleMouse({});
    setMaleRows([]);
    setMaleConfirm(false);
    setRoom(null);
};

const handleFemaleReset = () => {
    setFemaleStrain('');
    setFemaleMouse({});
    setFemaleRows([]);
    setFemaleConfirm(false);
    setRoom(null);
}

const handleMaleStrainSelection = (event) => {
    setMaleStrain(event.target.value);
};

const handleFemaleStrainSelection = (event) => {
    setFemaleStrain(event.target.value);
}

const handleMaleSelection = (mouseId) => {
    MouseService.getMouse(mouseId)
    .then((response) => {
        let mouse = response.data;
        if(mouse){
            setMaleMouse(mouse);
        }
    })
    .catch((err) => {
        console.log(err.message)
    })
};

const handleFemaleSelection = (mouseId) => {
    MouseService.getMouse(mouseId)
    .then((response) => {
        let mouse = response.data;
        if(mouse){
            setFemaleMouse(mouse);
        }
    })
    .catch((err) => {
        console.log(err.message)
    })
};

const handleMaleConfirm = () => {
    setMaleConfirm(!maleConfirm);
    if(!maleConfirm){
        setRoom(null);
    }
};

const handleFemaleConfirm = () => {
    setFemaleConfirm(!femaleConfirm)
    if(!femaleConfirm){
        setRoom(null);
    }
}

    const navigate = useNavigate();
    const canJumpFromSnackbar = (snackMessage) => {
        let searchString = 'to cage #';
        if(snackMessage.includes(searchString)){
        let cageNum = snackMessage.split(searchString)[1].replace(/^\D+/g, '');
        // navigate('/event/' + cageNum) 
        return cageNum
        }
    }

    const offspringGeneration = calculateGeneration(maleMouse?.generation, femaleMouse?.generation);

return (
    <>
    <>

    {
        (maleConfirm && femaleConfirm) && 
        <>
        <Grid item xs={12} md={12} lg={11.5}>
            <br/>
            <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end'
            }}>
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    minWidth: '100%',
                    minHeight: '10vh',
                    justifyContent: 'center',
                }}>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}>
                    {
                        !room && 
                        <>
                            <Box sx={{display:'flex', alignItems: 'center'}}>
                            <Typography variant='h6' sx={{mr: 4}}>
                                Verify pair date!
                            </Typography>
                            <FormControl sx={{width: 150}} required>
                                <TextField type='date' defaultValue={pairDate} onChange={(event) => {setPairDate(event.target.value)}}/>
                            </FormControl>
                            </Box>
                            <Box sx={{display:'flex', alignItems: 'center'}}>
                            <Typography variant='h6' sx={{mr: 4}}>
                                Choose room for new pairing!
                            </Typography>
                            <FormControl sx={{width: 125}} required>
                            <InputLabel>Room</InputLabel>
                            <Select
                            value={room}
                            onChange={handleRoomSelection}
                            >
                                {breederRooms && breederRooms.map((_num,index) => (
                                    <MenuItem key={index} value={_num}>
                                        {_num}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </Box>
                        </>
                    }
                    {
                        room && 
                        <>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Typography variant='h6'>
                                {pairText}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                
                            <Typography variant='body2' color={"gray"}>
                            &#8226; <b>First litter's generation: </b> {offspringGeneration}
                            </Typography>
                            <Typography variant='body1' color={"gray"}>
                            &#8226; <b>Pair date: </b> {convertDateToSlash(pairDate + "T04:00:00")}
                            </Typography>
                            </Box>
                        </Box>
                        
                        <Button variant='contained' onClick={handleNewPairing} sx={{ml: 5}}>
                            Make Pairing
                        </Button>
                        </>
                    }
                   
                </Box>
                </Paper>
            </Box>
        </Grid>
        </>
    }

    <Grid item xs={12} md={12} lg={8}>
        <Paper
        sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '30vh',
        }}
        >               
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '100%'
            }}
            >
                <Title>Male Mouse</Title>
                <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
                >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                <FormControl 
                    sx={{
                        width: '200px',
                    }}
                >
                <InputLabel id="pairing-calc-strain-label">Strain</InputLabel>
                <Select
                    value={maleStrain}
                    onChange={handleMaleStrainSelection}
                    labelId='pairing-calc-strain-label'
                    label="Strain"
                >
                {
                    breederStrains && breederStrains.map((_strain, index) => (
                    <MenuItem key={index} value={_strain}>
                        {_strain}
                    </MenuItem>
                    ))
                }
                </Select>
                </FormControl>
                </Box>
                <Button 
                variant='outlined'
                sx={{
                    borderRadius: 4,
                    height: '40px',
                    ml: 2
                }}
                onClick={handleMaleReset}>
                    Reset
                </Button>
                
                </Box>
            </Box>
            <Divider style={{width: '100%'}} sx={{mt: 1, mb: .5}}/>
            { maleRows.length !== 0 && 
            <>
            <DataGrid
                rows={maleRows}
                columns={columns}
                rowHeight={30}
                disableRowSelectionOnClick={false}
                disableColumnMenu
                sx={{
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
                        height: '0.5em'
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)'
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.2)',
                    },
                    minHeight: '30vh',
                    maxHeight: '50vh',
                    minWidth: '100%'
                }}
                onRowSelectionModelChange={handleMaleSelection}/>
                </>
            }
            {
                maleRows.length === 0 && 
                <>
                <br/>
                <br/>

                {
                    !maleStrain && 
                    <>
                        <Typography variant='h6' color="text.secondary" justifySelf="center">
                            Select strain to get started
                        </Typography>
                    </>
                }
                {
                    maleStrain && 
                    <>
                    <Typography variant='h6' color="text.secondary" justifySelf="center">
                        No mice found matching criteria
                    </Typography>
                    </>
                }
                </>
            }
        </Paper>
    </Grid>
    {
        Object.keys(maleMouse).length !== 0 && 
        <>
        <Grid item lg={3.5}>
            <Title>Male selection</Title>
            <Collapse in={!maleConfirm} collapsedSize={150}>
            <Paper
            sx={{
                p: 2,
                pt: 3,
                pb: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxHeight: '38vh'
            }}>
            {
                !maleConfirm && 
                <>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        ID
                    </Typography>
                    <Typography variant='h6'>
                        {maleMouse.id}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        Age
                    </Typography>
                    <Typography variant='h6'>
                        {ageFromDate(maleMouse.dob)}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        DOB
                    </Typography>
                    <Typography variant='h6'>
                        {maleMouse.dob}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        Wean Date
                    </Typography>
                    <Typography variant='h6'>
                        {maleMouse.weanDate}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        Strain
                    </Typography>
                    <Typography variant='h6'>
                        {maleMouse.strain}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        Gen #
                    </Typography>
                    <Typography variant='h6'>
                        {maleMouse.generation}
                    </Typography>
                </Box>
                <Button size='small' variant='outlined' sx={{ mt: 2}} onClick={handleMaleConfirm}>
                    Confirm
                </Button>
                </>
            }
            {
                maleConfirm && 
                <>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%'
                    }}>
                    <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    }}>
                        <Typography variant='h5'>
                            ID
                        </Typography>
                        <Typography variant='h6'>
                            &nbsp;&nbsp;&nbsp;{maleMouse.id}
                        </Typography>
                    </Box>
                    <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    }}>
                        <Typography variant='h5'>
                            Cage
                        </Typography>
                        <Typography variant='h6'>
                            &nbsp;&nbsp;&nbsp;{maleMouse.cageId}
                        </Typography>
                    </Box>
                    <Button size='small' variant='outlined' onClick={handleMaleConfirm}>
                        Edit 
                    </Button>
                </Box>
                </>
            }
            </Paper>
            </Collapse>
        </Grid>
        </>
    }
    <Grid item xs={12} md={12} lg={8}>
        <Paper
        sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '30vh',
        }}
        >               
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '100%'
            }}
            >
                <Title>Female Mouse</Title>
                <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
                >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                <FormControl 
                    sx={{
                        width: '200px',
                    }}
                >
                <InputLabel id="pairing-calc-strain-label">Strain</InputLabel>
                <Select
                    value={femaleStrain}
                    onChange={handleFemaleStrainSelection}
                    labelId='pairing-calc-strain-label'
                    label="Strain"
                >
                {
                    breederStrains && breederStrains.map((_strain, index) => (
                    <MenuItem key={index} value={_strain}>
                        {_strain}
                    </MenuItem>
                    ))
                }
                </Select>
                </FormControl>
                </Box>
                <Button 
                variant='outlined'
                sx={{
                    borderRadius: 4,
                    height: '40px',
                    ml: 2
                }}
                onClick={handleFemaleReset}>
                    Reset
                </Button>
                
                </Box>
            </Box>
            <Divider style={{width: '100%'}} sx={{mt: 1, mb: 1}}/>
            <br/>
            { femaleRows.length !== 0 && 
            <>
            <DataGrid
                rows={femaleRows}
                columns={columns}
                rowHeight={30}
                disableRowSelectionOnClick={false}
                disableColumnMenu
                sx={{
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
                        height: '0.5em'
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)'
                    },
                    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.2)',
                    },
                    minHeight: '30vh',
                    maxHeight: '50vh',
                    minWidth: '100%'
                }}
                onRowSelectionModelChange={handleFemaleSelection}/>
                </>
            }
            {
                femaleRows.length === 0 && 
                <>
                <br/>
                <br/>
                {
                    !femaleStrain && 
                    <>
                        <Typography variant='h6' color="text.secondary" justifySelf="center">
                            Select strain to get started
                        </Typography>
                    </>
                }
                {
                    femaleStrain && 
                    <>
                    <Typography variant='h6' color="text.secondary" justifySelf="center">
                        No mice found matching criteria
                    </Typography>
                    </>
                }
                </>
            }
        </Paper>
    </Grid>
    {
        Object.keys(femaleMouse).length !== 0 && 
        <>
        <Grid item lg={3.5}>
            <Title>Female selection</Title>
            <Collapse in={!femaleConfirm} collapsedSize={150}>
            <Paper
            sx={{
                p: 2,
                pt: 3,
                pb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxHeight: '38vh'
            }}>
                {
                    !femaleConfirm && 
                    <>
                    <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        ID
                    </Typography>
                    <Typography variant='h6'>
                        {femaleMouse.id}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        Age
                    </Typography>
                    <Typography variant='h6'>
                        {ageFromDate(femaleMouse.dob)}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        DOB
                    </Typography>
                    <Typography variant='h6'>
                        {femaleMouse.dob}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        Wean Date
                    </Typography>
                    <Typography variant='h6'>
                        {femaleMouse.weanDate}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        Strain
                    </Typography>
                    <Typography variant='h6'>
                        {femaleMouse.strain}
                    </Typography>
                </Box>
                <Box sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h5'>
                        Gen #
                    </Typography>
                    <Typography variant='h6'>
                        {femaleMouse.generation}
                    </Typography>
                </Box>
                <Button size='small' variant='outlined' sx={{ mt: 2}} onClick={handleFemaleConfirm}>
                    Confirm
                </Button>
                    </>
                }
                {
                femaleConfirm && 
                <>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%'
                    }}>
                    <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    }}>
                        <Typography variant='h5'>
                            ID
                        </Typography>
                        <Typography variant='h6'>
                            &nbsp;&nbsp;&nbsp;{femaleMouse.id}
                        </Typography>
                    </Box>
                    <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    }}>
                        <Typography variant='h5'>
                            Cage
                        </Typography>
                        <Typography variant='h6'>
                            &nbsp;&nbsp;&nbsp;{femaleMouse.cageId}
                        </Typography>
                    </Box>
                    <Button size='small' variant='outlined'onClick={handleFemaleConfirm}>
                        Edit 
                    </Button>
                </Box>
                </>
            }
            </Paper>
            </Collapse>
        </Grid>
        </>
    }
    </>
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
)
}

export default withRouter(PairingCalculator)