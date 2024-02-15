import React, {Component} from 'react';
// import Skeleton from '@material-ui/lab/Skeleton';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import Dialogo from './dialogo';
import Page from './page';
import { Titulo_default,Form_todos, Ver_Valores, genera_formulario, crear_campos, Permiso, conexiones } from '../../constantes';

//Utilizado para la creacion de formulacios con distintos datos
//formato de los datos
// formulario= {
//    campo:{
//        label:'titulo', value:'valor inicial del campo',
//        tipo:'tipo de dato que deseas ver o incluir' avatar, imagen, video, select, lista
//        en caso de ser select, lista:'valor de seleccion',
//              multiple:'bool indica seleccion multiple o no'
//        en caso de lista editable:'bool inidica si se puede modificar o no'
//                onClik:'funcion en el momento de un click'
//                value:'{lista:[item, item2, ...,], listae:[]}'
//        personal:{
//                  multiples:true, que desee varios campos en una fila
//                  value:{ el mismo formato de lo anterior}
//                }
//    }
// }
// formato de los datos segun el tipo
//Avatar:
class Formulario extends Component {
  constructor(props) {
      super(props);

      this.state = {
          props:this.props,
          datos:this.props.datos,
          dialogo:{
            open:false,  
          },
          Mensaje:{},
          Mas:this.Mas,
          config: props.config ? props.config : Ver_Valores().config
      }
  }
  
  Buscar_objeto_p = (name, form, result=[]) =>{
    // const {form}=this.state;
    let resultado=[...result];
    let encontrado = false
    Object.keys(form).map(valor=>{
      if (form[valor].multiples){
        const mas = this.Buscar_objeto_p(name,form[valor].value, [valor,'value'])
        if (mas.length!==0){
          resultado= [...resultado,...mas];
          encontrado=true;
        }
      }else if (valor===name){
        resultado= [...resultado, valor];
        encontrado=true;
      }
      return valor;
    });
    // console.log(resultado, encontrado);
    return encontrado ? resultado :[];
  }

  Mas = async(valor)=>{
    // esta hecho solo para valores y campos
    let {form}=this.state;
    const Config= this.state.config ? this.state.config : Ver_Valores().config
    
    const objeto= this.Buscar_objeto_p(valor.name,form);

    const titulos= await genera_formulario({valores:{}, campos: Form_todos(valor.form) },2)
    
    const formulario ={
      datos:{},
      titulos:titulos.titulos,
      botones:[
          {
            name:'guardar', label:'Guardar', title:'Guardar valores',
            variant:"contained", color:"primary", icono:<CheckIcon/>,
            sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            onClick: async(valores, campos)=>{
              campos = await crear_campos(campos, Form_todos(valor.form))
              const nuevos= await conexiones.Guardar({campos, valores, multiples_valores:true},valor.table);
              this.setState({dialogo:{ open: false}})
              if (nuevos.Respuesta==='Ok'){
                const lista= nuevos.resultado.map( v=>{
                  return {...v.valores}
                })
                if (objeto.length===1){
      
                  form[objeto[0]].lista=lista
                }else {
                  form[objeto[0]][objeto[1]][objeto[2]].lista=lista
                }
                this.setState({form})
              }else{
                  confirmAlert({
                      title: 'Error-' + nuevos.code,
                      message: 'Los datos no fueron guardados',
                      buttons: [{label: 'OK'}]
                    });
              }
            }, 
            validar:'true'
          },
          {
            name:'cancelar', label:'Cancelar', title:'Cancelar',
            variant:"contained", icono:<CancelIcon/>,
            onClick: ()=>this.setState({dialogo:{open:false}}),
          },
      ]
    }
    this.setState({dialogo:{ 
      open: true,
      Titulo:'Nuevo',
      Cuerpo:<Formulario {...formulario} />,
      Cerrar: ()=>this.setState({dialogo:{open:false}}),
      }
    })
  }
  Gen_Form =(titulos, datos)=>{
      let resultado={}
      // console.log(titulos)
      titulos.map(valor=>{
        let value= datos[valor.field] ? datos[valor.field] : '';
        let mas={}
        if (typeof value ==='object'){
          mas={tipo:'Json', height:  titulos.length===1 ? window.innerHeight*0.7 : 130}
        }
        
        resultado[valor.field]={
          label: valor.title,
          helperText:'',
          value,
          ...mas
        }
        return valor;
      })
      //console.log(resultado)
      return resultado;

  }

