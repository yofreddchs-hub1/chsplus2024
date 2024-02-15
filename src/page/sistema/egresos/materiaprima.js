import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';

import { Form_todos, genera_formulario } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';

export default function EMP(props) {
    const [formulario, setFormulario] = useState();
    
    const Guardar= async(valores)=>{
        console.log(valores)
        // const Resp = await conexiones.Ingresar_material(valores.mp);
        // setFormulario(formulario);
    }

    React.useEffect(()=>{
        const Inicio= async()=>{
            let {Config} = props;
            let nuevos = await genera_formulario({valores:{}, campos: Form_todos('Form_ingreso_materia_prima') });
            nuevos.titulos.mp.style={
                height:window.innerHeight * 0.63,
            }
            nuevos.botones=[
                {
                  name:'retirar', label:'Retirar', title:'Egresar materiales al sistema ',
                  variant:"contained", color:"success", 
                  onClick: Guardar, validar:'true', 
                  sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                }
            ]
            setFormulario(nuevos)
        }
        Inicio()
    },[])
    
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
                ?   <Box>
                        <Formulario {...formulario}/> 
                        <div style={{marginBottom:-10}}/>
                    </Box>
                : null}
            
        </Box>
    );
}

