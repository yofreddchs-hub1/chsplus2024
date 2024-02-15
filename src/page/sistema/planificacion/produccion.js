import React,{useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import GradingIcon from '@mui/icons-material/Grading';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Formulario from '../../../componentes/herramientas/formulario';
import { Form_todos, Ver_Valores, genera_formulario } from '../../../constantes';
import MostrarProduccion from './mostrar';
import Dialogo from '../../../componentes/herramientas/dialogo';
import Sindatos from '../../../componentes/herramientas/pantallas/sindatos';

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

export default function Produccion(props) {
    const {Seleccionar_dia, QuitardeProduccion, GuardarProduccion, EliminarProduccion} = props;
    const [formulario, setFormulario] = useState();
    const [dialogo, setDialogo]= useState({
        open:false,  
    });

    const Open_dialogo = (valor)=>{
        console.log(valor);
        setDialogo({
            ...dialogo, 
            open: !dialogo.open,
            Titulo:valor.mezcla,
            tam:'lg',
            Cuerpo:<MostrarProduccion datos={valor}/>,
            Cerrar: ()=>setDialogo({...dialogo,open:false}),
        })
    }
    const Config = Ver_Valores().Config;
    useEffect(()=>{
        const Inicio = async() =>{
            if (formulario!==undefined)
                setFormulario({...formulario, datos:{...formulario.datos, produccion:[]}});
            let {datos} = props;
            let dia = datos ? datos.dia : undefined;
            let nuevos = await genera_formulario({valores:datos, campos: Form_todos('Form_planificacion_dia') });
            nuevos.titulos.fecha.value= dia ? dia : new Date();
            nuevos.titulos.fecha.onAccept = Seleccionar_dia;
            // nuevos.titulos.produccion.value= datos && datos.produccion ? datos.produccion : []; 
            // nuevos.titulos.produccion.onChange= CambioProduccion;
            setFormulario(nuevos);
            
        }

        Inicio();
    },[props])

    const alto = window.innerHeight * 0.35;
    const error='#A30E02';
    const correcto='#138E04';
    return (
        <Box sx={{padding:1}}
        >
            <Grid container spacing={1}>
                <Grid xs={4}>
                    {formulario
                        ?   <div style={{ marginBottom:-20, marginTop: -10}}>
                                <Formulario {...formulario} Config={Config}/>
                            </div>
                        : null
                    }
                </Grid>
                <Grid xs={8}>
                    <Item sx={{backgroundColor:'#000'}}>
                        <IconButton aria-label="guardar" 
                                    title={"Guardar producción del día"} 
                                    onClick = {GuardarProduccion}
                                    disabled={props.datos.produccion.length===0}
                        >
                            <GradingIcon fontSize='large'/>
                        </IconButton>
                        {/* <IconButton aria-label="eliminar" 
                                    title={"Eliminar producción del día"} 
                                    onClick = {EliminarProduccion}
                        >
                            <DeleteIcon fontSize='large'/>
                        </IconButton> */}
                    </Item>

                </Grid>
            </Grid>
            <Box sx={(theme) => ({
                        height:window.innerHeight * 0.72,
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
                {props.datos && props.datos.produccion.length!==0
                    ?   props.datos.produccion.map((v,i)=>{
                            return(
                                <Box key={v._id} sx={{padding:1}}>
                                    <Grid container spacing={1}>
                                        <Grid xs={6} md={12}>
                                            <Item elevation={6} sx={{cursor:'pointer',  ...v.producido ? {bgcolor:correcto} : {}}} >
                                            <Stack direction="row" spacing={1}>
                                            {v.producido
                                                        ? null
                                                        :
                                                            <IconButton aria-label="delete" 
                                                                        title={"Quitar de lista de producción"} 
                                                                        onClick={()=>QuitardeProduccion(v)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                    }
                                                <Typography variant="h6"  noWrap title={`${v.mezcla} CANT. TROMPO: ${v.cantidad}`} onClick={()=>Open_dialogo(v)}>
                                                    
                                                    {v.mezcla} CANT. TROMPO: {v.cantidad}
                                                    
                                                </Typography>
                                            </Stack>
                                            </Item>
                                        </Grid>
                                        {/* <Grid xs={6} md={8}>
                                            <Item elevation={6}>
                                                <Typography variant="h6" gutterBottom>
                                                    {v.mezcla}
                                                </Typography>
                                            </Item>
                                        </Grid> */}
                                        
                                        {/* <Grid xs={6} md={6}>
                                            <Item elevation={6}>
                                                <Box
                                                    id="category-b"
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
                                                        {v.mp
                                                            ?
                                                                v.mp.map((m)=>{
                                                                    
                                                                    return(
                                                                    <Grid container spacing={1} key={m._id}>
                                                                        <Grid xs={9}>
                                                                            <Item sx={{textAlign:'left'}}>
                                                                                <Typography variant="body2" textTransform={'uppercase'}>
                                                                                    {m.descripcion}
                                                                                </Typography>
                                                                            </Item>
                                                                        </Grid>
                                                                        <Grid xs={3}>
                                                                            <Item sx={{textAlign:'right'}}>
                                                                                <Typography variant="body2"  noWrap title={`CANT. TROMPO: ${v.cantidad}`}>
                                                                                    {m.cantidad.toFixed(2)} {m.unidad.value}
                                                                                </Typography>
                                                                            </Item>
                                                                        </Grid>
                                                                    </Grid>)    
                                                                    
                                                                })
                                                            : null
                                                        }
                                                    </div>
                                                </Box>
                                                

                                            </Item>
                                        </Grid>
                                        <Grid xs={6} md={6}>
                                            <Item elevation={6}>
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
                                                        {v.mp
                                                            ?
                                                                v.pt.map((m)=>{
                                                                    
                                                                    return(
                                                                    <Grid container spacing={1} key={m._id}>
                                                                        <Grid xs={9}>
                                                                            <Item sx={{textAlign:'left'}}>{m.descripcion}</Item>
                                                                        </Grid>
                                                                        <Grid xs={3}>
                                                                            <Item sx={{textAlign:'right'}}>{m.cantidadFinal} Pza.</Item>
                                                                        </Grid>
                                                                    </Grid>)    
                                                                    
                                                                })
                                                            : null
                                                        }
                                                    </div>
                                                </Box>
                                            </Item>
                                        </Grid> */}
                                        <Grid
                                            xs={12}
                                            container
                                            justifyContent="space-between"
                                            alignItems="center"
                                            flexDirection={{ xs: 'column', sm: 'row' }}
                                            sx={{ fontSize: '12px' }}
                                            >
                                            <Grid sx={{ order: { xs: 2, sm: 1 } }}>
                                                <Item />
                                            </Grid>
                                            <Grid container columnSpacing={1} sx={{ order: { xs: 12, sm: 2 } }}>
                                                
                                                <Grid>
                                                    <Item>Material Total: {v.total ? v.total.toFixed(3) : '?'}</Item>
                                                </Grid>
                                                <Grid>
                                                    <Item>Material Restante: {v.resta ? v.resta.toFixed(3): '?'}</Item>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br/>
                                    <Divider/>
                                </Box>
                            )    
                        })
                    :   <Sindatos/>
                }
            </Box>
            <Dialogo  {...dialogo} config={props.Config}/>
        </Box>
    );
}
