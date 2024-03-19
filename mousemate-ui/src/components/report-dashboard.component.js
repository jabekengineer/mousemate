import * as React from 'react';
import { withRouter } from '../common/with-router';
import { Box, Button, FormControl, FormGroup, FormLabel, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import Title from './title.component';
import CageService from '../services/cage.service';
import { today } from '../common/today';
import ActionService from '../services/action.service';
import { months, years } from '../common/months';

function splitSnapshotRooms(cages){
    // room 441
    const roomOne = cages.filter((cage) => cage.roomId === 441);
    const roomOneStrains = groupBy(roomOne,'strain');

    // room 443
    const roomThree = cages.filter((cage) => cage.roomId === 443);
    const roomThreeStrains = groupBy(roomThree, 'strain');
    // room 228
    const roomEight = cages.filter((cage) => cage.roomId === 228);
    const roomEightStrains = groupBy(roomEight, 'strain');

    return [{441: roomOneStrains}, {443: roomThreeStrains}, {228: roomEightStrains}]
}

function createRowsFromRoom(roomStrainHash) {
    var strainRows = [];
    const roomStrains = roomStrainHash[Object.keys(roomStrainHash)[0]];
    for (const strain in roomStrains){
        let cages = roomStrains[strain];
        let numCages = cages?.length;
        let numMice = sumProp(filterProp(cages,'status','Adult'),'count');
        let numBreeders = (filterProp(cages, 'status', "Breeder"))?.length;
        let numMales = sumProp((filterProp(cages, 'gender', 'M')) ?? [], 'count');
        let numFemales = sumProp((filterProp((filterProp(cages, 'gender', 'F')), 'status', 'Adult')) ?? [] , 'count'); //but not status breeder
        strainRows.push({
            strain: strain,
            numCages: numCages,
            numMice: numMice,
            numBreeders: numBreeders,
            numMales: numMales,
            numFemales: numFemales
        });
    }
    return (strainRows.sort((a,b) => a.strain.localeCompare(b.strain)));
}

function totalsFromRows(strainRows) {
    const totals = {
        strain: "Total",
        numCages: sumProp(strainRows, 'numCages'),
        numMice: sumProp(strainRows, 'numMice'),
        numBreeders: sumProp(strainRows, 'numBreeders'),
        numMales: sumProp(strainRows, 'numMales'),
        numFemales: sumProp(strainRows, 'numFemales')
    }
    return [totals]
}

function groupBy(xs, prop) {
    var grouped = {};
    for (var i=0; i<xs.length; i++) {
        var p = xs[i][prop];
        if (!grouped[p]) { grouped[p] = []; }
        grouped[p].push(xs[i]);
    }
    return grouped;
}

function sumProp(items, prop) {
    return items?.reduce(function(a,b){
        return a + b[prop]
    },0);
};

function filterProp(items, prop, condition) {
    return items?.filter((item) => item[prop] === condition);
}

function filterCagesLivingInRange(cages, startDate, endDate) {
    var _start = new Date(startDate + 'T04:00:00');
    var _end = new Date(endDate + 'T04:00:00');
    var filteredCages = cages.filter((cage) => {
        return cage.mice?.filter((mouse) => {
            return (
                ((_start <= (new Date(mouse.dob))) && ((new Date(mouse.dob)) <= _end)) || 
                ((_start <= (new Date(mouse.dod))) && ((new Date(mouse.dod) <= _end) && mouse.dod !== null)) || 
                (((new Date(mouse.dob)) <= _start) && (mouse.dod === null))
            )
        }).length > 0
    })
    return filteredCages
}

function createRowsFromMonthActions(monthActionHash,dateCages){
    var monthRows = [];
    for (const actionMonth in monthActionHash){
        let monthActions = monthActionHash[actionMonth];
        let month = months[actionMonth];
        let ordered = tallyOrderedMice(monthActions, dateCages);
        let weaned = tallyWeanedMice(monthActions, dateCages);
        let donated = tallyDonatedMice(monthActions, dateCages);
        let culledRoomThree = tallyCulledMiceByRoom(monthActions, dateCages, 443);
        let culledRoomOne = tallyCulledMiceByRoom(monthActions, dateCages, 441);
        let culledRoomEight = tallyCulledMiceByRoom(monthActions, dateCages, 228);
        let culledTotal = tallyCulledMice(monthActions,dateCages);
        monthRows.push({
            month: month,
            ordered: ordered,
            weaned: weaned,
            donated: donated,
            culledRoomThree: culledRoomThree,
            culledRoomOne: culledRoomOne,
            culledRoomEight: culledRoomEight,
            culledTotal: culledTotal
        })
    }
    return monthRows
}

function totalsFromUsageRows(monthRows) {
    const totals = {
        month: "Total",
        ordered: sumProp(monthRows,'ordered'),
        weaned: sumProp(monthRows,'weaned'),
        donated: sumProp(monthRows,'donated'),
        culledRoomThree: sumProp(monthRows,'culledRoomThree'),
        culledRoomOne: sumProp(monthRows, 'culledRoomOne'),
        culledRoomEight: sumProp(monthRows,'culledRoomEight'),
        culledTotal: sumProp(monthRows,'culledTotal')
    }
    return [totals]
}

function tallyCulledMice(monthActions,dateCages) {
    let cullActions = monthActions.filter((action) => {
        return ((action.type === "Euthanize" && action.tagline.toUpperCase().indexOf("CULL") !== -1)
        && ((findCageById(dateCages, action.cageId))))
    });
    return cullActions?.length
}

function tallyCulledMiceByRoom(monthActions, dateCages, roomId){
    let cullActions = monthActions.filter((action) => {
        return (
            (action.type === "Euthanize" && action.tagline.toUpperCase().indexOf("CULL") !== -1)
            && ((findCageById(dateCages, action.cageId))?.roomId === roomId)
        )
    });
    return cullActions?.length
}

function tallyDonatedMice(actions, dateCages) {
    let donateActions = actions.filter((action) => {
        return (
            (action.type === "Euthanize" && action.tagline.toUpperCase().indexOf("DONATE") !== -1)
            && ((findCageById(dateCages, action.cageId)))
        )
    })
    return donateActions?.length
}

function filterActionsByDateRange(actions, year, startMonth, endMonth) {
    var filteredActions = actions.filter((action) => {
        var actionDate = new Date(action.createdAt);
            return (
                (actionDate.getFullYear() === year) &&
                (actionDate.getMonth() >= startMonth) &&
                (actionDate.getMonth() <= endMonth)
            )
    })
    return filteredActions
}

function groupActionsByMonth(actions) {
    var monthActionHash = actions.reduce((total, action) => {
        const month = (new Date(action.createdAt)).getMonth();
        if(!total[month]){
            total[month] = []
        }
        total[month].push(action)
        return total
    }, {});
    return monthActionHash
}

function tallyOrderedMice(monthActions,dateCages) {
    let adminActions = monthActions.filter((action) => {
        return ((action.type === "Cage Created" && action.tagline.toUpperCase().indexOf("ADMIN") !== -1) && ((findCageById(dateCages, action.cageId))))
    });
    var mouseCount = 0;
    adminActions?.forEach((action) => {
        let cage = findCageById(dateCages, action.cageId);
        if(cage){
            mouseCount += cage.mice?.length
        }
    })
    return mouseCount
}

function findCageById(cages, cageId) {
    return (cages.find(cage => cage.id === cageId))
}

function tallyWeanedMice(monthActions,dateCages) {
    let weanActions = monthActions.filter((action) => {
        return ((action.type === "Wean" && action.tagline.toUpperCase().indexOf("WEANED") !== -1) && ((findCageById(dateCages, action.cageId))))
    })
    var mouseCount = 0;
    weanActions.forEach((action) => {
        mouseCount+= mouseCountFromWeanEvent(action.tagline)
    })
    return mouseCount
}

function mouseCountFromWeanEvent (actionDescription) {
    let split = actionDescription.split(".");
    if(split?.length >= 2) {
        let count = split[1];
        count = count.replace(/\D/g,'');
        return parseInt(count)
    }
    return 0
}


function ReportDashboard (props) {
    const [view, setView] = React.useState("snapshot");

    // snapshot
    const [cages, setCages] = React.useState([]);

    React.useEffect(() => {
        CageService.getEmptyOrNot(false,false)
        .then((response) => {
            setCages(response.data)
        })
        .catch((err) => {
            console.log(err.message)
        })
    },[props.reload]);

    const rooms = splitSnapshotRooms(cages);

    // date Range
    const [startDate, setStartDate] = React.useState(today);
    const [endDate, setEndDate] = React.useState(today);
    const [dateCages, setDateCages] = React.useState([]);
    React.useEffect(() => {
        CageService.getEmptyOrNot(true,false)
        .then((response) => {
            setDateCages(response.data)
        })
        .catch((err) => {
            console.log(err.message)
        })
    },[props.reload])
    
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    }

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    }

    const dateRooms = splitSnapshotRooms(filterCagesLivingInRange(dateCages, startDate, endDate));

    // animal use
    const [usageYear, setUsageYear] = React.useState((new Date()).getFullYear());
    const [usageStartMonth, setUsageStartMonth] = React.useState(0);
    const [usageEndMonth, setUsageEndMonth] = React.useState(11);
    const [actions, setActions] = React.useState([]);

    const handleUsageStartSelection = (event) => {
        setUsageStartMonth(parseInt(event.target.value));
    }

    const handleUsageEndSelection = (event) => {
        setUsageEndMonth(parseInt(event.target.value));
    }

    const handleUsageYearSelection = (event) => {
        setUsageYear(parseInt(event.target.value));
    }

    React.useEffect(() => {
        ActionService.getAllActions()
        .then((response) => {
            setActions(response.data)
        })
        .catch((err) => {
            console.log(err.message)
        })
    },[props.reload]);

    const monthlyActions = groupActionsByMonth(filterActionsByDateRange(actions, usageYear, usageStartMonth, usageEndMonth));
    const usageRows = createRowsFromMonthActions(monthlyActions, dateCages);

    return (
        <>
        <Grid item xs={12} md={12} lg={12}>
            <Box
            sx={{
                display:'flex',
                width:'full',
                justifyContent: 'space-between'
            }}>
                <Title>Census</Title>
                <Box
                sx={{
                    display: 'flex',
                    p:1,
                    minHeight: 56,
                    alignItems: 'center',
                    gap: 2
                }}>
                    {
                     view === "range" && (
                        <>
                        <FormGroup>
                            <FormControl>
                                <Box sx={{display:'flex'}}>
                                <Box sx={{display:'flex', alignItems: 'center', columnGap: 1}}>
                                <FormLabel>Start Date</FormLabel>
                                <TextField type='date' size='small' defaultValue={today} onChange={handleStartDateChange} sx={{mr: 2}}/>
                                </Box>
                                <Box sx={{display:'flex', alignItems: 'center', columnGap: 1}}>
                                <FormLabel>End Date</FormLabel>
                                <TextField type='date' size='small' defaultValue={today} onChange={handleEndDateChange}/>
                                </Box>
                                </Box>
                            </FormControl>
                        </FormGroup>
                        </>
                     )   
                    }
                    {
                        view === "usage" && (
                            <>
                            
                                <Box sx={{display:'flex'}}>
                                <Box sx={{display:'flex', alignItems: 'center', columnGap: 1}}>
                                <FormLabel>Year</FormLabel>
                                <Select
                                size='small'
                                defaultValue={years[0]}
                                value={usageYear} 
                                onChange={handleUsageYearSelection} sx={{mr: 2}}>
                                    {years.map((year, index) => (
                                            <MenuItem key={index} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                                </Box>
                                <Box sx={{display:'flex', alignItems: 'center', columnGap: 1}}>
                                <FormLabel>Start Month</FormLabel>
                                <Select
                                size='small'
                                defaultValue={months[0]}
                                value={usageStartMonth} 
                                onChange={handleUsageStartSelection} sx={{mr: 2}}>
                                    {Object.keys(months).map((monthNumber, index) => (
                                            <MenuItem key={index} value={monthNumber}>{months[monthNumber]}</MenuItem>
                                    ))}
                                </Select>
                                </Box>
                                <Box sx={{display:'flex', alignItems: 'center', columnGap: 1}}>
                                <FormLabel>End Month</FormLabel>
                                <Select 
                                size='small'
                                defaultValue={months[12]}
                                value={usageEndMonth} 
                                onChange={handleUsageEndSelection} sx={{mr: 2}}>
                                    {Object.keys(months).map((monthNumber, index) => (
                                            <MenuItem key={index} value={monthNumber}>{months[monthNumber]}</MenuItem>
                                    ))}
                                </Select>
                                </Box>
                                </Box>
                           
                            </>
                        )
                    }
                    <Button variant={view === "snapshot" ? "contained" : "outlined"} size='small' 
                        sx={{borderRadius: 4}} onClick={() => setView("snapshot")}>Snapshot</Button>
                    <Button variant={view === "range" ? "contained" : "outlined"} size='small' 
                        sx={{borderRadius: 4}} onClick={() => setView("range")}>Date Range</Button>
                        <Button variant={view === "usage" ? "contained" : "outlined"} size='small' 
                        sx={{borderRadius: 4}} onClick={() => setView("usage")}>Animal Use</Button>
                </Box>
            </Box>
            
            <Paper
                sx={{
                    display: 'flex',
                    minHeight: '40vh',
                    flexDirection: 'column',
                    p:2,
                    rowGap: 2
                }}>
                    {
                        view === "snapshot" && rooms.map((room, index) => (
                            (
                                <div key={index}>
                                <Title>{Object.keys(room)[0]}</Title>
                                <Table sx={{ minWidth: 'full'}} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Strain</b></TableCell>
                                            <TableCell><b># Breeder Cages</b></TableCell>
                                            <TableCell><b># Male Mice</b></TableCell>
                                            <TableCell><b># Female Mice</b></TableCell>
                                            <TableCell><b># All Cages</b></TableCell>
                                            <TableCell><b># Nonbreeder Mice</b></TableCell> 
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {(createRowsFromRoom(room)).map((row,index) => (
                                        <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
                                            <TableCell>{row.strain}</TableCell>
                                            <TableCell>{row.numBreeders}</TableCell>
                                            <TableCell>{row.numMales}</TableCell>
                                            <TableCell>{row.numFemales}</TableCell>
                                            <TableCell>{row.numCages}</TableCell>
                                            <TableCell>{row.numMice}</TableCell>
                                        </TableRow>
                                    ))}
                                    {
                                        (totalsFromRows(createRowsFromRoom(room))).map((totals, index) => (
                                            <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border:0 } }}>
                                                <TableCell><b>{totals.strain}</b></TableCell>
                                                <TableCell><b>{totals.numBreeders}</b></TableCell>
                                                <TableCell><b>{totals.numMales}</b></TableCell>
                                                <TableCell><b>{totals.numFemales}</b></TableCell>
                                                <TableCell><b>{totals.numCages}{Object.keys(room).indexOf('228') === -1 ? "/100" : ""}</b></TableCell>
                                                <TableCell><b>{totals.numMice}</b></TableCell>
                                        </TableRow>
                                        ))
                                    }
                                    </TableBody>
                                </Table>        
                                </div>
                            )
                        )) 
                    }
                    {
                        view === "range" && dateRooms.map((room, index) => (
                            (
                                <div key={index}>
                                <Title>{Object.keys(room)[0]}</Title>
                                <Table sx={{ minWidth: 'full'}} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell><b>Strain</b></TableCell>
                                            <TableCell><b># Breeder Cages</b></TableCell>
                                            <TableCell><b># Male Mice</b></TableCell>
                                            <TableCell><b># Female Mice</b></TableCell>
                                            <TableCell><b># All Cages</b></TableCell>
                                            <TableCell><b># Nonbreeder Mice</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {(createRowsFromRoom(room)).map((row,index) => (
                                        <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
                                            <TableCell>{row.strain}</TableCell>
                                            <TableCell>{row.numBreeders}</TableCell>
                                            <TableCell>{row.numMales}</TableCell>
                                            <TableCell>{row.numFemales}</TableCell>
                                            <TableCell>{row.numCages}</TableCell>
                                            <TableCell>{row.numMice}</TableCell>
                                        </TableRow>
                                    ))}
                                    {
                                        (totalsFromRows(createRowsFromRoom(room))).map((totals, index) => (
                                            <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border:0 } }}>
                                                <TableCell><b>{totals.strain}</b></TableCell>
                                                <TableCell><b>{totals.numBreeders}</b></TableCell>
                                                <TableCell><b>{totals.numMales}</b></TableCell>
                                                <TableCell><b>{totals.numFemales}</b></TableCell>
                                                <TableCell><b>{totals.numCages}{Object.keys(room).indexOf('228') === -1 ? "/100" : ""}</b></TableCell>
                                                <TableCell><b>{totals.numMice}</b></TableCell>
                                        </TableRow>
                                        ))
                                    }
                                    </TableBody>
                                </Table>        
                                </div>
                            )
                        )) 
                    }
                    {
                        view === "usage" && (
                            <Table sx={{ minWidth: 'full'}} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Strain</b></TableCell>
                                    <TableCell><b>Ordered</b></TableCell>
                                    <TableCell><b>Weaned</b></TableCell>
                                    <TableCell><b>Donated</b></TableCell>
                                    <TableCell><b>Culled 443</b></TableCell>
                                    <TableCell><b>Culled 441</b></TableCell>
                                    <TableCell><b>Culled 228</b></TableCell>
                                    <TableCell><b>Culled Total</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {usageRows.map((row,index) => (
                                <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
                                    <TableCell>{row.month}</TableCell>
                                    <TableCell>{row.ordered}</TableCell>
                                    <TableCell>{row.weaned}</TableCell>
                                    <TableCell>{row.donated}</TableCell>
                                    <TableCell>{row.culledRoomThree}</TableCell>
                                    <TableCell>{row.culledRoomOne}</TableCell>
                                    <TableCell>{row.culledRoomEight}</TableCell>
                                    <TableCell>{row.culledTotal}</TableCell>
                                </TableRow>
                            ))}
                            {
                                (totalsFromUsageRows(usageRows)).map((totals, index) => (
                                    <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border:0 } }}>
                                        <TableCell><b>{totals.month}</b></TableCell>
                                        <TableCell><b>{totals.ordered}</b></TableCell>
                                        <TableCell><b>{totals.weaned}</b></TableCell>
                                        <TableCell><b>{totals.donated}</b></TableCell>
                                        <TableCell><b>{totals.culledRoomThree}</b></TableCell>
                                        <TableCell><b>{totals.culledRoomOne}</b></TableCell>
                                        <TableCell><b>{totals.culledRoomEight}</b></TableCell>
                                        <TableCell><b>{totals.culledTotal}</b></TableCell>
                                </TableRow>
                                ))
                            }
                            </TableBody>
                        </Table>         
                        )
                    }
            </Paper>
        </Grid>
        </>
    )
}

export default withRouter(ReportDashboard);
