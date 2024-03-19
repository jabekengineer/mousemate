import * as React from 'react';
import Title from './title.component'
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { withRouter } from '../common/with-router';
import CageService from '../services/cage.service';
import ageFromDate from '../common/ageFromDate';

const columns = [
    {field: 'roomId', headerName: 'Room #', width: 75, align: 'center'},
    {field: 'id', headerName: 'Cage #', width: 100},
    {field: 'generation', headerName: 'Gen #', width: 75, hidden: true},
    {field: 'strain', headerName: 'Strain', width: 155},
    {field: 'status', headerName: 'Cage Type', width: 100},
    {field: 'gender', headerName: 'Sex', width: 65},
    {field: 'age', headerName: 'Age', width: 65},
    {field: 'count', headerName: '# Mice', width: 75},
    {field: 'notes', headerName: 'Cage Notes', width: 375},
    {field: 'claim', headerName: 'Claimant', width: 85},
    {field: 'claimType', headerName: 'Claim', width: 125},
    
];

function createRows(cages) {
    if(!cages){
        return []
    }
    let rows = [];
    cages.forEach((cage) => {
        rows.push({
            roomId: cage.roomId,
            id: cage.id,
            strain: (cage.strain + genotypedMouseInCage(cage.mice)),
            claim: cage.claim,
            claimType: claimReasons(cage.mice),
            status: cage.status,
            gender: cage.gender,
            age: ageFromCage(cage),
            count: cage.count,
            generation: genFromCage(cage),
            notes: cage.notes
        })
    })
    return rows
}

function genotypedMouseInCage(mice){
    if(mice?.some((mouse) => mouse.genotype !== null)){
        return " (genotyped)"
    }
    else{
        return ""
    }
}
export {genotypedMouseInCage}

function claimReasons(mice) {
        const uniqueReasons = ([...new Set(mice?.map(mouse => mouse.claim))]).filter((element) => {return element !== null});
        var separator = "";
        if(uniqueReasons?.length > 1){
            separator = ", ";
        }
        return (uniqueReasons.join(separator));
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

function genFromCage(cage) {
    if(!cage?.mice){
        return ""
    }
    if(cage?.mice?.length === 0){
        return ""
    }
    var generations = [];
    cage.mice.forEach((mouse) => {
        if(generations.indexOf(mouse.generation) === -1) {
            generations.push(mouse.generation);
        }
    })
    generations?.sort();
    return (generations.length === 0 ? "" : generations.join(", "))
}

function CageList(props) {
    const [tableRows, setTableRows] = React.useState([]);
    const [showEmpty, setShowEmpty] = React.useState(false);

    const navigate = useNavigate();
    const goToCage = (cageNumber) => {
        navigate('/event/' + cageNumber)
    }

    React.useEffect(() => {
        CageService.getEmptyOrNot(showEmpty,false)
        .then(response => {
            setTableRows(createRows(response.data));
        })
        .catch(e => {
            console.log(e)
        });
    }, [showEmpty, props.reload])

    const [sortModel, setSortModel] = React.useState([
        {
          field: 'id',
          sort: 'desc',
        },
      ]);

return (
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
                <Title>All Cages</Title>
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
                rowHeight={40}
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
)
}
  export default withRouter(CageList)