import * as  React from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Typography, Box, FormControl, Select, MenuItem, Divider} from '@mui/material';
import { withRouter } from '../common/with-router';
import CageService from '../services/cage.service';
import { experimentRooms} from '../common/rooms';
import MouseService from '../services/mouse.service';
import ageFromDate from '../common/ageFromDate';

function parseLitterOption(row) {
  if(!row){
    return null;
  };
  let _colonSub = String(row).split(':')[0];
  _colonSub = String(_colonSub).split('|')[1];
  let litterId = _colonSub.replace(/\D/g,'');
  return litterId
}

function parseLitterCage(row) {
  if(!row){
    return null;
  };
  let _colonSub = String(row).split(':')[0];
  _colonSub = String(_colonSub).split('|')[0];
  let cageId = _colonSub.replace(/\D/g,'');
  return cageId
}

function CrossFoster(props){
const [strain, setStrain] = React.useState(null);
const [litterOptions, setLitterOptions] = React.useState([]);
const [cage, setCage] = React.useState('');
const [toLitter, setToLitter] = React.useState(null);
const [toCage, setToCage] = React.useState(null);
const [roomId, setRoomId] = React.useState(null);

React.useEffect(() => {
  // get the available cage options matching strain, gender, and with mousecount > 0
  MouseService.getUnfinishedLitters(props.litterId)
  .then((response) => {
    let litters = response.data;
    if(!litters){
      setLitterOptions([]);
    }
    litters.forEach((litter) => {
      // pup count age strain
      if(litter.parentCageId){
        CageService.get(litter.parentCageId)
        .then((response) => {
          let parentStrain = response.data.strain;
          let _row = "Cage " + litter.parentCageId + " | Litter id #" + litter.id + " : qty. " + litter.pupCount +  " " + ageFromDate(litter.dob) + "-day-old " + parentStrain + (litter.count === 1 ? ' pup.' : ' pups.');
          if(!litterOptions.includes(_row)){
            setLitterOptions(current => [...current, _row])
          }
        })
      }
    });
  })
  .catch((err) => {
    console.log({
      message: err.message
    })
  })

}, []);

React.useEffect(() => {
  setStrain(props.strain);
  setRoomId(experimentRooms[0]);
},[]);

const title = 'Cross foster ' + (props.pupCount) + (props.pupCount === 1 ? " pup" : " pups") + " from cage " + (props.cageId);

const handleCageSelection = (event) => {
  
  // parse cage option string for litter number
  setToLitter(parseLitterOption(event.target.value));

  // parse cage option string for to cage id
  setToCage(parseLitterCage(event.target.value));    
  // set the form cage value regardless
  setCage(event.target.value);
};  

const handleSubmit = () => {
  if(litterOptions.length > 0) {
    let newTransfer = {
      litterId: toLitter,
      fromLitterId: props.litterId,
      cfPupCount: props.pupCount,
      fromCageId: props.cageId,
      toCageId: toCage
    };
    props.onSubmit(newTransfer);
    props.drop();
    props.onClose();
  }
  if(!toLitter) {
    alert('Litter option not selected.');
  }
}

return(
    <>
    <DialogTitle textAlign={"center"}>{title}</DialogTitle>
    <DialogContent>
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          p:2
        }}>
          <Typography variant='h5'>
              Strain
          </Typography>
            <Typography variant='h7'>
              {strain}
            </Typography>
        </Box>
        {/* cage options */}
        <Divider orientation='vertical' flexItem/>
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          pl: 2,
          pt: 1
        }}>
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            mb: 1
          }}>
            <Typography variant='h5'>
                Cage
            </Typography>
          </Box>
          {
            litterOptions && 
            <>
            <FormControl 
            sx={{
              width: '175px',
            }}>
              <Select
              value={cage}
              onChange={handleCageSelection}
              defaultOpen={true}
              MenuProps={{
                anchorOrigin: {
                  vertical: "center",
                  horizontal: "right"
                },
                transformOrigin: {
                  vertical: "bottom",
                  horizontal: "left"
                },
              }}
              >
                {
                  litterOptions.length > 0 && litterOptions.map((_litter, index) => (
                    <MenuItem key={_litter.id} value={_litter}>
                      {_litter}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            </>
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
export default withRouter(CrossFoster)
