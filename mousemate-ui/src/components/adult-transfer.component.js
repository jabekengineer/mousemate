import * as  React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Box, FormControl, InputLabel, Select, MenuItem, Divider, FormControlLabel, FormGroup, Checkbox } from '@mui/material';
import { withRouter } from '../common/with-router';
import EditIcon from '@mui/icons-material/Edit';
import CageService from '../services/cage.service';
import { strains } from '../common/strains';
import { adultGenders } from '../common/genders';
import { breederRooms} from '../common/rooms';

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

function Transfer(props){
  const [strain, setStrain] = React.useState(null);
  const [editStrain, setEditStrain] = React.useState(false);
  const [gender, setGender] = React.useState(null);
  const [editGender, setEditGender] = React.useState(false);
  const [cageOptions, setCageOptions] = React.useState([]);
  const [cage, setCage] = React.useState('');
  const [toCage, setToCage] = React.useState(props.nextCage);
  const [showNewCage, setShowNewCage] = React.useState(false);
  const [roomId, setRoomId] = React.useState(props.roomId);
  const [showOptions, setShowOptions] = React.useState(false);
  const [showRoomChange, setShowRoomChange] = React.useState(false);

  React.useEffect(() => {
    // get the available cage options matching strain, gender, and with mousecount > 0
    CageService.getTransferCages(gender, strain, props.cage.id, false)
    .then((response) => {
      if(response.data){
        setCageOptions(createCageList(response.data));
        setShowOptions(true);
      }
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
  },[]);

  const title = 'Transfer ' + (props.mice.length) + (props.mice.length === 1 ? " mouse" : " mice") + " out of cage " + (props.cage.id);
  
  const handleCageSelection = (event) => {
    if(!showNewCage && event.target.value !== ""){
      // parse cage option string for cage number
      setToCage(parseCageOption(event.target.value));
    }
    // set the form cage value regardless
    setCage(event.target.value);
  };
  const handleStrainSelection = (event) => {
    setStrain(event.target.value);
  };
  const handleGenderSelection = (event) => {
    setGender(event.target.value);
  };

  const handleNewCageSelection = () => {
    setShowNewCage(!showNewCage);
    setToCage(props.nextCage);
  }

  const handleNewRoomSelection = () => {
    const livingMice = props.cage?.mice?.filter((mouse) => {return mouse.status !== "Inactive"});
    if(props.mice?.length !== livingMice?.length ){ 
      alert("Must select entire cage to change cage room")
    };
    if(props.mice?.length === livingMice?.length && breederRooms?.length !== 0){
      setShowRoomChange(!showRoomChange);
      setToCage(props.cage.id);
    }
  }

  const handleRoomSelection = (event) => {
    setRoomId(event.target.value);
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
    if(cageOptions.length > 0 || showNewCage || showRoomChange) {
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
    if(cageOptions.length === 0 && !showNewCage && !showRoomChange) {
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
          alignItems: 'center',
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
            {
              !editStrain && 
              <>
              <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
              >
              <Typography variant='h7'>
                {strain}
              </Typography>
              <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'right',
                    p:0,
                    m:0
                }}
                >
                  <Button variant='text'
                  style={{ backgroundColor: 'transparent' }} 
                  sx={{
                      p:0,
                      m:0,
                      textDecoration: 'underline',
                      color: (theme) => theme.palette.grey[500]
                      }}
                  onClick={() => {
                      setEditStrain(true);
                      }
                  }
                  >
                      <EditIcon sx={{height: 20}}/>
                      <Typography fontSize='14px'
                        sx={{
                          textDecoration: 'underline',
                          color: (theme) => theme.palette.grey[500]}}>
                              Edit
                      </Typography>
                  </Button>   
              </Box>
            </Box>
              </>
            }
            {
              editStrain && 
              <>
              <FormControl 
              sx={{
                width: '150px',
              }}>
                <Select
                value={strain}
                onChange={handleStrainSelection}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  }
                }}
                >
                  {
                    strains && strains.map((_strain, index) => (
                      <MenuItem key={index} value={_strain}>
                        {_strain}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              </>
            }
            <br/>
            <Typography variant='h5'>
                Sex
            </Typography>
            {
              !editGender && 
              <>
              <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
              >
              <Typography variant='h6'>
                {gender}
              </Typography>
              <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'right',
                    p:0,
                    m:0
                }}
                >
                  <Button variant='text'
                  style={{ backgroundColor: 'transparent' }} 
                  sx={{
                      p:0,
                      m:0,
                      textDecoration: 'underline',
                      color: (theme) => theme.palette.grey[500]
                      }}
                  onClick={() => {
                      setEditGender(true);
                      }
                  }
                  >
                      <EditIcon sx={{height: 20}}/>
                      <Typography fontSize='14px'
                        sx={{
                          textDecoration: 'underline',
                          color: (theme) => theme.palette.grey[500]}}>
                              Edit
                      </Typography>
                  </Button>   
              </Box>
            </Box>
              </>
            }
            {
              editGender && 
              <>
              <FormControl 
              sx={{
                width: '150px',
              }}>
                <Select
                value={gender}
                onChange={handleGenderSelection}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  }
                }}
                >
                  {
                    adultGenders && adultGenders.map((_gender, index) => (
                      <MenuItem key={index} value={_gender}>
                        {_gender}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              </>
            }
          </Box>
          {/* cage options */}
          <Divider orientation='vertical' flexItem/>
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            p: 2
          }}>
            <Typography variant='h4'>
                  Cage
              </Typography>
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              mb: 1.5
            }}>
                <FormControl>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={showNewCage} 
                        onClick={handleNewCageSelection}
                        />} 
                        label={<Typography variant="body2" color="textSecondary">New cage?</Typography>}
                        sx={{m:0}} />
                    </FormGroup>
                </FormControl>
                <FormControl>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={showRoomChange} 
                        onClick={handleNewRoomSelection}
                        />} 
                        label={<Typography variant="body2" color="textSecondary">New room?</Typography>}
                        sx={{m:0}} />
                    </FormGroup>
                </FormControl>
            </Box>
            {
              cageOptions && !showNewCage && !showRoomChange &&
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
                    vertical: "top",
                    horizontal: "right"
                  },
                  transformOrigin: {
                    vertical: "top",
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
              showNewCage && !showRoomChange && 
              <>
               <FormControl sx={{width: 150}} required>
                  <InputLabel>Room</InputLabel>
                    <Select
                    value={roomId}
                    onChange={handleRoomSelection}
                    >
                        {breederRooms && breederRooms.map((_num,index) => (
                            <MenuItem key={index} value={_num}>
                                {_num}
                            </MenuItem>
                        ))}
                    </Select>
              </FormControl>
              <br/>
              <Typography variant='body2'>
                  &nbsp;Cage #
              </Typography>
              <Typography variant='h6'>
                &nbsp;{toCage}
              </Typography>
              </>
            }
            {
              showNewCage && showRoomChange && 
              <>
              <Typography variant='body1'>
                Please select only one checkbox.
              </Typography>
              </>
            }
            {
              !showNewCage && showRoomChange && 
              <>
              <FormControl sx={{width: 150}} required>
                  <InputLabel>Change room</InputLabel>
                    <Select
                    value={roomId}
                    onChange={handleRoomSelection}
                    >
                        {breederRooms && breederRooms.map((_num,index) => (
                            <MenuItem key={index} value={_num} disabled={_num === props.roomId}>
                                {_num}
                            </MenuItem>
                        ))}
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
export default withRouter(Transfer)
