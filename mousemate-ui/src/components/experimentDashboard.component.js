import * as React from 'react';
import Title from './title.component'
import { Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { withRouter } from '../common/with-router';
import CageService from '../services/cage.service';
import ageFromDate from '../common/ageFromDate';
import { genotypedMouseInCage } from './home-cageList.component';

const columns = [
    // {field: 'roomId', headerName: 'Room #', width: 125, align: 'center', hidden: true},
    {field: 'id', headerName: 'Cage #',  align: 'center', width: 115},
    { field: 'notes', headerName: 'Cage Notes', width: 450},
    {field: 'strain', headerName: 'Genotype', width: 175},
    {field: 'gender', headerName: 'Sex', width: 85},
    {field: 'age', headerName: 'Age', width: 65},
    {field: 'dob', headerName: 'DOB', width: 110},
    {field: 'count', headerName: '# Mice', width: 85},
    {field: 'claim', headerName: 'Claim', width: 85},
];

function createRows(cages) {
    if(!cages){
        return []
    }
    let rows = [];
    cages.forEach((cage) => {
        rows.push({
            id: cage.id,
            notes: cage.notes,
            strain: (cage.strain + genotypedMouseInCage(cage.mice)),
            claim: cage.claim,
            gender: cage.gender,
            age: ageFromCage(cage),
            count: cage.count,
            dob: dobFromCage(cage)
        })
    })
    return rows
}


function dobFromCage(cage) {
    if(!cage){return null}
    let cageMice = cage?.mice;
    if(cageMice?.length !== 0){
        return cageMice[0].dob
    }
    else{
        return null
    }
}

function ageFromCage(cage) {
    if(!cage){return null}
    let cageMice = cage?.mice;
    if(cageMice?.length !== 0){
        return ageFromDate(cageMice[0].dob)
    }
    else{
        return null
    }
}

function ExperimentList(props) {

    const [tableRows, setTableRows] = React.useState([]);
    const [showEmpty, setShowEmpty] = React.useState(false);

    const navigate = useNavigate();
    const goToCage = (cageNumber) => {
        navigate('/event/' + cageNumber)
    }
    React.useEffect(() => {
        CageService.getEmptyOrNot(showEmpty,true)
        .then(response => {
            setTableRows(createRows(response.data));
        })
        .catch(e => {
            console.log(e)
        });
    }, [showEmpty,props.reload])

    const [sortModel, setSortModel] = React.useState([
        {
          field: 'id',
          sort: 'desc',
        },
      ]);

return (
    <Grid item xs={12} md={12} lg={12}>
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '76vh',
      }}
    >
        <React.Fragment>
        { tableRows.length > 0 &&
            <>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1
            }}>
                <Title>RLC Cages | Room 261</Title>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: 2
                }}>
                    <Button size='small' sx={{borderRadius: 4}} onClick={() => setShowEmpty(!showEmpty)} variant={showEmpty ? 'contained': 'outlined'} >
                        Showing Empty Cages
                    </Button>
                </Box>
            </Box>
            <Box>
                <DataGrid
                rows={tableRows}
                columns={columns}
                checkboxSelection={false}
                disableRowSelectionOnClick={false}
                onRowDoubleClick={(params) => {
                    goToCage(params.row.id)
                }}
                sortModel={sortModel}
                // rowHeight={42}
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
                    }}
                    />
            </Box>
            </>
        }
    </React.Fragment>
      </Paper>
    </Grid>
    
)
}
  export default withRouter(ExperimentList)