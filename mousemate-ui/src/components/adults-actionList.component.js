import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { withRouter } from '../common/with-router';
import Euthanize from './adult-euthanize.component'
import MouseService from '../services/mouse.service';
import Transfer from './adult-transfer.component';
import Experiment from './adult-experiment.component';
import Claim from './adult-claim.component';
import Genotype from './adult-genotype.component';
import ageFromDate from '../common/ageFromDate';
const columns = [
    { field: 'id', headerName: 'ID', width: 65},
    { field: 'age', headerName: 'Age', width: 65},
    { field: 'gender', headerName: 'Sex', width: 65},
    { field: 'dob', headerName: 'DOB', width: 100},
    { field: 'weanDate', headerName: 'Wean Date', width: 100},
    { field: 'strain', headerName: 'Strain', width: 140},
    {field: 'generation', headerName: 'Gen #', width: 65},
    { field: 'genotype', headerName: 'Genotype', width: 150},
    {field: 'notchNum', headerName: 'Notch #', width: 75},
    { field: 'claim', headerName: 'Claim', width: 100},
    { field: 'notes', 
    headerName: 'Notes', 
    width: 350,
    editable: true, 
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
                generation: mouse.generation ? mouse.generation : "",
                age: ageFromDate(mouse.dob),
                claim: mouse.claim,
                gender: mouse.gender,
                dob: mouse.dob,
                weanDate: mouse.weanDate,
                strain: mouse.strain, 
                notes: mouse.notes,
                genotype: mouse.genotype,
                notchNum: notchFromMouse(mouse.notchOne, mouse.notchTwo)
            })
        }
    })
    return rows
}

function notchFromMouse(notchOne, notchTwo){
    var notch = '';
    if(notchOne !== 0 && notchOne !== null){
        notch = notchOne;
    }
    if(notchTwo !== 0 && notchOne !== null){
        notch += ("/" + notchTwo)
    };
    return notch
}

function ActionList(props) {
    const [selections, setSelections ] = React.useState([]);
    const [euthanizeOpen, setEuthanizeOpen] = React.useState(false);
    const [cageNotes, setCageNotes] = React.useState('');
    const [mice, setMice] = React.useState([]);
    const [mouseNoteEdit, setMouseNoteEdit] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const [transferOpen, setTransferOpen] = React.useState(false);
    const [experimentOpen, setExperimentOpen] = React.useState(false);
    const [claimOpen, setClaimOpen] = React.useState(false);
    const [genotypeOpen, setGenotypeOpen] = React.useState(false);

    React.useEffect(() => {
        setMice(props.cage.mice);
        setCageNotes(props.cage.notes);
    },[props.cage]);

    React.useEffect(() => {
        props.setReload(!props.reload);
    },[mouseNoteEdit])

    React.useEffect(() => {
        setRows(createRows(mice));
    }, [mice]);
    
    const openEuthanizeDialog = () => {
        setEuthanizeOpen(true);
    }
 
    
    const openTransferDialog = () => {
        setTransferOpen(true);
    }
    
    const openExperimentDialog = () => {
        setExperimentOpen(true);
    }

    const openClaimDialog = () => {
        setClaimOpen(true);
    }

    const openGenotypeDialog = () => {
        setGenotypeOpen(true);
    }

    const handleClose = () => {
        setEuthanizeOpen(false);
        setTransferOpen(false);
        setExperimentOpen(false);
        setClaimOpen(false);
        setGenotypeOpen(false);
    };

    const saveMouseNote = (params, event) => {        
        if(event["target"] !== undefined) {
            let noteText = event.target.value;
            if(!event.target.value) {
                return
            }
            const body = {
                notes: noteText
              };
            MouseService.updateMouseNote(params.row.id, body);
            setMouseNoteEdit(!mouseNoteEdit)
        }
    }

    const handleSelection = (ids) => {
        setSelections(ids);
    }

    return (
        <>
        {rows.length > 0 && 
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}>
            <Box sx={{ width: '90%', minWidth: '50%', paddingRight: 2, paddingBottom: 2}}>
                <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5}}
                }}
                checkboxSelection
                disableRowSelectionOnClick={false}
                disableColumnMenu
                onCellEditStart={() => {
                    // alert('Press ENTER or TAB to save note.')
                }}
                
                onCellEditStop={(params, event) => {
                    saveMouseNote(params, event)
                }}
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
                      }
                 }}
                // rowHeight={40}
                onRowSelectionModelChange={handleSelection} />
                <Box
            sx={{
                display: 'flex',
                flexDirection: 'row', 
                justifyContent: 'space-evenly', 
                alignItems: 'center'
            }}>
                {(props.permissions === 'admin' || props.cage.roomId === 261)  && 
                <>
                <Button variant={"outlined"} disabled={selections.length === 0} sx={{m:.5}} onClick={openEuthanizeDialog}>Euthanize</Button>
                </>
                }
                {props.permissions === 'admin' && 
                <>
                <Button variant={"outlined"} disabled={selections.length === 0} sx={{m:.5}} onClick={openTransferDialog}>Transfer</Button>
                </>
                }
                <Button variant='outlined' disabled={selections.length === 0} sx={{m:.5}} onClick={openClaimDialog}>Claim</Button>
                <Button variant={"outlined"} disabled={selections.length === 0} sx={{m:.5}} onClick={openExperimentDialog}>Move to RLC</Button>
                <Button variant='outlined' disabled={selections.length === 0 || selections.length > 1} sx={{m:.5}} onClick={openGenotypeDialog}>Genotype</Button>
            </Box>
                </Box>
            
            <Dialog open={euthanizeOpen} onClose={handleClose}>
                <Euthanize 
                mice={selections}
                cage={props.cage} 
                onSubmit={props.onEuthSubmit}
                onClose={handleClose}/>
            </Dialog>

            <Dialog open={transferOpen} onClose={handleClose}>
                <Transfer
                    mice={selections}
                    cage={props.cage}
                    nextCage={props.nextCage}
                    roomId={props.roomId}
                    onSubmit={props.onTransferSubmit}
                    onClose={handleClose}
                />
            </Dialog>

            <Dialog open={experimentOpen} onClose={handleClose}>
                <Experiment
                    mice={selections}
                    cage={props.cage}
                    nextCage={props.nextCage}
                    onSubmit={props.onExperimentSubmit}
                    onClose={handleClose}
                />
            </Dialog>
            <Dialog open={claimOpen} onClose={handleClose}>
                <Claim
                    cage={props.cage}
                    mice={selections}
                    user={props.user}
                    onSubmit={props.onClaimSubmit}
                    onClose={handleClose}
                />
            </Dialog>
            <Dialog open={genotypeOpen} onClose={handleClose}>
                <Genotype
                    cage={props.cage}
                    mice={selections}    
                    onClose={handleClose}
                    onSubmit={props.onGenotypeSubmit}
                />
            </Dialog>


            </Box>
        }
        {rows.length === 0 && 
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}>
            <Typography variant='h6' sx={{color: 'text.secondary', mt: 4}}>
                All mice in cage are retired or transferred.
            </Typography>
        </Box>
        }
        </>
    )
};

export default withRouter(ActionList)