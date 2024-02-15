import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import RMP from './materiaprima';
import Reporte from './reporte';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height:window.innerHeight * 0.6,
//   maxWidth:window.innerWidth * 0.5
}));

export default function Reportes(props) {
    const {Config} = props;
    const Muestra = (data)=>{
        return (
            <Item sx={{...Config.Estilos.Dialogo_cuerpo}} elevation={6}>
                <Item sx={{height:50}}>
                    <Typography variant="h5" gutterBottom>
                        {data.Titulo ? data.Titulo : 'Titulo'}
                    </Typography>
                </Item>
                <Box sx={(theme) => ({ flexGrow: 1, 
                        height:'88%',
                        width:'100%',
                        backgroundColor:'#020',
                        overflow: 'hidden hidden',
                        '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: 8,
                            border: '2px solid',
                            borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                            backgroundColor: 'rgba(0 0 0 / 0.5)',
                        },
                    })}
                >
                    {data.children ? data.children : null}
                </Box>
            </Item>
        )

    }
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
                <Grid xs={6} md={6}>
                    <Muestra Titulo={'Ingresos-Egresos Materia Prima'}>
                        <Reporte {...props} Titulo={'Materia Prima'} TituloDetalle={'Movimientos en el Mes'} 
                                    Actualizar={['Actualizar_wesi_chs_server_material','Actualizar_inventariomp']}
                        />
                    </Muestra>
                </Grid>
                <Grid xs={6} md={6}>
                    <Muestra Titulo={'Ingresos-Egresos Empaques'}>
                        <Reporte {...props} Titulo={'Empaque'} TituloDetalle={'Movimientos en el Mes'}
                                    Actualizar={['Actualizar_wesi_chs_server_empaque','Actualizar_empaque']}
                        />
                    </Muestra>
                </Grid>
                <Grid xs={6} md={6}>
                    <Muestra Titulo={'Ingresos-Egresos Productos Terminados'}>
                        <Reporte {...props} Titulo={'Producto Terminado'} TituloDetalle={'Movimientos en el Mes'}
                                    Actualizar={['Actualizar_produccion','Actualizar_inventariopt']}
                        />
                    </Muestra>
                </Grid>
                <Grid xs={6} md={6}>
                    <Item sx={{...Config.Estilos.Dialogo_cuerpo}}></Item>
                </Grid>
            </Grid>
        </Box>
    );
}
