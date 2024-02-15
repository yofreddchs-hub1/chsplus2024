import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Tabla from '../../componentes/herramientas/tabla/tabla_multiple';
import { Titulos_todos, Ver_Valores, Form_todos } from '../../constantes';

export default function PruebasT(props) {
  const [state, setState] = useState({});
  
  const Cambios = (nuevos)=>{
    setState({...state, ...nuevos})
  }
  useEffect(()=>{
    const Inicio =()=>{
        let Titulos = Titulos_todos('Titulos_Proveedor');
        let Formulario = Form_todos(`Form_Proveedor`)
        Cambios({Titulos, Formulario});
    }  
    Inicio();
  },[])

  
  const {tipo}= Ver_Valores();
  return state.Titulos ? (
    
        <Tabla
            Nueva
            Alto={tipo==='Web' ? window.innerHeight * 0.76: window.innerHeight * 0.8 }
            multiples_valores
            Agregar_mas={false}
            Titulo_tabla={'Titulo tabla 1'}
            Config={props.Config}
            Titulos_tabla={state.Titulos}
            Table={'sistemachs_Proveedor'}
            cargaporparte={{condicion:{}}}
            Form_origen = {state.Formulario}
        />
      
    
  ): null;
}
