import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Typography from '@mui/material/Typography';
import {Titulos_todos ,conexiones, Permiso, MaysPrimera} from '../../../../constantes';
import Tabla from '../../../../componentes/herramientas/tabla';
import Dialogo from '../../../../componentes/herramientas/dialogo';
import Cargando from '../../../../componentes/esperar/cargar';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FormaPago from '../formapagos';
import ConfirmarPago from '../confirmar';
import { Moneda } from '../../../../constantes';

export default class PorCobrar extends Component {
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
    console.log(item, this.state.Titulos[item])
    this.Abrir1(this.state.Titulos[item].field);
  }
  Inicio = async()=>{
    this.setState({cargando:true});
    let titulos = Titulos_todos('Titulos_porcobrar');
    let resp= await conexiones.Ventas({estado:'pendiente'});
    let datos=[];
    let facturado=0;
    let pendiente=0;
    let cancelado=0;
    if (resp.Respuesta==='Ok'){
        datos= resp.ventas_p;
        facturado=resp.facturado;
        pendiente=resp.pendiente;
        cancelado=resp.tota;
    }
    
    this.setState({cargando:false, datos, titulos, facturado, pendiente, cancelado})
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

  Abrir = (data)=>{
    console.log(data)
    const {Config, dialogo}=this.state;
    this.setState({dialogo:{
        open:true,
        tam:'xl',
        Titulo: data.valores && data.valores.recibo ? `Referencia de venta: ${data.valores.recibo}` : 'Titulo',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.80}}>
            <FormaPago Config={Config} {...data.valores} Siguiente = {this.Siguiente({_id:data._id, ...data.valores})}/>
          </div>,
        Cerrar: this.Cerrar
    }})
  }
  Cerrar = () =>{
    const {dialogo} = this.state;
    this.setState({dialogo:{...dialogo, open:false}})
  }
  Siguiente= (data)=>(forma_pago) =>{
    const {Config, dialogo}=this.state;
    let nuevo = {
        ...data, 
        formapago:{
                formapago:forma_pago.valores.formapago, 
                totales:forma_pago.valores.totales, 
                'formapago-subtotal':forma_pago.valores['formapago-subtotal']
        }
    }
    this.setState({dialogo:{
        open:true,
        tam:'xl',
        Titulo: data.recibo ? `Referencia de venta: ${data.recibo}` : 'Titulo',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.70}}>
            <ConfirmarPago Config={Config} {...nuevo} 
                            Siguiente = {this.Siguiente({_id:nuevo._id, ...nuevo})} 
                            Atras = {this.Atras({_id:nuevo._id, ...nuevo})}
                            Procesar = {this.Procesar({_id:nuevo._id, ...nuevo})}
            />
          </div>,
        Cerrar: this.Cerrar
    }})
  }
  Procesar = (data) =>async(valores)=>{
    await conexiones.Egreso_venta(data);
    this.Cerrar();
    
  }
  Atras = (dato)=>(valores)=>{
    console.log(dato, valores)
    this.Abrir({_id:dato._id, valores:dato})
  }
  render(){
    const {datos, Config, titulos, dialogo, pendiente}=this.state;
    const color =  Config.Estilos.Input_icono ? Config.Estilos.Input_icono : {};
    return (
      <div style={{width:'100%',height:'98%', position: "relative"}}>
        <Tabla
          
          Titulo={"Ventas por Cobrar"}
          Config={Config}
          titulos={titulos}
          table={''}
          cantidad={ null}
          datos={datos}
          Accion={this.Abrir}
          acciones={
            <div >
              <IconButton color={'primary'} title={'Refrescar valores de Usuarios'} onClick={this.Inicio}>
                  <AutorenewIcon style={color}/>
              </IconButton>
              <div style={{ width:'50%', float:'right', paddingRight:10}}>
                <Typography variant="h6" align={'right'} color={'#fff'}>
                  Deuda {Moneda(pendiente,'$ ')}
                </Typography>
              </div>
              <div style={{width:'30%', backgroundColor:'#ff0', float:'right'}}></div>
            </div>
          }
        />
        {/* <Cargando open={cargando}/> */}
        <Dialogo  {...dialogo} config={Config}/>
       
      </div>
    )
  }
}
