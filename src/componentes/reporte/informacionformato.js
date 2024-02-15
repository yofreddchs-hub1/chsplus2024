import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import moment from 'moment';


export function InformacionFormatoCHS(props) {
    
    const {datos, Titulo, color_letra}= props;
    const valores = datos ? datos.valores : undefined;
    const Tletra = 15;
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
                        {`${moment().format('DD/MM/YYYY') }`}
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