  Sel_grupo= (valor, lista) =>{
    let {resultados}=this.state;
    resultados[lista.name].grupo=valor[0];
    this.setState({resultados});
  }

  Cambio = (event) =>{
    let {name, value} = event.target;
    // console.log(name,value)
    const {form}=this.state;
    const objeto= this.Buscar_objeto(name,form);
    // console.log(name, objeto);
    let {resultados}=this.state;
    
    // let seleccion=[];
    // if (typeof value === 'object'){
    //   seleccion=value;
    //   value= value._id;
    // }
    
    // if (resultados[name]!==undefined && resultados[name]!==null && resultados[name].value){
    //   resultados[name].value=value;
    // }else{
      resultados[name]=value;
    // }

    // console.log(resultados[name]);
    this.setState({resultados});

    try{
      if (objeto.onChange!== undefined){
        objeto.onChange({name, resultados}, form)
      }
      if (objeto.onClick!== undefined){
        objeto.onClick(value)
      }
    }catch(error) {

    }
  }

  Buscar_objeto = (name, form, result=undefined) =>{
    // const {form}=this.state;
    let resultado=result;
    Object.keys(form).map(valor=>{
      if (form[valor].multiples){
        resultado= this.Buscar_objeto(name,form[valor].value, resultado);
      }else if (valor===name){
        resultado= form[valor];
      }
      return valor;
    });
    // console.log(resultado);
    return resultado;
  }

  Agregar_file = (valores, file) => {
    let resultado=[];
    let agregar=true;
    valores.map(valor=>{
      if (valor.subtitulo || !agregar){
        resultado=[...resultado, valor];
      }else if (agregar){
        agregar=false;
        resultado=[...resultado,{...valor, subtitulo:file.name}]
      }
      return valor
    })
    if (agregar)
      resultado=[...resultado, {titulo:'Capitulo '+(resultado.length+1), subtitulo:file.name}]
    return resultado;
  }

  Cambio_A = (e) =>{
    const {name, files} = e.target;
    let tipo=[];
    const {form}=this.state;
    let {resultados}=this.state;
    const objeto= this.Buscar_objeto(name,form);
    // console.log('Archivosssssssssss',objeto);
    resultados[name]=resultados[name] === undefined ? [] : resultados[name];
    resultados[name+'_url']=resultados[name+'_url'] === undefined ? [] : resultados[name+'_url'];

    const url =Object.keys(files).map(ur => {
      resultados[name] = objeto.multiple ? [...resultados[name], files[ur]] : [files[ur]];
      if (objeto.multiple){
        const grupo = resultados[name+'_lista'].grupo;
        resultados[name+'_lista'].value[grupo] = this.Agregar_file(resultados[name+'_lista'].value[grupo],
          files[ur]);
      }
      tipo=[...tipo, files[ur].type.split('/')[0]]
      return URL.createObjectURL(files[ur])
    });
    // const tipo = files.map(type => type.type.split('/')[0]);
    resultados[name+'_url']= objeto.multiple ? [...resultados[name+'_url'],...url] : url;

    // resultados={
    //   ...resultados,
    //   [name]: archivos,
    //   [name+'_url']:url,
    //   [name+'_tipo']:tipo,
    // }
    // console.log(valor.subir_videos.resultados)
    try{
      if (objeto.onChange!== undefined){
        objeto.onChange(name, resultados)
      }
    }catch(error) {

    }
    this.setState({resultados});
  }

