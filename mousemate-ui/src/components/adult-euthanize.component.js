import * as  React from 'react';
import { Button, TextField, DialogActions, DialogContent, DialogTitle, 
  FormControl, FormLabel, Box, InputLabel, Select, MenuItem, 
  FormControlLabel, FormGroup, Checkbox } from '@mui/material';
import { withRouter } from '../common/with-router';
import { today } from '../common/today';
import { reasons } from '../common/euthReasons';
import { convertDateToSlash } from '../common/validateEvents';

function Euthanize(props){
  const [reason, setReason] = React.useState(reasons[0]);
  const [reasonDescription, setReasonDescription] = React.useState('');
  const [note, setNote] = React.useState('');
  const [appendNote, setAppendNote] = React.useState(false);
  const [euthDate, setEuthDate] = React.useState(new Date(today + "T04:00:00"));
  const title = 'Euthanize ' + (props.mice.length) + (props.mice.length === 1 ? " mouse" : " mice") + " in cage " + (props.cage.id);
  
  const handleDateSelection = (event) => {
    let _date = event.target.value;
    _date = new Date(_date + "T04:00:00");
    setEuthDate(_date);
  };
  const handleReasonSelection = (event) => {
    setReason(event.target.value);
  };

  const handleReasonDescription = (event) => {
    setReasonDescription(event.target.value);
    if(reason === "Other"){
      setAppendNote(true);
    }
  };

  React.useEffect(() => {
    if(appendNote){
      let _note = ' ' + convertDateToSlash(euthDate) + " - " + props.mice.length + (props.mice.length > 1 ? ' mice ' : ' mouse ') + 'euthanized: ';
      _note = _note + ( reason === "Other" && reasonDescription ? reasonDescription : reason ) + '. ';
      setNote(_note);
    }
    if(!appendNote){
        setNote('');
    }
  },[reason, reasonDescription, appendNote])


  const handleSubmit = () => {
    let euth = {
      'mice': props.mice,
      'date': euthDate,
      'reason': reason,
      'description': reasonDescription,
      'note': note
    };
    props.onSubmit(euth);
    props.onClose();
  }  
  return(
      <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
      <Box  
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            rowGap: 2,
        }}>
            <div id='date'>
                <FormControl sx={{width: 215}}>
                    <FormLabel>Enter Date </FormLabel>
                    <TextField type='date' defaultValue={today} onChange={handleDateSelection}></TextField>
                </FormControl>
            </div>
            <div id='reason'>
            <FormControl sx={{width: 215}} required>
                <InputLabel>Reason</InputLabel>
                <Select
                value={reason}
                onChange={handleReasonSelection}
                >
                    {reasons && reasons.map((_reason,index) => (
                        <MenuItem key={index} value={_reason}>
                            {_reason}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            </div>
            <div>
              {
                reason === "Other" && 
                <>
                  <FormControl sx={{width:215}}>
                    <TextField label='Euthansia description' value={reasonDescription} onChange={handleReasonDescription}/>
                  </FormControl>
                </>
              }
            </div>
            <div id='finished-checkbox'>
            <FormControl >
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={appendNote} onClick={() => {setAppendNote(!appendNote)}} />} label="Add reason to cage notes?"/>
            </FormGroup>
            </FormControl>
        </div>
      </Box>



      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
      </>
  )
}
export default withRouter(Euthanize)
