import * as React from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { withRouter } from '../common/with-router';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

function genderDistribution(litter) {
    let males = litter.malesWeaned ? litter.malesWeaned : '0';
    let females = litter.femalesWeaned ? litter.femalesWeaned : '0';
    let str = males + '/' + females;
    return str
}

function amountWeaned(litter){
    return litter.malesWeaned + litter.femalesWeaned

}

function BreederHistory (props) {
    const headers = ["Pregnancy #", "Date of Birth", "Gen #", "Number of Pups", "Sex (M/F)", "Date of Weaning", "Amount Weaned", "Litter Cages", "Notes"];
    const [editingNote, setEditingNote] = React.useState(false);
    const [litterId, setLitterId] = React.useState(0);
    const [historyLitterNote, setHistoryLitterNote] = React.useState('');


    const handleEditClick = (event, editedLitterId) => {
        event.stopPropagation();
        setLitterId(editedLitterId)
        setEditingNote((prev) => !prev);
    }

    const handleSubmitClick = () => {
        props.updateNote(historyLitterNote, litterId)
        setEditingNote((prev) => !prev);
        setEditingNote('');
    }

    const handleNoteChange = (event) => {
        setHistoryLitterNote(event.target.value);
    }

    const sortedLitterCageKeys = Object.keys(props.litterCages).sort((a, b) => a - b);
    
    return(
            <>
            {props.litters && 
            <div id='pair history'>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        {headers && headers.map((header,index) => (
                            <TableCell key={index} align="left" style={{maxWidth: 100}}>
                                <Typography variant='h7'>
                                <strong>{header}</strong>
                                </Typography>
                                </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody >
                    {props.litters && props.litters.map((litter,index) => (
                        <TableRow
                        hover={true}
                        key={index} 
                        sx={{ "&:last-child td, &:last-child th": { border: 0 }}}
                        >
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{litter.dob}</TableCell>
                            <TableCell>{litter.generation}</TableCell>
                            <TableCell>{litter.pupCount}</TableCell>
                            <TableCell>{genderDistribution(litter)}</TableCell>
                            <TableCell>{litter.weanDate}</TableCell>
                            <TableCell>{amountWeaned(litter)}</TableCell>
                            {/* These should become buttons or links to the cages */}
                            <TableCell>
                            <Box
                                display='flex'
                                flexDirection='row'
                                flexWrap='wrap'
                                gap='5px'
                                sx={{
                                    maxWidth: 150
                                }}>
                                {props.litterCages[sortedLitterCageKeys[index]] && props.litterCages[sortedLitterCageKeys[index]].map((cageNum, idx) => (
                                    <Link
                                     key={idx}
                                     to={"/event/" + cageNum}
                                     style={{textDecoration: 'none'}}>
                                        <Button variant='outlined' style={{textTransform: 'none', padding: '1px'}} >
                                            <Typography
                                            fontSize='small'
                                            color="palette.primary">
                                            {cageNum}
                                            </Typography>
                                        </Button>
                                    </Link>
                            ))}
                            </Box>
                            </TableCell>
                            <TableCell>
                                {
                                    (!editingNote || (editingNote && (litter.id !== litterId))) && (
                                        <>
                                        <Box 
                                        sx={{
                                            display:'flex',
                                            alignItems: 'center',
                                            justifyContent: (litter.notes?.length !== 0 ? 'space-between' : 'end')
                                        }}>
                                        {litter.notes}
                                        {
                                            litter.id !== props.currentLitter.id && (
                                                <>
                                                {
                                                    litter.notes?.length > 0 ? (
                                                        <>
                                                        <Tooltip title="Edit note">
                                                            <IconButton disabled={(editingNote && (litter.id !== litterId))} onClick={(e) => handleEditClick(e, litter.id)} sx={{m:0, p:0.5}}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        </>
                                                    ) : (
                                                        <>
                                                        
                                                        <Tooltip sx={{justifyContent: 'center'}} title="Add note">
                                                            <IconButton disabled={(editingNote && (litter.id !== litterId))} onClick={(e) => handleEditClick(e, litter.id)} sx={{m:0, p:0.5}}>
                                                                <NoteAddIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        </>
                                                    )
                                                }
                                                </>
                                            )
                                        }
                                        </Box>
                                        </>
                                    )
                                }
                                {
                                    (editingNote && (litter.id === litterId)) && (
                                        <Box 
                                        sx={{
                                            display:'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                        <TextField size='small' 
                                        inputProps={{style: {fontSize: 12}}}
                                        autoFocus
                                        sx={{minWidth: '300px'}} fullWidth multiline defaultValue={litter.notes} onChange={handleNoteChange}/>
                                        <Tooltip title="Finish edit">
                                            <IconButton onClick={handleSubmitClick} sx={{m:0.5, p:0.5}}>
                                                <CheckIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        </Box>
                                    )
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            } {!props.litters &&
                <Typography
                paddingTop={'70px'} textAlign={'center'}>Litter History Unavailable</Typography>}
            </>
        )
    }


export default withRouter(BreederHistory)