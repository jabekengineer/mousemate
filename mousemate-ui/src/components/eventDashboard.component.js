import * as React from 'react';
import { withRouter } from '../common/with-router';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Snackbar, SnackbarContent, TextField, Tooltip, Typography } from '@mui/material';
import Breeders from './breeders';
import BreederHistory from './breeder-history.component';
import Title from './title.component';
import Birth from './breeder-birth.component';
import PupListActions from './breeder-pupActionList.component';
import RetireBreeder from './breeder-retire.component';
import CageLinkButton from './parentLinkButton';
import AdultActionList from './adults-actionList.component';
import Layout from './layout.component';
import ActionHistory from './actionHistory.component';
import { actionColumns, convertToShortDate } from '../common/actions';
import CageService from '../services/cage.service';
import MouseService from '../services/mouse.service';
import { validateBirth, validateTransfer, validateWean } from '../common/validateEvents';
import ActionService from '../services/action.service';
import TaskService from '../services/task.service';
import AdultFinishedAccordionComponent from './adult-finishedAccordion.component';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LaunchIcon from '@mui/icons-material/Launch';
import { today } from '../common/today_mmddyyyy';

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

function sireAndDamId(cage) {
  if(!cage){return []};
  if(!cage.mice){return []};
  if(cage.status !== "Breeder"){return []};
  if(cage.status !== "Breeder"){return []};
  let breeders = {
    'sireId': null,
    'damId': null
  };
  cage.mice.forEach((breeder) => {
    if(breeder.gender === 'F'){
      breeders.damId = breeder.id;
    }
    if(breeder.gender === 'M'){
      breeders.sireId = breeder.id;
    }
  })
  if(breeders.damId && !breeders.sireId){
    // okay to not have sire in cage for uncaught birth.
  }
  if(!(breeders.damId || breeders.sireId)){
    return []
  }
    return breeders
  }

function findCurrentLitter(litters){
  if(!litters){
    return []
  }
  var maxId = 0;
  let currentLitter = [];
  litters.forEach(litter => {
    if(!litter.finished) {
      if(litter.id > maxId){
        maxId = litter.id;
        currentLitter = litter;
      }
    }
  });
  return currentLitter
}

