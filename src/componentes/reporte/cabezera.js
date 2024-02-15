import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import logo from '../../imagenes/logor.png';


export function CabezeraCHS(props) {
    
    const {datos, Titulo, color_letra}= props;
    const valores = datos ? datos.valores : undefined;
    const Tletra = 9;
    const Tletrad = 8;
    const color = color_letra ? color_letra : '#002060';
    const titulo = Titulo ? `${Titulo}` :'NOTA DE ENTREGA';
    return (
        
        <Grid container spacing={0.3}>
            <Grid xs={3.7}>
                <Box component={'div'}>
                    <img alt='logo' src={logo} height={35}/>   
                </Box>
                <Grid xs={12}>
                    <Typography color={color}  
                                fontSize={Tletra}
                                sx={{ fontWeight:'bold'}} 
                                
                    >
                        {titulo}
                    </Typography>
                </Grid>
                {valores && valores.recibo ?
                    <Grid xs={12}>
                        <Box>
                            <Typography color={color} 
                                        fontSize={Tletrad}
                                        fontFamily={'Aharoni'}
                                        sx={{ fontWeight:'bold'}}           
                            >
                                {`ORDEN NRO.: ${valores && valores.recibo ? valores.recibo : ''}`}
                            </Typography>
                        </Box>
                    </Grid>
                    :null
                }

            </Grid>
            <Grid xs={7.5}>
                <Box >
                    <Typography color={color}  
                                fontSize={Tletrad}
                                fontFamily={'Calibri (Cuerpo)'}
                                sx={{ fontWeight:'bold'}}           
                    >
                        CHS Construcciones y Materiales, C.A.
                    </Typography>
                    <Typography color={color}  
                                fontSize={Tletrad}
                                fontFamily={'Calibri (Cuerpo)'}
                                sx={{ fontWeight:'bold'}}           
                    >
                        J-40688784-6
                    </Typography>
                    <Typography color={color} 
                                fontSize={Tletrad}
                                fontFamily={'Calibri (Cuerpo)'}
                                sx={{ fontWeight:'bold'}}           
                    >
                        Av. Ramón Antonio Medina, Casa #2, Urb. Monche Soto, Coro-Edo.
                    </Typography>
                    <Typography color={color} 
                                fontSize={Tletrad}
                                fontFamily={'Calibri (Cuerpo)'}
                                sx={{ fontWeight:'bold'}}           
                    >
                        Falcón. 0426-1635453
                    </Typography>
                </Box>
                <Grid xs={12}>
                    <Box>
                        <Typography color={color} 
                                    align={'center'}
                                    fontSize={Tletra}
                                    sx={{ fontWeight:'bold'}}           
                        >
                            {`SOMOS TRANQUILIDAD Y CONFIANZA PARA TI..!`}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            
            <Grid xs={12}>
                <Box sx={{height:1.5,width:575, bgcolor:color}}/>
            </Grid>
            
        </Grid>
    );
}
