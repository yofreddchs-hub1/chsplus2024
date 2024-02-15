import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { Form_todos,conexiones, genera_formulario } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Page(props) {
    const {Seleccionar_dia, Config} = props;
    const [formulario, setFormulario] = useState();
    const [produccion, setProduccion] = useState(0);
    const [cargando, setCargando] = useState(false);

    useEffect(()=>{
        
        const Inicio = async() =>{
            let {datos} = props;
            let dia = datos ? datos.dia : undefined;
            let nuevos = await genera_formulario({valores:datos, campos: Form_todos('Form_planificacion_dia') });
            nuevos.titulos.fecha.value= dia ? dia : new Date();
            nuevos.titulos.fecha.onAccept = Seleccionar_dia;
            setFormulario(nuevos);
            setProduccion(datos.produccion.length!==0 ? datos.produccion[0] : 0);
            
        }

        Inicio();
    },[props.datos])

    const CambioMP = (event)=>{
        let {name, value} = event.target;
        let nuevo = {...produccion};
        const pos = nuevo.mp.findIndex(f=>f._id===name);
        nuevo.mp[pos].cantidadr = Number(value);
        setProduccion(nuevo);
    }
    const CambioPT = (event)=>{
        let {name, value} = event.target;
        let nuevo = {...produccion};
        const pos = nuevo.pt.findIndex(f=>f._id===name);
        nuevo.pt[pos].cantidadFinalr = Number(value);
        setProduccion(nuevo);
    }
    const Enviar = async()=>{
        setCargando(true);
        let nuevos = {...props.datos};
        const pos = nuevos.produccion.findIndex(f=>f._id===produccion._id);
        nuevos.produccion[pos]={...produccion, producir:true};
        // console.log(nuevos)
        await conexiones.Guardar_produccion(nuevos);
        
        props.Refrescar(new Date(props.datos.dia));
        setCargando(false);
    }
    const alto = window.innerHeight * 0.86;
    const correcto='#138E04';
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
                <Grid xs={4}>
                    <Item sx={{height:alto}} elevation={12}>
                        {formulario
                            ?   <div>
                                    <div style={{ marginBottom:-20, marginTop: -10}}>
                                        <Formulario {...formulario} Config={Config}/>
                                    </div>
                                    <Divider />
                                </div>
                            : null
                        }
                        <Typography variant="h6">Producción del día</Typography>
                        <Divider />
                        <Box sx={(theme) => ({
                                height:alto * 0.8,///window.innerHeight * 0.72,
                                overflow: 'hidden auto',
                                padding:0.5,
                                '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                                '&::-webkit-scrollbar-thumb': {
                                    borderRadius: 8,
                                    border: '2px solid',
                                    borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                                    backgroundColor: 'rgba(0 0 0 / 0.5)',
                                },
                            })}
                        >
                            {props.datos 
                                ?   props.datos.produccion.map((val,i)=>
                                        <Item key={val._id} 
                                                sx={{   marginBottom:1, cursor:'pointer', 
                                                        backgroundColor: val.producido ? correcto : '',
                                                        opacity: produccion===val  ? 0.5 : 1
                                                    }} 
                                                onClick={()=>setProduccion(val)}
                                                title={val.producido ? `Ya fue producido` : ''}
                                        >
                                            <Typography variant="h6">{val.mezcla}</Typography>
                                        </Item>
                                    )
                                : null
                            }
                                
                        </Box>
                    </Item>
                </Grid>
                <Grid xs={8}>
                    <Item sx={{height:alto}} elevation={12}>
                        <Box sx={(theme) => ({
                                height:'100%',///window.innerHeight * 0.72,
                                overflow: 'hidden auto',
                                padding:0.5,
                                '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                                '&::-webkit-scrollbar-thumb': {
                                    borderRadius: 8,
                                    border: '2px solid',
                                    borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                                    backgroundColor: 'rgba(0 0 0 / 0.5)',
                                },
                            })}
                        >
                            <Typography variant="h6" color={produccion.producido ? correcto : ''}>{produccion!==0 ? produccion.mezcla : ''}</Typography>
                            <Grid container>
                                <Grid item xs={4}><Item sx={{fontSize:20}}>Cantidad de Trompos: {produccion.cantidad}</Item></Grid>
                                <Grid item xs={4}><Item sx={{fontSize:20}}>Formula Total: {Number(produccion.total).toFixed(2)} Kg.</Item></Grid>
                                <Grid item xs={4}><Item sx={{fontSize:20}}>Sobran: {Number(produccion.resta).toFixed(2)}  Kg.</Item></Grid>
                            </Grid>
                            <Typography variant="h6" sx={{textTransform: 'uppercase',}}>Materias Primas</Typography>
                            <Divider />
                            <Grid container alignItems="center">
                                <Grid item xs={4}><Item elevation={6}>DESCRIPCION</Item></Grid>
                                <Grid item xs={4}><Item elevation={6}>CANTIDAD</Item></Grid>
                                <Grid item xs={4}><Item elevation={6}>CANTIDAD REAL</Item></Grid>
                            </Grid>
                            <Divider />
                            {produccion.mp
                                ?   produccion.mp.map(val=>
                                        <Grid container key={val._id} alignItems="center">
                                            <Grid item xs={4}><Item>{val.descripcion}</Item></Grid>
                                            <Grid item xs={4}><Item>{val.cantidadT} {val.unidad ? val.unidad.value : ''}</Item></Grid>
                                            <Grid item xs={4}>
                                                
                                                    <TextField
                                                        id={val._id}
                                                        sx={{ m: 1, width: '90%' }}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="start">{val.unidad ? val.unidad.value : ''}</InputAdornment>,
                                                        }}
                                                        variant="standard"
                                                        value={val.cantidadr}
                                                        type={'number'}
                                                        name={val._id}
                                                        onChange={CambioMP}
                                                    />    
                                                
                                            </Grid>
                                        </Grid>

                                    )
                                :   null
                            }
                            <Typography variant="h6" sx={{textTransform: 'uppercase',}}>Producto(s) Terminado(s)</Typography>
                            <Divider />
                            <Grid container alignItems="center">
                                <Grid item xs={6}><Item elevation={6}>DESCRIPCION</Item></Grid>
                                <Grid item xs={3}><Item elevation={6}>CANTIDAD</Item></Grid>
                                <Grid item xs={3}><Item elevation={6}>CANTIDAD REAL</Item></Grid>
                            </Grid>
                            <Divider />
                            {produccion.pt
                                ?   produccion.pt.map(val=>
                                        <Grid container key={val._id} alignItems="center">
                                            <Grid item xs={6}><Item>{val.codigo}-{val.descripcion}</Item></Grid>
                                            <Grid item xs={3}><Item>{val.cantidadFinal} {val.empaque ? val.empaque.descripcion : ''}</Item></Grid>
                                            <Grid item xs={3}>
                                                
                                                    <TextField
                                                        id={val._id}
                                                        sx={{ m: 1, width: '90%' }}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="start">{'EMP.'}</InputAdornment>,
                                                        }}
                                                        variant="standard"
                                                        value={val.cantidadFinalr}
                                                        type={'number'}
                                                        name={val._id}
                                                        onChange={CambioPT}
                                                    />    
                                                
                                            </Grid>
                                        </Grid>

                                    )
                                :   null
                            }
                            <br/>
                            <Divider />
                            <Item elevation={6}>
                                <Button variant="contained" onClick={Enviar} 
                                        sx={{...props.Config ? props.Config.Estilos.Botones.Aceptar : {}, color:'#fff'}}
                                        title={'Guarda la información de la producción'}
                                        disabled={!produccion._id || produccion.producido || (cargando && !produccion.producido)}
                                        startIcon={cargando ? <CircularProgress /> : null }
                                >
                                    Procesar producción
                                </Button>
                            </Item>
                            <Divider />
                        </Box>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}
