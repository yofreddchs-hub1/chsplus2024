import * as React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { CabezeraCHS } from '../../../../componentes/reporte/cabezera';
import { InformacionCHS } from '../../../../componentes/reporte/informacion';
import TablaReporte from '../../../../componentes/reporte/tabla_reporte';
import { genera_formulario, Form_todos, Ver_Valores, Moneda } from '../../../../constantes';


export default function NotaEntrega(props) {
    const [formulario,setFormulario] = React.useState();
    const {datos}= props;
    const Condicion = Ver_Valores().datos_reporte;
    const valores = datos ? datos.valores : undefined;
    const Tletra = 9;
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
                height:'auto',
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
                    width:612, height:396 //width:612, height:700 
                }}>
        <Grid container spacing={0}>
            <CabezeraCHS {...props}/>
            <InformacionCHS {...props}/>
            <Grid xs={12}>
                {formulario 
                    ? <TablaReporte datos={productos ? productos : []}  {...formulario && formulario.titulos ? formulario.titulos.producto : {}} Condicion={Condicion}/>     
                    : null
                }
            </Grid>
            <Grid xs={12}>
                <Box sx={{height:1.5, bgcolor:color}}/>
            </Grid>
            <Grid xs={7}/>
            <Grid xs={1}>
                <Typography color={color} fontSize={Tletra}>
                    {`${Condicion && Condicion.moneda._id===1 ? '$' : 'Bs.' }`}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra}>
                    {'TOTAL'}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra} align={'right'}>
                    {`${Moneda(subtotal, Condicion && Condicion.moneda._id===1 ? '$' : 'Bs', false)}`}
                </Typography>
            </Grid>
            <Grid xs={12}>
                <Box sx={{height:1.5, bgcolor:color}}/>
            </Grid>
            <Grid xs={7}/>
            <Grid xs={1}>
                <Typography color={color} fontSize={Tletra}>
                    {`${valores 
                        && valores.formapago.totales.desc 
                        && valores.formapago.totales.desc!==0 
                        && valores.formapago.totales.desc!=='0' 
                        ? Number(valores.formapago.totales.desc) : '0,00'}%`}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra}>
                    {'DESCUENTO'}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra} align={'right'}>
                    {`${Moneda(desc, Condicion && Condicion.moneda._id===1 ? '$' : 'Bs', false)}`}
                </Typography>
            </Grid>
            <Grid xs={8}/>
            
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra - 1}>
                    {'TOTAL PAGAR'}
                </Typography>
            </Grid>
            <Grid xs={2}>
                <Typography color={color} fontSize={Tletra} align={'right'}>
                    {`${Moneda(total, Condicion && Condicion.moneda._id===1 ? '$' : 'Bs', false)}`}
                </Typography>
            </Grid>
            
        </Grid>
        </Box>
    );
}
