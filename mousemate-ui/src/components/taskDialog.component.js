import * as React from 'react';
import { withRouter } from '../common/with-router';
import { Box, Button, Checkbox, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { convertDateSlashToHyphen } from '../common/validateEvents';


function TaskDialog(props){
    const [completed, setCompleted] = React.useState(props.task.completed === "Completed" ? true : false);
    const [date, setDate] = React.useState(props.task.date);
    const [editDate, setEditDate] = React.useState(false);
    const [editing, setEditing] = React.useState(false);

    const handleDateSelection = (event) => {
        setDate(event.target.value);
    };

    const handleSubmit = () => {
        if(editDate){
            const _date = (date + "T04:00:00");
            let task = {
                'id': props.task.id,
                'date': _date,
                'completed': completed
            }
            props.onSubmit(task);
        }
        else {
            const _date = (convertDateSlashToHyphen(date) + "T04:00:00");
            let task = {
                'id': props.task.id,
                'date': _date,
                'completed': completed
            }
            props.onSubmit(task);
        }
        props.onClose();
    }
    return (
        <>
        <DialogContent>
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            justifyContent: 'center',
            minWidth: 250,
            maxWidth: 400,
            flexWrap: 'wrap',
            columnGap: 5,
            rowGap: 2,
            pt: 1,
            pb: 1
        }}>
            <div id='date'>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4'>
                    Date
                </Typography>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                }}>
                    
                        { !editDate && 
                        <>
                            <Typography variant='h6'>
                                {props.task.date}
                            </Typography>
                            <Box 
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'left',
                                p:0,
                                m:0
                            }}
                            >
                                <Button variant='text'
                                style={{ backgroundColor: 'transparent' }} 
                                sx={{
                                    p:0,
                                    m:0,
                                    textDecoration: 'underline',
                                    color: (theme) => theme.palette.grey[500]
                                    }}
                                onClick={() => {
                                    setEditDate(true);
                                    setEditing(true);
                                    }
                                }
                                >
                                    <EditIcon sx={{height: 20}}/>
                                    <Typography fontSize='14px'
                                     sx={{
                                        textDecoration: 'underline',
                                        color: (theme) => theme.palette.grey[500]}}>
                                            Edit
                                    </Typography>
                                </Button>   
                            </Box>
                        </>
                        }
                        {
                            editDate && 
                            <FormControl sx={{
                                width: '135px'
                            }}
                            >
                                <TextField type='date' defaultValue={convertDateSlashToHyphen(props.task.date)} onChange={handleDateSelection}/>
                            </FormControl>
                        }
                </Box>
            </Box>
            </div>

            <div id='status'>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4'>
                    Status
                </Typography>
                <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                <FormControl>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={completed} 
                    onClick={() => {
                        setCompleted(!completed);
                        setEditing(true);
                            }
                        }
                    />} 
                    sx={{m:0}} />
                </FormGroup>
                </FormControl>
                <Typography variant='body2'
                sx={{
                    color: (theme) => theme.palette.grey[500] 
                }}>
                    {completed ? 'Complete' : 'Incomplete'}
                </Typography>
                </Box>
            </Box>
            </div>
            <Divider/>
            <div id='room'>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4'>
                    Room 
                </Typography>
                <Typography variant='h6'
                 sx={{
                    mr:2
                }}>
                    {props.task.roomId}
                </Typography>
            </Box>
            </div>
            <div id='cage'>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4'>
                    Cage 
                </Typography>
                <Typography variant='h6'
                 sx={{
                    mr:2
                }}>
                    {props.task.cageId}
                </Typography>
            </Box>
            </div>
            <div id='type'>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4'>
                    Type 
                </Typography>
                <Typography variant='h6'
                 sx={{
                    mr:1
                }}>
                    {props.task.type}
                </Typography>
            </Box>
            </div>
        </Box>
        </DialogContent>
            {
                editing && 
                <>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <DialogActions>
                        <Button variant='outlined' onClick={props.onClose}>Cancel</Button>
                        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                    </DialogActions>
                </Box>
                </>
            }

        </>
    )
}

export default withRouter(TaskDialog);