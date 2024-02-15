import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Form_todos, conexiones, Generar_id, genera_formulario } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';
import TablaMostrar from '../../../componentes/herramientas/tablamostrar';
import moment from 'moment';
import Scrollbars from '../../../componentes/herramientas/scrolbars';
import { Icon, IconButton } from '@mui/material';

export default function Detalles(props) {
    const [formulario, setFormulario] = useState();
    const [Fecha, setFecha] = useState();
    const [checkedI, setCheckedI] = useState(true);
    const [checkedE, setCheckedE] = useState(true);
    
    // const Guardar= async(valores)=>{
    //     console.log(valores)
    //     const Resp = await conexiones.Ingresar_material(valores.mp);
    //     console.log(formulario)
    //     // setFormulario(formulario);
    //     Inicio()
    // }

    const Cambio = async(value)=>{
        // console.log(value['$d'])
        // console.log(valores.resultados[valores.name]);
        
        // setFecha(value);
        Inicio(value['$d']);
    }
    const Inicio= async(fecha = new Date())=>{
        let meses = [moment(fecha).format('YYYY-MM-DD')];
        const res = await conexiones.Ingreso_Egreso({meses, tipo:props.Titulo ? props.Titulo : undefined});
        let nuevos = await genera_formulario({valores:{fecha}, campos: Form_todos('Form_fecha') });
        
        // console.log(nuevos.titulos.fecha)
        nuevos.titulos.fecha.onAccept= Cambio
        let nuevos1 = await genera_formulario({valores:{}, campos: Form_todos('Form_ingreso_materia_prima') });
        nuevos1.titulos.mp.Form = undefined;
        nuevos1.titulos.mp.label='Ingresos';
        nuevos1.titulos.mp.style={height:250, marginBottom:5};
        
        setFormulario({
            formulario: nuevos, ingreso:nuevos1, 
            Ingresos: res.Respuesta==='Ok' ? res.ingresos : [],
            Egresos : res.Respuesta==='Ok' ? res.egresos : [],
        });
        setFecha(fecha)
    }

    React.useEffect(()=>{
        
        Inicio(props.Fecha ? props.Fecha : new Date())
    },[props])
    // console.log(Fecha)
    return (
        <Box sx={(theme) => ({ flexGrow: 1, 
            height:'100%',
            overflow: 'hidden auto',
            '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: 8,
                border: '2px solid',
                borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                backgroundColor: 'rgba(0 0 0 / 0.5)',
            },
        })}
        >
            {formulario 
                ?   <Box >
                        <Box sx={{width:window.innerWidth *0.2}}>
                            <Formulario {...formulario.formulario}/> 
                        </Box>
                        {/* {formulario.ingresos ? formulario.ingresos : null} */}
                        {/* {formulario.ingresos.map(val=>
                            <div key={Generar_id()} style={{marginTop:-15}}>
                                <Formulario {...val}/>     
                            </div>    
                        )} */}
                        <Box sx={{paddingX:2}}>
                            <Typography variant="h6" gutterBottom>
                                INGRESOS {moment(Fecha).format('DD-MM-YYYY')}
                                {formulario.Ingresos && formulario.Ingresos.filter(f=>moment(Fecha).format('YYYY-MM-DD')===f.fecha).length!==0 
                                    ?   <IconButton onClick={()=> setCheckedI(!checkedI)}><Icon>{checkedI ? 'arrow_drop_up' : 'arrow_drop_down'}</Icon></IconButton>
                                    :   null
                                } 
                                
                            </Typography>
                            <Divider light />
                            
                            <Scrollbars sx={{
                                    height: checkedI && formulario.Ingresos && formulario.Ingresos.filter(f=>moment(Fecha).format('YYYY-MM-DD')===f.fecha).length!==0 
                                            ? window.innerHeight * 0.4 
                                            : 0,
                                    bgcolor:'#141415',
                                    p:1,
                                }}
                            >
                                {formulario.Ingresos ? formulario.Ingresos.map(val=>{
                                    
                                    let formu = {...formulario.ingreso};
                                    formu.titulos.mp.label=`Ingresos ${val.codigo ? val.codigo : ''} - ${val.actualizado ? val.actualizado : ''}`;
                                    formu.titulos.mp.value=val.movimiento;
                                    formu.titulos.mp.titulos='Titulos_formula_mp_d';
                                    formu.datos = val;
                                    formu.titulos.mp.style={height:200};
                                    return moment(Fecha).format('YYYY-MM-DD')===val.fecha ? (
                                        <div key={Generar_id()} style={{marginBottom:40}}>    
                                            <TablaMostrar {...formu}  {...formu.titulos.mp}/>     
                                        </div>
                                    ):null

                                }) : null}
                            </Scrollbars>
                            
                            <Typography variant="h6" gutterBottom>
                                EGRESOS {moment(Fecha).format('DD-MM-YYYY')}
                                {formulario.Egresos && formulario.Egresos.filter(f=>moment(Fecha).format('YYYY-MM-DD')===f.fecha).length!==0 
                                    ?   <IconButton onClick={()=> setCheckedE(!checkedE)}><Icon>{checkedE ? 'arrow_drop_up' : 'arrow_drop_down'}</Icon></IconButton>
                                    :   null
                                } 
                            </Typography>
                            <Divider light />
                            <Scrollbars sx={{
                                    height: checkedE && formulario.Egresos && formulario.Egresos.filter(f=>moment(Fecha).format('YYYY-MM-DD')===f.fecha).length!==0 
                                            ? window.innerHeight * 0.4 
                                            : 0,
                                    bgcolor:'#141415',
                                    p:1,
                                }}
                            >
                                {formulario.Egresos ? formulario.Egresos.map(val=>{
                                    let formu = {...formulario.ingreso};
                                    formu.titulos.mp.label=`Egresos ${val.codigo ? val.codigo : ''} ${val.ref_movimiento ? ' - (POR PRODUCCIÓN DE '+val.ref_movimiento +')' : ''} - ${val.actualizado ? val.actualizado : ''}`;
                                    formu.titulos.mp.value=val.movimiento;
                                    formu.datos = val;
                                    formu.titulos.mp.style={height:200};
                                    return moment(Fecha).format('YYYY-MM-DD')===val.fecha ? (
                                        <div key={Generar_id()} style={{marginBottom:40}}>    
                                            <TablaMostrar {...formu}  {...formu.titulos.mp}/>     
                                        </div>
                                    ):null

                                }) : null}
                            </Scrollbars>
                        </Box>
                    </Box>
                : null}
            
        </Box>
    );
}
