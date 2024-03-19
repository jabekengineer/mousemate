import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CageList from './components/home-cageList.component';
import { Route, Routes } from 'react-router-dom';
import EventDashboard from './components/eventDashboard.component';
import Calendar from './components/calendar.component'
import Layout from './components/layout.component'
import TODO from './components/todoPage.component';
import Admin from './components/admin-dashboard.component';
import Login from './components/login.component';
import useToken from './components/useToken.component';
import PairingCalculator from './components/pairingCalculator.component';
import Experiment from './components/experimentDashboard.component';
import ReportDashboard from './components/report-dashboard.component';
import TaskService from './services/task.service';


function ColonyDashboard(props) {
    const content = (
    <Grid item xs={12} md={12} lg={12}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '76vh',
        }}
      >
          <CageList user={props.user} permissions={props.permissions} reload={props.reload}/>
        </Paper>
      </Grid>
    )

    return (
      <Layout open={props.open} setOpen={props.setOpen} reload={props.reload} setReload={props.setReload} user={props.user} content={content} permissions={props.permissions}/>
    );
  }



export default function App() {

  const {token, setToken} = useToken();
  const [user, setUser] = React.useState('');
  const [permissions, setPermissions] = React.useState('');
  const [reload, setReload] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setReload(!reload)
    },1000);

    return () => clearInterval(interval);
  },[reload])
  React.useEffect(() => {
    setUser(sessionStorage.getItem('user'));
  },[]);
  React.useEffect(() => {
    setPermissions(sessionStorage.getItem('permissions'));
  },[user]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      TaskService.cleanTaskList();
    },30000);
    return () => clearInterval(interval);
  },[])
  
  return (
    <>
    {
      (!token) && (
        <>
          <Login setUser={setUser} setToken={setToken} setPermissions={setPermissions}/>
        </>
      )
    }
    {
      (permissions === 'admin') && (
        <>
        <Routes>
          <Route path="/" element={<ColonyDashboard open={open} reload={reload} setReload={setReload} setOpen={setOpen} user={user} permissions={permissions}/>} />
          <Route path="/event/:cageId" element={<EventDashboard open={open} setOpen={setOpen} user={user} permissions={permissions} reload={reload} setReload={setReload}/>}/>
          <Route path="calendar" element={<Layout open={open} setOpen={setOpen} reload={reload} setReload={setReload} user={user} permissions={permissions} content={<Calendar reload={reload} setReload={setReload} permissions={permissions}/>}/>}/>
          <Route path="calculator" element={<Layout open={open} setOpen={setOpen} reload={reload} setReload={setReload} user={user} permissions={permissions} content={<PairingCalculator reload={reload} setReload={setReload} user={user}/>}/>}/>
          <Route path="experiments" element={<Layout open={open} setOpen={setOpen} user={user} reload={reload} setReload={setReload} permissions={permissions} content={<Experiment reload={reload} setReload={setReload} permissions={permissions} user={user}/>}/>}/>
          <Route path="report" element={<Layout open={open} setOpen={setOpen} user={user} reload={reload} setReload={setReload} permissions={permissions} content={<ReportDashboard reload={reload} setReload={setReload} permissions={permissions} user={user}/>}/>}/>
          <Route path="about" element={<Layout open={open} setOpen={setOpen} user={user} reload={reload} setReload={setReload} permissions={permissions} content={<TODO name="Mousemate User Guide"/>}/>}/>
          <Route path="admin" element={<Layout open={open} setOpen={setOpen} user={user} reload={reload} setReload={setReload} permissions={permissions} content={<Admin user={user} reload={reload} setReload={setReload}/>}/>}/>
        </Routes>
        </>
      )
    }
    {
      (permissions === 'user') && (
        <>
          <Routes>
            <Route path="/" element={<ColonyDashboard open={open} setOpen={setOpen} user={user} permissions={permissions} reload={reload} setReload={setReload}/>} />
            <Route path="/event/:cageId" element={<EventDashboard open={open} setOpen={setOpen} user={user} permissions={permissions} reload={reload} setReload={setReload}/>}/>
            <Route path="calendar" element={<Layout open={open} setOpen={setOpen} reload={reload} setReload={setReload} user={user} permissions={permissions} content={<Calendar reload={reload} setReload={setReload} permissions={permissions}/>}/>}/>
            <Route path="experiments" element={<Layout open={open} setOpen={setOpen} user={user} permissions={permissions} content={<Experiment reload={reload} setReload={setReload} permissions={permissions} user={user}/>}/>}/>
            <Route path="report" element={<Layout open={open} setOpen={setOpen} user={user} reload={reload} setReload={setReload} permissions={permissions} content={<ReportDashboard reload={reload} setReload={setReload} permissions={permissions} user={user}/>}/>}/>
            <Route path="about" element={<Layout open={open} setOpen={setOpen} user={user} permissions={permissions} content={<TODO name="Mousemate User Guide"/>}/>}/>
          </Routes>
        </>
      )
    }
    </>
    )
  }