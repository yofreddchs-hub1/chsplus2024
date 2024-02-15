import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Logo from '../../../imagenes/noexiste.png'

export default function Noexiste() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={2}>
        
        </Grid>
        <Grid item xs={8}>
          
            <img
                src={Logo}
                
                alt={'No Existe'}
                loading="lazy"
            />
          
        </Grid>
        <Grid item xs={2}>
          
        </Grid>
        
      </Grid>
    </Box>
  );
}
