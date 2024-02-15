import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Cargando from '../../../componentes/esperar/cargar';
import { formatoBolivar, Form_todos, genera_formulario, Moneda } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';
import Scrollbars from '../../../componentes/herramientas/scrolbars';
import TablaMostrar from '../../../componentes/herramientas/tablamostrar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.subtitle1,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    textTransform:'uppercase'
}));

export default function ConfirmarPago(props) {
    const [formulario, setFormulario] = useState();
    const [cargando, setCargando] = useState(true);
    let {Config, formapago, orden_venta} = props;
    const Guardar= async(valores)=>{    
        if (props.Procesar){
            props.Procesar({valores, tipo:'FormaPago'});
        }   
    }

    const Inicio= async()=>{
        setCargando(true)
        let {formapago, orden_venta, pendiente} = props;
        let nuevos = await genera_formulario({valores:{...orden_venta}, campos: Form_todos('Form_venta') });
        nuevos.titulos=[nuevos.titulos[1]];
        nuevos.titulos[0].value.producto.Form = undefined;
        nuevos.titulos[0].value.producto.style={height:200, marginBottom:5};
        let totales={...orden_venta['producto-subtotal']}
        let nuevos1 = await genera_formulario({valores:{...formapago, totales}, campos: Form_todos('Form_FormasPago') });
        nuevos1.titulos.formapago.Form = undefined;
        nuevos1.titulos.formapago.style={height:180, marginBottom:5};
        let botones = {
            datos:{},
            titulos:{},
            botones:[
                ... props.Atras 
                    ? [{
                        name:'atras', label:'Atras', title:'Atras',
                        variant:"contained", color:"success", 
                        onClick: props.Atras, 
                        sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                    }]
                    : [] ,
                ...pendiente || pendiente===undefined
                ?[
                    {
                    name:'procesar', label:'Procesar', title:'Procesar',
                    variant:"contained", color:"success", 
                    onClick: Guardar,
                    sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                    confirmar:'true', confirmar_mensaje:'Desea guardar cambios?'
                    }
                ]
                :[]
            ]
        }
        setFormulario({orden: nuevos, formapago:nuevos1, botones});
        setCargando(false)
    }

    React.useEffect(()=>{
        
        Inicio()
    },[])
    
    return (
        <div style={{width:'100%', height:'100%',position: "relative"}}>
            <Scrollbars sx={{height:'100%',padding:2}}>
            
                <Grid container spacing={1}>
                    <Grid xs={4}>
                        <Item elevation={6}>Control: {orden_venta && orden_venta.recibo ? orden_venta.recibo : 'np'}</Item>
                    </Grid>
                    <Grid xs={8}>
                        <Item elevation={6}>Cliente: {orden_venta && orden_venta.cliente ? orden_venta.cliente.nombre : ''}</Item>
                    </Grid>
                    <Grid xs={12}>
                        <Item elevation={6}>
                            {formulario ? 
                                <TablaMostrar datos={orden_venta && orden_venta.producto ? {movimiento:orden_venta.producto} : {movimiento:[]}}  {...formulario && formulario.orden.titulos ? formulario.orden.titulos[0].value.producto : {}}/>     
                                : null
                            }
                        </Item>
                    </Grid>
                    <Grid xs={12}>
                        <Item elevation={6}>
                            {formulario ? 
                                <TablaMostrar datos={formapago && formapago.formapago ? {movimiento:formapago.formapago} : {movimiento:[]}}  {...formulario && formulario.formapago.titulos ? formulario.formapago.titulos.formapago : {}}/>     
                                : null
                            }
                        </Item>
                    </Grid>
                    <Grid container xs={12}>
                        {/* Izquierda */}
                        <Grid xs={6}>
                            <Grid xs={12}>
                            
                                <Stack sx={{ width: '100%', marginTop:1, padding:1 }} spacing={2}>
                                    {formapago['formapago-subtotal'] && formapago['formapago-subtotal'].restan
                                        ?   <Alert severity="error">Pendiente $ {formapago['formapago-subtotal'].restan.toFixed(2)}</Alert>
                                        :   null
                                        // :   <Alert severity="success"></Alert>
                                    
                                    }
                                </Stack>
                                
                            </Grid>
                            <Grid xs={12}>
                                <div style={{marginTop:-10}}>
                                    {formulario 
                                        ?   <Formulario {...formulario.botones}/>
                                        :   null
                                    }
                                </div>
                            </Grid>
                        </Grid>
                        {/* Derecha */}
                        <Grid xs={6}>
                            <Grid
                                xs={12}
                                container
                                justifyContent="space-between"
                                alignItems="center"
                                flexDirection={{ xs: 'column', sm: 'row' }}
                                sx={{ fontSize: '12px' }}
                            >
                                <Grid sx={{ order: { xs: 2, sm: 1 } }}/>
                                    
                                <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                                    <Grid>
                                        <Item elevation={6}>Tasa {formapago && formapago.totales ? Moneda(formapago.totales.Tasa) : 0 }</Item>
                                    </Grid>
                                    <Grid>
                                        <Item elevation={6}>Total</Item>
                                    </Grid>
                                    <Grid>
                                        <Item sx={{width:100, textAlign:'right'}} elevation={6}> {formapago && formapago.totales ? Moneda(formapago.totales.total,'$') : 0}</Item>
                                    </Grid>
                                    {/* <Grid>
                                        <Item sx={{width:130, textAlign:'right'}} elevation={6}>{formapago && formapago.totales ? Moneda(formapago.totales.totalb) : 0}</Item>
                                    </Grid> */}
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
                                <Grid sx={{ order: { xs: 2, sm: 1 } }}/>
                                    
                                <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                                    <Grid>
                                        <Item elevation={6}>Cancelado</Item>
                                    </Grid>
                                    <Grid>
                                        <Item sx={{width:100, textAlign:'right'}} elevation={6}>
                                            {formapago && formapago['formapago-subtotal'] 
                                                ? Moneda(formapago['formapago-subtotal'].total, '$')
                                                : Moneda(0,'$') 
                                            }
                                        </Item>
                                    </Grid>
                                    {/* <Grid>
                                        <Item sx={{width:130, textAlign:'right'}} elevation={6}>
                                            {formapago && formapago['formapago-subtotal'] 
                                                    ? Moneda(formapago['formapago-subtotal'].totalb)
                                                    : Moneda(0)
                                            }
                                        </Item>
                                    </Grid> */}
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
                                <Grid sx={{ order: { xs: 2, sm: 1 } }}/>
                                    
                                <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
                                    <Grid>
                                        <Item elevation={6}>Restante</Item>
                                    </Grid>
                                    <Grid>
                                        <Item sx={{width:100, textAlign:'right'}} elevation={6}>
                                            {formapago && formapago['formapago-subtotal'] && formapago['formapago-subtotal'].restan 
                                                    ? Moneda(formapago['formapago-subtotal'].restan,'$')
                                                    : Moneda(0, '$') 
                                            }
                                        </Item>
                                    </Grid>
                                    {/* <Grid>
                                        <Item sx={{width:130, textAlign:'right'}} elevation={6}>
                                            {formapago && formapago['formapago-subtotal'] && formapago['formapago-subtotal'].restanb 
                                                    ? Moneda(formapago['formapago-subtotal'].restanb) 
                                                    : Moneda(0) 
                                            }
                                        </Item>
                                    </Grid> */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                </Grid>
                
            </Scrollbars>
            <Cargando open={cargando} Config={props.Config}/>
        </div>
    );
}

