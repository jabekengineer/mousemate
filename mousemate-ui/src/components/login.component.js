import React from 'react';
import { Box, Button, FormControl, FormLabel, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import LoginService from '../services/login.service';
import { withRouter } from '../common/with-router';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import LoginImage from '../common/logo.PNG';
import labLogo from '../common/haider_lab_grayscale.PNG'

function Login(props) {
    const [name, setName] = React.useState('');
    const [failed, setFailed] = React.useState(false);
    const checkCredentials = async e => {
        e.preventDefault();
        LoginService.checkUser(name)
        .then((response) => {
            if(response.data.length > 0){
                let permissions = response.data[0].permissions;
                props.setToken(true, name, permissions);
                props.setUser(name);
            }
            else {
                setFailed(true)
            }
        })
        .catch(err => {
            console.log(err.message)
        })
    };

    const onNameChange = (event) => {
        setName(event.target.value.toLowerCase());
    };
    React.useEffect(() => {
        setFailed(false);
    },[]);
    return(
        <Box 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'top',
            height: '98vh',
            alignItems: 'center',
            rowGap: 2,
            marginTop: 0,
            color: 'rgba(245, 245, 245)'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignContent: 'left'
                }}>
                    <a href="https://haider.gatech.edu/">
                        {/* <img src='https://cdn.glitch.global/345b4a37-e5cb-4b8c-bcd6-71b41bee8341/haiderlab_grayscale.PNG?v=1686534721846' 
                            alt='haider lab logo' height='45'/> */}
                            <img src={labLogo} alt="lab logo" height='45'/>
                    </a>
                </Box>
            </Box>
            <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'top',
                alignItems: 'center',
                boxShadow: 10,
                width: 525,
                height: 500,
                borderRadius: 9,
                mt: '10vh'
            }}
            >
                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'inherit',
                    m:0,
                    p:0,
                    mt: 6
                }}>
                <div className='logo'>
                    {/* <img src='https://cdn.glitch.global/345b4a37-e5cb-4b8c-bcd6-71b41bee8341/logo.PNG?v=1686608085507' alt="Mousemate logo" height='175' /> */}
                    <img src={LoginImage} alt="Mousemate logo" height='175' />
                </div>
                <div>
                    <Typography variant='h4' color='black' sx={{fontWeight: 450, mt: 2}}>
                        Sign in with Mousemate ID
                    </Typography>
                </div>
                <div className='name'>
                    {
                        failed && (
                            <>
                            <TextField label="enter name" type='text' onChange={onNameChange}
                                sx={{mt: 5}}
                                error
                                helperText="ID not recognized"
                                InputProps={{ 
                                    sx: { borderRadius: 4 },
                                    endAdornment: (
                                        <InputAdornment position='end' onClick={checkCredentials}>
                                            <ArrowCircleRightOutlinedIcon
                                            sx={{
                                                '&:hover': {
                                                    cursor: "pointer",
                                                    color: "#1769aa"
                                                }
                                            }}/>
                                        </InputAdornment>
                                    ) 
                            }}/>
                            </>
                        )
                    }
                    {
                        !failed && (
                            <>
                            <TextField label="enter name" 
                                type='text' 
                                onChange={onNameChange}
                                onKeyUp={(e) => {
                                    if(e.key === "Enter") {
                                        checkCredentials(e);
                                    }
                                }}
                                sx={{mt: 5}}
                                InputProps={{ 
                                    sx: { borderRadius: 4 },
                                    endAdornment: (
                                        <InputAdornment position='end' onClick={checkCredentials}>
                                            <ArrowCircleRightOutlinedIcon
                                            sx={{
                                                '&:hover': {
                                                    cursor: "pointer",
                                                    color: "#1769aa"
                                                }
                                            }}/>
                                        </InputAdornment>
                                    ) 
                            }}/>
                            </>
                        )
                    }
                </div>
                </Box>
            </Paper>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                alignContent: 'center',
                
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    mt: '23.5vh'
                }}>
                <Typography variant="h6" color="text.secondary" align="center" >
                   Jason Sebek 2023
                </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" align='right' sx={{mt: '25vh'}}>
                    v1.3
                </Typography>
            </Box>
        </Box>
    )
}

export default withRouter(Login)