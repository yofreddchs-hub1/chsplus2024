import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import MP from './materiaprima';
import ProduccionDia from './producciondia';
import Empaques from './empaques';
import PT from './productoterminado';
import ProduccionObrero from './produccion_obrero';
import { Permiso } from '../../../constantes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Dashboard(props) {
  const [permisos, setPermisos]= React.useState()
  React.useEffect(()=>{
    const Inicio=async()=>{
      const mp = await Permiso('MP');
      const produccion = await Permiso('Produccion');
      const empaque = await Permiso('Empaque');
      const pt = await Permiso('PT');
      setPermisos({mp, produccion, empaque, pt})
    }
    Inicio();
  },[])
  return (
    <Box sx={(theme) => ({ flexGrow: 1, 
        height:'100%',
        overflow: 'hidden auto',
        '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
        '&::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            border: '2px solid',
            borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
            backgroundColor: 'rgba(0 0 0 / 0.5)',
        },
    })}
    >
      <Grid container spacing={0.5}>
        {permisos && permisos.mp
          ? <Grid xs={4}>
                <Item elevation={6}>
                    <MP {...props}/>
                </Item>
            </Grid>
          : null
        }
        {permisos && permisos.produccion
          ?
            <Grid xs={8}>
              <Item elevation={6}>
                <ProduccionDia {...props}/>
              </Item>
            </Grid>
          : null
        }
        {permisos && permisos.empaque
          ?
            <Grid xs={4}>
              <Item elevation={6}>
                <Empaques {...props}/>
              </Item>
            </Grid>
          : null
        }
        {permisos && permisos.mp
          ?
            <Grid xs={8}>
              <Item elevation={6}>
                <PT {...props}/>
              </Item>
            </Grid>
          : null
        }
        <Grid xs={12}>
          <Item elevation={6}>
            <ProduccionObrero {...props}/>
          </Item>
        </Grid>
        
      </Grid>
    </Box>
  );
}
