import axios from 'axios';
import {Actualizar_datos, encriptado, Procesar, Tasa_cambio, Usuario, Ver_Valores} from '../constantes';
import { uploadImagen } from './api_cloundinary';

let User; 
let Api;
const Inicio = async(user)=>{
  User= user
}

export const conexiones = {
  Sincronizar,
  Ver_api,
  Login,
  Inicio,
  Enviar,
  Leer,
  Leer_C,
  Guardar,
  Guardar_Pago,
  Eliminar,
  Leer_data,
  Guardar_data,
  Eliminar_data,
  DataBase,
  VerApis,
  Verificar,
  Guardar_excel,
  ValorCambio,
  Mensualidades,
  Solvencias,
  Resumen,
  Enviar_pago,
  //SistemaCHS
  Guardar_produccion,
  Ingresar,
  Ingresar_material,
  Ingresar_empaque,
  Ingreso_Egreso,
  Recibo_Venta,
  Egreso_venta,
  Ventas,
  Serial,
  //unefa
  MisDatos,
  LeerHorario,
  GuardarHorario,
  DisponibilidadHorario,

  // whatsapp
  WhatsappQR
}

async function Sincronizar(tablas, datos, timeout=50000,mensaje='Solicitando datos...'){
  const Api = Ver_Valores().valores.app;
  console.log(' por sincronizar........')
  const resultados= await Enviar({
                            datos:{tablas, datos, Api},
                            http_destino:'/api/sincronizar',
                            method:'POST',
                            timeout,
                            mensaje_esperar:mensaje
                          });
  return resultados
}
//Ver codigo de api
async function Ver_api(api){
  const resultados= await Enviar({
    datos:{api},
    http_destino:'/api/ver_api',
    method:'POST',
  });
  
  if (resultados.Respuesta==='Ok'){
    Api= resultados.api;
    return Api
  }else{
    // confirmAlert({
    //   title: 'Problemas en conexión con servidor',
    //   buttons: [
    //     {label: 'Continuar'},
    //     {label: 'Reintentar', onClick: ()=>window.location.reload()}
    //   ]
    // });
  }
  // else if (resultados.Respuesta==='Ok'){
  //   return resultados.api;
  // }
  
  return {}
}
//Login
async function Login(datos, api){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
    datos:{...datos, Api, mantener:true, crear: false},
    http_destino:'/api/login',
  });
  return resultados
}
//Leer datos de archivo
async function Leer_data(archivo, api, valord={}){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, archivo, valord},
                            http_destino:'/api/leer_data',
                            method:'POST',
                          });
  return resultados
}
//Guardar archivo
async function Guardar_data(archivo, valor){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, archivo, valor},
                            http_destino:'/api/guardar_data',
                            method:'POST',
                          });
  return resultados
}
//Elimina archivo
async function Eliminar_data(archivo){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, archivo},
                            http_destino:'/api/eliminar_data',
                            method:'DELETE',
                          });
  return resultados
}
//Ver bases de datos del sistema
async function DataBase(){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api},
                            http_destino:'/api/database',
                            method:'POST',
                          });
  return resultados
}
//Ver bases de datos del sistema
async function VerApis(){
  const resultados= await Enviar({
                            datos:{User},
                            http_destino:'/api/verapis',
                            method:'POST',
                          });
  return resultados
}
//Pide datos al servidor
//Necesario tablas=[tabla1,tabla2....]
async function Leer(tablas, mensaje='Solicitando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User,tablas, Api},
                            http_destino:'/api/getall',
                            method:'POST',
                            mensaje_esperar:mensaje
                          });
  return resultados
}
async function Leer_C(tablas, condicion, timeout=50000,mensaje='Solicitando datos...'){
  const Api = Ver_Valores().valores.app;
  tablas=Object.keys(condicion)
  const resultados= await Enviar({
                            datos:{User,tablas, condicion, Api},
                            http_destino:'/api/getallc',
                            method:'POST',
                            timeout,
                            mensaje_esperar:mensaje
                          });
  return resultados
}
//Guardar Datos
async function Guardar(dato, tabla, user=undefined, mensaje='Guardando datos...', acciones=null){
  dato.actualizado=user ? user : User ? User.username : 'Sin usuario';
  let files=undefined;
  let imagenes= ['foto','avatar','image-cedula', 'video', 'logo', 'Logo', 'img', 'portada'];
  if (dato.files && Object.keys(dato.files).length!==0){
    files=dato.files;
  }else if (dato.file){
    files={'file_0':dato.file[0]};
    // dato.file=null;
  } else if (dato.multiples_valores){
    console.log('Por aquiiiiiiii', dato.valores)
    if (dato.valores.password && dato.valores.passwordc
        && dato.valores.password===dato.valores.passwordc
        &&dato.valores.password!==''){
          dato.valores.newpassword = dato.valores.password;
          delete dato.valores.password;
          delete dato.valores.passwordc;
    }
    if (dato.valores._id) dato['_id']=dato.valores._id
    Object.keys(dato.valores).map(val=>{
      const nombre=val.split('_url')[0];
      
      if (val.indexOf('_url')!==-1 && dato.valores[nombre]){ 
          if (files===undefined) files={}
          files={...files, [nombre]:dato.valores[nombre][0]}
          delete dato.valores[val]
      }else if(val.indexOf('Error-')!==-1){
        delete dato.valores[val]
      }

      return val
    })
  }else{
    imagenes.map(val=>{
      if (Object.keys(dato).indexOf(val)!==-1 && dato[val]!==undefined){
        if (files===undefined) files={}

        files={...files, [val]:dato[val][0]}
      }
      return val
    })
  }
  const {cloud_name, carpeta} = Ver_Valores().valores; 
  console.log('>>>>>>>archivos',files, cloud_name, carpeta);
  if (files){
    for (var i=0 ; i<Object.keys(files).length; i++){
      const camp = Object.keys(files)[i];
      let res = await uploadImagen(files[camp], carpeta, cloud_name);
      if (res===null && dato.multiples_valores){
        delete dato.valores[camp];
      }else if (res===null){
        delete dato[camp];
      }else if (dato.multiples_valores){
        dato.valores[camp]= res;
      }else{
        dato[camp]= res;
      }

    }
    
    files=undefined;
  }
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User: user ? user : User , Api, datos:JSON.stringify(dato), tabla},
                            http_destino:'/api/setall',
                            method:'POST',
                            destino:'imagenes',
                            mensaje_esperar:mensaje,
                            tipo:false,//files!==undefined ? 'Archivos' : false,
                            files,
                            acciones
                          });
  return resultados
}
//eliminar
async function Eliminar(dato, tablas, mensaje='Eliminar datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{dato, Api, tablas},
                            http_destino:'/api/delall',
                            method:'DELETE',
                            mensaje_esperar:mensaje
                          });
  return resultados
}

