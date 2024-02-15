import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import Menu from './menu';
import Enconstruccion from '../herramientas/pantallas/enconstruccion';

function ScrollTop(props) {
  const { children, window } = props;
  // console.log(window)
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function BackToTop(props) {
  const [state,setState] = React.useState(()=>{
    const Inicio= props.pantallas ? props.pantallas.Inicio : undefined
    return {
      Pantalla: props.Pantalla ? props.Pantalla : Inicio ? <Inicio {...props}/> : undefined ,
      Seleccion: props.Seleccion ? props.Seleccion : props.pantallas ? 'Inicio' : undefined
    }
  });
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
    console.log(value)
    let seleccion= value.pantalla ? value.pantalla : value.value;
    let pantalla= value.primary;
    
    let Pantallas= await Buscar_pantalla(props.pantallas, seleccion)
    
    seleccion = Pantallas[seleccion] ? Pantallas[seleccion] :  <Enconstruccion />
    
    setState({...state, Pantalla:seleccion, Seleccion:pantalla})

  }
  return (
    <React.Fragment>
      <CssBaseline />
      <Menu {...props} {...state} Seleccion_pantalla= {Seleccion_pantalla}/>
      {/* <Toolbar id="back-to-top-anchor" /> */}
      <Box component="div" sx={{padding:1, overflowY:'auto', height:window.innerHeight * 0.91, width: window.innerWidth, ...props.Config.Estilos.Fondo_pantalla}}
         onScroll={(props)=>{
            var y = window.scrollY;
            
            console.log(y, window.pageYOffset)
            // console.log(props)
         }}   
      >
        {/* <Box sx={{ }}> */}
          {state.Pantalla }
        {/* </Box> */}
        
      </Box>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
