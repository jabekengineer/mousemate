const actionColumns = [
    { field: 'id', headerName: 'id', width: 100 , hide: true},
    { field: 'date', headerName: 'Date', width: 100, align: 'center', headerAlign: 'center'},
    { field: 'litterId', headerName: 'Litter #', width: 100, align: 'center', headerAlign: 'center'},
    { field: 'user', headerName: 'User', width: 100, align: 'center', headerAlign: 'center'},
    { field: 'type', headerName: 'Type', width: 100, align: 'center', headerAlign: 'center'},
    { field: 'tagline', headerName: 'Description', width: 600, align: 'center', headerAlign: 'center'}
];

const adminActionColumns = [
    { field: 'id', headerName: 'id', align: 'center', headerAlign: 'center', width: 100},
    { field: 'date', headerName: 'Date', width: 100, align: 'center', headerAlign: 'center'},
    {field: 'cageId', headerName: 'Cage #', width: 100, align: 'center', headerAlign: 'center'},
    { field: 'litterId', headerName: 'Litter #', width: 100, align: 'center', headerAlign: 'center'},
    { field: 'user', headerName: 'User', width: 100, align: 'center', headerAlign: 'center'},
    { field: 'type', headerName: 'Type', width: 175, align: 'center', headerAlign: 'center'},
    { field: 'tagline', headerName: 'Description', width: 500, align: 'center', headerAlign: 'center'}
];

function convertToShortDate (isoDate) {
    var date = new Date(isoDate);
    var dd = String(date.getDate()).padStart(2, 0);
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    // var hour = String(date.getUTCHours());
    // var minute = String(date.getUTCMinutes());
    // var seconds = String(date.getUTCSeconds());
    date = mm + '/' + dd + '/' + yyyy //+ '\n' + hour + ':' + minute + ':' + seconds;
    return date
}

export {actionColumns, adminActionColumns, convertToShortDate}

