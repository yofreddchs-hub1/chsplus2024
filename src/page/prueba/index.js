import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import { Form_todos, conexiones, genera_formulario } from '../../constantes';
import Formulario from '../../componentes/herramientas/formulario';

export default function Pruebas(props) {
  const [formulario, setFormulario] = useState();
  const Guardar = async (valores)=>{
    console.log(valores);
    const res = await conexiones.Guardar({valores, multiples_valores:true},'ejemplo')
    // const res = await uploadImagen(valores.imagen);
    console.log(res);
  }
  useEffect(()=>{
    const Inicio = async() =>{
      let {Config} = props;
      let formula = await genera_formulario({valores:{}, campos: Form_todos('Form_ejemplos')})
      formula.botones=[
        {
          name:'ingresar', label:'Ingresar', title:'Ingresar materiales al sistema ',
          variant:"contained", color:"success", 
          onClick: Guardar, validar:'true', 
          sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
        }
    ]
      setFormulario(formula)
    }
    Inicio();
  },[])
  
  return formulario ? (
    <Box sx={{ height: 520, width: '100%' }}>
      <Formulario {...formulario}/>
    </Box>
  ): null;
}