//eliminar
async function Verificar(dato){
  console.log(dato)
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{...dato, Api},
                            http_destino:'/api/login/verificar',
                            method:'POST',
                          });
  return resultados
}

//Guardar excel
async function Guardar_excel(valores){
  const resultados= await Enviar({
                            datos:{User, valores},
                            http_destino:'/api/guardar_excel',
                            method:'POST',
                          });
  return resultados
}
//Colegio
//Ver tasa de cambio
async function ValorCambio(){
  let resultados= await Enviar({
                            datos:{User},
                            http_destino:'/api/valor_dolar',
                            method:'POST',
                          });
  if (resultados.Respuesta==='Ok'){
    await Tasa_cambio({status:'Guardar', dato:{tasa:resultados.valor}})
  }else{
    resultados.Respuesta='Ok';
    resultados.valor= await Tasa_cambio({});
  }
  return resultados
}
//Solicitar Mensualidades
async function Mensualidades(dato, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(dato)},
                            http_destino:'/api/colegio/mensualidades',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
//Solicitar Solvencias
async function Solvencias(dato, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(dato)},
                            http_destino:'/api/colegio/solvencias',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
//Resumen
async function Resumen(dato, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(dato)},
                            http_destino:'/api/colegio/resumen',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
//Enviar Pago
async function Enviar_pago(dato, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(dato)},
                            http_destino:'/api/colegio/enviarpago',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
//Guardar Pago
async function Guardar_Pago(dato, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(dato)},
                            http_destino:'/api/procesarpago',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
//SistemasCHS
//Guardar los la produccion del dia
async function Recibo_Venta(){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
    datos:{User, Api},
    http_destino:'/api/reciboventa',
    method:'GET',
    destino:'archivos/imagenes',
  });
  return resultados
}
async function Serial(dato){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
    datos:{User, Api, dato},
    http_destino:'/api/serial',
    method:'POST',
    destino:'archivos/imagenes',
  });
  return resultados
}
async function Guardar_produccion(datos, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(datos)},
                            http_destino:'/api/guardarproduccion',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
async function Ingresar(datos, tabla_inv, tabla_ing, id, egresar ){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(datos), tabla_inv, tabla_ing, id, egresar},
                            http_destino:'/api/ingresar',
                            method:'POST',
                            destino:'archivos/imagenes'
                          });
  return resultados
}
async function Ingresar_material(datos, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(datos)},
                            http_destino:'/api/ingresarmaterial',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
async function Ingresar_empaque(datos, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(datos)},
                            http_destino:'/api/ingresarempaque',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
async function Ingreso_Egreso(datos, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(datos)},
                            http_destino:'/api/ingresoegreso',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
