import React, {useState} from 'react';
// import { createTheme} from '@mui/material/styles';
// import { makeStyles} from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Tabla from './index';
import Dialogo from '../dialogo';
import Formulario from '../formulario';

import Esperar from '../../esperar/cargar';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
//Iconos
import { Icon } from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';

import { conexiones, genera_formulario, crear_campos, 
         nuevo_Valores, Ver_Valores, AExcell} from '../../../constantes';

function Tabla_multiple (props) {
    
    const {Form_origen,Table,Titulo_dialogo,Titulo_tabla,Titulos_tabla, Agregar_mas, //Columnas, 
            Acciones1, Seleccion, Nuevo, cargaporparte,Config, multiples_valores,
            Condiciones, Acciones, sinpaginacion, //Eliminar_props
          }=props
    
    // const classes= Estilos(estilos);
    const [state, setState]= useState({table: Table, datos:[], cantidad:-1});
    const [dialogo, setDialogo]= useState({
        open:false,  
    });


    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    const Actualizar_data = (valores)=>{
        cambiarState({cantidad:valores.cantidad, datos:valores.nuevodatos});
        // nuevo_Valores({[`Actualizar_${state.table}`]:false});
    }
    
    const Refrescar = ()=>{
        cambiarState({cantidad:-1, datos:[]})
    }
    const Agregar = ()=>{
        Abrir({})
    }
    
    const Guardar = async(valores, campos) =>{
        // cambiarState({esperar:true, mensaje:'Guardando...'})
        let nuevos;
        if (multiples_valores){
            // console.log(valores)
            campos = await crear_campos(campos, Form_origen)
            if (Condiciones){
                valores = await Condiciones(state.table, {campos, valores})    
            }
            if (!valores.finalizado_condicion){
                
                nuevos= await conexiones.Guardar({campos, valores, multiples_valores:true},state.table);
            }else{
                nuevos=valores
            }
        }else{
            const datos= await Condiciones(state.table, valores);
            nuevos= await conexiones.Guardar(datos,state.table);
        }
        
        if (nuevos.Respuesta==='Ok'){
            cambiarState({datos:nuevos.resultado})
            setDialogo({...dialogo,open:false})
        }
        
        return nuevos
    }

    const Eliminar = async(datos) =>{
        cambiarState({esperar:true, mensaje:'Eliminando...'})
        const nuevos = await conexiones.Eliminar(datos,[state.table]);
        cambiarState({esperar:false})
        if (nuevos.Respuesta==='Ok'){
            Refrescar();
            // setDialogo({...dialogo,open:false})
        }else{
            confirmAlert({
                title: 'Error-' + nuevos.code,
                message: 'Los datos no fueron eliminados',
                buttons: [{label: 'OK'}]
                });
        }
        setDialogo({...dialogo,open:false})
        return nuevos
        
    }

    const Abrir = async(valores) =>{
        if (valores.valores===undefined){
            valores={_id:valores._id, valores};
        }
        const nuevos = valores._id!==undefined
                                    ? await genera_formulario({...valores, campos: Form_origen })
                                    : await genera_formulario({valores:{},  campos: Form_origen})
        let dato=nuevos.datos;
        const pguardar= true//await Permiso('guardar');
        const peliminar= true//await Permiso('eliminar')
        const formulario ={
            ...nuevos,
            // datos:valores,
            // titulos:genera_fromulario(valores).titulos,
            Form_origen,
            botones:[
                {
                  name:'guardar', label:'Guardar', title:'Guardar ',
                  variant:"contained", color:"success", icono:<CheckIcon/>,
                  onClick: Guardar, validar:'true', 
                  sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                  disabled: !pguardar,
                },
                ...dato._id!==undefined  && peliminar
                    ?
                        [{
                        name:'eliminar', label:'Eliminar', title:'Eliminar ',
                        variant:"contained", color:"secondary", icono:<DeleteIcon/>,
                        sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
                        confirmar:'true', confirmar_mensaje:'Desea eliminar',confirmar_campo:props.Eliminar ? props.Eliminar : '_id',
                        onClick: Eliminar,
                        }]
                    :[],
                {
                  name:'cancelar', label:'Cancelar', title:'Cancelar',
                  variant:"contained",  icono:<CancelIcon/>,
                  sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
                  onClick: ()=>setDialogo({...dialogo,open:false})
                },
            ]
        }
        setDialogo({
            ...dialogo, 
            open: !dialogo.open,
            Titulo:Titulo_dialogo ? Titulo_dialogo(dato,proceso_individual) : 'Registro',
            Cuerpo:<Formulario {...formulario} Agregar={Agregar_mas} config={props.Config}/>,
            Cerrar: ()=>{
                setDialogo({...dialogo,open:false});
                Refrescar();
            },
        })
    }
    const proceso_individual = (informacion) =>{
        console.log(informacion)
        if (informacion.tipo==='Dialogo'){
            setDialogo({
                ...informacion.dialogo, 
                Cerrar: ()=>setDialogo({...dialogo,open:false}),
            })
        }
    }
    const Exportar = ()=>{
        const {datos, table} = state;
        let campos= [... datos.length!==0 ? Object.keys(datos[0].valores) : []];
        let resultado = datos.map((val,i)=>{
            const dato = val.valores;
            let valor={'ID':i+1};
            campos.map(camp=>{
                valor[camp.toUpperCase()]=typeof dato[camp]==='object' ? dato[camp].titulo ? dato[camp].titulo : typeof dato[camp] : dato[camp] ;
                return camp;
            })
            return valor;
        })
        
        AExcell(resultado,`${table}`, `${table}.xlsx`);

    }
    const color =  props.Config.Estilos.Input_icono ? props.Config.Estilos.Input_icono : {};
    
    return (
        <div style={{height:props.Alto ? props.Alto : window.innerHeight* 0.78, width: '100%',position: "relative"}}>
            <Tabla  Nueva ={props.Nueva}
                    Titulo={Titulo_tabla}
                    Config={props.Config}
                    titulos={Titulos_tabla}
                    table={state.table}
                    cantidad={state.cantidad ? state.cantidad : null}
                    cargacompleta={Actualizar_data}
                    datos={state.datos}
                    Accion={Seleccion ? Seleccion : Abrir}
                    cargaporparte={cargaporparte ? cargaporparte : null }
                    sinpaginacion= {sinpaginacion}
                    acciones={
                        !Acciones
                        ? <div>
                            <IconButton color={'primary'} title={'Exportar a excell'} onClick={Exportar}>
                                <Icon style={color}>download</Icon>
                            </IconButton>
                            <IconButton color={'primary'} title={'Refrescar valores de Usuarios'} onClick={Refrescar}>
                                <AutorenewIcon style={color}/>
                            </IconButton>
                            {!Nuevo 
                            ? <IconButton color={'primary'} title={'Agregrar nuevo Usuario'} onClick={Agregar}>
                                <AddIcon style={color}/>
                              </IconButton> 
                            : null
                            }
                          </div>
                        : Acciones
                    }
                    acciones1={Acciones1 ? Acciones1 : null}
            />
            <Dialogo  {...dialogo} config={props.Config}/>
            <Esperar open={state.esperar}/>
        </div>
      
    )
}

export default Tabla_multiple;