import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CalculateIcon from '@mui/icons-material/Calculate';
import BarChartIcon from '@mui/icons-material/BarChart';
import BiotechIcon from '@mui/icons-material/Biotech';
import ContentTimeline from './home-contentTimeline.component';
import TimelineLogo from './home-timelineLogo.component';
import { withRouter } from '../common/with-router';
import { useNavigate } from 'react-router-dom';



function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Mousemate v1.3 by '}
        <Typography component='a' variant="body2" sx={{color: 'inherit', textDecoration: ''}} href="https://haider.gatech.edu/people/">
          Jason Sebek
        </Typography>{' '}
        {2023}
        {'.'}
      </Typography>
    );
  }

  const drawerWidth = 275;
    
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );
  
  const mdTheme = createTheme();

function Layout (props) {
    const toggleDrawer = () => {
      props.setOpen(!props.open);
    };

    const navigate = useNavigate();
    const goHomeAndRefresh = () => {
      navigate('/');
    }
    
    const listItemsClosed = (
      <React.Fragment>
      <ListItemButton onClick={toggleDrawer} sx={{pl: 2.5, mt: '4px', mb: '8px'}}>
          <ListItemIcon>
              <BarChartIcon/>
          </ListItemIcon>
      </ListItemButton >
      <ListItemButton onClick={toggleDrawer} sx={{pl: 2.5, mt: '4px', mb: '8px'}}>
          <ListItemIcon>
              <BiotechIcon/>
          </ListItemIcon>
      </ListItemButton>
      {props.permissions === 'admin' && 
      <>
      <ListItemButton onClick={toggleDrawer} sx={{pl: 2.5, mt: '4px', mb: '8px'}}>
          <ListItemIcon>
              <CalculateIcon/>
          </ListItemIcon>
      </ListItemButton>
      <ListItemButton onClick={toggleDrawer} sx={{pl: 2.5, mt: '4px', mb: '8px'}}>
        <ListItemIcon>
            <CorporateFareIcon/>
        </ListItemIcon>
      </ListItemButton>
      </>
      }
      <ListItemButton onClick={toggleDrawer} sx={{pl: 2.5, mt: '4px'}}>
          <ListItemIcon>
              <PeopleIcon/>
          </ListItemIcon>
      </ListItemButton>
    </React.Fragment>
  );
  const listItemsOpen = (
    <React.Fragment>
    <Link to='/report' style={{textDecoration: 'none', color: 'inherit'}}>
    <ListItemButton>
        <ListItemIcon>
            <BarChartIcon/>
        </ListItemIcon>
      <ListItemText primary="Census & Animal Use" />
    </ListItemButton>
    </Link>
    <Link to='/experiments' style={{textDecoration: 'none', color: 'inherit'}}>
    <ListItemButton>
        <ListItemIcon>
            <BiotechIcon/>
        </ListItemIcon>
      <ListItemText primary="RLC Cages" />
    </ListItemButton>
    </Link>
    {props.permissions === 'admin' && 
    <>
    <Link to='/calculator' style={{textDecoration: 'none', color: 'inherit'}}>
    <ListItemButton>
        <ListItemIcon>
            <CalculateIcon/>
        </ListItemIcon>
      <ListItemText primary="Pair Breeders" />
    </ListItemButton>
    </Link>
    <Link to='/admin' style={{textDecoration: 'none', color: 'inherit'}}>
    <ListItemButton>
        <ListItemIcon>
            <CorporateFareIcon/>
        </ListItemIcon>
      <ListItemText primary="Actions & Add Cages" />
    </ListItemButton>
    </Link>
    </>
    }
    <Link to='/about' style={{textDecoration: 'none', color: 'inherit'}}>
    <ListItemButton>
        <ListItemIcon>
            <PeopleIcon/>
        </ListItemIcon>
      <ListItemText primary="User Guide" />
    </ListItemButton>
    </Link>
  </React.Fragment>
  );

   
    return(
        <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={props.open}>
            <Toolbar
              sx={{
                pr: '24px' // keep right padding when drawer closed
              }}
            >
                <Button
                onClick={toggleDrawer}
                color='inherit'
                sx={{
                    marginRight: '36px',
                    ...(props.open && { display: 'none' }),
                  }}
                >
                    <MenuIcon/>
                </Button>
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexGrow: 1
            }}>
              
              <Button onClick={goHomeAndRefresh} variant='text' style={{ textTransform: 'none', paddingLeft: '0px'}} sx={{'&:hover': {cursor: 'pointer!important'}}}>
                <Typography
                  component="h1"
                  variant="h4"
                  color="white"
                  noWrap
                  sx={{ flexGrow: 1 }}
                >
                  Mousemate
                </Typography>
                </Button>
              <Typography
                  variant="h6"
                  color="white"
                >
                  {props.user}
                </Typography>
            </Box>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={props.open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
                <Button onClick={toggleDrawer} >
                    <ChevronLeftIcon/>
                </Button>
            </Toolbar>
            <Divider />
            <List component="nav">
              
              {props.open && 
              <>
              {listItemsOpen}
              {
                props.permissions === "admin" && (
                  <ContentTimeline reload={props.reload} setReload={props.setReload}/>
                )
              }
              
              </> 
              }
              {!props.open &&
              <>
              {listItemsClosed}
              <Button 
              sx={{
                display: 'flex', 
                flexDirection: 'column',
                padding: 0, 
                marginTop: '6.5vh'
              }} 
                onClick={toggleDrawer}>
                <TimelineLogo/>
              </Button>
              </> 
              }
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            {/* Site body container, can expand to lg,xl,md, top and bottom margin before copyright */}
            <Container sx={{ mt: 4, mb: 4, maxWidth: '1385px!important'}}> 
              <Grid container spacing={3}>
                {props.content}
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>

    )
}

export default withRouter(Layout)