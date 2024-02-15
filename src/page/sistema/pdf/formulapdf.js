import * as React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { CabezeraCHS } from '../../../componentes/reporte/cabezera';
import TablaReporte from '../../../componentes/reporte/tabla_reporte';

export default function Formulapdf(props) {
    const {datos}= props;
    const valores = datos ? datos : undefined;

    React.useEffect(()=>{
        const Iniciar = async()=>{
            
        }
        Iniciar();
    },[props])
    const color = '#000000';
    
    return (
        <Box sx={{ flexGrow: 1, bgcolor:'#fff', padding:2, 
                    ...props.sizePagina ? props.sizePagina : {width:612, height:700} 
                }}
        >
            <Grid container spacing={0.5}>
                <CabezeraCHS {...props} Titulo={`Formula: ${valores ? valores.mezcla : ''}`}/>
                <TablaReporte datos={valores.formulas} titulos='Titulos_formula_mp_d'/> 
                <Grid xs={12}>
                    <Box sx={{height:1.5, bgcolor:color}}/>
                </Grid>
                
            </Grid>
        </Box>
    );
}
