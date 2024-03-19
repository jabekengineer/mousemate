import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { withRouter } from '../common/with-router';
import { Box, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';

function TODO (props) {
    return(
        <>
        <Grid item xs={12} md={12} lg={12}>
            <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '50vh',
            }}
            >
                <Box 
                sx={{
                    display:'flex',
                    flexDirection: 'row',
                    gap: 10,
                    mt: '20vh'
                }}>
                    <CircularProgress sx={{color: "text.secondary"}}/>
                <Typography variant='h4' textAlign={'center'} color="text.primary">
                    {props.name} coming soon
                </Typography>
                </Box>
            </Paper>
        </Grid>
        </>
    )
}

export default withRouter(TODO)