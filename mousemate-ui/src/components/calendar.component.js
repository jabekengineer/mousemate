import * as React from 'react';
import { withRouter } from '../common/with-router';
import TaskService from '../services/task.service';
import { Box, Button, Dialog, Grid, Paper } from '@mui/material';
import Title from './title.component';
import { DataGrid } from '@mui/x-data-grid';
import { convertToShortDate } from '../common/actions';
import { convertDateToSlash } from '../common/validateEvents';
import TaskDialog from './taskDialog.component';


function Calendar (props) {
    const [tasks, setTasks] = React.useState([]);
    const [task, setTask] = React.useState({});
    const [taskOpen, setTaskOpen] = React.useState(false);
    const [reload, setReload] = React.useState(false);
    const [showingComplete, setShowComplete] = React.useState(false);
    const [filterModel, setFilterModel] = React.useState({
      items: [{ field: 'completed', operator: 'equals', value: 'Incomplete' }],
    });
    const [sortModel, setSortModel] = React.useState([
      {
        field: 'date',
        sort: 'asc',
      },
    ]);


    React.useEffect(() => {
        TaskService.getAllTasks()
        .then((response) => {
            let _tasks = response.data;
            _tasks.forEach((task) => {
                task.date = convertToShortDate(convertDateToSlash(task.date));
                task.completed = (task.completed ? 'Completed' : 'Incomplete')
            return _tasks
            });
            setTasks(_tasks)
        })
    },[props.reload, reload]);

    const handleRowClick = (row) => {
        setTask(row);
        setTaskOpen(true);
    };

    const handleClose = () => {
        setTaskOpen(false);
    };

    const handleTaskUpdate = React.useCallback((newTask) => {
      TaskService.updateTask(newTask);
      props.setReload(!props.reload);
      setReload(!reload)
    })


    const columns = [
        {field: 'id', headerName: 'taskId', width: 125, hide: true},
        {field: 'date', headerName: 'Date', width: 125, align: 'center', headerAlign: 'center'},
        {field: 'roomId', headerName: 'Room #', width: 125, align: 'center', headerAlign: 'center'},
        {field: 'cageId', headerName: 'Cage #', width: 125, align: 'center', headerAlign: 'center'},
        {field: 'type', headerName: 'Type', width: 175, align: 'center', headerAlign: 'center'},
        {field: 'completed', headerName: 'Status', width: 125, align: 'center', headerAlign: 'center'}
    ];
    
    const toggleFilterSortModel = () => {
      setShowComplete(!showingComplete);
      if(!showingComplete){
        setSortModel([
          {
            field: 'date',
            sort: 'desc'
          }
        ]);
        setFilterModel({
          items: [{ field: 'completed', operator: 'equals', value: 'Completed' }],
        })
      }
      else if(showingComplete){
        setSortModel([
          {
            field: 'date',
            sort: 'asc'
          }
        ]);
        setFilterModel({
          items: [{ field: 'completed', operator: 'equals', value: 'Incomplete' }],
        })
      }
    }

    return(
        <>
          <Grid item xs={12} md={12} lg={12}>
            <Paper
            sx={{
                p:2,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '80vh'
            }}>
              <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1
              }}>
                <Title>Tasks</Title>
                <Button size='small' sx={{borderRadius: 4}} onClick={toggleFilterSortModel} variant={showingComplete ? 'contained': 'outlined'}>
                  Showing Completed Tasks
                </Button>
              </Box>
                <DataGrid
                rows={tasks}
                columns={columns}
                columnVisibilityModel={{
                    id: false
                }}
                checkboxSelection={false}
                disableRowSelectionOnClick={true}
                onRowDoubleClick={(params) => {
                    handleRowClick(params.row)
                }}
                filterModel={filterModel}
                onFilterModelChange={(newFilterModel) => {setFilterModel(newFilterModel)}}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
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
                    maxHeight: '67vh'
                    }}>
                </DataGrid>
            </Paper>
          </Grid>
          <Dialog open={taskOpen} onClose={handleClose}>
            <TaskDialog task={task} onSubmit={handleTaskUpdate} onClose={handleClose}/>
          </Dialog>
        </>
    )
}

export default withRouter(Calendar)