async function Egreso_venta(datos){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(datos)},
                            http_destino:'/api/egresoventa',
                            method:'POST',
                            destino:'archivos/imagenes'
                          });
  return resultados
}
async function Ventas(datos){
  //datos.estado='pendiente', por cobrar
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{User, Api, datos:JSON.stringify(datos)},
                            http_destino:'/api/ventas',
                            method:'POST',
                            destino:'archivos/imagenes'
                          });
  return resultados
}

//Unefa
//Leer Horario
async function MisDatos(user, api, mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{user, api:Api},
                            http_destino:'/api/unefa/misdatos',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
async function LeerHorario(dato, user, api, table='unefa_horario', mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{user, api:Api, table, datos:JSON.stringify(dato)},
                            http_destino:'/api/unefa/leerhorario',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
async function GuardarHorario(dato, user, api, table='unefa_horario', mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{user, api:Api, table, datos:JSON.stringify(dato)},
                            http_destino:'/api/unefa/guardarhorario',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
async function DisponibilidadHorario(dato, user, api, table='unefa_horario', mensaje='Guardando datos...'){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{user, api:Api, table, datos:JSON.stringify(dato)},
                            http_destino:'/api/unefa/disponibilidadhorario',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
//Whatsapp
async function WhatsappQR(){
  const Api = Ver_Valores().valores.app;
  const resultados= await Enviar({
                            datos:{Api},
                            http_destino:'/api/whatsappqr',
                            method:'POST',
                          });
  return resultados
}
async function Enviar(props){
  // console.log('Enviar ====>',props);
  //Datos de props necesarios
  //datos: valores que desea Enviar
  //http_destino: destino del envio '/api' o 'http://www.ejemplo.com/api'
  // tipo: solo si es Archivo, de lo contrario se deja en blanco
  // method: metodo de envio POST, GET, DELETE, PUT
  const Lista_Local_web=['/api/getallc','/api/getall'];
  let {datos, http_destino, destino, tipo, method, files, acciones}= props;
  http_destino = Ver_Valores().valores.http+ http_destino;
  // console.log('Enviar>>>>>>>', http_destino);
  //'/api/login' verificar si tambien funciona local
  let Respuesta
  if (Ver_Valores().tipo==='Electron' 
      && [ '/api/ver_api','/api/sincronizar','/api/login','/api/valor_dolar', '/api/whatsappqr'].indexOf(props.http_destino)===-1
      ){
        Respuesta = await Procesar(props);
        if ((Lista_Local_web.indexOf(props.http_destino)===-1)|| Ver_Valores().conectadoserver===false){
          return Respuesta
        }
  }
  const timeout=props.timeout ? props.timeout : 50000;
  const hash= await encriptado.Hash_texto(JSON.stringify(datos));
  datos= {...datos, hash};
  var data=datos;
  if (tipo && tipo==='Archivos'){
    data =  new FormData();

    await Object.keys(files).map(val=>{
      data.append(val,files[val]);
      return val
    })
    
    await Object.keys(datos).map(async value =>{
      if (['User','Api'].indexOf(value)!==-1){
        data.append(value, JSON.stringify(datos[value]));
      }else{
        data.append(value, datos[value]);
      }
      // console.log(value,data.get(value))
      return value;
    })
    
  }
  // console.log('destino',http_destino);
  let options = {
    url: http_destino,
    method: method ? method : 'POST',
    timeout: timeout,
    headers: {
      'Accept': 'application/json',
      'Content-type': tipo==='Archivos' ?
                      'multipart/form-data' :
                      'application/json;charset=UTF-8',
      'destino':destino
    },
    data,
    onUploadProgress: (progressEvent)=> {
      var progreso = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      // console.log(progreso);
      if(acciones) acciones(progreso)
      // this.setState({progreso});
    },
    onDownloadProgress: progressEvent => {
      // let percentCompleted = Math.round(
      //   (progressEvent.loaded * 100) / progressEvent.total
      // );
      if(acciones) acciones(progressEvent)//progressEvent)
    },

  };
  // console.log('enviar',options);
  return await axios(options)
    .then((res) => {
      
      if (res.data.Respuesta==='Error' && res.data.mensaje==="no autorizado"){
        Usuario('Eliminar')
        window.location.reload()
      }
      // this.setState({cargando:false, progreso:0})
      if (Ver_Valores().tipo==='Electron' && Lista_Local_web.indexOf(props.http_destino)!==-1){
        Respuesta = Actualizar_datos(Respuesta, res.data,  props.http_destino);
        return Respuesta
      }else{
        return res.data
      }
    })
    .catch(err => {
      console.log(err);
      // this.setState({cargando:false, progreso:0})
      return {Respuesta:'Error_c', mensaje:'Error en conexión, intente nuevamente'}
    } );
}
