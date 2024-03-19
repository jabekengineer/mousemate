import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Dialog, Popover, TextField, Typography } from '@mui/material';
import { withRouter } from '../common/with-router';
import Wean from './breeder-wean.component';
import PupDeath from './breeder-pupDeath.component';
import CrossFoster from './breeder-crossFoster.component';
import ageFromDate from '../common/ageFromDate';

const columns = [
    // { field: 'id', headerName: 'ID', width: 100},
    { field: 'age', headerName: 'Age', width: 75},
    { field: 'dob', headerName: 'DOB', width: 150},
    { field: 'weanDate', headerName: 'Wean Date', width: 150},
    { field: 'strain', headerName: 'Strain *', width: 150},
    { field: 'fosterOrigin', headerName: 'Cage Fostered From *', width: 200 },
];

function createRows(litter, strain, cfData) {
    // if no litters reported yet 
    if(!litter){
        return []
    }
    // if litter without pups or cf pups yet
    if(!litter.pupCount && !litter.cfPupCount) {
        return []
    }
    let rows = [];
    for(var i = 0; i < litter.pupCount; i++){
        rows.push(
            {
                id: i,
                age: ageFromDate(litter.dob),
                strain: strain,
                dob: litter.dob,
                weanDate: litter.weanDate,
                fosterOrigin: litter.cfCageId ? litter.cfCageId : '',
            }
        )
    }
    for(var j = (litter.pupCount > 0 ? litter.pupCount : 0); 
        j < (litter.cfPupCount + (litter.pupCount > 0 ? litter.pupCount : 0)); j++){
        rows.push(
            {
                id: j,
                age: ageFromDate(cfData.dob),
                strain: cfData.strain,
                dob: cfData.dob,
                weanDate: cfData.weanDate,
                fosterOrigin: cfData.cage ? cfData.cage : '',
            }
        )
    }

    return rows
}

