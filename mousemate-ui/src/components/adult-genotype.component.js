import * as  React from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Typography, Box, FormControl, Select, MenuItem, Divider, FormLabel } from '@mui/material';
import {genotypeStrains} from '../common/strains';
import {notches} from '../common/notches';
import { withRouter } from '../common/with-router';

function Genotype(props){
  
  const [substrain, setSubstrain] = React.useState('');
  const [notchOne, setNotchOne] = React.useState('');
  const [notchTwo, setNotchTwo] = React.useState('');

  const handleStrainSelection = (event) => {
    setSubstrain(event.target.value);
  };

  const handleNotchOneSelection = (event) => {
    setNotchOne(event.target.value);
  };
  const handleNotchTwoSelection = (event) => {
    setNotchTwo(event.target.value);
  }

  const substrainOptions = React.useMemo(() => {
    if(Object.keys(genotypeStrains).indexOf(props.cage.strain) === -1){
      return null
    }
    const options = genotypeStrains[props.cage.strain];
    if(options.indexOf("Remove") === -1){
      options.push("Remove")
    }
    return options
  },[props.cage])

  const handleSubmit = () => {
    if(substrain !== "Remove" && (substrain === '' || notchOne === '')){
      alert("genotype strain and notch one number can't be empty");
    }
    else {
      let genotype = {
        mouse: props.mice,
        genotype: substrain === "Remove" ? null : substrain,
        notchOne: ( notchOne === '' || substrain === "Remove" ) ? 0 : notchOne,
        notchTwo: ( notchTwo === '' || substrain === "Remove") ? 0 : notchTwo
      };
      props.onSubmit(genotype);
      props.onClose();
    }
  }
  const noGenotypingTitle = 'Genotyping not enabled for ' + props.cage?.strain + ' mice.';
  const title = 'Genotyping ' + props.mice?.length + " " + props.cage?.strain + (props.mice?.length > 1 ? " mice." : " mouse.");
  return(
      <>
      <DialogTitle alignSelf={"center"}>{substrainOptions === null ? noGenotypingTitle : title}</DialogTitle>
      {
        substrainOptions !== null && (
          <>
        <DialogContent>
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            columnGap: 2
          }}>
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
              <Typography variant='h6'>Genotype</Typography>
              <FormControl
              sx={{
                width: '150px',
                mt: 5
              }}>
                <Select
                value={substrain}
                onChange={handleStrainSelection}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  }
                }}
                >
                  {
                    substrainOptions && substrainOptions?.map((_substrain, index) => (
                      <MenuItem key={index} value={_substrain}>
                        {_substrain}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Box>
            <Divider orientation='vertical' flexItem/>
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
              <Typography variant='h6'>Notch #</Typography>
              <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                p:2,
                columnGap: 2
              }}>
                  <FormControl
              sx={{
                width: '75px'
              }}>
                <FormLabel sx={{p:0}}>Notch 1</FormLabel>
                <Select
                value={notchOne}
                onChange={handleNotchOneSelection}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  }
                }}
                >
                  {
                    notches && notches?.map((notch, index) => (
                      <MenuItem key={index} value={notch}>
                        {notch}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <Typography variant='h3' sx={{mt:2.5}} color='gray'>/</Typography>
              <FormControl
              sx={{
                width: '75px'
              }}>
                <FormLabel sx={{p:0}}>Notch 2</FormLabel>
                <Select
                value={notchTwo}
                onChange={handleNotchTwoSelection}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  }
                }}
                >
                  {
                    notches && notches?.map((notch, index) => (
                      <MenuItem key={index} value={notch} disabled = {notch === notchOne}>
                        {notch}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              </Box>
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
      </>
  )
}
export default withRouter(Genotype)