  componentDidMount(){
    // console.log('Por formulario>>>>>>>>>>>>>>>>>>')
    let {titulos, datos, botones, Agregar}= this.state.props;
    
    let {Form_origen}=this.state;
    Form_origen=undefined;
    if (titulos===undefined && (datos!==undefined && Object.keys(datos).length!==0)){
      titulos= this.Gen_Form(Titulo_default(datos),datos);
    }
    let resultados= {...datos,...this.Valores_inicio(titulos)};
    
    this.setState({form: titulos, datos, resultados, total:datos,
                   Gen_Form:this.Gen_Form, Valores_inicio:this.Valores_inicio,
                   Cambio: this.Cambio, Cambio_A:this.Cambio_A,
                   Sel_grupo:this.Sel_grupo,
                   botones, Responder: this.Responder,
                   Agregar, Agregar_formulario: this.Agregar_formulario,
                   Remover_formulario:this.Remover_formulario,
                   Refrescar_agregar:this.Refrescar_agregar,
                   Form_origen
                  });
  }

  Componente =(name, titulos=this.state.form, anterior=null)=>{
    let resultado={
      encontrado:false,
      direccion:anterior !== null ? [anterior] : [],
    };
    Object.keys(titulos).map(valor=>{
      if (titulos[valor].multiples && !resultado.encontrado){
        const resul= this.Componente(name, titulos[valor].value, valor);
        resultado= resul.encontrado ? resul : resultado;
      }else if (valor===name){
        resultado={
          encontrado:true,
          direccion:[...resultado.direccion,valor],
          valor:titulos[valor]
        }
      }
      return valor;
    })

      return resultado;

  }

  Valido = async(name,valor) =>{
    let {resultados}=this.state;
    let valido=true;
    const val = await this.Componente(name);
    
    if (val.encontrado && val.valor.required &&
        ['',null,undefined].indexOf(valor)!==-1) {
      resultados['Error-'+name]=val.valor.mensaje_error ? val.valor.mensaje_error :'Indique el valor';
      this.setState({resultados})
      valido=false;
    }else if (val.encontrado && val.valor.comparar &&
              valor!=='' && valor!==resultados[val.valor.con]) {
      resultados['Error-'+name]=val.valor.mensaje_error ? val.valor.mensaje_error :'Indique el valor';
      valido=false;
    }else if (val.encontrado && val.valor.comparar &&
              valor===resultados[val.valor.con]) {
      resultados['Error-'+name]='';
    }
    
    return valido;
  }

  Validar = async(valores) =>{
    let respuesta=true;
    return Promise.all(Object.keys(valores).map(async(valor) =>{
      const result = await this.Valido(valor, valores[valor])
      if (!result) {
        respuesta=result;
      }
      return result;
    })
    ).then(valor=>{
      return respuesta;
    })

  }

  Responder = async(funcion, valor, validar, pos) =>{
    let {botones}=this.state;
    botones[pos].esperar='true';
    this.setState({botones})
    const {datos, form}=this.state;
    if (validar){
        const continuar= await this.Validar(valor);
        let Mensaje={}
        if (continuar) {
            const respuesta= await funcion({...datos, ...valor}, form);
            
            if (respuesta)
              Mensaje= {tipo:respuesta.Respuesta, ...respuesta}
        }else{
          Mensaje={
            tipo:'Error',
            mensaje:'Debe indicar los datos solicitados'
          }
        }
        botones[pos].esperar=undefined;
        this.setState({Cambios:true, botones, Mensaje}) 
    }else{
      const respuesta= await funcion({...datos, ...valor}, form)
      let Mensaje={}
      if (respuesta && respuesta.Respuesta){
        Mensaje= {tipo:respuesta.Respuesta, Mensaje:respuesta.Mensaje}
      }
      botones[pos].esperar=undefined;
      this.setState({botones, Mensaje}) 
    }

  }

