import * as  React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Box, FormControl, InputLabel, Select, MenuItem, Divider, FormControlLabel, FormGroup, Checkbox } from '@mui/material';
import { withRouter } from '../common/with-router';
import EditIcon from '@mui/icons-material/Edit';
import CageService from '../services/cage.service';
import { strains } from '../common/strains';
import { adultGenders } from '../common/genders';
import { experimentRooms} from '../common/rooms';


function createCageList(cages){
  if(!cages){
    return [];
  }
  var rows = [];
  cages.forEach((cage) => {
    let _row = "Cage " + cage.id + " : " + cage.count + " " + cage.status + " " + cage.gender + " " + cage.strain + (cage.count === 1 ? ' mouse.' : ' mice.');
    rows.push(_row); 
  });
  return rows
};

function parseCageOption(row) {
  if(!row){
    return null;
  };
  let _colonSub = String(row).split(':')[0];
  let cageId = _colonSub.replace(/\D/g,'');
  return cageId
}

function Experiment(props){
const [strain, setStrain] = React.useState(null);
const [gender, setGender] = React.useState(null);
const [cageOptions, setCageOptions] = React.useState([]);
const [cage, setCage] = React.useState('');
const [toCage, setToCage] = React.useState(props.nextCage);
const [showNewCage, setShowNewCage] = React.useState(false);
const [roomId, setRoomId] = React.useState(null);

React.useEffect(() => {
  // get the available cage options matching strain, gender, and with mousecount > 0
  CageService.getTransferCages(gender, strain, props.cage.id, true)
  .then((response) => {
      setCageOptions(createCageList(response.data));
  })
  .catch((err) => {
    console.log({
      message: err.message
    })
  })

}, [strain, gender]);

React.useEffect(() => {
  setStrain(props.cage.strain);
  setGender(props.cage.gender);
  setRoomId(experimentRooms[0]);
},[]);

const title = 'Select ' + (props.mice.length) + (props.mice.length === 1 ? " mouse" : " mice") + " from cage " + (props.cage.id) + " for experiment";

const handleCageSelection = (event) => {
  if(!showNewCage && event.target.value !== ""){
    // parse cage option string for cage number
    setToCage(parseCageOption(event.target.value));
  }
  // set the form cage value regardless
  setCage(event.target.value);
};  

const anyClaimedMice = (cageMice, selectedMice) => {
  const selectedMiceObj = cageMice?.filter((mouse) => {return selectedMice.indexOf(mouse.id) !== -1});
  const anyClaimed = (selectedMiceObj?.some(mouse => mouse.claim !== null));
  return anyClaimed
}

const removeFromCageClaim = (cageMice, selectedMice) => {
  const remainingMice = cageMice?.filter((mouse) => {return selectedMice.indexOf(mouse.id) === -1});
  const remove = (remainingMice?.every(mouse => mouse?.claim === null))
  return remove
}

const handleSubmit = () => {
  if(cageOptions.length > 0 || showNewCage) {
    let newTransfer = {
      strain: strain,
      gender: gender,
      roomId: roomId,
      fromCage: props.cage.id,
      toCage: toCage,
      mice: props.mice,
      litterId: props.cage.litterId,
      claim: anyClaimedMice(props.cage?.mice, props.mice) ? props.cage.claim : null,
      fromClaim: removeFromCageClaim(props.cage?.mice, props.mice) ? null : props.cage.claim
    };
    props.onSubmit(newTransfer);
    props.onClose();
  }
  if(cageOptions.length === 0 && !showNewCage) {
    alert('Existing cage not selected. Did you mean to create a new cage?');
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
          <br/>
          <Typography variant='h5'>
              Sex
          </Typography>
          <Typography variant='h7'>
            {gender}
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
              <FormControl>
                  <FormGroup>
                      <FormControlLabel control={<Checkbox checked={showNewCage} 
                      onClick={() => {setShowNewCage(!showNewCage)}}
                      />} 
                      label={<Typography variant="body2" color="textSecondary">New cage?</Typography>}
                      sx={{m:0}} />
                  </FormGroup>
              </FormControl>
          </Box>
          {
            cageOptions && !showNewCage &&
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
                  cageOptions.length > 0 && cageOptions.map((_cage, index) => (
                    <MenuItem key={index} value={_cage}>
                      {_cage}
                    </MenuItem>
                  ))
                }
                {
                    cageOptions.length === 0 && 
                    <MenuItem value="" onClick={() => {setShowNewCage(true)}}>No cages matching strain or sex found, make new cage.</MenuItem>
                  }
              </Select>
            </FormControl>
            </>
          }
          {
            showNewCage && 
            <>
            <Typography variant='h5'>
              Room
            </Typography>
              {experimentRooms && experimentRooms.map((_num,index) => (
                  <Typography variant='h6' key={index}>
                    {_num}
                  </Typography>
              ))}
            <Typography variant='h5' sx={{mt: 1}}>
                  Cage #
            </Typography>
            <Typography variant='h6'>
                &nbsp;{toCage}
            </Typography>
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
export default withRouter(Experiment)
