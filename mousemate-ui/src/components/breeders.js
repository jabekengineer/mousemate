import * as React from 'react';
import { Box, Divider, TextField, Typography } from '@mui/material';
import { withRouter } from '../common/with-router';
import { convertToShortDate } from '../common/actions';
import ageFromDate from '../common/ageFromDate';


// being added to box with row flex
function Breeders (props) {
    // Adult cages override router param cage number with their parent cage 
    const [breeders, setBreeders] = React.useState([]);
    const [cage, setCage] = React.useState({});
    React.useEffect(() => {

        setBreeders(props.cage.mice)

        // if(props.cage.status !== 'Inactive'){
        //     setBreeders(
        //         props.cage.mice.filter((breeder) => {
        //             return breeder.status !== 'Inactive'
        //         })
        //     );
        // }
    },[props.cage])

    React.useEffect(() => {
        setCage(props.cage);
    },[props.cage, props.reload])
    

    return (
        <>
         <Box sx={{
            display: 'flex',
            flexDirection: 'column',
         }}>
        {breeders && breeders.map((mouse, index) => (
            <div key={index}>
            <Typography variant='h4' color={mouse.status === "Inactive" ? "lightgray" : "inherit"} sx={{mt: .25}}>
                {mouse.strain} ({mouse.gender})
            </Typography>
            <Typography color={mouse.status === "Inactive" ? "lightgray" : "inherit"} sx={{mt: .25}}>
                {
                    mouse.status === "Inactive" ? 
                    (
                        <>
                            <b>Retired:</b> {mouse.dod} &nbsp; <b>ID:</b> {mouse.id} &nbsp; <b>Age:</b> {ageFromDate(mouse.dob)} &nbsp; <b>Gen #</b> {mouse.generation ? ( mouse.generation) : ""}
                        </>
                    ) : (
                        <>
                            <b>ID:</b> {mouse.id} &nbsp; <b>Age:</b> {ageFromDate(mouse.dob)} &nbsp; <b>DOB:</b> {mouse.dob} &nbsp; <b>Gen #</b> {mouse.generation ? ( mouse.generation) : ""}    
                        </>
                    )
                }
            </Typography>
            </div>
                
        ))}
        {
            cage.breederPairDate  && 
            <>
                <Typography variant='h6' sx={{mt: .75, mb: 1}}>
                    <b>Pair Date:</b> {convertToShortDate(cage.breederPairDate)}
                </Typography>
            </>
        }

        {
            !cage.breederPairDate &&
            <br/>
        }
        <Divider/>
        <TextField fullWidth multiline size='small' label={cage.notes?.length > 1 ? "" : "cage notes"} defaultValue={cage.notes} onChange={props.updateNote} sx={{mt: 1}}>
            {cage.notes}
        </TextField>
        </Box>
        </>
    )
}

export default withRouter(Breeders)