function PupListActions(props) {

    const [selections, setSelections] = React.useState([]);
    const [currentLitter, setCurrentLitter] = React.useState([]);
    const [weanOpen, setWeanOpen] = React.useState(false);
    const [pupDeathOpen, setPupDeathOpen] = React.useState(false);
    const [crossFosterOpen, setCrossFosterOpen] = React.useState(false);
    const [litterNotes, setLitterNotes] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(false);
    const [strainOption, setStrainOption] = React.useState(props.strain);
    const [rows, setRows] = React.useState([]);

    const open = Boolean(anchorEl);
    const id = open ? 'task-popover' : undefined;

    const openPupDeathDialog = () => {
        setPupDeathOpen(true);    
    }

    const openCrossFosterDialog = () => {
        setCrossFosterOpen(true);
    }


    const openWeanDialog = () => {
        setWeanOpen(true);
    }
    const handleClose =() => {
        setWeanOpen(false);
        setPupDeathOpen(false);
        setCrossFosterOpen(false);
        setAnchorEl(null);
    }

    React.useEffect(() => {
        setCurrentLitter(props.litter)
        setLitterNotes(props.litter.notes)
    },[props.litter]);
    
    React.useEffect(() => {
        setRows(createRows(currentLitter,props.strain, props.cfData))
    },[currentLitter, props.strain, props.cfData])

    React.useEffect(() => {
        setSelections([]);
    },[props.reload])

    const addMouse = (event) => {
        if(Object.keys(props.cfData).length === 0 || !rows.length > 0) {
            props.add(currentLitter.id);
            props.setReload(!props.reload);
        }
        else if(Object.keys(props.cfData).length > 0 && rows.length > 0) {
            setAnchorEl(event.currentTarget);
        }
    }

    const addHomePup = () => {
        props.add(currentLitter.id);
        props.setReload(!props.reload);
        handleClose();
    }

    const addCfPup = () => {
        props.addCf(currentLitter.id);
        props.setReload(!props.reload);
        handleClose();
    }
    

    const deleteMice = () => {
        var count = 0;
        var cfCount = 0;
        var selectedRows = [];
        rows.forEach((row) => {
            if(selections.includes(row.id)){
                selectedRows.push(row)
            }
        })
        selectedRows.forEach((selection) => {
            if(selection.strain === props.strain) {
                count += 1;
            }
            if(selection.strain === props.cfData.strain) {
                cfCount += 1;
            }
        })
        let body = {
                count: count,
                cfCount: cfCount
            };
        props.drop(currentLitter.id,body);
    }

    const handleSelection = (ids) => {
        if(ids.length < 1){
            setSelections(ids);
        }
        setSelections(ids);
    }

    const breederPairInactive = !(props.breeders.some(mouse => (mouse.gender === "F" && mouse.status === "Breeder")));

    const litterDescription = (currentLitter) => {
        const litterNum = (props.nextLitter + 1);
        if(currentLitter.length === 0 && !breederPairInactive){
            if(props.permissions === 'admin'){
                let description = "No active litters, report birth to create litter #" + litterNum;
                return description
            }
            else {
                let description = "No active litters in cage.";
                return description
            }
        }
        if(currentLitter.id > 0 && !breederPairInactive){
            return 'No pups added to litter ' + (litterNum - 1)
        }
        if(breederPairInactive){
            return "Breeder pair not active without female."
        }
    }

    

    return (
        <>
        {rows.length > 0 && 
            <> 
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row', 
                justifyContent: 'space-evenly',
                alignItems: 'center',
            }}>
                <Box sx={{ width: '90%', minWidth: '40%', paddingRight: 2, paddingBottom: 2}}>
                
                {/* Add and Drop Buttons */}
                <Box 
                sx={{
                    border: 1,
                    borderRadius: 1,
                    borderColor: 'divider',
                    p:1,
                    display: 'flex',
                    flexDirection: 'row',
                    
                }}
                >
                    <Button
                    onClick={addMouse}
                    disabled={breederPairInactive}
                    variant='outlined'
                    sx={{
                        mr: 1
                    }}
                    >
                        Add
                    </Button>
                    
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                        >
                        <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        columnGap: 1,
                        p:1
                        }}
                        >
                        <Button variant='outlined' disabled={breederPairInactive} onClick={addHomePup}>
                            {props.strain}
                        </Button>
                        <Button variant='outlined' disabled={breederPairInactive} onClick={addCfPup}>
                            {props.cfData.strain}
                        </Button>
                    </Box>
                        </Popover>

                    <Button
                    variant='outlined'
                    disabled={selections.length === 0 || breederPairInactive}
                    onClick={deleteMice}
                    sx={{
                        mr: 1
                    }}
                    >
                        Delete
                    </Button>
                    <TextField fullWidth multiline size='small' label={currentLitter.notes?.length > 1 ? "" : "litter notes"} defaultValue={currentLitter.notes} onChange={props.updateNote}>
                        {litterNotes}
                    </TextField>
                    <Button
                    variant='outlined'
                    disabled={breederPairInactive}
                    onClick={props.onFinish}
                    sx={{
                        ml: 1
                    }}
                    >
                        Finish
                    </Button>
                </Box>

                <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5}}
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableRowSelectionOnClick={false}
                rowHeight={40}
                onRowSelectionModelChange={handleSelection}
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
                        height: '0.5em',
                        width: '0.5em'
                      },
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)'
                      },
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.2)',
                      },
                      maxHeight: '35vh',
                 }} />
                 {props.permissions === 'admin' && 
                 
                <Box
            sx={{
                display: 'flex',
                flexDirection: 'row', 
                justifyContent: 'space-evenly', 
                alignItems: 'center'
            }}>
                <Button variant='outlined' sx={{m:.5}} disabled={selections.length === 0} onClick={openWeanDialog}>Wean</Button>
                <Button variant='outlined' sx={{m:.5}} disabled={selections.length === 0} onClick={openPupDeathDialog}>Report Pup Death </Button>
                <Button variant='outlined' sx={{m:.5}} disabled={selections.length === 0 || Object.keys(props.cfData).length !== 0 } onClick={openCrossFosterDialog}>Cross Foster</Button>
            </Box>
                }
                </Box>

                {/* wean dialog */}
                <Dialog open={weanOpen} onClose={handleClose}>
                    <Wean
                    count={selections.length}
                    nextCage={props.nextCage}
                    roomId={props.roomId}
                    cageId={props.cageId}
                    wean={props.wean}
                    drop={deleteMice}
                    dob={currentLitter.dob}
                    onSubmit={props.onWeanSubmit}
                    onClose={handleClose}
                    />
                </Dialog>

                <Dialog open={pupDeathOpen} onClose={handleClose}>
                    <PupDeath
                    count={selections.length}
                    cageId={props.cageId}
                    drop={deleteMice}
                    onSubmit={props.onPupDeathSubmit}
                    onClose={handleClose}/>
                </Dialog>

                <Dialog open={crossFosterOpen} onClose={handleClose}>
                    <CrossFoster 
                        litterId={currentLitter.id}
                        strain={props.strain}
                        pupCount={selections.length}
                        drop={deleteMice}
                        cageId={props.cageId}
                        onSubmit={props.onCrossFosterSubmit}
                        onClose={handleClose}
                    />
                </Dialog>
                

            </Box>
            
            </>
        } {!rows.length > 0 && 
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                pt: '3%'
            }}>
            <Typography variant='h6'> {litterDescription(props.litter)}  </Typography>
            {/* Add Buttons */}
            { props.permissions === 'admin' && 
            
            <Box>
            <Button
            disabled={currentLitter.length == 0}
            onClick={addMouse}
            variant='outlined'
            >
                Add
            </Button>
            <Button
            variant='outlined'
            disabled={currentLitter.length == 0}
            onClick={props.onFinish}
            sx={{
                ml: 1
            }}
            >
                Finish
            </Button>
            </Box>
            
            }
        </Box>
            }
        </>
    )
}
export default withRouter(PupListActions)