function EventDashboard(props) {
  const params = useParams();
  const [reload, setReload] = React.useState(false);
  // backend look up cage to get type (breeder, adult, experimental)
  const [cage, setCage] = React.useState({});
  const [litters, setLitters] = React.useState([]);
  const [littersCages, setLittersCages] = React.useState({});
  const [currentLitter, setCurrentLitter] = React.useState({});
  const [cfSourceLitter, setCFsourceLitter] = React.useState({});
  const [birth, setBirth] = React.useState({
    'date': null,
    'note': null
  });
  const [wean, setWean] = React.useState({
    'date': null,
    'cage': null,
    'note': null
  });
  const [nextCage, setNextCage] = React.useState(0);
  const [nextLitter, setNextLitter] = React.useState(0);
  const [nextMouse, setNextMouse] = React.useState(0);
  const [pupActionListTitle, setPupActionListTitle] = React.useState('Litters');
  const [cageActions, setCageActions] = React.useState([]);
  const [parentCage, setParentCage] = React.useState({});
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  const handleAddPup = React.useCallback((litterId) => {
    // increment pup count of active litter 
    MouseService.addPup(litterId)
    .then(() => {
      setReload(!reload);
    })
    .catch(err => {
      console.log({
        message: err.message
      })
    })
  },[]);

  const handleAddCfPup = React.useCallback((litterId) => {
    // increment pup count of active litter 
    MouseService.addCfPup(litterId)
    .then(() => {
      setReload(!reload);
    })
    .catch(err => {
      console.log({
        message: err.message
      })
    })
  });

  const handleDropPup = React.useCallback((litterId,body) => {
    // increment pup count of active litter 
    MouseService.dropPup(litterId,body)
    .then(() => {
      setReload(!reload);
    })
    .catch(err => {
      console.log({
        message: err.message
      })
    })
  });

  const handleDropCfPup = React.useCallback((litterId,body) => {
    // increment pup count of active litter 
    MouseService.dropCfPup(litterId,body)
    .then(() => {
      setReload(!reload);
    })
    .catch(err => {
      console.log('trouble adding pup to cage')
    })
  },[])

  // BBIRTH
  const handleBirthSubmit = React.useCallback((newBirth) => {
    setBirth(newBirth);
    let sireAndDam = sireAndDamId(cage);
    let parentCageId = cage.id;
    let validation = validateBirth(newBirth, nextLitter, sireAndDam, findCurrentLitter(litters), parentCageId, cage.mice);
    // validate submission of new birth and approve or reject
    if(validation.passed){
      cage.mice.forEach((breeder)=>{
        if(breeder.gender === 'F'){
        MouseService.addLitter(breeder.id, validation.data)
        .then(() => {
          setReload(!reload)
          let action = {
            user: props.user,
            litterId: (findCurrentLitter(litters)).id ? (findCurrentLitter(litters)).id : (litters.length + 1),
            type: 'Birth',
            tagline: 'Litter #' + (litters.length + 1) + " born." 
          };
          ActionService.addAction(cage.id, action);
          setSnackMessage(action.tagline);
          setSnackOpen(true);
          
          var snackDate = new Date(newBirth.date);
          snackDate.setDate(snackDate.getDate() + 14);
          let task = {
            roomId: cage.roomId,
            cageId: cage.id,
            type: 'Pup Snax',
            date: snackDate,
            completed: false
          };
          TaskService.createTask(task);
          var weanDate = new Date(newBirth.date);
          weanDate.setDate(weanDate.getDate() + 19);
          task = {
            roomId: cage.roomId,
            cageId: cage.id,
            type: 'Wean Litter',
            date: weanDate,
            completed: false
          }
          TaskService.createTask(task);
        })
        .catch(err => {
          console.log({
            message: 
            err.message || 'Trouble refreshing cage after birth reported'
          })
        })
        }
        });
    }
    if(!validation.passed) {
      alert(validation.message)
    }
  },[cage.mice,litters,reload]);
 
  // WWEAN Callback
  const handleWeanSubmit = React.useCallback((newWean) => {
    var action = {
      user: props.user,
      type: 'Wean',
      tagline: ''
    }
    setWean(newWean);
    const litter = findCurrentLitter(litters);
    const parentCageId = cage.id;
    // validate the wean
    let validation = validateWean(newWean, nextCage, cage.strain, litter, parentCageId);
    // if weaning to a new cage, create the new cage 
    if(Object.keys(validation.newCage).length !== 0) {
      CageService.addNew(validation.newCage)
      .then(response => {
        action.tagline = action.tagline + 'Weaned to cage #' + validation.newCage.id + '. ';
        let newCageAction = {
          user: props.user,
          type: 'Cage Created',
          tagline: ('Mice weaned from cage ' + cage.id + '.')
        }
        ActionService.addAction(validation.newCage.id, newCageAction);
        setSnackMessage(newCageAction.tagline);
        setSnackOpen(true);
        // add the check sex and check weight task
        if(newWean?.checkSexDate) {
          let task = {
              roomId: newWean.room,
              cageId: newWean.cage,
              type: 'Check Sex',
              date: newWean.checkSexDate,
              completed: false
          };
          TaskService.createTask(task);
        }
        if(newWean?.checkWeightDate) {
          let task = {
              roomId: newWean.room,
              cageId: newWean.cage,
              type: 'Check Weight',
              date: newWean.checkWeightDate,
              completed: false
          };
          TaskService.createTask(task);
        }
        if(newWean.count >= 1){
          let weanMouse = validation.weanMouse;
          for(var i = 0; i < newWean.count; i++){
            weanMouse.id = nextMouse + i;
            CageService.addMouse(newWean.cage, weanMouse)
            .then(response => {
            })
            .catch(err => [
              console.log({
                message: 
                err.message 
              })
            ])
          }
          action.tagline = action.tagline + newWean.count + (newWean.count === 1 ? " pup was " : " pups were ") + 'weaned. ';
          action.litterId = (findCurrentLitter(litters)).id;
          MouseService.updateLitterWean(litter.id, validation.updateLitter)
            .then((response) => {
              if(!validation.updateLitter.finished){
                action.tagline = action.tagline + 'Litter #' + litter.id + ' was updated.';
              } else {
                action.tagline = action.tagline + 'Litter #' + litter.id + ' was finished.';
                TaskService.clearWeanTask({cageId: cage.id});
                TaskService.clearWeanTask({cageId: cage.id});
              }
              ActionService.addAction(cage.id, action);
              setSnackMessage(action.tagline);
              setSnackOpen(true);
            })
            .catch(err => {
              console.log({
                message: 
                err.message})
            })
        }
        setReload(!reload);
      })
      .catch(err => {
        console.log({
          message:
          err.message
        })
      })
    }
    else if(Object.keys(validation.newCage).length === 0){
      if(newWean.count >= 1){
        let weanMouse = validation.weanMouse;
        for(var i = 0; i < newWean.count; i++){
          weanMouse.id = nextMouse + i;
          CageService.addMouse(newWean.cage, weanMouse)
          .then(response => {
          })
          .catch(err => [
            console.log({
              message: 
              err.message 
            })
          ])
        }
        action.tagline = action.tagline + newWean.count + (newWean.count === 1 ? " pup was " : " pups were ") + 'weaned. ';
        action.litterId = (findCurrentLitter(litters)).id;
        MouseService.updateLitterWean(litter.id, validation.updateLitter)
          .then((response) => {
            if(!validation.updateLitter.finished){
              action.tagline = action.tagline + 'Litter #' + litter.id + ' was updated.';
            } else {
              action.tagline = action.tagline + 'Litter #' + litter.id + ' was finished.';
            }
            if(newWean?.checkSexDate) {
              let task = {
                  roomId: newWean.room,
                  cageId: newWean.cage,
                  type: 'Check Sex',
                  date: newWean.checkSexDate,
                  completed: false
              };
              TaskService.createTask(task);
            }
            if(newWean?.checkWeightDate) {
              let task = {
                  roomId: newWean.room,
                  cageId: newWean.cage,
                  type: 'Check Weight',
                  date: newWean.checkWeightDate,
                  completed: false
              };
              TaskService.createTask(task);
            }
            ActionService.addAction(cage.id, action);
            setSnackMessage(action.tagline);
            setSnackOpen(true);
          })
          .catch(err => {
            console.log({
              message: 
              err.message})
          })
      }
      setReload(!reload);
    }
  })
  // LLitterNote Callback
  const updateLitterNote = React.useCallback((newNote) => {
    const _note = newNote.target.value;
    const body = {
      notes: _note
    };
    MouseService.updateLitterNote(currentLitter.id, body)
    .then(() => {
      setReload(!reload);
    })
    .catch(err => {
      console.log({
        message: err.message
      })
    })
  });

  const updateHistoryNote = React.useCallback((newNote, litterId) => {
    const body = {
      notes: newNote
    };
    MouseService.updateLitterNote(litterId, body)
    .then(() => {
      setReload(!reload);
    })
    .catch(err => {
      console.log({
        message: err.message
      })
    })
  })

  const updateCageNote = React.useCallback((newNote) => {
    const _note = newNote.target.value;
    const body = {
      notes: _note
    };
    CageService.updateCageNote(cage.id, body)
    .then(() => {
      setReload(!reload);
    })
    .catch(err => {
      console.log({
        message: err.message
      })
    })
  });
  
  // newPupDeath: count, date, note, finished
  const handlePupDeathSubmit = React.useCallback((newPupDeath) => {
    var _note = '';
        if(currentLitter.notes){
            _note = currentLitter.notes + (newPupDeath.note? " | " + newPupDeath.note : '')
        } else {
            _note = newPupDeath.note;
        }
    
    const body = {
      count: newPupDeath.count,
      finished: newPupDeath.finished,
      notes: _note,
      litter: currentLitter
    };
    MouseService.updateLitterPupDeath(currentLitter.id, body)
    .then(() => {
      let action = {
        user: props.user,
        type: 'Pup - death',
        litterId: (findCurrentLitter(litters)).id,
        tagline: (body.count + " pups reported dead in litter #" + currentLitter.id + ". ")
      }
      if(newPupDeath.finished){
        action.tagline = action.tagline + 'Litter was finished.'
        TaskService.clearWeanTask({cageId: cage.id});
        TaskService.clearWeanTask({cageId: cage.id});
      }
      ActionService.addAction(cage.id, action);
      setSnackMessage(action.tagline);
      setSnackOpen(true);
      setReload(!reload);
    })
    .catch(err => {
      console.log({
        message: err.message
      })
    })
  });
  // finish litter of breeder pups
  const handleFinishLitter = React.useCallback(() => {
    const body = {
      finished: true,
      litter: currentLitter
    };
    MouseService.finishLitter(currentLitter.id, body)
    .then(() => {
      let action = {
        user: props.user,
        type: 'Finish Litter',
        litterId: (findCurrentLitter(litters)).id,
        tagline: (" Litter #" + currentLitter.id + " finished.")
      }
      ActionService.addAction(cage.id, action);
      setSnackMessage(action.tagline);
      TaskService.clearWeanTask({cageId: cage.id});
      TaskService.clearWeanTask({cageId: cage.id});
      setSnackOpen(true);
      setReload(!reload);
    })
    .catch(err => {
      console.log({
        message: err.message
      })
    })
  });

  // Adult cage callbacks
  // adult euthanasia
  const handleEuthanize = React.useCallback((newEuth) => {
    const body = {
      date: newEuth.date,
      count: newEuth.mice.length,
      cageId: cage.id
    };
    // update cage note with euthanasia reason, if requested
    newEuth.mice.forEach((mouseId) => {
      if(newEuth.note){
        var _note = '';
        if(cage.notes){
          _note = cage.notes + (newEuth.note? newEuth.note : '')
        } else {
            _note = newEuth.note;
        }
        let body = {
          notes: _note
        };
        CageService.updateCageNote(cage.id, body);
      }
    // update each mouse in cage
      MouseService.euthanize(mouseId,body)
      .then(() => {
        let action = {
          user: props.user,
          type: 'Euthanize',
          tagline: (" Mouse #" + mouseId + ' euthanized: ' + (newEuth.reason === "Other" ? newEuth.description : newEuth.reason) + '.')
        };
        ActionService.addAction(cage.id, action);
      })
      .catch(err => {
        console.log({
          message: err.message
        })
      })
    })
    // if note, add reason to cages notes
    setSnackMessage(newEuth.mice.length + (newEuth.mice.length === 1 ? " mouse" : " mice") + ' euthanized: ' + (newEuth.reason === "Other" ? newEuth.description : newEuth.reason) + '.');
    setSnackOpen(true);
    setReload(!reload);
  });
  // adult transfer
  const handleTransfer = React.useCallback((newTransfer) => {
    let parentCageId = cage.parentCageId ? cage.parentCageId : cage.id;
    let validation = validateTransfer(newTransfer, nextCage, parentCageId);
    if(Object.keys(validation.newCage).length !== 0) {
      CageService.addNew(validation.newCage)
      .then(() => {
        if(validation.transferMouse) {
          newTransfer.mice.forEach((mouseId) => {
            MouseService.transfer(mouseId,validation.transferMouse)
            .catch((err) => {
              console.log({
                message: err.message
              });
            });
          })
          
          var action = {
            user: props.user,
            type: 'Transfer',
            tagline: ''
          };
          action.tagline = action.tagline + 'Transferred ' + ( newTransfer.mice.length === 1 ? 'mouse ' : 'mice ') + newTransfer.mice.join(", ") + 
            " from cage #" + newTransfer.fromCage + " to cage #" + newTransfer.toCage;
          ActionService.addAction(newTransfer.fromCage, action);
          ActionService.addAction(newTransfer.toCage, action);
          setSnackMessage('Transferred ' + newTransfer.mice.length + ( newTransfer.mice.length === 1 ? ' mouse' : ' mice') + " to cage #" + newTransfer.toCage);
          setSnackOpen(true);
          setReload(!reload);
        }
      })
      .catch((err) => {
        console.log({
          message: err.message
        })
      })
    }
    else if(Object.keys(validation.newCage).length === 0){
      // transfer mice to an existing cage
      if(validation.roomChange){
        CageService.updateCageRoom(newTransfer.fromCage, validation.roomChange)
        .catch((err) => {
          console.log({
            message: err.message
          })
        })
      }
      if(validation.transferMouse) {
        newTransfer.mice.forEach((mouseId) => {
          MouseService.transfer(mouseId,validation.transferMouse)
          .catch((err) => {
            console.log({
              message: err.message
            });
          });
        })
        
        var action = {
          user: props.user,
          type: 'Transfer',
          tagline: ''
        };

        if(Object.keys(validation.roomChange)?.length === 0){
          action.tagline = action.tagline + 'Transferred ' + ( newTransfer.mice.length === 1 ? 'mouse ' : 'mice ') + newTransfer.mice.join(", ") +
          " from cage #" + newTransfer.fromCage + " to cage #" + newTransfer.toCage;
          ActionService.addAction(newTransfer.fromCage, action);
          setSnackMessage('Transferred ' + newTransfer.mice.length + ( newTransfer.mice.length === 1 ? ' mouse' : ' mice') + " to cage #" + newTransfer.toCage);
        }
        if(Object.keys(validation.roomChange)?.length > 0){
          action.tagline = action.tagline + 'Transferred cage from room #' + cage.roomId + " to room #" + newTransfer.roomId;
          setSnackMessage('Transferred cage from room #' + cage.roomId + " to room #" + newTransfer.roomId)
        }
        ActionService.addAction(newTransfer.toCage, action);
        setSnackOpen(true);
        setReload(!reload);
      }
    }
  });

  const handleExperimentTransfer =  React.useCallback((newExp) => {
    let parentCageId = cage.parentCageId ? cage.parentCageId : cage.id;
    let validation = validateTransfer(newExp, nextCage, parentCageId);
    if(Object.keys(validation.newCage).length !== 0) {
      CageService.addNew(validation.newCage)
      .then(() => {
      if(validation.transferMouse) {
        newExp.mice.forEach((mouseId) => {
          MouseService.transfer(mouseId,validation.transferMouse)
          .catch((err) => {
            console.log({
              message: err.message
            });
          });
        })
        
        var action = {
          user: props.user,
          type: 'Transfer',
          tagline: ''
        };
        action.tagline = action.tagline + 'Transferred ' + ( newExp.mice.length === 1 ? 'mouse ' : 'mice ') + newExp.mice.join(", ") + 
          " from cage #" + newExp.fromCage + " to experimental cage #" + newExp.toCage;
        ActionService.addAction(newExp.fromCage, action);
        ActionService.addAction(newExp.toCage, action);
        setSnackMessage('Transferred ' + newExp.mice.length + " experimental " + ( newExp.mice.length === 1 ? ' mouse' : ' mice') + " to cage #" + newExp.toCage);
        setSnackOpen(true);
        setReload(!reload);
      }
      })
      .catch((err) => {
        console.log({
          message: err.message
        })
      })
    }
    else if(Object.keys(validation.newCage).length === 0){
      if(validation.transferMouse) {
        newExp.mice.forEach((mouseId) => {
          MouseService.transfer(mouseId,validation.transferMouse)
          .catch((err) => {
            console.log({
              message: err.message
            });
          });
        })
        
        var action = {
          user: props.user,
          type: 'Transfer',
          tagline: ''
        };
        action.tagline = action.tagline + 'Transferred ' + ( newExp.mice.length === 1 ? 'mouse ' : 'mice ') + newExp.mice.join(", ") +
          " from cage #" + newExp.fromCage + " to experimental cage #" + newExp.toCage;
        ActionService.addAction(newExp.fromCage, action);
        ActionService.addAction(newExp.toCage, action);
        setSnackMessage('Transferred ' + newExp.mice.length + " experimental " + ( newExp.mice.length === 1 ? ' mouse' : ' mice') + " to cage #" + newExp.toCage);
        setSnackOpen(true);
        setReload(!reload);
      }
    }
  });

  const handleAdultClaim = React.useCallback((claim) => {
    // Cage service save claim user name
    CageService.updateCageClaim(cage.id, claim).then(() => {
      // Mouse service apply claim reason to each mouse
      claim?.mice?.forEach((mouseId) => {
        MouseService.claimMouse(mouseId, claim)
        .catch((err) => {console.log(err.message)})
      })
      var action = {
        user: props.user,
        type: 'Claim',
        tagline: (claim.mice.length > 1 ? "Mice " : "Mouse ") + claim.mice.join(", ") + 
          (claim.reason === null ? " claim removed" : " claimed for " + claim.reason) + "." + 
          (claim.genotyping ? " Genotyping requested." : "")
      }
      ActionService.addAction(cage.id, action);
      setSnackMessage(action.tagline);
      if(claim.genotyping){
        var genotypeDate = new Date(today);
        let task = {
          roomId: cage.roomId,
          cageId: cage.id,
          type: 'Genotype',
          date: genotypeDate,
          completed: false
      };
        TaskService.createTask(task);
      }
      setSnackOpen(true);
      setReload(!reload);
    })
    .catch((err) => {
      console.log(err.message)
    })
  });

  const handleAdultGenotype = React.useCallback((newGenotype) => {
    MouseService.genotypeMouse(newGenotype.mouse, newGenotype)
    .then(() => {
      var action = {
        user: props.user,
        type: 'Genotype',
        tagline: (newGenotype.genotype === null ? ("Removed genotype for mouse " + newGenotype.mouse + ".")
           : ('Genotyped mouse ' + newGenotype.mouse + ' as ' + newGenotype.genotype + '.'))
      }
      ActionService.addAction(cage.id, action);
      setSnackMessage(action.tagline);
      setSnackOpen(true);
      setReload(!reload);
    })
    .catch(err => console.log(err.message));
  })

  const handleCrossFoster = React.useCallback((newCf) => {
    MouseService.updateLitterCrossFoster(newCf.litterId, newCf);
    var action = {
      user: props.user,
      type: 'Cross Foster',
      tagline: ''
    };
    action.tagline = action.tagline + 'Cross fostered ' + newCf.cfPupCount + ( newCf.cfPupCount.length === 1 ? ' pup' : ' pups') + 
      " from cage #" + newCf.fromCageId + " to cage #" + newCf.toCageId;
    ActionService.addAction(newCf.fromCageId, action);
    ActionService.addAction(newCf.toCageId, action);
    setSnackMessage('Cross fostered ' + newCf.cfPupCount + ( newCf.cfPupCount.length === 1 ? ' pup' : ' pups') + " to cage #" + newCf.toCageId);
    setSnackOpen(true);
    setReload(!reload);
  });

  const handleRetireBreeder = React.useCallback((retire) => {
    // euthanize the male
    switch (retire.type) {
      case "euth":
        var body = {
          date: retire.date,
          count: 1,
          cageId: retire.mouse.cageId
        };
        MouseService.euthanize(retire.mouse.id, body)
        .then(() => {
          if(retire.note){
            var _note = '';
            if(cage.notes){
              _note = cage.notes + retire.note;
            } else {
              _note = retire.note;
            }
            let body = {
              notes: _note
            }
            if(retire.mouse.cageId){
              CageService.updateCageNote(retire.mouse.cageId, body)
            }
          }
          // euthanizing male breeder changes gender but not status of cage
          let body = { gender: 'F'};
          CageService.updateCageRetire(retire.mouse.cageId, body)
          let action = {
            user: props.user, 
            type: 'Retire',
            tagline: ("Male breeder mouse #" + retire.mouse.id + ' retired and euthanized.' + (retire.note ? 'Notes added to cage notes': ''))
          }
          ActionService.addAction(retire.mouse.cageId, action);
          setSnackMessage("Male breeder mouse retired and euthanized.");
          setSnackOpen(true);
          setReload(!reload);
        })
        .catch((err) => {
          console.log({
            message: err.message
          })
        })
        break;

      case "transfer":
        body = {
          id: retire.toCage,
          roomId: retire.toRoom,
          strain: retire.mouse.strain,
          status: "Adult",
          gender: retire.mouse.gender,
          litterId: retire.mouse.litterId,
          parentCageId: retire.mouse.parentCageId
        }
        CageService.addNew(body)
        .then(() => {
          let body = {
            toCage: retire.toCage,
            fromCage: retire.mouse.cageId,
            strain: retire.mouse.strain,
            gender: retire.mouse.gender
          }
          MouseService.retireBreeder(retire.mouse.id, {})
          MouseService.transfer(retire.mouse.id, body)
          .then(() => {
            if(retire.note){
              var _note = '';
              let body = {
                notes: _note
              }
              if(retire.toCage){
                CageService.updateCageNote(retire.toCage, body)
              }
            }
            // retiring the male changes cage gender to female
            let body = { gender: 'F'};
            CageService.updateCageRetire(retire.mouse.cageId, body)
            let action = {
              user: props.user, 
              type: 'Transfer',
              tagline: ("Male breeder mouse #" + retire.mouse.id + ' transferred from cage #' + retire.mouse.cageId + ' to cage #' + retire.toCage + "." + (retire.note ? ' Notes added to cage notes': ''))
            }
            ActionService.addAction(retire.mouse.cageId, action);
            ActionService.addAction(retire.toCage, action)
            setSnackMessage("Male breeder mouse #" + retire.mouse.id + ' transferred to cage # ' + retire.toCage + ".");
            setSnackOpen(true);
            setReload(!reload);
          })
          .catch((err) => {
            console.log({
              message: err.message
            })
          })
        })
        .catch((err) => {
          console.log({
            message: err.message
          })
        })
        break;

      case "retire":
        body = {
          date: retire.date,
          count: 1,
          cageId: retire.mouse.cageId
        };
        if(cage.gender === "Pair"){
          alert("Retire or Transfer the male before retiring female breeder.");
          break;
        }
        else if(retire.mouse.gender === "F"){
          MouseService.euthanize(retire.mouse.id, body)
          .then(() => {
            if(retire.note){
              var _note = '';
              if(cage.notes){
                _note = cage.notes + retire.note;
              } else {
                _note = retire.note;
              }
              let body = {
                notes: _note
              }
              if(retire.mouse.cageId){
                CageService.updateCageNote(retire.mouse.cageId, body)
              }
            }
            // euthanizing female breeder drops mouse count to zero but
            let body = { gender: 'F', status: 'Breeder', strain: retire.strain};
            CageService.updateCageRetire(retire.mouse.cageId, body)
            let action = {
              user: props.user, 
              type: 'Retire',
              tagline: ("Female breeder mouse #" + retire.mouse.id + ' retired and euthanized.' + (retire.note ? 'Notes added to cage notes': ''))
            }
            ActionService.addAction(retire.mouse.cageId, action);
            setSnackMessage("Female Breeder mouse retired and euthanized.");
            setSnackOpen(true);
            setReload(!reload);
            })
        .catch((err) => {
          console.log({
            message: err.message
          })
        })
        }
        break;

      case "repair":
        if(cage.gender === "Pair"){
          alert("Retire or Transfer the male before retiring female breeder.");
          break;
        }
        if(retire.mouse.gender === "F"){
          if(retire.note){
            var _note = '';
            if(cage.notes){
              _note = cage.notes + retire.note;
            } else {
              _note = retire.note;
            }
            let body = {
              notes: _note
            }
            if(retire.mouse.cageId){
              CageService.updateCageNote(retire.mouse.cageId, body)
            }
          }
        if(cage.gender === "Pair"){
          alert("Retire or Transfer the male before retiring female breeder.");
          break;
        }
        if(retire.mouse.gender === "F"){
          if(retire.note){
            var _note = '';
            if(cage.notes){
              _note = cage.notes + retire.note;
            } else {
              _note = retire.note;
            }
            let body = {
              notes: _note
            }
            if(retire.mouse.cageId){
              CageService.updateCageNote(retire.mouse.cageId, body)
            }
          }
        // rotating female breeder makes cage status Adult again
        body = { gender: 'F', status: 'Adult', strain: retire.mouse.strain};
        CageService.updateCageRetire(retire.mouse.cageId, body)
        MouseService.retireBreeder(retire.mouse.id, {})
        .then(() => {
          let action = {
            user: props.user, 
            type: 'Repair',
            tagline: ("Female breeder mouse #" + retire.mouse.id + ' updated to adult for re-pairing.' + (retire.note ? 'Notes added to cage notes': ''))
          }
          ActionService.addAction(retire.mouse.cageId, action);
          setSnackMessage("Female Breeder mouse updated to adult for re-pairing.");
          setSnackOpen(true);
          setReload(!reload);
        })
        }
        }
        break;

        case "reminder":
          let action = {
            user: props.user, 
            type: 'Repair/Rotate',
            tagline: ("Reminder made to re-pair or rotate breeder female on " + convertToShortDate(retire.date) + "." + (retire.note ? 'Notes added to cage notes': ''))
          }
          ActionService.addAction(retire.mouse.cageId, action);
          setSnackMessage("Reminder made to re-pair or rotate breeder female.");
          setSnackOpen(true);
          setReload(!reload);
          let rotateDate = new Date(retire.date);
          let task = {
            roomId: retire.room,
            roomId: retire.room,
            cageId: retire.mouse.cageId,
            type: 'Retire/Rotate',
            date: rotateDate,
            completed: false
          };
          TaskService.createTask(task)
        break;
        default:
          break;
    }
    setReload(!reload);
  });
  
  // Load Cage Data
  React.useEffect(() => {
    CageService.get(params.cageId)
    .then(response => {
        setCage(response.data);
    })
    .catch(err => {
      console.log({
        message:
        err.message || "trouble fetching this cage's data on initial render"
      })
    })
  },[params.cageId, props.reload, reload]);

  // Load parent cage data
  React.useEffect(() => {
    if(cage.litterId) {
      MouseService.getLitterAndCages(cage.litterId)
      .then((response) => {
        let _litter = response.data;
        CageService.get(_litter.parentCageId)
        .then((response) => {
          setParentCage(response.data)
        })
        .catch((err) => {
          console.log({
            message: err.message
          })
        })
      })
      .catch((err) => {
        console.log({
          message: err.message
        })
      })
    }
  },[cage])

  // load cage actions
  React.useEffect(() => {
    ActionService.getCageActions(params.cageId)
    .then(response => [
      setCageActions(response.data)
    ])
    .catch(err => [
      console.log({
        message: 
          err.message
      })
    ])
  },[cage, params.cageId])

  // Load Litter Data
  React.useEffect(() => {
    if(cage.status === "Breeder") {
      cage.mice.forEach((breeder) => {
        if(breeder.gender === "F") {
          MouseService.getLitter(breeder.id)
          .then(response => {
            setLitters(response.data)
          })
        }
      })
    }
  },[cage]);

  React.useEffect(() => {
    var _litterCages = {};
    var itemsProcessed = 0;
    litters && litters.forEach((litter) => {
        MouseService.getLitterCages(litter.id)
        .then(response => {
            itemsProcessed++;
            let cages = response.data;
            let _cageArr = [];
            cages && cages.forEach((cage) => {
                _cageArr.push(cage.id)
            })
            _litterCages[litter.id] = _cageArr
            if(itemsProcessed === litters.length){
              setLittersCages(_litterCages);
            }
        })
    })
},[cage]);

  // Load Next Litter ID
  React.useEffect(() => {
    MouseService.getNextLitter()
    .then(response => {
      setNextLitter(response.data.id);
    })
    .catch(err => {
        console.log( 
        err.message + "couldn't get next litter id number"
        )
    })
  },[litters,reload,props.reload]);

  // Set current litter
  React.useEffect(() => {
    setCurrentLitter(findCurrentLitter(litters))
  },[litters]);

  // gather cross foster litter info
  React.useEffect(() => {
    // we need litter dob, litter wean date, and strain
    var cfData = {};
    if(currentLitter.cfLitterId){
      MouseService.getLitterAndCages(currentLitter.cfLitterId)
      .then(response => {
        let litter = response.data;
        if(litter) {
          cfData.dob = litter.dob;
          cfData.weanDate = litter.weanDate;
          cfData.cage = litter.parentCageId;
          if(litter.parentCageId){
            CageService.get(litter.parentCageId)
            .then(response => {
              let cage = response.data;
              cfData.strain = cage.strain
              setCFsourceLitter(cfData);
            })
          }
        }
      })
    }
  },[currentLitter, props.reload])

  // Load next available cage
  React.useEffect(() => {
    CageService.getNextCage()
    .then(response => {
      setNextCage(response.data.id);
    })
    .catch(err => {
      console.log(err && "error getting next cage");
    })
  },[reload, props.reload]);

  // Load next available mouse
  React.useEffect(() => {
    MouseService.getNextMouse()
    .then(response => {
      setNextMouse(response.data.id);
    })
    .catch(err => {
      console.log(err && "couldn't get next mouse")
    })
  },[reload, props.reload]);

  // Set pup action list title
  React.useEffect(() => {
    if(isEmpty(currentLitter)){
      if(litters.length >= 1){
        setPupActionListTitle('Previous litter #' + (litters.length) + ' finished');
      }
      if(litters.length === 0){
        setPupActionListTitle('No litters in cage yet');
      }
    }
    if(!isEmpty(currentLitter)){
      setPupActionListTitle("Litter #" + (litters.length > 0 ? litters.length: 0) + ' Pups');
    }
  },[nextLitter,currentLitter])
  
  const navigate = useNavigate();
  const canJumpFromSnackbar = (snackMessage) => {
    let searchString = 'to cage #';
    if(snackMessage.includes(searchString)){
      let cageNum = snackMessage.split(searchString)[1].replace(/^\D+/g, '');
      // navigate('/event/' + cageNum) 
      return cageNum
    }
  }


  const breederDashboard = (
    <>
    <Grid item xs={12} md={12} lg={12} 
    sx={{
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'flex-start', 
      flexWrap: 'wrap',
      rowGap: 2,
      columnGap: 2,
      justifyContent: 'space-between'}}>
    <Paper
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'left',
        flexGrow: 1,
        maxWidth: 370,
        minHeight: 150
      }}
    >
    <Title>Breeder Cage {cage.id} | Room {cage.roomId}</Title>
      <Breeders reload={reload} cage={cage} updateNote={updateCageNote}/>
    </Paper>

    {/* Current Litter Pup Action List */}
    <Paper
      sx={{
          p:1,
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          minHeight: 150,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 7.5
        }}>
          <Title component>{pupActionListTitle !=='' ? pupActionListTitle : 'Litters'}</Title>
            {
            findCurrentLitter(litters).cfLitterId && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      spacing: 2
                    }}>
                      <WarningAmberIcon sx={{color:"#7b1fa2!important", mb:.2, transform: "scale(.9)"}}/>
                      <Typography variant='h7' color="#7b1fa2">Cross fostered pups reported</Typography>
                    </Box>
                </>
              )
            }
      
        </Box>
        <PupListActions
          permissions={props.permissions}
          breeders={cage.mice}
          strain={cage.strain} 
          litter={findCurrentLitter(litters)}
          cfData={cfSourceLitter} 
          add={handleAddPup}
          addCf={handleAddCfPup} 
          drop={handleDropPup}
          dropCf={handleDropCfPup} 
          reload={reload} 
          setReload={setReload}
          updateNote={updateLitterNote}
          nextCage={nextCage}
          nextLitter={litters.length > 0 ? litters.length : 0}
          wean={wean}
          onWeanSubmit={handleWeanSubmit}
          roomId={cage.roomId}
          cageId={cage.id}
          onPupDeathSubmit={handlePupDeathSubmit}
          onFinish={handleFinishLitter}
          onCrossFosterSubmit={handleCrossFoster}
        />
      </Paper>
    </Grid>
    {props.permissions === 'admin' && 
    <>
    <Grid item xs={12} md={8.5} lg={7} >
    <Title>Retire Breeder</Title>
      <Paper 
      sx={{
        display: 'flex',
        flexDirection: 'column', 
        minHeight: 150,
        flexGrow: 1,
        p:1
      }}>
        <RetireBreeder
        onSubmit={handleRetireBreeder}
        cage={cage}
        nextCage={nextCage}
        reload={reload}
        setReload={setReload}
        />
      </Paper>
    </Grid>

    {/* Birth from Breeding Pair  */}
    <Grid item xs={12} md={7} lg={5}>
    <Title>Birth from Breeding Pair</Title>
    <Paper 
    sx={{
      display: 'flex',
      flexDirection: 'column', 
      minHeight: 150,
      flexGrow: 1
    }}>
      {<Birth birth={birth} cage={cage} onSubmit={handleBirthSubmit}/>}
    </Paper>
    </Grid>
    </>
    }
    <Grid item xs={12} md={12} lg={12}>
      <Title>Breeder Pair History</Title>

      <Paper 
      sx={{
        display: 'flex',
        flexDirection: 'column', 
        p:1
      }}>
    {/* breeder pair history */}
       <BreederHistory litters={litters} currentLitter={findCurrentLitter(litters)} 
        litterCages={littersCages} updateNote={updateHistoryNote} reload={reload} setReload={setReload}/>
    </Paper>
    </Grid>
    <Grid item xs={12} md={12} lg={12} sx={{mt:2}}>
    <Title>Cage History</Title>
    <Paper
    sx={{
      p:1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <ActionHistory rows={cageActions} columns={actionColumns} cage={cage}/>
    </Paper>
    </Grid>
    <Snackbar 
      open={snackOpen}
      autoHideDuration={5000}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      onClose={handleSnackClose}>
        <SnackbarContent style={{
          backgroundColor:'#357a38',
        }}
        message={
        <>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 1
        }}>
          <CheckCircleOutlineIcon/>
          {snackMessage}
          {
            canJumpFromSnackbar(snackMessage) && 
            <Tooltip title='Jump to Cage'>
              <IconButton onClick={() => {navigate('/event/' + canJumpFromSnackbar(snackMessage))}}>
              <LaunchIcon sx={{color: 'white'}} />
              </IconButton>
            </Tooltip>
          }
        </Box>
        </>}
      >
      </SnackbarContent>
      </Snackbar>
    </>
    )

