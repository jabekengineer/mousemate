import * as  React from 'react';
import { Button, TextField, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { withRouter } from '../common/with-router';

function SaveBreederCage(props){
    const handleSubmit = () => {
        props.onSubmit(props.cage);
    }
    return(
        <>
        <DialogTitle>Review Cage Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <pre>{JSON.stringify(props.cage, null, 2)}</pre>
            {/* <pre>{JSON.stringify(props.cage.female, null, 2)}</pre>
            {props.cage.male && 
            <>
            {JSON.stringify(props.cage.male, null, 2)}
            </>} */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
        </>
    )
}
export default withRouter(SaveBreederCage)
