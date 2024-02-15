import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';

import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Menus from './menu';
import ListaMenu from './listamenu';
import logo from '../../imagenes/logo512.png';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

// import Noexiste from '../herramientas/pantallas/noexiste';
import Enconstruccion from '../herramientas/pantallas/enconstruccion';

const drawerWidth = 260;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: window.innerHeight * 0.9,
  overflow: 'auto'
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(0.2),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft(props) {
  const theme = useTheme();
  const {Config}=props;
  const [open, setOpen] = React.useState(true);
  const [state,setState] = React.useState(()=>{
    const Inicio= props.pantallas ? props.pantallas.Inicio : undefined
    return {
      Pantalla: props.Pantalla ? props.Pantalla : Inicio ? <Inicio {...props}/> : undefined ,
      Seleccion: props.Seleccion ? props.Seleccion : props.pantallas ? 'Inicio' : undefined
    }
  });
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const Buscar_pantalla = async (listas, seleccion) =>{
    let Pantallas={}
    // Object.keys(listas).map(async v=>{
    for (var i=0 ; i<Object.keys(listas).length; i++ ){ 
      let v=Object.keys(listas)[i];
      if (typeof listas[v]==='object'){
        let nuevo= await Buscar_pantalla(listas[v], seleccion)
        Pantallas={...Pantallas, ...nuevo}
      }else if(v===seleccion){
        const P = listas[v]
        Pantallas[v]=<P {...props}/>
      }  
      // return v
    }//)
    
    return Pantallas
  }

  const Seleccion_pantalla = async(value, padre)=>{
    // let {Config}= props;
    // this.Sacar(Config.Menu)
    let seleccion= value.pantalla ? value.pantalla : value.value;
    let pantalla= value.primary;
    
    let Pantallas= await Buscar_pantalla(props.pantallas, seleccion)
    
    seleccion = Pantallas[seleccion] ? Pantallas[seleccion] :  <Enconstruccion />
    
    setState({...state, Pantalla:seleccion, Seleccion:pantalla})

  }
  
  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed" open={open} 
              style={{backgroundColor:'#000000', ...Config.Estilos.Barra_menu ? Config.Estilos.Barra_menu : {}}}
      >
        <Menus {...props} open={open} Seleccion={state.Seleccion} handleDrawerOpen={handleDrawerOpen}/>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader 
            style={{backgroundColor:'#000000', ...Config.Estilos.Barra_menu ? Config.Estilos.Barra_menu : {}}}
        >
          { open ? <img  src={logo}  className={'logo'} 
                         style={{marginRight:50, height:60, width:60, ...props.Config.Estilos.Logo ? props.Config.Estilos.Logo : {} }} 
                         alt="logo" 
                    />  
                 : null
          }
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' 
                ? <ChevronLeftIcon 
                    sx={{ color: Config.Estilos.Barra_menu ? Config.Estilos.Barra_menu.color : '#ffffff' }}
                  /> 
                : <ChevronRightIcon 
                    sx={{ color: Config.Estilos.Barra_menu ? Config.Estilos.Barra_menu.color : '#ffffff' }}
                  />
            }
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        <ListaMenu {...props} 
                    {...state}
                    Seleccion_pantalla= {Seleccion_pantalla}
        />
         
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              {state.Pantalla 
                ? {...state.Pantalla, props:{...state.Pantalla.props, Seleccion_pantalla: Seleccion_pantalla}} 
                : null
              }
            </Item>
          </Grid>
        </Grid>
        
      </Main>
    </Box>
  );
}
