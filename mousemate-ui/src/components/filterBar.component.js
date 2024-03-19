import * as React from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

export default function FilterBar() {
    // back end replacement
    const strains = ['all','cntnap', 'gtrosa', 'scnn1a-cre', 'WT', 'pv-sst'];
    const [strain, setStrain] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event) => {
        setStrain(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return(
        <React.Fragment>
            <div id="cage-search-box">
            <Box marginLeft={10} 
            sx={{ maxWidth: 200, minWidth: 125}}>
            <Typography variant='h5' paddingBottom={1}>
                Cage </Typography>
                {/* gives context for input elements */}
                <FormControl fullWidth >
                <TextField
                label="enter number"
                type='number'/>
                </FormControl>
            </Box>
            </div>

            <div id="strain-select">
                <Box marginRight={10}
                sx={{maxWidth: 375, minWidth: 225}}>
                    <Typography variant='h5' paddingBottom={1}>
                        Strain
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>enter strain</InputLabel>
                        <Select
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={strain}
                        onChange={handleChange}
                        >
                            {strains && strains.map((strain,index) => (
                                <MenuItem value={strain} key={index}>{strain}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </div>

        </React.Fragment>
    )
}