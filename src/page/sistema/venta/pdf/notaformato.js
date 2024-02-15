import * as React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { CabezeraCHS } from '../../../../componentes/reporte/cabezera';
import { InformacionFormatoCHS } from '../../../../componentes/reporte/informacion';
import TablaReporte from '../../../../componentes/reporte/tabla_reporte';
import { genera_formulario, Form_todos, Ver_Valores, Moneda } from '../../../../constantes';


export default function NotaEntregaFormato(props) {
    const [formulario,setFormulario] = React.useState();
    const {datos}= props;
    const Condicion = Ver_Valores().datos_reporte;
    const valores = datos ? datos.valores : undefined;
    const Tletra = 11;
    const Tletrad = 9;
    const productos = valores===undefined ? undefined : 
        valores.orden_venta.producto.map(val=>{
            const cantidad= val.cantidad ? val.cantidad : 1;
            const total= Number(cantidad) * Number(val.precio);
            return {...val, cantidad, total };
        })
    
    React.useEffect(()=>{
        const Iniciar = async()=>{
            let nuevos = await genera_formulario({valores:{}, campos: Form_todos('Form_venta_mostrar') });
            nuevos.titulos.producto.label='';
            nuevos.titulos.producto.style={
                height:185,
                borderColor:'#000',
                border:3,
            }
            
            setFormulario(nuevos);
        }
        Iniciar();
    },[props])
    const color = '#002060';
    const subtotal = valores 
                     && Condicion 
                     && Condicion.moneda._id===1 
                     ?  Number(valores.formapago.totales.subtotal).toFixed(2)
                     :  valores 
                     ?  Number(valores.formapago.totales.subtotal * Number(Condicion.tasa)).toFixed(2)
                     :'0,00';
    const desc = valores 
                && valores.formapago.totales.desc 
                && valores.formapago.totales.desc!==0 
                && valores.formapago.totales.desc!=='0'
                ? Number(subtotal * Number(valores.formapago.totales.desc) / 100).toFixed(2)
                :'0.00';
    const total = (Number(subtotal) - Number(desc)).toFixed(2) ;
    
    return (
        <Box sx={{ flexGrow: 1, bgcolor:'#fff', padding:2, 
                    width:612, height:700 
                }}>
        <Grid container spacing={0.5}>
            <Grid xs={12}>
                <div style={{height:72.5}}/>
            </Grid>
            <InformacionFormatoCHS {...props}/>
            <Grid xs={12}><div style={{height:20}}/></Grid>
            
            <Grid xs={0.25}></Grid>
            <Grid xs={11.5}>
                {formulario 
                    ? <TablaReporte datos={productos ? productos : []}  {...formulario && formulario.titulos ? formulario.titulos.producto : {}} Condicion={Condicion} nomostrar/>     
                    : null
                }
            </Grid>
            <Grid xs={0.25}></Grid>
            <Grid xs={6.7}/>
            <Grid xs={1}>
                <Typography color={color} fontSize={Tletra-2}>
                    {`${Condicion && Condicion.moneda._id===1 ? '$' : 'Bs.' }`}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra-2}>
                    {'TOTAL'}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra-2} align={'right'}>
                    {`${Moneda(subtotal, Condicion && Condicion.moneda._id===1 ? '$' : 'Bs', false)}`}
                </Typography>
            </Grid>
            <Grid xs={0.3}></Grid>
            <Grid xs={6.7}/>
            <Grid xs={1}>
                <Typography color={color} fontSize={Tletra-2}>
                    {`${valores 
                        && valores.formapago.totales.desc 
                        && valores.formapago.totales.desc!==0 
                        && valores.formapago.totales.desc!=='0' 
                        ? Number(valores.formapago.totales.desc) : '0,00'}%`}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra-2}>
                    {'DESCUENTO'}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra-2} align={'right'}>
                    {`${Moneda(desc, Condicion && Condicion.moneda._id===1 ? '$' : 'Bs', false)}`}
                </Typography>
            </Grid>
            <Grid xs={0.3}></Grid>
            <Grid xs={7.7}/>
            
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra - 2}>
                    {'TOTAL PAGAR'}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra-2} align={'right'}>
                    {`${Moneda(total, Condicion && Condicion.moneda._id===1 ? '$' : 'Bs', false)}`}
                </Typography>
            </Grid>
            <Grid xs={0.3}></Grid>
            
        </Grid>
        </Box>
    );
}
