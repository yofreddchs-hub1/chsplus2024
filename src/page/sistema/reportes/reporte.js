import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Typography from '@mui/material/Typography';
import Tabla from '../../../componentes/herramientas/tabla';
import { Titulos_todos, conexiones, genera_formulario, Form_todos} from '../../../constantes';
import Dialogo from '../../../componentes/herramientas/dialogo';
import moment from 'moment';
import { Stack, Box } from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Detalles from './detalles';
import Formulario from '../../../componentes/herramientas/formulario';

export default class Reporte extends Component {
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
    // console.log(item, this.state.Titulos[item])
    this.Abrir1(this.state.Titulos[item].field);
  }
  Inicio = async(dia=undefined, diaf=undefined) =>{
    let fecha=new Date();
    var mes = moment(fecha).format('MM');
    var ano = moment(fecha).format('YYYY');
    var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getUTCDate();
    let fechaf = new Date();
   
    let titulos = Titulos_todos('Titulos_ingresos_egresos');
    if (this.state.props.Titulo==='Materia Prima'){
      titulos=[...titulos,
        {
          "title": "Cantidad Paquete",
          "field": "actual",
          "tipo": "",
          "formato": (dato)=> {
            const dato1 = dato.valores ? dato.valores : dato;
            let resultado =Number(dato1.aproximadosaco && Number(dato1.aproximadosaco)!==0  
                            ? dato1.aproximadosaco
                            : Number(dato1.aproximadosaco)===0 && Number(dato1.cantidadsaco)!==0
                            ? Number(dato1.actual) / Number(dato1.cantidadsaco)
                            : 0);
            return `${resultado.toFixed(2)}`
          },
          "default": "",
          "type": "",
          "fixed":"left",
          "width":200
        }
      ]
    }

    let meses = [];
    const ingreso='#138E04';
    const egreso='#A30E02';
    const ambos ='#AA9309';
    const Titulos_dia=[...titulos,{
        field:moment(fecha).format('YYYY-MM-DD'),
        default:'',
        title:`${moment(fecha).format('DD-MM-YYYY')} \n Ingresos/Egresos`,
        tipo:'html',
        formato: (dato)=>{
          if (dato[moment(fecha).format('YYYY-MM-DD')]){
            const valor = dato[moment(fecha).format('YYYY-MM-DD')];
            return <Typography variant="h6" 
                          sx={{
                                color:valor.ingreso!==0 && valor.egreso===0 
                                  ? ingreso 
                                  : valor.ingreso===0 && valor.egreso!==0
                                  ? egreso
                                  : ambos
                              }} 
                    >
                      {`${Number(valor.ingreso).toFixed(2)} / ${Number(valor.egreso).toFixed(2)} `}
                    </Typography>
                    
          }
          return (<Typography variant="h6" >{`0 / 0`}</Typography>)
        }
    }];

    if (dia!==undefined){
      fecha = dia;
    }else{
      fecha = new Date(`${ano}-${mes}-1`);
    }
    if (diaf!==undefined){
      fechaf = diaf;
    }else{
      fechaf = new Date(`${ano}-${mes}-${ultimoDia}T00:00:00.000+00:00`);
      fechaf.setDate(fechaf.getDate()+1)
    }
    //for (var dia=1; dia<=ultimoDia;dia++){
    let diaa =4;
    const fechai= new Date(fecha);
    this.setState({fechai, fechaf});
    while (fecha<=fechaf){
      const campo =  moment(fecha).format('YYYY-MM-DD');//`${ano}-${mes}-${dia<10 ? '0' + dia : dia}`;
        titulos=[...titulos,{
            field:campo,
            default:'',
            title:`${moment(fecha).format('DD-MM-YYYY')} \n Ingresos/Egresos`,//`${dia<10 ? '0' + dia : dia}-${mes}-${ano} \n Ingresos/Egresos`,
            tipo:'html',
            props:{
              onClick:this.Seleccion(Number(diaa))
                
            },
            formato: (dato)=>{
              if (dato[campo]){
                return <Typography variant="h6" 
                              sx={{
                                    color:dato[campo].ingreso!==0 && dato[campo].egreso===0 
                                      ? ingreso 
                                      : dato[campo].ingreso===0 && dato[campo].egreso!==0
                                      ? egreso
                                      : ambos
                                  }} 
                        >
                          {`${Number(dato[campo].ingreso).toFixed(2)} / ${Number(dato[campo].egreso).toFixed(2)}`} 
                        </Typography>
              }
              return (<Typography variant="h6" >{`0 / 0`}</Typography>)
            }
        }];
        meses=[...meses, campo];
        fecha.setDate(fecha.getDate()+1);
        diaa++;
    }  
 
    const res = await conexiones.Ingreso_Egreso({meses, tipo:this.props.Titulo ? this.props.Titulo : undefined});
    let datos = [];
    let ingresos = [];
    let egresos = [];
    if (res.Respuesta==='Ok'){
      datos= res.inventario;
      ingresos = res.ingresos;
      egresos = res.egresos;
    }
    this.setState({cargando:false, Titulos:titulos, Titulos_dia, datos, ingresos, egresos})
    return
  }
  async componentDidMount(){
    this.Inicio();
    if (this.state.props.Actualizar && this.state.props.socket){
      this.state.props.Actualizar.map(val=>{
        this.state.props.socket.on(val, data => {
          this.Inicio();     
      })
        return val
      })
    }
   
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

  Seleccionar_dia = (dian)=>async(value) =>{
    let fechai = this.state.fechai;
    let fechaf = this.state.fechaf;
    if (dian==='fechai') fechai = value['$d'];
    else fechaf= value['$d']; 
    this.setState({[dian]:value['$d'], cargando:true});
    this.Cerrar();
    await this.Inicio(fechai, fechaf);
    setTimeout(() => {
      this.Abrir();
    }, 200);
  }

  Abrir = async()=>{
    const {datos, Config, Titulos, dialogo, fechai, fechaf}=this.state;
    let forma = {...Form_todos('Form_fecha')};
    forma.columna= 2;
    let otro = {...forma.value[0], key:'fechaf', name:'fechaf', nombre:'fechaf'};
    forma.value=[...forma.value, otro];
    let nuevos = await genera_formulario({valores:{}, campos: forma });

    nuevos.titulos[0].value.fecha.value= fechai;
    nuevos.titulos[0].value.fecha.label='Fecha Inicial';
    nuevos.titulos[0].value.fecha.onAccept = this.Seleccionar_dia('fechai');
    nuevos.titulos[0].value.fechaf.value= fechaf;
    nuevos.titulos[0].value.fechaf.label='Fecha Final';
    nuevos.titulos[0].value.fechaf.onAccept = this.Seleccionar_dia('fechaf');
    this.setState({dialogo:{
        open:!dialogo.open,
        tam:'xl',
        Titulo: this.props.TituloDetalle ? this.props.TituloDetalle : 'Titulo',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.80}}>
            <Tabla
                
                alto={window.innerHeight * 0.6}
                anchop = {window.innerWidth * 0.95}
                Titulo={this.props.Titulo ? this.props.Titulo : 'Titulo tabla'}
                Config={Config}
                titulos={Titulos}
                table={''}
                cantidad={ null}
                datos={datos}
                // Accion={this.Abrir1}
        
                acciones={
                  <Stack direction={'row'} justifyContent="center"
                    alignItems="center"
                  >
                    <Box sx={{width:window.innerWidth * 0.3}}>
                      <Formulario {...nuevos} />
                    </Box>
                  </Stack>
                }
            />
            
          </div>,
        Cerrar: this.Cerrar
    }})
  }

  Abrir_detalle = ()=>{
    const { dialogo}=this.state;
    this.setState({dialogo:{
        open:!dialogo.open,
        tam:'xl',
        Titulo: this.props.TituloDetalle ? this.props.TituloDetalle : 'Titulo',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.80}}>
            
            <Detalles Config={this.state.Config} Titulo={this.props.Titulo} Ingresos={this.state.ingresos} Egresos={this.state.egresos}/>
          </div>,
        Cerrar: this.Cerrar
    }})
  }

  Abrir1 = (valores)=>{
    let fecha = new Date(valores);
    fecha.setDate(fecha.getDate()+1)
    const { dialogo1}=this.state;
    this.setState({dialogo1:{
        open:!dialogo1.open,
        tam:'xl',
        Titulo:'Detalles',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.70}}>  
            <Detalles Config={this.state.Config} Titulo={this.props.Titulo} Fecha={fecha}/>
          </div>,
        Cerrar: ()=>this.setState({dialogo1:{open:false}})
    }})

  }
  render(){
    const {cargando, datos, Config, Titulos_dia, dialogo, dialogo1}=this.state;
    
    return (
      <div style={{width:'100%',height:'100%', position: "relative"}}>
        <Tabla
          
          Titulo={this.props.Titulo ? this.props.Titulo : "Titulo"}
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
              <IconButton color={'primary'} sx={{color:'#fff'}} title={'Detalles de Ingresos y egresos'} onClick={this.Abrir_detalle}>
                <Icon>plagiarism</Icon>
              </IconButton>
            </div>
          }
        />
        {/* <Cargando open={cargando}/> */}
        <Dialogo  {...dialogo} config={Config}/>
        <Dialogo {...dialogo1} config={Config}/>
      </div>
    )
  }
}
