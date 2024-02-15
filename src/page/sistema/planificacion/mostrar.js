import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MensajeTool from '../../../componentes/herramientas/mensaje';
import Logo from '../../../imagenes/trompo.png';
import { Divider } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


  
export default function MostrarProduccion(props) {
    const {datos}= props;
    const alto = window.innerHeight * 0.50;
    const error='#A30E02';
    const correcto='#138E04';
    return (
        <Box sx={{ flexGrow: 1, padding:1 }}>
            <Grid container spacing={1}>
                <Grid xs={12} md={3} lg={2}>
                    <Item elevation={12} sx={{height:alto , ...datos && datos.producido ? {bgcolor:correcto}: {}}}>
                        <img
                                src={ Logo}
                                alt={'Trompo'}
                                loading="lazy"
                                style={{height:window.innerHeight * 0.20}}
                        />
                        <MensajeTool
                            title={
                                <React.Fragment>
                                    <Typography color="inherit">Cantidad de Trompos a preparar</Typography>
                                </React.Fragment>
                            }
                        >
                            <Typography variant="h4" gutterBottom>
                                Cant: {datos && datos.cantidad ? datos.cantidad : 0}
                            </Typography>
                        </MensajeTool>
                    </Item>
                </Grid>
                <Grid container xs={12} md={9} lg={10} spacing={1}>
                    <Grid xs={6} lg={6}>
                        <Item elevation={12} sx={{...datos && datos.producido ? {bgcolor:correcto}: {}}}>
                            <Box
                                id="category-a"
                                sx={{ fontSize: '16px', textTransform: 'uppercase', textAlign:'center' }}
                            >
                                Materia Prima
                            </Box>
                            <Grid container alignItems="center">
                                <Grid item xs={6}>
                                    <Item elevation={6}>
                                        <Typography variant="body2"  noWrap title={`Descripcion`}>
                                            DESCRIPCION
                                        </Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={3}>
                                    <Item elevation={6}>
                                        <Typography variant="body2"  noWrap title={`Cantidad de materia prima para la mezcla`}>
                                            CANTIDAD
                                        </Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={3}>
                                    <Item elevation={6}>
                                        <Typography variant="body2"  noWrap title={`Cantidad Total de materia prima utilizada`}>
                                            CANT. TOTAL
                                        </Typography>
                                    </Item>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <Box
                                sx={(theme) => ({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    height: alto,
                                    '& > div': {
                                    overflow: 'hidden auto',
                                    '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                                    '&::-webkit-scrollbar-thumb': {
                                        borderRadius: 8,
                                        border: '2px solid',
                                        borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                                        backgroundColor: 'rgba(0 0 0 / 0.5)',
                                    },
                                    },
                                })} 
                            >
                                <div style={{height:'100%'}}>
                                    {datos && datos.mp
                                        ?   datos.mp.map((v)=>
                                            
                                                <Grid container spacing={1} key={v._id}>
                                                    <Grid xs={6}>
                                                        <MensajeTool
                                                            title={
                                                                <React.Fragment>
                                                                    <Typography color="inherit">{v.cantidad>v.actual ? `Cantidad en inventario insuficiente (Inv.: ${v.actual})` : v.descripcion}</Typography>
                                                                </React.Fragment>
                                                            }
                                                        >
                                                            <Item sx={{backgroundColor: v.cantidad>v.actual && !datos.producido ? error : '', textTransform: 'uppercase', textAlign:'left', }} 
                                                                    
                                                            >
                                                                <Typography variant="body2"  noWrap >
                                                                    {v.descripcion}
                                                                </Typography>
                                                            </Item>
                                                        </MensajeTool>
                                                    </Grid>
                                                    <Grid xs={3}>
                                                        <MensajeTool
                                                            title={
                                                                <React.Fragment>
                                                                    <Typography color="inherit">{`${v.cantidad} ${v.unidad.value}`}</Typography>
                                                                </React.Fragment>
                                                            }
                                                        >
                                                            <Item sx={{backgroundColor: v.cantidad>v.actual && !datos.producido ? error : '', textAlign:'right'}} 
                                                            >
                                                                <Typography variant="body2"  noWrap >
                                                                    {v.cantidad} {v.unidad.value}
                                                                </Typography>
                                                            </Item>
                                                        </MensajeTool>
                                                        
                                                    </Grid>
                                                    <Grid xs={3}>
                                                        <MensajeTool
                                                            title={
                                                                <React.Fragment>
                                                                    <Typography color="inherit">{`${v.cantidadT} ${v.unidad.value}`}</Typography>
                                                                </React.Fragment>
                                                            }
                                                        >
                                                            <Item sx={{backgroundColor: v.cantidad>v.actual && !datos.producido ? error : '', textAlign:'right'}} 
                                                            >
                                                                <Typography variant="body2"  noWrap >
                                                                    {v.cantidadT} {v.unidad.value}
                                                                </Typography>
                                                            </Item>
                                                        </MensajeTool>
                                                    </Grid>
                                                </Grid>    
                                            
                                            )
                                        : null
                                    }
                                </div>
                            </Box>
                        </Item>
                    </Grid>
                    <Grid xs={6} lg={6}>
                        <Item elevation={12} sx={{...datos && datos.producido ? {bgcolor:correcto}: {}}}>
                            <Box
                                id="category-a"
                                sx={{ fontSize: '16px', textTransform: 'uppercase', textAlign:'center' }}
                            >
                                Productos Terminados
                            </Box>
                            <Grid container alignItems="center">
                                <Grid item xs={9}>
                                    <Item elevation={6}>
                                        <Typography variant="body2"  noWrap title={`Descripcion`}>
                                            DESCRIPCION
                                        </Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={3}>
                                    <Item elevation={6}>
                                        <Typography variant="body2"  noWrap title={`Cantidad Total de materia prima utilizada`}>
                                            CANTIDAD
                                        </Typography>
                                    </Item>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <Box
                                sx={(theme) => ({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    height: alto,
                                    '& > div': {
                                    overflow: 'hidden auto',
                                    '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                                    '&::-webkit-scrollbar-thumb': {
                                        borderRadius: 8,
                                        border: '2px solid',
                                        borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                                        backgroundColor: 'rgba(0 0 0 / 0.5)',
                                    },
                                    },
                                })} 
                            >
                                <div style={{height:'100%'}}>
                                    {datos && datos.pt
                                        ?   datos.pt.map((v)=>{
                                            
                                            return(
                                                <Grid container spacing={1} key={v._id}>
                                                    <Grid xs={9}>
                                                        <MensajeTool
                                                            title={
                                                                <React.Fragment>
                                                                    <Typography color="inherit">{v.cantidadFinal>v.cantidadE ? `Cantidad de empaque insuficiente Inv. ${v.cantidadE}` : `${v.descripcion}`}</Typography>
                                                                </React.Fragment>
                                                            }
                                                        >
                                                            <Item sx={{textAlign:'left', backgroundColor: v.cantidadFinal>v.cantidadE ? error : ''}}>
                                                                <Typography variant="body2"  noWrap >
                                                                    {v.descripcion}
                                                                </Typography>
                                                            </Item>
                                                        </MensajeTool>
                                                    </Grid>
                                                    <Grid xs={3}>
                                                        <MensajeTool
                                                            title={
                                                                <React.Fragment>
                                                                    <Typography color="inherit">{`${v.cantidadFinal} EMP. de "${v.descripcion}"`}</Typography>
                                                                </React.Fragment>
                                                            }
                                                        >
                                                            <Item>
                                                                <Typography variant="body2"  noWrap  textAlign={'right'}>
                                                                    {v.cantidadFinal} EMP.
                                                                </Typography>
                                                            </Item>
                                                        </MensajeTool>
                                                        
                                                    </Grid>
                                                </Grid>)    
                                            
                                            })
                                        : null
                                    }
                                </div>
                            </Box>
                        </Item>
                    </Grid>
                    
                </Grid>
                <Grid
                    xs={12}
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    sx={{ fontSize: '12px', marginTop:1}}
                >
                    <Grid sx={{ order: { xs: 2, sm: 1 } }}>
                        <Item sx={{...datos && datos.producido ? {bgcolor:correcto}: {}}}>{datos && datos.mezcla ? datos.mezcla : '?'}</Item>
                    </Grid>
                    <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                        <Grid>
                            <Item sx={{...datos && datos.producido ? {bgcolor:correcto}: {}}}>Material Total: {datos && datos.total ? datos.total.toFixed(3) : '?'}</Item>
                        </Grid>
                        <Grid>
                            <Item sx={{...datos && datos.producido ? {bgcolor:correcto}: {}}}>Material Restante: {datos && datos.resta ? datos.resta.toFixed(3): '?'}</Item>
                        </Grid>
                        
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
