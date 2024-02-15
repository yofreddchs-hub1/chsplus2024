import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Logo from '../../imagenes/logo1.png'

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor:'#000', opacity:1, pl:1, pr:1 }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="#fff">{`${
          Number(props.value).toFixed(2).toLocaleLowerCase()
        }%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};


export default function Cargando(props) {
  const {open, Fondo, Config, progreso} = props;
  return open ? (
    <div style={{
        height:'99.5%', width:'99.5%', 
        position: 'absolute', top:1,
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:100,
        backgroundColor: Fondo ? Fondo : Config ? Config.Estilos.Fondo_pantalla : '#7ABC32', opacity:0.8,
    }}>
        {/* <CircularProgress color="inherit" /> */}
        <div style={{alignItems:'center',  opacity:1,justifyContent:'center', justifyItems:'center', marginTop:20}}> 
            <img
                    src={ Logo }
                    alt={'Cargando'}
                    loading="lazy"
                    style={{height:window.innerHeight * 0.25}}
            />
            <Box sx={{ width: '100%', opacity:1}}>
              {progreso
                ? <LinearProgressWithLabel value={progreso} />
                : <LinearProgress color="inherit"/>
              }
            
            </Box>
        </div>
      
    </div>
  ): null;
}