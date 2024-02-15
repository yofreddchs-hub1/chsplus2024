import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';

import Cargando from '../../../componentes/esperar/cargar';
import { Form_todos, genera_formulario } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';
import Scrollbars from '../../../componentes/herramientas/scrolbars';

export default function FormaPago(props) {
    const [formulario, setFormulario] = useState();
    const [cargando, setCargando] = useState(true);
    const Guardar= async(valores)=>{    
        if (props.Siguiente){
            props.Siguiente({valores, tipo:'FormaPago'});
        }   
        
        
        // const Resp = await conexiones.Ingresar_material(valores.mp);
        // setFormulario(formulario);
    }

    const Inicio= async()=>{
        setCargando(true)
        let {Config, formapago, orden_venta} = props;
        let totales={...orden_venta['producto-subtotal']}
        let nuevos = await genera_formulario({valores:{...formapago, totales}, campos: Form_todos('Form_FormasPago') });
        nuevos.titulos.formapago.style={
            height:window.innerHeight * 0.59,
        }
        nuevos.botones=[
            ... props.Atras 
                ? [{
                    name:'atras', label:'Atras', title:'Atras',
                    variant:"contained", color:"success", 
                    onClick: props.Atras, 
                    sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                }]
                : [] ,
            {
              name:'siguiente', label:'Siguiente', title:'Siguiente',
              variant:"contained", color:"success", 
              onClick: Guardar, validar:'true', 
              sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            }
        ]
        setFormulario(nuevos);
        setCargando(false)
    }

    React.useEffect(()=>{
        
        Inicio()
    },[])
    
    return (
        <div style={{width:'100%', height:'100%',position: "relative"}}>
            <Scrollbars sx={{height:'100%',}}>
                {formulario 
                    ?   <Box>
                            <Formulario {...formulario}/> 
                            <div style={{marginBottom:-10}}/>
                        </Box>
                    : null}
                
            </Scrollbars>
            <Cargando open={cargando} Config={props.Config}/>
        </div>
    );
}

