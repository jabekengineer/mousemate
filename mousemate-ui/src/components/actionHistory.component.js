import * as React from 'react';
import { withRouter } from '../common/with-router';
import { DataGrid } from '@mui/x-data-grid';
import { Box} from '@mui/material';
import { convertToShortDate } from '../common/actions';

const convertRows = (rows) => {
    let _rows = [];
    rows.forEach((row) => {
        row.date = convertToShortDate(row.createdAt);
        _rows.push(row);
    });
    return _rows
}

function ActionHistory (props) {
    const rows = convertRows(props.rows);
    const columns = props.columns;
    const [sortModel, setSortModel] = React.useState([
        {
          field: 'id',
          sort: 'desc',
        },
      ]);
    var showLitterId = true;
    if(props.cage.status === 'Adult'){
        showLitterId = false;
    };
    return (
        <>
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        }}>
            <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            columnVisibilityModel={{
                id: false,
                litterId: {showLitterId},
            }}
            sx={{
                maxWidth: '100%',
                maxHeight: '40vh',
                border:'none',
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
        </Box>
        </>
    )
}

export default withRouter(ActionHistory)