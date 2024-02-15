import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Cargando from '../../../componentes/esperar/cargar';
import { conexiones, Generar_id, Ver_Valores } from '../../../constantes';

export default function PT(props) {
    const [datos,setDatos]=React.useState([]);
    React.useEffect(()=>{
        const Inicio= async()=>{
            let resp = await conexiones.Leer_C(['sistemachs_Inventariopt'],{sistemachs_Inventariopt:{}});
            if (resp.Respuesta==='Ok'){
                const sede = Ver_Valores().sede;
                let dat = resp.datos.sistemachs_Inventariopt
                    .filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) )
                    .sort((a,b)=> a.valores.categoria && b.valores.categoria && (a.valores.categoria.titulo>b.valores.categoria.titulo) ? 1 : -1);
                // const mayor = dat.filter(f=> Number(f.valores.actual)>Number(f.valores.minimo) && f.valores.minimo!=='');
                // const menor = dat.filter(f=> Number(f.valores.actual)<=Number(f.valores.minimo) || f.valores.minimo==='');
                // dat=[...menor,...mayor]
                setDatos(dat);
            }
            props.socket.on(`Actualizar_produccion`, data => {
                Inicio();  
            })
            props.socket.on(`Actualizar`, data => {
                Inicio();  
            })
        }
        Inicio()
    },[props])
    const alto=props.Alto ? props.Alto : window.innerHeight * 0.50;
    const error='#AA9309';
    const correcto='#138E04';
    let anterior
    return (
        <Box>
            <Box
                id="category-b"
                sx={{ fontSize: '20px', textTransform: 'uppercase', textAlign:'center', backgroundColor:'#000C89', borderTopLeftRadius:8, borderTopRightRadius:8 }}
            >
                Productos Terminados
            </Box>
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    padding:0.5,
                    gap: 3,
                    height: alto,
                    textTransform: 'uppercase',
                    backgroundColor:'#000000',
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
                <div style={{height:'100%', paddingTop:10}}>
                    {datos
                        ?   datos.map(val=>{
                                let titulo = null;
                                if (val.valores.categoria && anterior!==val.valores.categoria.titulo){
                                    
                                    anterior= val.valores.categoria.titulo
                                    titulo = <Box sx={{borderBottom:3, marginBottom:2}}>
                                        <Typography title={'Categoria'}>{anterior}</Typography>
                                    </Box>
                                }
                                
                                return(
                                    <Box key={Generar_id()}>
                                        {titulo}
                                        <Box key={val._id}
                                                sx={{
                                                    backgroundColor:Number(val.valores.actual)> Number(val.valores.minimo) && val.valores.minimo!=='' ? correcto : error, 
                                                    marginBottom:2, borderRadius:2, width:'100%', padding:1,
                                                }}
                                        >
                                            <Grid container wrap="nowrap" spacing={0.5} alignItems="center">
                                                <Grid item xs={8} zeroMinWidth>
                                                    <Typography noWrap textAlign={'left'}>{val.valores.descripcion}</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Grid container spacing={0.5} textAlign={'right'}>
                                                        <Grid item xs={12}>
                                                            <Typography title={'Cantidad actual'}>{Number(val.valores.actual)} EMP.</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} textAlign={'right'}>
                                                            <Typography title={'Cantidad minima'}>{Number(val.valores.minimo)} EMP.</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            
                                        </Box>
                                    </Box>
                                )
                            })
                        :   <Cargando open={true}/>
                    }
                </div>
            </Box>
        </Box>
    );
}

