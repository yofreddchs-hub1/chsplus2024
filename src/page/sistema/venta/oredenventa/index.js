import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {Titulos_todos ,conexiones} from '../../../../constantes';
import Tabla from '../../../../componentes/herramientas/tabla';
// import Tabla from '../../../../componentes/herramientas/tablamostrar';
import Dialogo from '../../../../componentes/herramientas/dialogo';
import moment from 'moment';
import AddIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import Venta from '../../venta';
import Reporte from '../pdf/reporte';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default class OrdenVenta extends Component {
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

 
  
  Refrescar = ()=>{
    this.Inicio();
  }
  Inicio = async()=>{
    this.setState({cargando:true});
    
    let titulos = [...Titulos_todos('Titulos_Ventas')];
    
    titulos[1].formato=(dato)=>{
        const fecha = `${dato.valores ? moment(dato.valores.fecha).format('DD/MM/YYYY') : moment(dato.fecha).format('DD/MM/YYYY')}`;
        return fecha
    }
    delete  titulos[3];
    delete  titulos[4];
    delete  titulos[5];
    let resp= await conexiones.Ventas({tipo:'Orden'});
    
    let datos=[];
    let facturado=0;
    let pendiente=0;
    let cancelado=0;
    if (resp.Respuesta==='Ok'){
        datos= resp.ventas;
        facturado=resp.facturado;
        pendiente=resp.pendiente;
        cancelado=resp.total;
    }
    
    this.setState({cargando:false, datos, titulos, facturado, pendiente, cancelado})
  }
  async componentDidMount(){
    this.Inicio();
    this.state.props.socket.on(`Actualizar`, data => {
      this.Refrescar();     
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
    confirmAlert({
      title: 'Seleccione Opción ',
      
      buttons: [
        {
          label: 'Modificar',
          onClick: async () => {
            this.Modificar(data);
          }
        },
        {
          label: 'Imprimir',
          onClick: async () => {
            // setTimeout(()=>{
            //   this.Imprimir(data);
            // },200)
            this.Mostrar(data,'NOTA DE ENTREGA')
          }
        }
      ]
    });

  }
  Imprimir = (data) =>{
    confirmAlert({
      title: 'Que desea imprimir?',
      
      buttons: [
        {
          label: 'NOTA DE ENTREGA',
          onClick: async () => {
            this.Mostrar(data,'NOTA DE ENTREGA')
          }
        },
        {
          label: 'ORDEN DE TRASLADO',
          onClick: async () => {
            this.Mostrar(data,'ORDEN DE TRASLADO')
          }
        },
        {
          label: 'FACTURA',
          onClick: async () => {
            this.Mostrar(data,'FACTURA')
          }
        }
      ]
    });
  }
  Mostrar = async(data,tipo)=>{
    const {Config, dialogo}=this.state;
    const cliente = await conexiones.Leer_C(['sistemachs_Cliente'],{
      sistemachs_Cliente:{_id:data.valores.orden_venta.cliente._id}
    })
    if (cliente.Respuesta==='Ok'){
      data.valores.orden_venta.cliente=cliente.datos.sistemachs_Cliente[0].valores;
    }
    this.setState({dialogo:{
        open:true,
        tam:'xl',
        fullScreen:true,
        Titulo: tipo,
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.80}}>
            {tipo
              ? <Reporte datos={data} tipo={tipo}/>//<embed src={`${NotaEntrega(data)}#view=Fit&toolbar=1&navpanes=1&scrollbar=1`} type="application/pdf" width="100%" height={window.innerHeight * 0.80} />
              : null
            }
          </div>,
        Cerrar: this.Cerrar
    }})
  }
  Modificar = (data)=>{
    console.log(data.valores.recibo)
    const {Config, dialogo}=this.state;
    this.setState({dialogo:{
      open:true,
      tam:'xl',
      fullScreen:true,
      Titulo: `Orden Venta ${data.valores.recibo}`,
      Cuerpo:
        <div style={{margin:5, height:window.innerHeight * 0.885}}>
          <Venta Config={Config} Datos={data} Cerrar={this.Cerrar} Orden/>
        </div>,
      Cerrar: this.Cerrar
    }})
  }
  
  Cerrar = () =>{
    
    setTimeout(async()=>{
      const respuesta = await this.state.props.Sincronizar();
      this.Refrescar();
    },3000);
    
    const {dialogo} = this.state;
    this.setState({dialogo:{...dialogo, open:false}})
  }
  
  Procesar = async(data) =>{
    const resp = await conexiones.Egreso_venta(data);
    this.Cerrar();
  }
  Venta = () =>{
    const {Config}=this.state;
    this.setState({dialogo:{
        open:true,
        tam:'xl',
        fullScreen:true,
        Titulo: 'Nueva Orden',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.885}}>
            <Venta Config={Config} Cerrar={this.Cerrar} Orden/>
          </div>,
        Cerrar: this.Cerrar
    }})
  }
 
  render(){
    const {datos, Config, titulos, dialogo}=this.state;
    const color =  Config.Estilos.Input_icono ? Config.Estilos.Input_icono : {};
    return (
      <div style={{width:'100%',height:'95%', position: "relative"}}>
        <Tabla
          
          Titulo={"Ordenes de Venta"}
          Config={Config}
          titulos={titulos}
          table={''}
          cantidad={ null}
          datos={datos}
          Accion={this.Modificar}
          acciones={
            <Stack direction={'row'} justifyContent="center"
                    alignItems="center"
            >
              <Box sx={{width:'20%'}}>
                <IconButton color={'primary'} title={'Crear nueva Venta'} onClick={this.Venta}>
                    <AddIcon style={color}/>
                </IconButton>
                <IconButton color={'primary'} title={'Refrescar valores de Usuarios'} onClick={this.Refrescar}>
                    <AutorenewIcon style={color}/>
                </IconButton>
              </Box>
              <Box sx={{width:'50%'}}>
                
              </Box>
              
            </Stack>
          }
        />
        {/* <Cargando open={cargando}/> */}
        <Dialogo  {...dialogo} config={Config}/>
       
      </div>
    )
  }
}
