import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {Titulos_todos ,conexiones, genera_formulario, Form_todos, Ver_Valores} from '../../../../constantes';
import Tabla from '../../../../componentes/herramientas/tabla';
// import Tabla from '../../../../componentes/herramientas/tablamostrar';
import Dialogo from '../../../../componentes/herramientas/dialogo';
import Cargando from '../../../../componentes/esperar/cargar';
import moment from 'moment';
import AddIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import Formulario from '../../../../componentes/herramientas/formulario';
import Venta from '../../venta';
import Reporte from '../pdf/reporte';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default class Ventas extends Component {
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
  Seleccionar_dia = (dian)=>(value) =>{
    let dia = this.state.dia;
    let diaf = this.state.diaf;
    if (dian==='dia') dia = value['$d'];
    else diaf= value['$d']; 
    this.setState({[dian]:value['$d']});
    this.Inicio(dia, diaf)
  }
  Refrescar = ()=>{
    let dia = this.state.dia;
    let diaf = this.state.diaf;
    this.Inicio(dia, diaf);
  }
  Inicio = async(dia, diaf)=>{

    if (dia===undefined || dia===null){
      dia = new Date();
      dia.setDate(1);  
    }
    if (diaf===undefined || diaf===null){
      diaf = new Date();
      var ultimoDia = new Date(diaf.getFullYear(), diaf.getMonth() + 1, 0).getUTCDate();
      
      diaf.setDate(ultimoDia); 
    }
    this.setState({cargando:true});
    let forma = {...Form_todos('Form_fecha')};
    forma.columna= 2;
    let otro = {...forma.value[0], key:'fechaf', name:'fechaf', nombre:'fechaf'};
    forma.value=[...forma.value, otro];
    
    let nuevos = await genera_formulario({valores:{}, campos: forma });
    
    nuevos.titulos[0].value.fecha.value= dia;
    nuevos.titulos[0].value.fecha.label='Fecha Inicial';
    nuevos.titulos[0].value.fecha.onAccept = this.Seleccionar_dia('dia');
    nuevos.titulos[0].value.fechaf.value= diaf;
    nuevos.titulos[0].value.fechaf.label='Fecha Final';
    nuevos.titulos[0].value.fechaf.onAccept = this.Seleccionar_dia('diaf');
    let titulos = Titulos_todos('Titulos_Ventas');
    titulos[1].formato=(dato)=>{
      const fecha = `${dato.valores ? moment(dato.valores.fecha).format('DD/MM/YYYY') : moment(dato.fecha).format('DD/MM/YYYY')}`;
      return fecha
    }
    let resp= await conexiones.Ventas({fecha:{dia:moment(dia).format('YYYY-MM-DD'),diaf:moment(diaf).format('YYYY-MM-DD')} });
    
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
    
    this.setState({cargando:false, dia, diaf, fecha:nuevos, datos, titulos, facturado, pendiente, cancelado})
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
    
    const {Config, dialogo}=this.state;
    this.setState({dialogo:{
      open:true,
      tam:'xl',
      fullScreen:true,
      Titulo: 'Nueva Venta',
      Cuerpo:
        <div style={{margin:5, height:window.innerHeight * 0.885}}>
          <Venta Config={Config} Datos={data} Cerrar={this.Cerrar}/>
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
        Titulo: 'Nueva Venta',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.885}}>
            <Venta Config={Config} Cerrar={this.Cerrar}/>
          </div>,
        Cerrar: this.Cerrar
    }})
  }
  Atras = (dato)=>(valores)=>{
    console.log(dato, valores)
    this.Abrir({_id:dato._id, valores:dato})
  }
  render(){
    const {cargando, datos, Config, titulos, dialogo, dialogo1, pendiente, facturado, cancelado}=this.state;
    const color =  Config.Estilos.Input_icono ? Config.Estilos.Input_icono : {};
    return (
      <div >
        <Tabla
          alto={Ver_Valores().tipo==='Web' ? window.innerHeight * 0.63 :window.innerHeight * 0.72}
          Titulo={"Ventas"}
          Config={Config}
          titulos={titulos}
          table={''}
          cantidad={ null}
          datos={datos}
          Accion={this.Abrir}
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
              <Box>
                <Formulario {...this.state.fecha} />
              </Box>
              <Box sx={{width:'50%'}}>
                <Typography variant="h6" align={'right'} color={'#fff'}>
                  Facturado ${Number(facturado).toFixed(2)}
                </Typography>
                <Typography variant="h6" align={'right'} color={'#fff'}>
                  Cancelado ${Number(cancelado).toFixed(2)}
                </Typography>
                <Typography variant="h6" align={'right'} color={'#A30E02'}>
                  Deuda ${Number(pendiente).toFixed(2)}
                </Typography>
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
