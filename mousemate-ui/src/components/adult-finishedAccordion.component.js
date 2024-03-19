import * as React from 'react';
import { withRouter } from '../common/with-router';
import { Accordion, AccordionDetails, AccordionSummary, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Title from './title.component';
import { convertToShortDate } from '../common/actions';


function AdultFinishedAccordion(props) {

    function ageBetweenDates(dob, dod){
        let _dob = new Date(dob);
        let _dod = new Date(dod);
        const diffTime = Math.abs(_dod - _dob);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays
    }
    
    function createRows(mice) {
        if(!mice){
            return []
        }
        let rows = [];
        mice.forEach((mouse) => {
            if(mouse.status === 'Inactive') {
                rows.push({
                    id: mouse.id, 
                    age: ageBetweenDates(mouse.dob, mouse.dod),
                    dob: mouse.dob,
                    dod: convertToShortDate(mouse.dod),
                    weanDate: mouse.weanDate,
                    strain: mouse.strain,
                    gender: mouse.gender,
                    notes: mouse.notes
                })
            };
           
        })
        return rows
    }
    
    React.useEffect(() => {
        let _rows = createRows(props.cage.mice);
        setRows(_rows);
    }, [props.cage, props.reload])
    const [rows, setRows] = React.useState([]);
    const headers = ['ID', 'Age', 'DOB', 'DOD', 'Wean Date', 'Strain', 'Sex', 'Notes'];
    const description = (rows.length > 0 ? (rows.length + " retired " + (rows.length == 1 ? "mouse " : "mice ") + "in cage") : ("No retired mice in cage"))
    return (
        <>
        <Accordion disableGutters>
            <AccordionSummary
            sx={{
                '&:hover': {cursor: 'pointer'}, 
                m:'0!important',
            }}
            expandIcon={<ExpandMoreIcon/>}>
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    pr: 2
                }}>
                    <Title>Retired Mice</Title>
                    <Typography sx={{color: 'text.secondary'}}>{description} </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers && headers.map((header, index) => (
                                <TableCell key={index} align="left" style={{maxWidth: 100}}>
                                    <Typography variant='h7'>
                                        <strong>{header}</strong>
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows && rows.map((row, index) => (
                            <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 }}}
                            >
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.age}</TableCell>
                                <TableCell>{row.dob}</TableCell>
                                <TableCell>{row.dod}</TableCell>
                                <TableCell>{row.weanDate}</TableCell>
                                <TableCell>{row.strain}</TableCell>
                                <TableCell>{row.gender}</TableCell>
                                <TableCell>{row.notes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </AccordionDetails>
        </Accordion>
        </>
    )
}

export default withRouter(AdultFinishedAccordion);