const adultDashboard = (
<>
<Grid item xs={12} md={12} lg={12} 
sx={{
display: 'flex', 
flexDirection: 'row', 
alignItems: 'flex-start',
flexWrap: 'wrap',
rowGap:2, 
columnGap: 2,
justifyContent: 'space-between'}}>
<Paper
  sx={{
      p:1,
      pl: 2,
      display: 'flex', 
      flexDirection: 'column', 
      flexGrow: 1, 
      minHeight: 150,
  }}
>
  <Box
  sx={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    columnGap: 1.5,
    pr: 9
  }}>
  <Box
  sx={{
    display: 'flex',
    flexDirection: 'row',
    columnGap: 1.5,
  }}>
  <Title> {cage.gender === 'M' ? 'Male' : 'Female'} {cage.roomId === 261 ? 'Experimental': 'Adult'} Cage {cage.id} | Room {cage.roomId}</Title>
  <CageLinkButton cageNum={parentCage.id}/>
  </Box>
  <TextField fullWidth multiline size='small' label={cage.notes?.length > 1 ? "" : "cage notes"} defaultValue={cage.notes} onChange={updateCageNote} sx={{mr: .66}}/>
  </Box>
  <AdultActionList 
    cage={cage} 
    reload={reload} 
    permissions={props.permissions}
    user={props.user}
    setReload={setReload}
    onEuthSubmit={handleEuthanize}
    roomId={cage.roomId}
    onTransferSubmit={handleTransfer}
    nextCage={nextCage}
    onExperimentSubmit={handleExperimentTransfer}
    onClaimSubmit={handleAdultClaim}
    onGenotypeSubmit={handleAdultGenotype}
    />