  Valores_inicio = (valores) =>{
    // console.log('============>',valores);
    let resultado = {};
    if (valores!==undefined){
      Object.keys(valores).map(valor =>{
        //console.log('...',valor);
        if (valores[valor].multiples){
          resultado = {...resultado, ...this.Valores_inicio(valores[valor].value)}
        }else{
          resultado = {...resultado, [valor]:valores[valor].value, ['Error-'+valor]:valores[valor].helperText}
          if (valores[valor].tipo==='video'){
            resultado[valor+'_lista']=
                {
                  name:valor+'_lista',
                  label:valores[valor].label,
                  editable:true,
                  grupo:valores[valor].grupo,
                  value:{[valores[valor].grupo]:[]},
                };
          }
        }
        return valor;
      });
    }
    return resultado;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.datos !== state.datos){//(props.titulos !== state.form || props.datos !== state.datos) {
      // console.log('Por formulario 11111 >>>>>>>>>>>>>>>>>>')
      let {datos, titulos, botones, estilospage, Agregar}= props;
      
      // console.log('formularo segundo', state.resultados)
      
      if (titulos===undefined && datos && Object.keys(datos).length!==0){
        // console.log('pro aalalala')

        titulos= state.Gen_Form(Titulo_default(datos),  state.resultados === undefined ?  datos  : state.resultados);
      }
      // let resultados= Object.keys(datos).length !== 0 ? datos : {};
      let resultados= {...datos} 
      resultados = state.Valores_inicio ? {...resultados,...state.Valores_inicio(titulos)} : resultados
      
      return {
        props,
        datos,
        form: titulos,
        botones,
        estilospage,
        resultados,
        Agregar,
        config: props.config
      };
    }
    // No state update necessary
    return null;
  }

  Refrescar_agregar = (ahora)=>{
    
    this.setState({form:ahora, ahora:false})
  }
  
  Guardar_agregar = async(valores, campos)=>{
    let nuevo= {
      key:valores.nombre, name:valores.nombre.toLowerCase(), 
      label:valores.label ? valores.label : valores.nombre,
      placeholder: valores.label ? valores.label : valores.nombre, tipo:valores.tipo.value,
      multiline:valores.tipo.value==='multiline' , numberOfLines:valores.tipo.value==='multiline' ? 4 : 1,
      ...valores.tipo.value==='lista_multiuso' 
        ? {
            lista:valores.lista.titulo,
            "getOptionLabel": [
                    "titulo"
            ],
          } 
        : {}

    }
    let {Form_origen}=this.state
    Form_origen= Form_origen ? Form_origen : {...this.state.props.Form_origen} 
    Form_origen.value=[...Form_origen.value, nuevo ]
    const nuevo_f = await genera_formulario({campos:Form_origen,valores:{}})
    delete nuevo_f.titulos.xnonex
    // delete this.state.form[0].value.xnonex
    // delete this.state.form.xnonex
    let ahora = {...nuevo_f.titulos};
    this.setState({resultados:{...this.state.resultados, [nuevo.name]:''}, Form_origen, form:ahora, dialogo:{open:false}})
    
  }

  seleccion_tipo = async(nuevos,dato)=>{
    const Config= this.state.config ? this.state.config : Ver_Valores().config
    nuevos.datos=dato.resultados;
    nuevos.titulos.tipo.value=nuevos.datos.tipo;
    // nuevos.titulos.tipo.disabled= true;
    nuevos.titulos.tipo.mensaje_error= '';
    if (nuevos.datos.tipo._id===9){
      
      let lista=Object.keys(Config.Listas).map((v,i)=>{
        return {_id: i, titulo:v}
      })
      nuevos.titulos.lista.lista=lista;
      nuevos.titulos.lista.required=true;
      nuevos.titulos.lista.mensaje_error='Selecciones lista';
      nuevos.titulos.lista.disabled= false;
    }
    const formulario ={
      ...nuevos,
      botones:[
          {
            name:'guardar', label:'Agregar', title:'Agregar item',
            variant:"contained", color:"primary", icono:<CheckIcon/>,
            onClick: this.Guardar_agregar, validar:'true',
            sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
            disabled: !Permiso('guardar'),
          },
          {
            name:'cancelar', label:'Cancelar', title:'Cancelar',
            variant:"contained", icono:<CancelIcon/>,
            onClick: ()=>this.setState({dialogo:{open:false}}),
            sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
          },
      ]
    }
    this.setState({dialogo:{ 
      tam:'xs',
      open: true,
      Titulo:'Agregar item',
      Cuerpo:<Formulario {...formulario} />,
      Cerrar: ()=>this.setState({dialogo:{open:false}}),
      }
    })

  }

  Agregar_formulario =async()=>{
    const Config= this.state.config ? this.state.config : Ver_Valores().config
    const Form_origen = await Form_todos('Form_agregaritem');
    let nuevos = await genera_formulario({valores:{}, campos: Form_origen }, 1)
    nuevos.titulos.tipo.onChange= (dato)=>this.seleccion_tipo(nuevos,dato)
    const formulario ={
      ...nuevos,
      botones:[
          {
            name:'cancelar', label:'Cancelar', title:'Cancelar',
            variant:"contained", icono:<CancelIcon/>,
            onClick: ()=>this.setState({dialogo:{open:false}}),
            sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
          },
      ]
    }
    this.setState({dialogo:{ 
      tam:'xs',
      open: true,
      Titulo:'Agregar item',
      Cuerpo:<Formulario {...formulario} />,
      Cerrar: ()=>this.setState({dialogo:{open:false}}),
      }
    })
  }
  
  Quitar= (valores)=>{
    
    const {form, resultados} = this.state;
    
    let nuevo = {}
    let nuevoR= {}
    Object.keys(form).map(val=>{
      if (valores.tipo.value!==val) {
        nuevo[val]=form[val];
        nuevoR[val]=resultados[val];
      }
      
      return val;
    })
    
    this.setState({dialogo:{open:false}, form:nuevo, resultados:nuevoR})
    // this.setState({dialogo:{open1:false}})
    return
    // confirmAlert({
    //   title: 'Eliminar item',
    //   message: `Desea eliminar ${valores.tipo.title}?`,
    //   buttons: [
    //     {
    //       label: 'SI',
    //       onClick: async () => {
    //         const {form, resultados} = this.state;
    //         let nuevo = {}
    //         let nuevoR= {}
    //         Object.keys(form).map(val=>{
    //           if (valores.tipo.value!==val) {
    //             nuevo[val]=form[val];
    //             nuevoR[val]=resultados[val];
    //           }
              
    //           return val;
    //         })
            
    //         this.setState({form:nuevo, resultados:nuevoR})
    //       }
    //     },
    //     {
    //       label: 'NO',

    //     }
    //   ]
    // });
  }
  
  Remover_formulario = ()=>{
    // console.log('Remover')
    const Config= this.state.config ? this.state.config : Ver_Valores().config
    const {form}=this.state;
    let lista = Object.keys(form).map((v,i)=>{
      return {_id:i, titulo:form[v].placeholder, value:v} 
    }).filter(f=> f.titulo!==undefined)

    const formulario ={
      datos:{},
      titulos:{
        tipo:{
          label: 'Item a eliminar',
          helperText:'',
          tipo:'select',
          lista: lista,
          required:true,
          mensaje_error:'Debe seleccionar el item a eliminar',
          value:null,
          getOptionLabel: (option)=> `${option.titulo}`,
          getOptionSelected: (option)=> `${option.value}`,
      },
      },
      botones:[
          {
            name:'eliminar', label:'Eliminar', title:'Eliminar item',
            variant:"contained", color:"secondary", icono:<DeleteIcon/>,
            onClick: this.Quitar, validar:'true',
            disabled: !Permiso('eliminar'), confirmar:'true',
            confirmar_mensaje:'Desea eliminar',confirmar_campo:'tipo',
            sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
          },
          {
            name:'cancelar', label:'Cancelar', title:'Cancelar',
            variant:"contained",  icono:<CancelIcon/>,
            onClick: ()=>this.setState({dialogo:{open:false}}),
            sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
          },
      ]
    }
    this.setState({dialogo:{ 
      open: true,
      tam:'xs',
      Titulo:'Eliminar Item',
      Cuerpo:<Formulario {...formulario} />,
      Cerrar: ()=>this.setState({dialogo:{open:false}}),
      }
    })
  }

  render(){
    
    return (
      <div>
        <Page
            config= {this.state.config}
            datos={{...this.state}}
            http_server={this.props.http_server}
        />
        <Dialogo  {...this.state.dialogo} config={this.state.config ? this.state.config : Ver_Valores().config ? Ver_Valores().config : {Estilos:{}}}/>
      </div>
    )
  }
}

export default Formulario;
