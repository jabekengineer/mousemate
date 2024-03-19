import * as  React from 'react';
import { Button, TextField, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { withRouter } from '../common/with-router';

function SaveAdultCage(props){
  const handleSubmit = () => {
    props.onSubmit(props.cage)
  }

  return(
      <>
      <DialogTitle>Review Adult Cage Details</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <pre>{JSON.stringify(props.cage, null, 2)}</pre>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
      </>
  )
}
export default withRouter(SaveAdultCage)
