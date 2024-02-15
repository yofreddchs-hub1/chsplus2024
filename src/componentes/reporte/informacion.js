import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import moment from 'moment';


export function InformacionCHS(props) {
    
    const {datos, color_letra}= props;
    const valores = datos ? datos.valores : undefined;
    const Tletra = 9.5;
    const color = color_letra ? color_letra : '#002060';
    return (
        <Grid container spacing={0.5}>
            <Grid xs={7}/>
            <Grid xs={5}>
                <Box>
                    <Typography color={color} 
                                fontSize={Tletra}
                                align={'right'}
                                sx={{ fontWeight:'bold'}}
                                
                    >
                        {`Santa Ana de Coro: ${valores && valores.fecha ? moment(valores.fecha).format('DD MM YYYY') : ''}`}
                    </Typography>
                </Box>
            </Grid>
            <Grid xs={3.5}>
                <Box>
                    <Typography color={color} fontSize={Tletra} fontWeight={'bold'}>
                        { !props.nomostrar ? `Nombre o Razón Social: ` : ''}
                    </Typography>
                </Box>
            </Grid>
            <Grid xs={5.5}>
                <Box>
                    <Typography color={color} fontSize={Tletra} >
                        {`${valores && valores.orden_venta ? valores.orden_venta.cliente.nombre : ''}`}
                    </Typography>
                </Box>
            </Grid>
            <Grid xs={3}>
                <Box>
                    <Typography color={color} fontSize={Tletra}>
                        {`${!props.nomostrar ? 'RIF:' : ''} ${valores && valores.orden_venta ? valores.orden_venta.cliente.rif : ''}`}
                    </Typography>
                </Box>
            </Grid>
            <Grid xs={2}>
                <Box>
                    <Typography color={color} fontSize={Tletra} fontWeight={'bold'}>
                        {!props.nomostrar ? `Dirección: ` : ''}
                    </Typography>
                </Box>
            </Grid>
            <Grid xs={10}>
                <Box>
                    <Typography color={color} fontSize={Tletra-2}>
                        {`${valores && valores.orden_venta ? valores.orden_venta.cliente.direccion : ''}`}
                    </Typography>
                </Box>
            </Grid>
            <Grid xs={2}>
                <Box>
                    <Typography color={color} fontSize={Tletra} fontWeight={'bold'}>
                        {!props.nomostrar ? `Teléfono: ` : ''}
                    </Typography>
                </Box>
            </Grid>
            <Grid xs={10}>
                <Box>
                    <Typography color={color} fontSize={Tletra - 2}>
                        {`${valores && valores.orden_venta ? valores.orden_venta.cliente.telefono : ''}`}
                    </Typography>
                </Box>
            </Grid>
            
        </Grid>
    );
}

export function InformacionFormatoCHS(props) {
    
    const {datos, Titulo, color_letra, Condicion}= props;
    const valores = datos ? datos.valores : undefined;
    const Tletra = 9;
    const color = color_letra ? color_letra : '#002060';
    let direccion = valores && valores.orden_venta ? valores.orden_venta.cliente.direccion : '';
    let direccion1 ='';
    if (direccion.length>90){
        direccion1 = direccion.substr(91);
        direccion = direccion.substr(0,91);
    }
    const titulo =  Condicion && Condicion.destino ? `${Condicion.destino}` :'';
    return (
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0.6}>
            
            <Grid item xs={1}><Typography color={color} fontSize={Tletra} fontWeight={'bold'}></Typography></Grid>
            <Grid item xs={2}><Typography color={color} fontSize={Tletra} >{moment().format('DD/MM/YYYY')}</Typography></Grid>
            <Grid item xs={2}><Typography color={color} fontSize={Tletra} fontWeight={'bold'}></Typography></Grid>
            <Grid item xs={7}>
                <Typography color={color} fontSize={Tletra} fontWeight={'bold'}>
                    {`${valores && valores.orden_venta ? valores.orden_venta.cliente.nombre : ''}`}
                </Typography>
            </Grid>
            
            <Grid item xs={1.5}><Typography color={color} fontSize={Tletra}></Typography></Grid>
            <Grid item xs={10.5}>
                <Typography color={color} fontSize={Tletra-2}>
                    {`${direccion}`}
                </Typography>
            </Grid>
            
            <Grid item xs={0.5}>
                <Typography color={color} fontSize={Tletra} >
                </Typography>
            </Grid>
            <Grid item xs={7.5}>
                <Typography color={color} fontSize={Tletra-2} noWrap>
                    {direccion1}
                </Typography>
            </Grid>
            
            <Grid item xs={2}>
                <Typography color={color} fontSize={Tletra-2} >
                    {`${valores && valores.orden_venta ? valores.orden_venta.cliente.telefono : ''}`}
                </Typography>
            </Grid>
            <Grid item xs={0.4}><Typography color={color} fontSize={Tletra} fontWeight={'bold'}></Typography></Grid>
            <Grid item xs={1.6}>
                <Typography color={color} fontSize={Tletra-2}>
                    {valores && valores.orden_venta ? valores.orden_venta.cliente.rif : ''}
                </Typography>
            </Grid>
            <Grid item xs={1.6}><Typography color={color} fontSize={Tletra}></Typography></Grid>
            <Grid item xs={10.4}>
                <Typography color={color} fontSize={Tletra-2}>
                    {`${titulo}`}
                </Typography>
            </Grid>
        </Grid>
        </Box>
    );
}
