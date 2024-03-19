import * as React from 'react';
import { Timeline, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab';
import { withRouter } from '../common/with-router';
import { Box, Button, Checkbox, Container, Dialog, Divider, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import TaskService from '../services/task.service';
import { convertToShortDate } from '../common/actions';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TaskDialog from './taskDialog.component';
import { convertDateSlashToHyphen, isDST } from '../common/validateEvents';

function ContentTimeline(props) {
    const [tasks, setTasks] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(false);
    const [taskOpen, setTaskOpen] = React.useState(false);
    const [selectedCageId, setSelectedCageId] = React.useState(null);
    const [reload, setReload] = React.useState(false);

    // load the todo events for next interval (default 10) days
    React.useEffect(() => {
        TaskService.getTasks(5)
        .then(response => {
            let _tasks = response.data;
            _tasks.forEach((task) => {
                task.date = convertToShortDate(task.date);
            return _tasks
            });
            setTasks(_tasks);
        })
        .catch(err => {
            console.log(err.message)
        })
    },[reload, props.reload]);

    const handleClick = (event, cageId) => {
        setAnchorEl(event.currentTarget);
        setSelectedCageId(cageId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setTaskOpen(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'task-popover' : undefined;

    const handleComplete = React.useCallback((currentTask) => {
        currentTask.completed = !currentTask.completed;
        currentTask.date = convertDateSlashToHyphen(currentTask.date) + 'T04:00:00';
        TaskService.updateTask(currentTask);
        props.setReload(!props.reload);
        setReload(!reload)
    });

    const shiftDay = React.useCallback((currentTask, increment) => {
        let dateObj = new Date(currentTask.date);
        dateObj.setDate(dateObj.getDate() + increment);
        currentTask.date = dateObj;
        TaskService.updateTask(currentTask);
        props.setReload(!props.reload);
        setReload(!reload);
    })

    return (
        <Container 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '3vh',
            paddingRight: '0!important',
            maxHeight: '63.75vh',
        }}>
            <Link to={'/calendar'}  style={{textDecoration: 'none', color: 'inherit'}}>
            <Typography 
            variant='h5' 
            sx={{
                fontWeight: '400',
                marginLeft: 8,
                "&:hover": { color: "text.secondary"}
                }}>
                    To-Do List
                </Typography>
                <Typography 
                variant='body2' 
                sx={{
                    color: "text.secondary",
                    marginLeft: 7,
                    }}>
                        Room | Cage | Task
                    </Typography>
            </Link>
            <Container 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingRight: '0!important',
            mt: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
                width: '0.3em',
                m: 0, 
                p: 0,
              },
              '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.2)',
              },
        }}>
        <Timeline position='left' sx={{alignItems: 'flex-end', pt: 0, mt: 0, pr: 0}}>
            {tasks && 
            tasks.map((task, index) => (
                <TimelineItem id={task.id} key={task.id} 
                sx={{
                    "&::before" : {
                        paddingRight: 0,
                             }}}>
                    <TimelineSeparator>
                        <Checkbox
                            style={{
                                transform: "scale(.9)",
                            }}
                            sx={{p:0, m:0, mt:1, pr: .25}}
                            icon={<CheckBoxOutlineBlankIcon/>}
                            checkedIcon={<CheckBoxIcon/>}
                            defaultChecked={task.completed}
                            onClick={() => {handleComplete(task)}}
                        />
                        {index + 1 !== tasks.length &&
                    <Divider/>}
                </TimelineSeparator>
                <TimelineContent sx={{textAlign: "center"}}>
                    <Button variant='text' onClick={(e) => {handleClick(e,task.cageId)}} style={{textTransform: "none"}} sx={{m:0, p:0, maxHeight: 24}}>
                        <Typography color="text.primary" component='span' textAlign='center'>
                            {task.roomId} | {task.cageId} | {task.type}
                        </Typography>
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
                            }}>
                                <Button variant='outlined'>
                                    <Link to={'/event/' + selectedCageId}  style={{textDecoration: 'none', color: "inherit"}}> 
                                        View Cage
                                    </Link>
                                </Button>
                                <Button variant='outlined' >
                                    <Link to={'/calendar'}  style={{textDecoration: 'none', color: "inherit"}}> 
                                        View List
                                    </Link>
                                </Button>
                            </Box>
                    </Popover>
                    <br/>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        pl: 3,
                    }}>
                    <Tooltip title="Advance 1 day">
                        <IconButton size='small' onClick={() => {shiftDay(task,-1)}}>
                            <RemoveIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography color="text.secondary" component='span'>
                        {convertToShortDate(task.date)}
                    </Typography>
                    <Tooltip title="Delay 1 day">
                        <IconButton size='small'
                        onClick={() => {shiftDay(task, 1)}}>
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                    </Box>
                </TimelineContent>
            </TimelineItem>
            ))}
        </Timeline>
        </Container>
        </Container>
    )

}

export default withRouter(ContentTimeline)
