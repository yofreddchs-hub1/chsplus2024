import * as React from 'react';
// import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Unstable_Grid2';
// import Typography from '@mui/material/Typography';
import moment from 'moment';
import MostrarProduccion from '../planificacion/mostrar';
// import Logo from '../../../imagenes/trompo.png';
import { conexiones, Ver_Valores } from '../../../constantes';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

export default function ProduccionObrero(props) {
    const [datos,setDatos]=React.useState();

    React.useEffect(()=>{
        const Inicio= async()=>{
            const dia = new Date();
            const {tipo} = Ver_Valores();
            const Resp =  await conexiones.Leer_C(['sistemachs_Produccion','sistemachs_Inventariomp'],
                {
                    sistemachs_Produccion:tipo==='Electron'
                        ? {"valores.dia":moment(dia).format('MM/DD/YYYY')}
                        : {$text: {$search: moment(dia).format('MM/DD/YYYY'), $caseSensitive: false}},
                    sistemachs_Inventariomp:{},
                    sistemachs_Empaque:{}
                }
            );
            if (Resp.Respuesta==='Ok'){
                let datosn={dia:new Date(), produccion:[]};
                const sede = Ver_Valores().sede;
                let dat= Resp.datos.sistemachs_Produccion
                    .filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) )
                    .filter(f=>f.valores.dia === moment(dia).format('MM/DD/YYYY') );
                let inventario = Resp.datos.sistemachs_Inventariomp.filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) );
                let empaques = Resp.datos.sistemachs_Empaque.filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) );
                
                if (dat.length!==0){

                    datosn= {...dat[0].valores, _id:dat[0]._id, }
                    datosn.produccion=datosn.produccion.map(valor=>{
                        valor.mp = valor.mp.map(val=>{
                            const pos = inventario.findIndex(f=>f._id===val._id);
                            val.actual= Number(inventario[pos].valores.actual);
                            inventario[pos].valores.actual = Number(inventario[pos].valores.actual) - Number(val.cantidadT);
                            
                            return val;
                        })
                        valor.pt = valor.pt.map(val=>{
                            const pos = empaques.findIndex(f=>val.empaque && f._id===val.empaque._id);
                            
                            if (pos!==-1){
                                val.cantidadE= Number(empaques[pos].valores.actual);
                                empaques[pos].valores.actual = Number(empaques[pos].valores.actual) - Number(val.cantidadFinal);
                            }else{
                                val.cantidadE=0;
                            }
                            // console.log(val.descripcion, val.cantidadE, pos, empaques[pos].valores.actual)
                            return val;
                        })
                        return valor;
                    })
                }else{
                    datosn={dia: dia!==null ? dia : datosn.dia, produccion:[]}
                }
                
                setDatos(datosn);
                props.socket.on(`Actualizar`, data => {
                    Inicio();  
                })
                
            }
        }
        Inicio()
    },[props])
    const alto = window.innerHeight * 0.6;
    return (
        <Box >
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
                    {datos
                        ?   datos.produccion.map(val=>
                                <MostrarProduccion key={val._id} datos={val} />
                            )
                        :   null
                    }

                </div>
            </Box>
        </Box>
    );
}
