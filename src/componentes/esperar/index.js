import * as React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Logo from '../../imagenes/logo1.png'

export default function Esperar(props) {
  const [open] = React.useState(true);

  return (
    <div>
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        
      >
        {/* <CircularProgress color="inherit" /> */}
        <div>
          <img
                  src={props.Logo ? props.Logo : Logo}
                  alt={'Cargando datos'}
                  loading="lazy"
                  style={{height:window.innerHeight * 0.25}}
          />
          <Box sx={{ width: '100%' }}>
            <LinearProgress color="inherit"/>
            {'>'+process.env.PUBLIC_URL}
          </Box>
        </div>
      </Backdrop>
    </div>
  );
}
