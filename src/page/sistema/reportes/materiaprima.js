import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';

import Tabla from '../../../componentes/herramientas/tabla';
import { Titulos_todos,conexiones } from '../../../constantes';
import Dialogo from '../../../componentes/herramientas/dialogo';
import Cargando from '../../../componentes/esperar/cargar';
import moment from 'moment';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

export default class RMP extends Component {
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

  
  async componentDidMount(){
    let fecha=new Date();
    var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getUTCDate();
    var mes = moment(fecha).format('MM');
    var ano = moment(fecha).format('YYYY');
    let titulos = Titulos_todos('Titulos_ingresos_egresos');
    let meses = [];
    const Titulos_dia=[...titulos,{
        field:moment(fecha).format('YYYY-MM-DD'),
        default:'',
        title:`${moment(fecha).format('DD-MM-YYYY')} \n Ingresos/Egresos`,
        formato: (dato)=>{
          if (dato[moment(fecha).format('YYYY-MM-DD')]){
            return `${dato[moment(fecha).format('YYYY-MM-DD')].ingreso} / ${dato[moment(fecha).format('YYYY-MM-DD')].egreso} `
          }
          return `0 / 0 `
        }
    }];
    for (var dia=1; dia<=ultimoDia;dia++){
      const campo = `${ano}-${mes}-${dia<10 ? '0' + dia : dia}`;
        titulos=[...titulos,{
            field:campo,
            default:'',
            title:`${dia<10 ? '0' + dia : dia}-${mes}-${ano} \n Ingresos/Egresos`,
            formato: (dato)=>{
              if (dato[campo]){
                return `${dato[campo].ingreso} / ${dato[campo].egreso} `
              }
              return `0 / 0 `
            }
        }];
        meses=[...meses, campo]
    }    
    const res = await conexiones.Ingreso_Egreso({meses, tipo:'Materia Prima'});
    
    let datos = []
    if (res.Respuesta==='Ok'){
      datos= res.inventario
    }
    this.setState({cargando:false, Titulos:titulos, Titulos_dia, datos})
   
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

  Cerrar = () =>{
    const {dialogo} = this.state;
    this.setState({dialogo:{...dialogo, open:false}})
  }
  Abrir = ()=>{
    const {datos, Config, Titulos, dialogo}=this.state;
    this.setState({dialogo:{
        open:!dialogo.open,
        tam:'xl',
        Titulo:'Titulo',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.70, backgroundColor:'#0f0'}}>
            <Tabla
            
                Titulo={"Materia Prima"}
                Config={Config}
                titulos={Titulos}
                table={''}
                cantidad={ null}
                datos={datos}
                // Accion={this.Abrir1}
        
            //   acciones={<Formulario {...formulario_lista}/>}
            />
            
          </div>,
        Cerrar: this.Cerrar
    }})
  }

  Abrir1 = (valores)=>{

    const {datos, Config, Titulos, dialogo1}=this.state;
    this.setState({dialogo1:{
        open:!dialogo1.open,
        tam:'xl',
        Titulo:'Detalles',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.70, backgroundColor:'#0f0'}}>
            
            
          </div>,
        Cerrar: ()=>this.setState({dialogo1:{open:false}})
    }})

  }
  render(){
    const {cargando, datos, Config, Titulos_dia, dialogo, dialogo1}=this.state;
    
    return (
      <div style={{width:'100%',height:'100%', position: "relative"}}>
        <Tabla
          
          Titulo={"Materia Prima"}
          Config={Config}
          titulos={Titulos_dia}
          table={''}
          cantidad={ null}
          datos={datos}
        //   Accion={this.Abrir}
    
          acciones={
            <div>
              <IconButton color={'primary'} sx={{color:'#fff'}} title={'Ver movimientos'} onClick={this.Abrir}>
                <Icon>zoom_in</Icon>
              </IconButton>
            </div>
          }
        />
        <Cargando open={cargando}/>
        <Dialogo  {...dialogo} config={Config}/>
        <Dialogo {...dialogo1} config={Config}/>
      </div>
    )
  }
}
