import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import {Titulos_todos ,conexiones, genera_formulario, Form_todos} from '../../../constantes';
import Tabla from '../../../componentes/herramientas/tabla';
import Dialogo from '../../../componentes/herramientas/dialogo';
import Cargando from '../../../componentes/esperar/cargar';
import Formulario from '../../../componentes/herramientas/formulario';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class IngresosModificar extends Component {
  constructor(props) {
      super(props);

      this.state = {
          cargando:true,
          props: this.props,
          Config:this.props.Config,
          datos:[],
          dialogo:{open:false},
          dialogo1:{open:false},
      }
  }

  Seleccion = (item)=>(dato) =>{

    // console.log(dato.target.innerText, dato.target.cellIndex, this.state.Titulos[dato.target.cellIndex].field)
    this.Abrir1(this.state.Titulos[item].field);
  }
  Inicio = async()=>{
    const {props} =  this.state;
    this.setState({cargando:true});
    let titulos = Titulos_todos('Titulos_Ingresos');
    let resp= await conexiones.Leer_C([props.table],{[props.table]:{}});
    let datos= [];
    if (resp.Respuesta==='Ok'){
        datos= resp.datos[props.table].sort((a,b)=> a.valores.codigo > b.valores.codigo ? -1 : 1);    
    }
    
    this.setState({cargando:false, datos, titulos})
  }
  async componentDidMount(){
    this.Inicio();
    this.state.props.socket.on(`Actualizar_venta`, data => {
      this.Inicio();     
    })
  }

  static getDerivedStateFromProps(props, state) {

    if (props !== state.props) {
        
      return {
        props,
        Config:props.Config,
      };
    }
    // No state update necessary
    return null;
  }

  Guardar = async(data)=>{
    const {tabla_inv, table, id, Egresar}= this.state.props;
    data.fecha= moment(data.fecha ? data.fecha : new Date()).format('YYYY-MM-DD');
    let movimientos = data.movimiento.map(v=>{
        const cantidad= v.saco && Number(v.saco)!==0 && v.cantsaco && Number(v.cantsaco)!==0 ? Number(v.saco)*Number(v.cantsaco) : Number(v.cantidad);
        return {...v, cantidad}
    })
    data.movimiento = movimientos;
    const resp = await conexiones.Ingresar(data, 
        tabla_inv ? tabla_inv :'sistemachs_Inventariomp' ,
        table,
        id ? id : 'IMP',
        Egresar ? Egresar : false
    )
    // console.log(resp)
    // this.Cerrar();
    // this.Inicio();
    this.Abrir(resp.nuevo ? resp.nuevo : {_id: resp.datos._id, valores: resp.datos});
    return
  }
  Eliminar = async(data)=>{
    const {tabla_inv, table, id, Egresar}= this.state.props;
    data.movimiento = [];
    await conexiones.Ingresar(data, 
      tabla_inv ? tabla_inv :'sistemachs_Inventariomp' ,
      table,
      id ? id : 'IMP',
      Egresar ? Egresar : false
    );
    await conexiones.Eliminar(data,[table]);
    this.Cerrar();
    // this.Abrir(resp.nuevo ? resp.nuevo : {_id: resp.datos._id, valores: resp.datos});
  }
  Agregar = ()=>{
    this.Abrir({valores:{}})
  }

    
  Abrir = async(data)=>{
    console.log(data);
    const {props}=this.state;
    const {Config}=this.state;
    const {Egresar} = props;
    let nuevos = await genera_formulario({valores:{_id:data._id, ...data.valores}, campos: Form_todos('Form_Ingresos') });
    nuevos.titulos.movimiento.style={
        height:window.innerHeight * 0.50,
    }
    nuevos.titulos.movimiento.label= props.label ? props.label : nuevos.titulos.movimiento.label;
    nuevos.titulos.movimiento.Form = props.Form ? props.Form :  nuevos.titulos.movimiento.Form;
    nuevos.titulos.movimiento.titulos = props.titulos ? props.titulos :  nuevos.titulos.movimiento.titulos;
    nuevos.botones=[
        {
            name:'ingresar', label:Egresar ? 'Egresar' : 'Ingresar', title: Egresar ? 'Egresar datos al sistema' : 'Ingresar datos al sistema',
            variant:"contained", color:"success", 
            onClick: this.Guardar, validar:'true', 
            sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
        },
        ...data._id!==undefined ? 
        [{
          name:'eliminar', label:'Eliminar', title: 'Eliminar dato del sistema',
          variant:"contained", color:"success", 
          onClick: this.Eliminar, validar:'true', 
          sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
          confirmar:'true', confirmar_mensaje:'Desea eliminar',confirmar_campo:'codigo',
        }] : []
    ]
    this.setState({dialogo:{
        open:true,
        tam:'xl',
        Titulo: data.valores && data.valores.codigo ? `${data.valores.codigo}${data.valores.ref_movimiento ? ' - (POR PRODUCCIÓN DE '+ data.valores.ref_movimiento +')' : ''}` : Egresar ? 'Nuevo Egreso' : 'Nuevo Ingreso',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.78}}>
            <Formulario {...nuevos}/> 
          </div>,
        Cerrar: this.Cerrar
    }})
  }
  Cerrar = () =>{
    const {dialogo} = this.state;
    this.Inicio();
    this.setState({dialogo:{...dialogo, open:false}})
  }
  
  Procesar = (data) =>async(valores)=>{
    await conexiones.Egreso_venta(data);
    this.Cerrar();
    
  }
  Atras = (dato)=>(valores)=>{
    this.Abrir({_id:dato._id, valores:dato})
  }
  render(){
    const {cargando, datos, Config, titulos, dialogo}=this.state;
    const color =  Config.Estilos.Input_icono ? Config.Estilos.Input_icono : {};
    return (
      <div style={{width:'100%',height:'99%', position: "relative"}}>
        <Tabla
          
          Titulo={this.state.props.Titulo ? this.state.props.Titulo : 'Titulo'}
          Config={Config}
          titulos={titulos}
          table={''}
          cantidad={ null}
          datos={datos}
          Accion={this.Abrir}
          acciones={
            <div >
                <IconButton color={'primary'} title={'Refrescar datos'} onClick={this.Inicio}>
                    <AutorenewIcon style={color}/>
                </IconButton>
                <IconButton color={'primary'} title={'Agregrar nuevo dato'} onClick={this.Agregar}>
                    <AddIcon style={color}/>
                </IconButton> 
                <div style={{ width:'50%', float:'right', paddingRight:10}}>
                    
                </div>
                <div style={{width:'30%', backgroundColor:'#ff0', float:'right'}}></div>
            </div>
          }
        />
        <Cargando open={cargando}/>
        <Dialogo  {...dialogo} config={Config}/>
       
      </div>
    )
  }
}
