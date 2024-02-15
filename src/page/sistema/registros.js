import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Stack from '@mui/material/Stack';
import { Icon, Box, Divider, IconButton } from '@mui/material';
import Cuerpo from '../../componentes/herramientas/cuerpo';
import TablaMultiple from '../../componentes/herramientas/tabla/tabla_multiple';
import { Form_todos, Titulos_todos, MaysPrimera, Ver_Valores } from '../../constantes';
import Reporte from '../../componentes/reporte';
import Cargando from '../../componentes/esperar/cargar';
import Formulapdf from './pdf/formulapdf';

export default class Registros extends Component {
  constructor(props) {
      super(props);

      this.state = {
          cargando:true,
          props: this.props,
          Config:this.props.Config,
      }
  }

  Condiciones = async(campo, datos) =>{
    let {valores}= datos
    switch (campo) {
      case 'User_api':{
        if (datos.password!==''){
          // datos.password =await encriptado.Hash_password(datos.npassword)
          datos.newpassword=datos.password;
          
        }
        // else{
          delete datos.password
        // }
        datos.categoria = typeof datos.categoria === 'object' ? datos.categoria._id : datos.categoria 
        return datos
      }
      
      default:
        return valores;
    }

  }
  Imprimir_formula = (dato)=>{
    return{
      tipo:'Dialogo',
      dialogo:{
        open:true,
        tam:'xl',
        Titulo:dato.mezcla,
        Cuerpo:<Reporte datos={dato} reporte={Formulapdf} sizePagina= {{width:612, height:396}}/>,
      }
    }
  }
  Editores = (campo)=>{
    
    let multiples_valores= true;//campo.indexOf('User_api')===-1
    let nuevo_campo = campo.indexOf('User_api')!==-1 ? 'User_api' : campo.indexOf('Lista_Venta')!==-1 ? 'Lista_Venta' : campo.split('_')[1];//MaysPrimera(campo.replace('colegio_',''))
    let Titulo_dialogo={
      sistemachs_Proveedor:(dato)=>`${dato.rif} ${dato.nombre}`,
      sistemachs_Cliente: (dato)=>`${dato.rif} ${dato.nombre}`,
      sistemachs_Empaque: (dato)=>dato.codigo,
      sistemachs_Inventariomp: (dato)=>dato.codigo,
      sistemachs_Formula: (dato, proceso)=>{
        const imprimir = this.Imprimir_formula(dato);
        return <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
          <Box>{dato.mezcla}</Box>
          <Box><IconButton onClick={()=>proceso(imprimir)}><Icon>print</Icon></IconButton></Box>
        </Stack>
      },
      sistemachs_Inventariopt:(dato)=>dato.codigo,
      sistemachs_User_api:(dato)=>dato.username,
    }
    let Eliminar={
      Proveedor:'nombre',
      Cliente: 'nombre',
      Empaque:'codigo',
      Inventariomp:'codigo',
      Formula:'mezcla',
      Inventariopt:'codigo',
      User_api: 'username'
    }
    let Titulo;
    switch(campo){
      case 'sistemachs_Cliente':{
        Titulo= 'CLIENTES'
        break;
      }
      case 'sistemachs_Proveedor':{
        Titulo= 'PROVEEDORES'
        break;
      }
      case 'sistemachs_Empaque':{
        Titulo= 'EMPAQUES'
        break;
      }
      case 'sistemachs_Formula':{
        Titulo= 'FORMULAS'
        break;
      }
      case 'sistemachs_Inventariomp':{
        Titulo= 'MATERIAS PRIMAS'
        break;
      }
      case 'sistemachs_Inventariopt':{
        Titulo= 'PRODUCTO TERMINADO'
        break;
      }
      case 'sistemachs_Lista_Venta':{
        Titulo= 'LISTAS DE PRECIO DE VENTA'
        break;
      }
      case 'sistemachs_User_api':{
        Titulo= 'USUARIOS'
        break;
      }
      case 'sistemachs_Agencia':{
        Titulo= 'AGENCIAS'
        break;
      }
      default:{
        Titulo=campo;
      }
    }

    const funcion= Titulo_dialogo[campo];
    const {tipo}= Ver_Valores();
    console.log(campo)
    return <TablaMultiple
                {...this.state.props}
                Alto={tipo==='Web' ? window.innerHeight * 0.76: window.innerHeight * 0.8 }
                multiples_valores={multiples_valores}
                Agregar_mas={false}//multiples_valores}
                Condiciones={this.Condiciones}
                Columnas={2} 
                Form_origen = {Form_todos(`Form_${nuevo_campo}`)}
                Titulo_tabla={Titulo}
                Table = {campo}
                cargaporparte={{condicion:{}}}
                Eliminar_props={(dato)=>{
                    return `Desea eliminar de ${nuevo_campo} ${dato._id}`
                }}
                Eliminar= {Eliminar[nuevo_campo] ? Eliminar[nuevo_campo] : '_id'}
                Titulo_dialogo ={(dato, proceso)=> dato._id ?  Titulo_dialogo[campo] ? funcion(dato, proceso) : `Registro ${dato._id}`: `Nuevo registro en ${Titulo}`}
                Titulos_tabla = {Titulos_todos(`Titulos_${nuevo_campo}`)}
            />
  }
  
  async componentDidMount(){
    
    // let database= await conexiones.DataBase();
    let Bloques1={PROVEEDORES:null, CLIENTES:null, 'MATERIAS PRIMAS':null, EMPAQUES:null, FORMULAS:null, 'PRODUCTO TERMINADO':null}
    let models=['sistemachs_Cliente','sistemachs_Proveedor',
                'sistemachs_Empaque', 'sistemachs_Formula',
                'sistemachs_Inventariomp','sistemachs_Inventariopt',
                'sistemachs_Lista_Venta',
                'sistemachs_User_api', 'sistemachs_Agencia',  
              ]
    models.map((val,i)=>{
        if ((val.indexOf('sistemachs_')!==-1 )  && ['Api'].indexOf(val)===-1 ){
            let nuevo = MaysPrimera(val)
            switch(val){
              case 'sistemachs_Cliente':{
                nuevo= 'CLIENTES'
                break;
              }
              case 'sistemachs_Proveedor':{
                nuevo= 'PROVEEDORES'
                break;
              }
              case 'sistemachs_Empaque':{
                nuevo= 'EMPAQUES'
                break;
              }
              case 'sistemachs_Formula':{
                nuevo= 'FORMULAS'
                break;
              }
              case 'sistemachs_Inventariomp':{
                nuevo= 'MATERIAS PRIMAS'
                break;
              }
              case 'sistemachs_Inventariopt':{
                nuevo= 'PRODUCTO TERMINADO'
                break;
              }
              case 'sistemachs_Lista_Venta':{
                nuevo= 'LISTAS PRECIO DE VENTA'
                break;
              }
              case 'sistemachs_User_api':{
                nuevo= 'USUARIOS'
                break;
              }
              case 'sistemachs_Agencia':{
                nuevo= 'AGENCIAS'
                break;
              }
              default:{

              }
            }

            Bloques1[nuevo]=this.Editores(val);
        }
        return {_id:i, titulo:val, value:val}
    })
   
    let Bloques={
     
      ...Bloques1
    }

    this.setState({Bloques, BloquesT:Bloques, cargando:false})
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

  render(){
    const {Bloques, cargando}=this.state;
    return (
      <div style={{width:'100%', height:'100%',position: "relative"}}>
        <Cuerpo Bloques={Bloques}/>
        <Cargando open={cargando}/>
      </div>
    )
  }
}
