import * as React from 'react';
import { withRouter } from '../common/with-router';
import { Box, Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, MenuItem, Select } from '@mui/material';
import { claims } from '../common/claims';


function Claim(props) {
    const title = 'Claim ' + (props.mice.length) + (props.mice.length === 1 ? " mouse" : " mice") + " in cage " + (props.cage.id);
    const [reason, setReason] = React.useState(claims[0]);
    const [showGenotypeTaskOption, setShowGenotypeTaskOption] = React.useState(false);
    const [issueGenotypeTask, setIssueGenotypeTask] = React.useState(false);
    const handleReasonSelection = (event) => {
        setReason(event.target.value);
        if(event.target.value === "Experiment"){
            setShowGenotypeTaskOption(true);
        }
        if(event.target.value !== "Experiment"){
            setShowGenotypeTaskOption(false);
        }
    }
    
    const claimedMiceInCage = props.cage?.mice.filter((mouse) => {
        return ( mouse.claim !== null )
    })

    const allClaimedMiceSelected = ((claimedMiceInCage.filter((mouse) => props.mice?.indexOf(mouse.id) === -1)).length === 0);

    const handleSubmit = () => {
        let claim = {
            'mice': props.mice,
            'reason': reason === "Remove" ? null : reason,
            'user': ( reason === "Remove" && allClaimedMiceSelected) ? null : props.user,
            'genotyping': issueGenotypeTask
        };
        props.onSubmit(claim);
        props.onClose();
    }

    return (
        <>
        <DialogTitle alignSelf={'center'}>{title}</DialogTitle>
        <DialogContent>
          <Box
          sx={{
            display: 'flex',
            p:2,
            columnGap: 2,
            alignItems: 'center',
            justifyContent: 'space-between'
            }}>
                <FormControl sx={{width:215}} required>
                    <FormLabel>Claim Type</FormLabel>
                    <Select
                    value={reason}
                    onChange={handleReasonSelection}>
                        {claims && claims.map((claim, index) => (
                            <MenuItem key={index} value={claim}>
                                {claim}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    {
                        showGenotypeTaskOption && (
                            <>
                            <FormControl sx={{width:215, pt: 2}}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox 
                                        checked={issueGenotypeTask} 
                                        onClick={() => {setIssueGenotypeTask(!issueGenotypeTask)}} 
                                        />}
                                        label="Request genotyping"
                                    />
                                </FormGroup>
                            </FormControl>
                            </>
                        )
                    }
                    
                </Box>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
        </>
    )
}
export default withRouter(Claim)