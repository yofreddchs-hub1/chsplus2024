import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Formulario from '../../../componentes/herramientas/formulario';

const Item = styled(Paper)((props) =>{ 
    const {theme} = props;
    return({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    })
});

export default function Page_planificar(props) {
    const {Seleccion, MateriaPrima, CambioMP, ProductoTerminado, CambioPT, Total, Resta, Agregar, Producir, Formula} = props;
    const error='#A30E02';
    const correcto='#138E04';
    const alto = window.innerHeight * 0.225; //200;
    const espacio = 12;//6;
    
    return (
        <Box sx={{padding:0.8, marginBottom:0}}>
        <Grid container spacing={1}>
            <Grid xs={12} >
                <Item elevation={12} >{Seleccion 
                    ?
                        <div style={{marginBottom:-13}}>
                            <Formulario {...Seleccion}/> 
                        </div>
                    : '...'}
                </Item>
            </Grid>
            <Grid container xs={12} spacing={1}>
                <Grid xs={espacio} >
                    <Item elevation={12}>
                        <Box
                            id="category-a"
                            sx={{ fontSize: '16px', textTransform: 'uppercase', textAlign:'center' }}
                        >
                            Materia Prima
                        </Box>
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
                                {MateriaPrima 
                                
                                    ?
                                        MateriaPrima.map((v,i)=>{
                                            
                                            return(
                                                <Grid container spacing={1} key={i+v._id}>
                                                    <Grid xs={7}>
                                                        <Item sx={{backgroundColor: v.cantidad>v.actual ? error : '', textTransform: 'uppercase'}} 
                                                                title={v.cantidad>v.actual ? `Cantidad en inventario insuficiente (Inv.: ${v.actual})` : ''}
                                                        >
                                                            {v.descripcion}
                                                        </Item>
                                                    </Grid>
                                                    <Grid xs={3}>
                                                        
                                                        <TextField
                                                            id={v._id}
                                                            sx={{ m: 1, width: '90%' }}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="start">{v.unidad.value}</InputAdornment>,
                                                            }}
                                                            variant="standard"
                                                            value={v.cantidad}
                                                            type={'number'}
                                                            name={v._id}
                                                            onChange={CambioMP}
                                                        />
                                                        
                                                    </Grid>
                                                    <Grid xs={2}>
                                                        <Item sx={{backgroundColor: v.cantidad>v.actual ? error : '', textAlign:'right'}} 
                                                        >
                                                            {v.cantidadT} {v.unidad.value}
                                                        </Item>
                                                    </Grid>
                                                </Grid> 
                                            )   
                                            
                                        })
                                    : null
                                }
                            </div>
                        </Box>
                    </Item>
                </Grid>
                <Grid xs={espacio} >
                    <Item elevation={12}>
                        <Box
                            id="category-b"
                            sx={{ fontSize: '16px', textTransform: 'uppercase', textAlign:'center' }}
                        >
                            Producto(s) Terminado(s)
                        </Box>
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
                                {ProductoTerminado && ProductoTerminado.length===0
                                    ? 'No Existen productos terminados con esta formula'
                                    : ProductoTerminado
                                    ?
                                        ProductoTerminado.map((v,i)=>{
                                            
                                            return(
                                                <Grid container spacing={1} key={v._id + i}>
                                                    <Grid xs={9}>
                                                        <Item sx={{textAlign:'left', backgroundColor: v.cantidadFinal>v.cantidadE ? error : ''}}
                                                                title={v.cantidadFinal>v.cantidadE ? `Cantidad de empaque insuficiente Inv. ${v.cantidadE}` : ''}
                                                        >
                                                            {v.descripcion}
                                                        </Item>
                                                    </Grid>
                                                    <Grid xs={3}>
                                                        
                                                        <TextField
                                                            id={v._id}
                                                            sx={{ m: 1, width: '90%' }}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="start">EMP.</InputAdornment>,
                                                            }}
                                                            variant="standard"
                                                            value={v.cantidadFinal}
                                                            type={'number'}
                                                            name={v._id}
                                                            onChange={CambioPT}
                                                        />
                                                        
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
            sx={{ fontSize: '12px' }}
            >
            <Grid sx={{ order: { xs: 2, sm: 1 } }}>
                <Item sx={{bgcolor:Resta<0 || !Producir ? error : correcto}}>
                    <IconButton aria-label="delete" 
                                title={"Agregar a producción del día"} 
                                // disabled={Resta<0 || !Producir ? true : false}
                                onClick={Agregar}
                    >
                        <Icon fontSize="inherit">add_task</Icon>
                    </IconButton>
                </Item>
            </Grid>
            <Grid container columnSpacing={1} sx={{ order: { xs: 12, sm: 2 } }}>
                <Grid>
                <Item>M. Almacen: {Formula && Formula.actual ? Number(Formula.actual).toFixed(2) : '0.00'}</Item>
                </Grid>
                <Grid>
                <Item>M. Total: {Total ? Total.toFixed(2) : '?'}</Item>
                </Grid>
                <Grid>
                <Item>M. Restante: {typeof Resta==='number' ? Resta.toFixed(2): '?'}</Item>
                </Grid>
            </Grid>
            </Grid>
        </Grid>
        </Box>
    );
}
