import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import Cargando from '../../../componentes/esperar/cargar';
import { Form_todos, conexiones, genera_formulario } from '../../../constantes';
import Formulario from '../../../componentes/herramientas/formulario';
import Scrollbars from '../../../componentes/herramientas/scrolbars';

export default function Venta(props) {
    const [state, setState]= useState({cargando:true})
    const Guardar= async(valores)=>{    
        if (props.Guardar_orden){
            props.Guardar_orden(valores);
        }   
    }

    const Siguiente = async(valores)=>{
        if (props.Siguiente){
            props.Siguiente({valores, tipo:'Orden'});
        }   
    }
    const cambioState=(dato)=>{
        setState({...state, ...dato});
    }

    const Precios = (data, formulario) =>{
        let {orden_venta} = props;
        let nuevos= {...formulario};
        console.log(data, formulario);
        let lista=data.producto;
        nuevos.titulos[1].value.producto.lista= lista.map(v=>{return {...v, precioproduccion:v.precio, precio:v.precioventa}});
        nuevos.titulos[1].value.producto.value = nuevos.titulos[1].value.producto.value ?  nuevos.titulos[1].value.producto.value.map(val=>{
            const pos = nuevos.titulos[1].value.producto.lista.findIndex (v=>v._id===val._id);
            let precioproduccion= Number(val.precioproduccion);
            let precio = Number(val.precio);
            if (pos!==-1){
                precioproduccion = nuevos.titulos[1].value.producto.lista[pos].precioproduccion
                precio = nuevos.titulos[1].value.producto.lista[pos].precio
            }
            return {...val, precio, precioproduccion }
        }): nuevos.titulos[1].value.producto.value;
        nuevos.datos.producto = nuevos.titulos[1].value.producto.value;
        console.log(nuevos)
        nuevos.titulos[0].value.lista.onClick = (data)=>Precios(data, nuevos)
        cambioState({formulario:nuevos, cargando:false, orden_venta});
        return data
    } 

    const Eliminar = async(valores)=>{
        console.log('Por eliminar', valores, props.Orden && props.Guardar_orden)
        // if (props.Orden && props.Guardar_orden){
            props.Guardar_orden(valores, true);
        // }else{
            
        // }  
    }
    const Inicio= async()=>{
        // setCargando(true)
        cambioState({cargando:true});
        let {Config, orden_venta} = props;
        // console.log('>>>>>>>>>Orden venta', orden_venta, state.orden_venta)
        let resp =  await conexiones.Serial({tabla:props.Orden ? 'sistemachs_Orden_Venta' : 'sistemachs_Venta', id:props.Orden ? 'O' : 'V', cantidad:6});
        let recibo='No recibido...';

        if (resp.Respuesta==='Ok'){
            recibo= orden_venta===null ? resp.Recibo : orden_venta.recibo;
        }
        let nuevos = await genera_formulario({valores:{fecha : new Date(), ...orden_venta}, campos: Form_todos('Form_venta') });
        nuevos.titulos[0].value.recibo.value=recibo;
        nuevos.titulos[1].value.producto.style={
            height:window.innerHeight * 0.477,
        }
        nuevos.botones=[
            ...props.Orden ?
            [{
              name:'guardar', label:'Guardar Orden', title:'Guardar Orden de Venta',
              variant:"contained", color:"success", 
              onClick: Guardar, validar:'true', 
              sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            }] : [],
            {
                name:'siguiente', label:props.Orden ? 'Realizar Venta' : 'Siguiente', title:'Realizar Venta',
                variant:"contained", color:"success", 
                onClick: Siguiente, validar:'true', 
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            },
            ...orden_venta!==null ?
            [{
                name:'eliminar', label: !props.Orden ? 'Eliminar Venta' : 'Eliminar Orden', title:'Eliminar Orden o Venta',
                variant:"contained", color:"success", 
                onClick: Eliminar, validar:'false', 
                sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
                confirmar:'true', confirmar_mensaje:'Desea eliminar',confirmar_campo: 'referencia',
            }] : []
        ]
        // setFormulario(nuevos);
        // setCargando(false)
        let lista=nuevos.titulos[0].value.lista.lista;
        const respl = await conexiones.Leer_C([lista],{[lista]:{}});
        if (respl.Respuesta==='Ok'){
            lista = respl.datos[lista].map(v=>{return {_id:v._id, ...v.valores}})
            nuevos.titulos[0].value.lista.lista=lista;
            nuevos.titulos[0].value.lista.value= nuevos.titulos[0].value.lista.value ? nuevos.titulos[0].value.lista.value : lista[0];
            
        }
        
        if (lista.length===0){
            
            props.Cerrar();
            confirmAlert({
                title: 'Debe crear lista de precio',
                
                buttons: [
                  {
                    label: 'OK',
                  }
                ]
            });
          
            return
        }
        nuevos.titulos[1].value.producto.lista= nuevos.titulos[0].value.lista.value.producto.map(v=>{return {...v, precioproduccion:v.precio, precio:v.precioventa}});
        nuevos.titulos[1].value.producto.value = nuevos.titulos[1].value.producto.value ?  nuevos.titulos[1].value.producto.value.map(val=>{
            const pos = nuevos.titulos[1].value.producto.lista.findIndex (v=>v._id===val._id);
            let precioproduccion= Number(val.precioproduccion);
            let precio = Number(val.precio);
            if (pos!==-1){
                precioproduccion = nuevos.titulos[1].value.producto.lista[pos].precioproduccion
                precio = nuevos.titulos[1].value.producto.lista[pos].precio
            }
            return {...val, precio, precioproduccion }
        }): nuevos.titulos[1].value.producto.value;
        nuevos.titulos[0].value.lista.onClick = (data)=>Precios(data, nuevos)
        cambioState({formulario:nuevos, cargando:false, orden_venta});
    }

    React.useEffect(()=>{
        // console.log('Por Venta>>>>>>>>>>>>>>>>>>')
        Inicio()
    },[props])
    
    return (
        <div style={{width:'100%', height:'100%',position: "relative"}}>
            <Scrollbars sx={{height:'100%',}}>
                {state.formulario 
                    ?   <Box>
                            <Formulario {...state.formulario}/> 
                            <div style={{marginBottom:-10}}/>
                        </Box>
                    : null}
                
            </Scrollbars>
            <Cargando open={state.cargando} Config={props.Config}/>
        </div>
    );
}
