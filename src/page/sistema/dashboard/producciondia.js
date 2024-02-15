import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import moment from "moment";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { conexiones, Ver_Valores } from '../../../constantes';

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

export default function ProduccionDia(props) {
    const [datos,setDatos]=React.useState();
    React.useEffect(()=>{
        const Inicio= async()=>{
            const dia = new Date();
            const {tipo} = Ver_Valores();
            const Resp =  await conexiones.Leer_C(['sistemachs_Produccion','sistemachs_Inventariomp'],
                {
                    sistemachs_Produccion: tipo==='Electron'
                        ? {"valores.dia": moment(dia).format('MM/DD/YYYY')}
                        : {$text: {$search: moment(dia).format('MM/DD/YYYY'), $caseSensitive: false}
                    },
                    sistemachs_Inventariomp:{},
                    sistemachs_Empaque:{}
                }
            );
            if (Resp.Respuesta==='Ok'){
                const sede = Ver_Valores().sede;
                let dat= Resp.datos.sistemachs_Produccion
                    .filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) )
                    .filter(f=>f.valores.dia === moment(dia).format('MM/DD/YYYY') );
                let inventario = Resp.datos.sistemachs_Inventariomp.filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) );
                const empaques = Resp.datos.sistemachs_Empaque.filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) );
                let mezclas=[];
                let materiasPrima=[];
                let productoTerminado=[];
                if (dat.length!==0){
                    dat[0].valores.produccion.map(val=>{
                        if (!val.producido){
                            mezclas=[...mezclas, {_id:val._id, mezcla:val.mezcla, cantidad:val.cantidad}]
                            val.mp.map(m=>{
                                const pos = materiasPrima.findIndex(f=> f._id===m._id);
                                const pos1 = inventario.findIndex(f=> f._id===m._id );
                                if(pos===-1){
                                    materiasPrima=[...materiasPrima, {_id:m._id, unidad:m.unidad, descripcion:m.descripcion, 
                                        cantidad:Number(m.cantidad), codigo:m.codigo, actual:inventario[pos1].valores.actual}]
                                }else{
                                    materiasPrima[pos].cantidad+=Number(m.cantidad);
                                }
                                return m;
                            })
                            val.pt.map(p=>{
                                const pos = empaques.findIndex(f=> p.empaque && f._id===p.empaque._id);
                                let cantidadE = 0;
                                if (pos!==-1){
                                    cantidadE = empaques[pos].valores.actual ? Number(empaques[pos].valores.actual) : 0;
                                }
                                productoTerminado=[...productoTerminado, {...p, cantidadE}];
                                return p;
                            })
                        }    
                        return val
                    })
                    setDatos({mezclas, materiasPrima, productoTerminado});
                }else{
                    setDatos({});
                }
            }
            props.socket.on(`Actualizar`, data => {
                Inicio();
            })
        }
        Inicio()
    },[props])
    
    const Mostrar = (props) =>{
        const {Titulo, children} = props;
        return(
            <Box>
                <Box
                    sx={{borderRadius:2, width:'100%',}}
                >
                    {Titulo}
                </Box>
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        padding:1,
                        gap: 1,textTransform: 'uppercase', textAlign:'left',
                        height: alto * 0.85,
                        // backgroundColor:'#000C89',
                        // '& > div': {
                            overflow: 'hidden auto',
                            '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                            '&::-webkit-scrollbar-thumb': {
                                borderRadius: 8,
                                border: '2px solid',
                                borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                                backgroundColor: 'rgba(0 0 0 / 0.5)',
                            },
                        // },
                    })}
                >
                    {children}
                </Box>
            </Box>
        )
    }
    const alto=props.Alto ? props.Alto : window.innerHeight * 0.50;
    const error='#A30E02';
    // const correcto='#138E04';
    return (
        <Box>
            <Box
                id="category-b"
                sx={{ fontSize: '20px', textTransform: 'uppercase', textAlign:'center', backgroundColor:'#000C89', borderTopLeftRadius:8, borderTopRightRadius:8 }}
            >
                Producción Planificada en el Dia
            </Box>
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    padding:0.5,
                    gap: 3,
                    height: alto,
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
                    <Grid container wrap="nowrap" spacing={0.5} alignItems="center" >
                        <Grid item xs={4} zeroMinWidth>
                            <Mostrar Titulo={'FORMULAS'}>
                               {datos && datos.mezclas
                                    ?   datos.mezclas.map(val=>
                                            <Item  key={val._id}>
                                                <Grid container spacing={0.5} alignItems="center">
                                                    <Grid item xs={9}>
                                                        <Typography noWrap>{val.mezcla}</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography textAlign={'right'}>Cant.:{val.cantidad}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Item> 
                                        
                                        )
                                    :   null
                               }
                            </Mostrar>

                        </Grid>
                        <Grid item xs={4} zeroMinWidth>
                            <Mostrar Titulo={'MATERIAS PRIMA'}>
                                {datos && datos.materiasPrima
                                    ?   datos.materiasPrima.map(val=>
                                            <Item key={val._id}>
                                                <Grid container spacing={0.5} alignItems="center">
                                                    <Grid item xs={9}>
                                                        <Typography noWrap color={Number(val.cantidad)>Number(val.actual) ? '#EE2B1B' : ''}>{val.descripcion}</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography textAlign={'right'} color={Number(val.cantidad)>Number(val.actual) ? '#EE2B1B' : ''}>{val.cantidad.toFixed(2)} {val.unidad && val.unidad.value ? val.unidad.value : '' }</Typography>
                                                    </Grid>
                                                </Grid> 
                                            </Item>
                                        )
                                    :   null
                               }
                            </Mostrar>
                        </Grid>
                        <Grid item xs={4} zeroMinWidth>
                            <Mostrar Titulo={'PRODUCTOS TERMINADOS'}>
                                {datos && datos.productoTerminado
                                    ?   datos.productoTerminado.map(val=>
                                            <Item key={val._id} sx={{backgroundColor: val.cantidadFinal>val.cantidadE ? error : ''}}
                                                    title={val.cantidadFinal>val.cantidadE ? `Cantidad de empaque insuficiente Inv. ${val.cantidadE}` : ''}
                                            >
                                                <Grid container spacing={0.5} alignItems="center">
                                                    <Grid item xs={9}>
                                                        {val.descripcion}
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography textAlign={'right'}>{val.cantidadFinal} EMP.</Typography>
                                                    </Grid>
                                                </Grid> 
                                            </Item>
                                        )
                                    :   null
                               }
                            </Mostrar>
                        </Grid>
                    </Grid>
                    {//datos && datos.mezclas
                        // ?   datos.mezclas.map(v=>
                        //     <Grid container wrap="nowrap" spacing={0.5} alignItems="center" key={v._id}>
                        //         <Grid item xs={6} zeroMinWidth>
                        //             <Box key={val._id}
                        //                     sx={{
                                                
                        //                         borderRadius:2, width:'100%',
                        //                     }}
                        //             >
                        //                 MATERIA PRIMA
                        //             </Box>
                        //             <Box
                        //                 sx={(theme) => ({
                        //                     display: 'flex',
                        //                     flexDirection: 'column',
                        //                     padding:1,
                        //                     gap: 2,textTransform: 'uppercase', textAlign:'left',
                        //                     height: alto * 0.5,
                        //                     backgroundColor:'#00f',
                        //                     // '& > div': {
                        //                         overflow: 'hidden auto',
                        //                         '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                        //                         '&::-webkit-scrollbar-thumb': {
                        //                             borderRadius: 8,
                        //                             border: '2px solid',
                        //                             borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                        //                             backgroundColor: 'rgba(0 0 0 / 0.5)',
                        //                         },
                        //                     // },
                        //                 })}
                        //             >
                        //                 {val.mp.map(v=>
                        //                     // <div style={{textTransform: 'uppercase', textAlign:'left', backgroundColor:'#f0f'}} key={v._id}>
                        //                         <Grid container spacing={0.5}>
                        //                             <Grid item xs={6}>
                        //                                 {v.descripcion}
                        //                             </Grid>
                        //                             <Grid item xs={3}>
                                                        
                        //                             </Grid>
                        //                         </Grid>
                        //                     // </div>
                                            
                                            
                        //                 )}
                        //             </Box>
                        //         </Grid>
                        //         <Grid item xs={6}>
                        //             <Grid container spacing={0.5}>
                        //                 <Grid item xs={12}>
                                            
                        //                 </Grid>
                        //                 <Grid item xs={12}>
                                            
                        //                 </Grid>
                        //             </Grid>
                        //         </Grid>
                        //     </Grid>
                        //     )
                        // ?   datos.produccion.map(val=>
                        //         <Box key={val._id}
                        //                 sx={{
                        //                     backgroundColor:correcto, padding:1,
                        //                     marginBottom:2, borderRadius:2, width:'100%',
                        //                 }}
                        //         >
                        //             <Typography noWrap>{val.mezcla}</Typography>
                        //             <Grid container wrap="nowrap" spacing={0.5} alignItems="center">
                        //                 <Grid item xs={6} zeroMinWidth>
                        //                     <Box key={val._id}
                        //                             sx={{
                                                         
                        //                                 borderRadius:2, width:'100%',
                        //                             }}
                        //                     >
                        //                         MATERIA PRIMA
                        //                     </Box>
                        //                     <Box
                        //                         sx={(theme) => ({
                        //                             display: 'flex',
                        //                             flexDirection: 'column',
                        //                             padding:1,
                        //                             gap: 2,textTransform: 'uppercase', textAlign:'left',
                        //                             height: alto * 0.5,
                        //                             backgroundColor:'#00f',
                        //                             // '& > div': {
                        //                                 overflow: 'hidden auto',
                        //                                 '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                        //                                 '&::-webkit-scrollbar-thumb': {
                        //                                     borderRadius: 8,
                        //                                     border: '2px solid',
                        //                                     borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                        //                                     backgroundColor: 'rgba(0 0 0 / 0.5)',
                        //                                 },
                        //                             // },
                        //                         })}
                        //                     >
                        //                         {val.mp.map(v=>
                        //                             // <div style={{textTransform: 'uppercase', textAlign:'left', backgroundColor:'#f0f'}} key={v._id}>
                        //                                 <Grid container spacing={0.5}>
                        //                                     <Grid item xs={6}>
                        //                                         {v.descripcion}
                        //                                     </Grid>
                        //                                     <Grid item xs={3}>
                                                                
                        //                                     </Grid>
                        //                                 </Grid>
                        //                             // </div>
                                                    
                                                    
                        //                         )}
                        //                     </Box>
                        //                 </Grid>
                        //                 <Grid item xs={6}>
                        //                     <Grid container spacing={0.5}>
                        //                         <Grid item xs={12}>
                                                    
                        //                         </Grid>
                        //                         <Grid item xs={12}>
                                                    
                        //                         </Grid>
                        //                     </Grid>
                        //                 </Grid>
                        //             </Grid>
                                    
                        //         </Box>
                        //     )
                    //     :   <Cargando open={true}/>
                    }
                </div>
            </Box>
        </Box>
    );
}