</Paper>
</Grid>
<Grid item xs={12} md={12} lg={12}>
  <AdultFinishedAccordionComponent cage={cage} reload={reload}/>
</Grid>
<Grid item xs={12} md={12} lg={12}>
<Title>&nbsp;&nbsp;&nbsp;Cage History</Title>
  <Paper
  sx={{
    p:1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }}>
    <ActionHistory rows={cageActions} columns={actionColumns} cage={cage}/>
  </Paper>
</Grid>
<Snackbar 
      open={snackOpen}
      autoHideDuration={7500}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      onClose={handleSnackClose}>
        <SnackbarContent style={{
          backgroundColor:'#357a38',
        }}
        message={
        <>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 1
        }}>
          <CheckCircleOutlineIcon/>
          {snackMessage}
          {
            canJumpFromSnackbar(snackMessage) && 
            <Tooltip title='Jump to Cage' placement='top'>
              <IconButton onClick={() => {navigate('/event/' + canJumpFromSnackbar(snackMessage))}} sx={{m: 0, p: 0, ml: 1.5}}>
              <LaunchIcon sx={{color: 'white', transform: 'scale(0.8)'}} />
              </IconButton>
            </Tooltip>
          }
        </Box>
        </>}
      >
      </SnackbarContent>
      </Snackbar>
</>
    )
    return (
      <>
      { (cage.status === 'Breeder' || cage.status === "Inactive") && 
          <Layout open={props.open} setOpen={props.setOpen} user={props.user} reload={props.reload} setReload={setReload} content={breederDashboard} permissions={props.permissions}/>
      } 
      { cage.status === 'Adult' && 
          <Layout open={props.open} setOpen={props.setOpen} user={props.user} reload={props.reload} setReload={props.setReload} content={adultDashboard} permissions={props.permissions}/>
      } 
      </>
    );
  }

  export default withRouter(EventDashboard);