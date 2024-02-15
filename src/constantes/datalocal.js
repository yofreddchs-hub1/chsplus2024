import { conexiones } from "./conexiones";
import { nuevo_Valores, Ver_Valores } from "./valores"
import { encriptado } from './encriptado';
import { Usuario } from "./funciones";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from "moment";

const Datastore= require("nedb-promises");
var ObjectID = require('bson-objectid');
const {Hash_chs,Hash_password, Codigo_chs} = encriptado;
const Table_modificar= 'sistemachs_Modificado';
const Table_Eliminados= 'sistemachs_Eliminados';
const Database=(tabla)=>{
    let db = new Datastore({
        filename: process.env.PUBLIC_URL + `/data1/${tabla}.db`, 
        autoload: true
    });
    return db
}
export const Iniciar_data = async () =>{
  console.log('Limpiando toda la base de datos>>>>>>>>>');
  let respuesta='Eliminando base de datos>>>>>>>>';
  let ultimos = Database(Table_modificar);
  await ultimos.remove({}, { multi: true });
  const tablas = Ver_Valores().valores && Ver_Valores().valores.models 
            ? Ver_Valores().valores.models 
            :[];
  respuesta = await Promise.all(tablas.map(async(data)=>{
    let db = Database(data);
    await db.remove({}, { multi: true });
      
  }))
  .then(()=>{
      // nuevo_Valores({sincronizado:true})
      //return 'Datos locales verificados, enviando a servidor...'
      console.log('Bases de datos limpiadas>>>>>>>>>>>>>');
      return 'Datos Eliminados';
      
  });
  return respuesta;
}
export const Ultima_fecha= async()=>{
  let ultimos = Database(Table_modificar);
  const ultimo = await ultimos.find({}).sort({fecha:-1}).limit(1);
  let fecha = ultimo.length===0 ? null : ultimo[0].fecha;
  console.log('>>>>>>>>>>>>>>>>>>>>>>Ultima fecha',fecha)
  return fecha;
}
const Refrescar_data=async(nuevo, peticion)=>{
  const User = await Usuario();
  // if (peticion==='/api/colegio/recibo'){
  //   for(let i=0;i<nuevo.length;i++){
  //     await Guardar_data(User,'uecla_Recibo',nuevo[i],false)
  //   }
  // }else if (peticion==='/api/colegio/mensualidades'){
  //   for(let i=0;i<nuevo.length;i++){
  //     await Guardar_data(User,'uecla_Mensualidad',nuevo[i],false)
  //   }
  // }else if (peticion==='/api/colegio/resumen'){
  //   // for (let i=0 ; i<nuevo.mensualidad.length; i++){
  //   //   await Guardar_data(User,'uecla_Mensualidad',nuevo.mensualidad[i],false);
  //   // }
  //   for (let i=0; i<nuevo.recibos.length; i++){
  //     await Guardar_data(User,'uecla_Recibo',nuevo.recibos[i],false);
  //   }
  // }else{
    const campos = Object.keys(nuevo);
    
    for (let i=0; i<campos.length;i++){
      const campo = campos[i];
      if (campo.indexOf('_cantidad')===-1){
        for (var j=0;j<nuevo[campo].length;j++){
          const dato = nuevo[campo][j];
          // console.log('>>>>>>>>>>aquikkkkk')
          await Guardar_data(User,campo,dato,false)
        }
      }
    }
  //}
}
export const Actualizar_datos = (local, remoto, peticion)=>{
  // console.log('en actulizar datos-------', peticion, local, remoto)
  let resultado = local.Respuesta ==='Ok' ? {...local} : {...remoto};
  const especiales = []
  let nuevo ={};
  let actualizar ={};
  if (remoto.Respuesta==='Ok'){
    const datosl= //peticion==='/api/colegio/recibo' ? local.recibos 
    //               : peticion==='/api/colegio/mensualidades' ? local.mensualidades
    //               : peticion==='/api/colegio/resumen' || peticion==='/api/colegio/solvencias'? local
    //               :
                  local.datos;
    const datosr= //peticion==='/api/colegio/recibo' ? remoto.recibos 
                  // : peticion==='/api/colegio/mensualidades' ? remoto.mensualidades
                  // : peticion==='/api/colegio/resumen' || peticion==='/api/colegio/solvencias' ? remoto
                  // : 
                  remoto.datos;
    const campos = //especiales.indexOf(peticion)!==-1 || peticion==='/api/colegio/solvencias' ? [] : 
                    Object.keys(remoto.datos)
    // console.log(datosl, datosr)
    if (especiales.indexOf(peticion)!==-1){
      nuevo=[];
      actualizar=[];
      for (let i=0;i<datosr.length; i++){
        let dato = datosr[i];
        const pos = datosl.findIndex(f=>f._id===dato._id);
        if (pos!==-1){
          // dato = String(dato.updatedAt) >= String(datosl[pos].updatedAt) ? dato : datosl[pos];
          if (moment(dato.updatedAt).format("YYYY/MM/DD HH:mm:ss") > moment(datosl[pos].updatedAt).format("YYYY/MM/DD HH:mm:ss")){
            actualizar=[...actualizar, dato];
          }
          dato = moment(dato.updatedAt).format("YYYY/MM/DD HH:mm:ss") >= moment(datosl[pos].updatedAt).format("YYYY/MM/DD HH:mm:ss") ? dato : datosl[pos];
        }else{
          actualizar=[...actualizar, dato];
        }
        nuevo=[...nuevo,dato]
      }
    }else{
      for (let i=0; i<campos.length; i++){
        const campo = campos[i];
        if (campo.indexOf('_cantidad')===-1){
          nuevo[campo]=[];
          for(let j=0; j< datosr[campo].length; j++){
            let dato = datosr[campo][j];
            const pos = datosl[campo].findIndex(f=>f._id===dato._id);
            if (pos!==-1){
              if (moment(dato.updatedAt).format("YYYY/MM/DD HH:mm:ss") > moment(datosl[campo][pos].updatedAt).format("YYYY/MM/DD HH:mm:ss")){
                if (actualizar[campo]){
                  actualizar[campo]=[...actualizar[campo], dato]
                }else{
                  actualizar[campo]=[dato]
                }
                
                // console.log(campo, actualizar)
              }
              dato = moment(dato.updatedAt).format("YYYY/MM/DD HH:mm:ss") >= moment(datosl[campo][pos].updatedAt).format("YYYY/MM/DD HH:mm:ss") ? dato : datosl[campo][pos];
              
            }else{
              if (actualizar[campo]){
                actualizar[campo]=[...actualizar[campo], dato]
              }else{
                actualizar[campo]=[dato]
              }
            }
            nuevo[campo]=[...nuevo[campo], dato];
          }
        }else{
          nuevo[campo]=datosr[campo];
          actualizar[campo]=datosr[campo];
        }  
      }
    }  
  }
  Refrescar_data(actualizar, peticion);
  
  return {...resultado, 
    ...{datos: nuevo} 
  };
  //peticion==='/api/colegio/recibo' 
        //? {recibos:nuevo} 
        // : peticion==='/api/colegio/mensualidades'
        // ? {mensualidades:nuevo}
        // : peticion==='/api/colegio/resumen' || peticion==='/api/colegio/solvencias'
        // ? nuevo
        // : 
}
export const Sincronizar=async(enviar=true, Tablas=undefined, FechaA=undefined)=>{
  console.log('en sincronizar ......')
  let enviars= false;
  const {online, conectadoserver} = Ver_Valores();
  if (!online || !conectadoserver) return 'Sin conexión';
  nuevo_Valores({sincronizando:true})
  let paso ='Verificando data local...';
  const tablas = Tablas ? ['sistemachs_Eliminados',...Tablas] : Ver_Valores().valores && Ver_Valores().valores.models 
          ? Ver_Valores().valores.models 
          :[];
  let tablase=[]; 
  const User = await Usuario();
  // console.log(paso)
  // let ultimos = Database(Table_modificar);
  // await ultimos.remove({}, { multi: true });
  // const ultimo = await ultimos.find({}).sort({fecha:-1}).limit(1);
  // let fechai = ultimo.length===0 ? null : ultimo[0].fecha;
  // console.log('>>>>>>>>>>>>>>>>>>>>>>Ultima fecha',fechai)
  let fechai = await Ultima_fecha();
  if (FechaA!==undefined){
    fechai= new Date(fechai);
    fechai.setDate(fechai.getDate() - FechaA);
  }
  // console.log('>>>>>>>>>>>>>>>>>>>',Object.keys(Ver_Valores()))
  let fechaf
  for (var i=0; i<tablas.length; i++){
    const data=tablas[i];
    let db = Database(data);
    const datosl= await db.find({local:true});
    if (datosl.length!==0){
      tablase=[...tablase, data];
      enviars= true;
    
      let resultado = await conexiones.Sincronizar(data, {fecha:fechai, datos:datosl});
      if (resultado.Respuesta==='Ok'){
        fechaf = resultado.fecha;
        if (data!==Table_Eliminados){
          for (let i=0; i<datosl.length; i++){ 
            const val = datosl[i];
            await Guardar_data(User,data,val,false)
          }
        }else{
          console.log('En eliminar>>>>>', datosl)
          
          for (let i=0; i<datosl.length;i++){
            const valor = datosl[i].valores;
            const Elimina= await Database(valor.tabla);
            await Elimina.deleteOne({_id:valor._id});
          }
          
          await db.remove({}, { multi: true });
        }
      }else{
        console.log('Error Sincronizando >>>>', data, resultado);
        paso='Error en respuesta de servidor'
      }
    }
  }
  
  if (enviar && enviars){
    Ver_Valores().socket.emit('Sincronizado',{tablase, fechaf})
  }
  nuevo_Valores({sincronizando:false})
  
  return paso;
}
// export const Sincronizar=async()=>{
//     const {online, conectadoserver} = Ver_Valores();
    
//     if (!online || !conectadoserver) return 'Sin conexión';
//     nuevo_Valores({sincronizando:true})
//     let paso ='Verificando data local...';
//     const tablas = Ver_Valores().valores && Ver_Valores().valores.models 
//             ? Ver_Valores().valores.models 
//             :[];
//     const User = await Usuario();
//     // console.log(paso)
//     // let ultimos = Database(Table_modificar);
//     // await ultimos.remove({}, { multi: true });
//     // const ultimo = await ultimos.find({}).sort({fecha:-1}).limit(1);
//     // let fechai = ultimo.length===0 ? null : ultimo[0].fecha;
//     // console.log('>>>>>>>>>>>>>>>>>>>>>>Ultima fecha',fechai)
//     let fechai = await Ultima_fecha();
//     let fechaf
//     paso = await Promise.all(tablas.map(async(data)=>{
//         let db = Database(data);
//         // console.log('Sincronizando >>>>', data);
//         const datosl= await db.find({local:true});
//         // console.log('Local>>>', data,datosl);
//         let resultado = await conexiones.Sincronizar(data, {fecha:fechai, datos:datosl});
//         if (resultado.Respuesta==='Ok'){
//           let datos = resultado.resultados;
//           fechaf = resultado.fecha;
//           // console.log('Server>>>>',data,datos);
//           // await db.remove({}, { multi: true });
//           if (data!==Table_Eliminados){
//             for (let i=0; i<datos.length; i++){ 
//               const val = datos[i];
//               await Guardar_data(User,data,val,false)
//             }
//           }else{
//             console.log('En eliminar>>>>>', datos)
            
//             for (let i=0; i<datos.length;i++){
//               const valor = datos[i].valores;
//               const Elimina= await Database(valor.tabla);
//               await Elimina.deleteOne({_id:valor._id});
//             }
            
//             await db.remove({}, { multi: true });
//           }
//           // console.log('Sincronizado <<<<<<<', data);
//         }else{
//           console.log('Error Sincronizando >>>>', data, resultado);
//           paso='Error en respuesta de servidor'
//         }
//     }))
//     .then(()=>{
//         Guardar_data(User,Table_modificar,{fecha:fechaf},false);
//         nuevo_Valores({sincronizado:true})
//         //return 'Datos locales verificados, enviando a servidor...'
//         return 'Datos sincronizados';
//     });
//     // console.log('2',paso)
//     // let resultado = await conexiones.Sincronizar(tablas, nuevos);
//     // if (resultado.Respuesta==='Ok'){
//     //     let datos = resultado.resultados;

//     //     paso = await Promise.all(tablas.map(async(data)=>{
//     //         //Eliminar todos.....
//     //         let db = Database(data);
//     //         await db.remove({}, { multi: true });
//     //         for (let i=0; i<datos[data].length; i++){ 
//     //             const val = datos[data][i];
//     //             await Guardar_data(User,data,val,false)
//     //         }
            
            
//     //     }))
//     //     .then(()=>{
//     //         nuevo_Valores({sincronizado:true})
//     //         return 'Datos sincronizados';
//     //     });
//     //     // console.log('3',paso)
//     // }else{
//     //     console.log(resultado);
//     //     paso='Error en respuesta de servidor'
//     // }
//     Ver_Valores().socket.emit('Sincronizado',fechaf)
//     nuevo_Valores({sincronizando:false})
//     return paso;
// }

// Porcesos para el almacenamiento de datos de forma local
// cuando se trabaja con app electron
// el envio de archivos hay que ver

export const Procesar = async(props)=>{
    const {http_destino} = props;

    // console.log('>>>>>>>>>>>>> Por procesar',props);
    const Procesos={
        '/api/getall':async(props)=> await Getall(props),
        '/api/getallc':async(props)=> await Getall_C(props),
        '/api/setall':async(props)=> await Setall(props),
        '/api/delall':async(props)=> await Delall(props),
        '/api/ingresoegreso':async(props)=> await IngresoEgreso(props),
        '/api/ingresar':async(props)=> await Ingresar(props),
        '/api/ingresarmaterial':async(props)=> await IngresarMaterial(props),
        '/api/ingresarempaque':async(props)=> await IngresarEmpaque(props),
        '/api/serial':async(props)=> await PeticionSerial(props),
        '/api/ventas':async(props)=> await Ventas(props),
        '/api/egresoventa': async(props)=> await EgresoVentas(props),
        '/api/guardarproduccion': async(props) => await Guardar_produccion(props),
    }

    if (Procesos[http_destino]){
        const resp=await Procesos[http_destino](props);
        const {conectadoserver, sincronizado} = Ver_Valores();
        // console.log('Sincronizado', sincronizado)
        if(conectadoserver && !sincronizado && !Ver_Valores().esperaSincronizar){
            const SincronizarP = Ver_Valores().Sincronizar;
            if (SincronizarP){
                SincronizarP();
            }else{Sincronizar()}
        }
        return resp;
    }else{
        confirmAlert({
          title: 'Error',
          message: `No se encuentra la solicitud (${http_destino})`,
          buttons: [{label: 'OK'}]
        });
        return {Respuesta:'Error', mensaje:`No se encuentra la solicitud (${http_destino})`}
    }
    
}

const Getall= async(props) =>{
    const {tablas}= props.datos
    const Resultado = await Ver_datos(tablas);
    return Resultado
}
const Getall_C= async(props) =>{
    const {tablas, condicion}= props.datos
    
    const Resultado = await Ver_datos_C(tablas, condicion);
    return Resultado
}
const Setall= async(props)=>{
    const {User,tabla}= props.datos;
    let newdatos= JSON.parse(props.datos.datos);
    try{
        //almacena imagen dentro del servidor
        // if ((tabla==='null' || tabla==='') && req.files ){
        //   req.files.map(val=>{
        //     newdatos[val.fieldname]='/api/imagen/'+val.filename//[...newdatos['filename'],req.files[val][0].filename];
        //     return val;
        //   })
          
        //   res.json({Respuesta:'Ok', newdatos});
        // }
        let DB = Database(tabla);
    
        if (newdatos['unico'] && newdatos._id===undefined){
          let datos = await DB.find(
              {$text: {$search: newdatos['multiples_valores'] ? newdatos.valores[newdatos['unico']] : newdatos[newdatos['unico']] , 
              $caseSensitive: false}});
          
          let continuar = true;
          
          datos.map(d=>{
            if ((newdatos['multiples_valores'] && d.valores[newdatos['unico']]===newdatos.valores[newdatos['unico']])
                || (!newdatos['multiples_valores'] && d[newdatos['unico']]===newdatos[newdatos['unico']])
            ){
              continuar = false
            }
            return d;
          })
          
          if (continuar===false){
            return{Respuesta:'Error', mensaje:`Nombre de usuario ya existe`};
          }
        }
        //subir imagen a cloudinary ver como realizar desde aqui
        // if (req.files){
          
        //   let archivos={}
        //   for  (var i=0; i<req.files.length; i++){
        //     const result = await cloudinary.uploader.upload(req.files[i].path);
        //     archivos[req.files[i].fieldname]= result.secure_url;
        //     archivos[req.files[i].fieldname+'-id']= result.public_id;
        //   }
          
        //   const valor_verificar = await DB.findOne({_id:newdatos._id})
        //   if(newdatos['multiples_valores']){
        //     req.files.map(val=>{
        //       if (valor_verificar!==null 
        //           && valor_verificar.valores[val.fieldname]!=='' 
        //           && valor_verificar.valores[val.fieldname]!==null 
        //           && valor_verificar.valores[val.fieldname]!==undefined
        //         ) 
        //         Eliminar_imagen(valor_verificar.valores[val.fieldname+'-id'])
        //       // newdatos.valores[val.fieldname]='/api/imagen/'+val.filename//[...newdatos['filename'],req.files[val][0].filename];
        //       newdatos.valores[val.fieldname]=archivos[val.fieldname];
        //       newdatos.valores[val.fieldname+'-id']=archivos[val.fieldname+'-id'];
        //       return val;
        //     })
        //   }else{
        //     req.files.map(val=>{
        //       if (valor_verificar!==null && valor_verificar[val.fieldname]!=='' && valor_verificar[val.fieldname]!==null && valor_verificar[val.fieldname]!==undefined) 
        //         Eliminar_imagen(valor_verificar[val.fieldname+'-id'])
        //       // newdatos[val.fieldname]='/api/imagen/'+val.filename//[...newdatos['filename'],req.files[val][0].filename];
        //       newdatos[val.fieldname]=archivos[val.fieldname]
        //       newdatos[val.fieldname+'-id']=archivos[val.fieldname+'-id']
        //       return val;
        //     })
        //   }
      
        // }
        // console.log(newdatos)
        
        if (newdatos.newpassword){
          newdatos.password= await Hash_password(newdatos.newpassword);
          delete newdatos.newpassword
        }else if (newdatos['multiples_valores'] && newdatos.valores.newpassword){
          newdatos.valores.password= await Hash_password(newdatos.valores.newpassword);
          delete newdatos.valores.newpassword
        }else{
          delete newdatos.password
        }
        // if (newdatos._id){//(newdatos._id){
        //   const hash_chs = await Hash_chs({...newdatos})
        //   await DB.updateOne({_id:newdatos._id},{...newdatos, hash_chs, actualizado:User.username},{ upsert: true });
        // } else {
        //   let cod_chs = await Codigo_chs({...newdatos['multiples_valores'] ? newdatos.valores : newdatos});
        //   const hash_chs = await Hash_chs({...newdatos, cod_chs})
        //   console.log('Por aquiiio dosdif')
        //     //   const Nuevo = new DB({...newdatos, cod_chs, hash_chs, actualizado:User.username});
        //     //   await Nuevo.save();
        //     await DB.insert({...newdatos, cod_chs, hash_chs, actualizado:User.username, createdAt: fecha, updatedAt:fecha});
        // }
        const resultado=await Guardar_data(User, tabla, newdatos);
        console.log('Actualizar_'+tabla)
        // global.io.emit('Actualizar_'+tabla,{tabla}) //datos:resultado})
        return{Respuesta:'Ok', resultado};
    }catch(error) {
        console.log('Error-Setall',error, error.keyValue);
        return{Respuesta:'Error', code: error.code};
    }
}
const Delall= async(props)=>{
    const {dato, tablas}= props.datos;
    const User = await Usuario();
    try{
        const resultado = await Promise.all(tablas.map(async(data)=>{
            let DB = Database(data);
            // const valor_verificar = await DB.findOne({_id:dato._id})
            // let imagenes= Object.keys(valor_verificar.valores).filter(f=>f.indexOf('-id')!==-1)
            // imagenes.map(val=>{
            //     Eliminar_imagen(valor_verificar.valores[val])
            // })
            
            await DB.deleteOne({_id:dato._id});
            // const tablas = Ver_Valores().valores && Ver_Valores().valores.models 
            // ? Ver_Valores().valores.models 
            // :[];
            // const pos= tablas.findIndex(v=> v.indexOf('Eliminados')!==-1);
            // if (pos!==-1 && tablas[pos]){
                Guardar_data(User,Table_Eliminados, {valores:{...dato, tabla:data}, tabla:data})
            // }
            
          
            try{
                // const direct = __dirname.replace('/src/controllers','/archivos/imagenes/');
                // dato.filename.map(img=>
                //   fs.unlinkSync(direct+img)  
                // )
                // await cloudinary.uploader.destroy(dato.fileid[0]);
            }catch (err) {
                
            }
            // if (Object.keys(dato).indexOf('fileid')!==-1){
            //   dato.fileid.map( fileid=>
            //     global.gfs.delete(new mongoose.Types.ObjectId(fileid), (err, data) => {  
            //     })
            //   ) 
                
            // }
            return data;
        })).then(async()=>{
            let condicion={};
            tablas.map(val=>{
                condicion[val]={};
                return val
            })
            let datos= await Ver_datos_C(tablas,condicion);
            // console.log('Despues de eliminar',datos);
            return {Respuesta:'Ok',datos} ;
        });
        return resultado;
      }catch(error) {
        console.log('Error-Delall',error);
        return {Respuesta:'Error'};
      }
}
//De sistemachs
const IngresoEgreso = async(props)=>{
  let {datos}=props.datos;
  datos = JSON.parse(datos);
    let Ingreso;
    let Egreso;
    let Inventario;
    if (datos.tipo === undefined ){
      return {Respuesta:'Ok', inventario:[], mensaje:'Tipo de ingreso y egresos no conocidos'};
    }
    if (datos.tipo==='Materia Prima'){
      Ingreso = Database('sistemachs_Ingresomp');
      Egreso = Database('sistemachs_Egresomp');
      Inventario = Database('sistemachs_Inventariomp');
    }else if (datos.tipo==='Empaque'){
      Ingreso = Database('sistemachs_Ingresoem');
      Egreso = Database('sistemachs_Egresoem');
      Inventario = Database('sistemachs_Empaque');
    }else if (datos.tipo==='Producto Terminado'){
      Ingreso = Database('sistemachs_Ingresopt');
      Egreso = Database('sistemachs_Egresopt');
      Inventario = Database('sistemachs_Inventariopt');
    }else{
      return{Respuesta:'Ok', inventario:[], mensaje:'Tipo de ingreso y egresos no conocidos'};
    }
    let ingresos=[];
    let egresos=[];
    
    let inventario = await Inventario.find();
    //agregado para filtrar por cede
    const sede = Ver_Valores().sede;
    inventario= inventario.filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) )
    //------------------------------
    inventario= inventario.map(val=>{return{_id:val._id, ...val.valores}});

    for (var i=0; i<datos.meses.length;i++){
      const mes = datos.meses[i];
      // let ingreso = await Ingreso.find({$text: {$search: mes, $caseSensitive: false}});
      // let ingreso = await Ingreso.find();
      let ingreso = await Ingreso.find({"valores.fecha":mes});
      ingreso= ingreso.filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) );
      // console.log('antes', ingreso)
      // ingreso= ingreso.filter(f=>f.valores.fecha===mes).map(val=>{return{_id: val._id, actualizado: val.actualizado, ...val.valores}});
      ingreso= ingreso.map(val=>{return{_id: val._id, actualizado: val.actualizado, ...val.valores}});

      // console.log('despues', ingreso)
      ingresos=[...ingresos,...ingreso];
      // let egreso = await Egreso.find({$text: {$search: mes, $caseSensitive: false}});
      let egreso = await Egreso.find();
      egreso = egreso.filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) );
      egreso= egreso.filter(f=>f.valores.fecha===mes).map(val=>{return{_id: val._id, actualizado: val.actualizado, ...val.valores}});
      egresos=[...egresos,...egreso];
    }

    for (let i=0; i<ingresos.length; i++){
      const ingreso = ingresos[i];
      // console.log('pppppp', ingreso)
      for (var j=0; j<ingreso.movimiento.length;j++){
        const mp= ingreso.movimiento[j];
        
        const pos = inventario.findIndex(f=>String(f._id)===String(mp._id));
        
        if (pos!==-1){
          if(inventario[pos][ingreso.fecha]){
            inventario[pos][ingreso.fecha].ingreso+=Number(mp.cantidad);  
          }else{
            inventario[pos][ingreso.fecha]={ingreso:Number(mp.cantidad), egreso:0};
          }
          // console.log('Agregar en ingreso>>>>>>')
          // console.log(datos.tipo,ingreso.fecha,inventario[pos][ingreso.fecha])
        }
      }
    }
    
    for (let i=0; i<egresos.length; i++){
      const egreso = egresos[i];
      // console.log('pppppp', ingreso)
      for (let j=0; j<egreso.movimiento.length;j++){
        const mp= egreso.movimiento[j];
        const pos = inventario.findIndex(f=>String(f._id)===String(mp._id) || f.codigo===mp.codigo);
        if (pos!==-1){
          if(inventario[pos][egreso.fecha]){
            inventario[pos][egreso.fecha].egreso+=Number(mp.cantidad);  
          }else{
            inventario[pos][egreso.fecha]={ingreso:0, egreso:Number(mp.cantidad)};
          }
          // console.log('Agregar en engreso>>>>>>')
          // console.log(datos.tipo,egreso.fecha,inventario[pos][egreso.fecha])
        }
      }
    }
    // console.log('Ingresos',ingresos);
    // console.log('Egresos',egresos);
    // console.log(inventario)
    return{Respuesta:'Ok', inventario, ingresos, egresos};
}
//Ingresar y egresar
const Ingresar = async(props)=>{
  let {User, datos, tabla_inv, tabla_ing, id, egresar}=props.datos;
  const MP = Database(`${tabla_inv}`);
  const IM = Database(`${tabla_ing}`);
  datos = JSON.parse(datos);
  if (datos._id){
    
    let anterior = await IM.findOne({_id:datos._id});
    console.log(anterior)
    for (let i=0; i< anterior.valores.movimiento.length; i++){
      console.log('Quitar....')
      let material =  anterior.valores.movimiento[i];
      let Mat = await MP.findOne({_id:material._id});
      console.log('antes Quitadoxxxxxxxx', Mat.valores.actual);
      if (egresar){
        Mat.valores.actual= Number(Mat.valores.actual) + Number(material.cantidad);  
      }else{
        Mat.valores.actual= Number(Mat.valores.actual)===0 ? 0 : Number(Mat.valores.actual) - Number(material.cantidad);
      }
      await MP.update({_id:material._id},{valores:Mat.valores, actualizado:`Referencia: ${anterior.valores.codigo} - ${User.username}`, local:true},{ upsert: true });
      
      // await Guardar_data(User,tabla_inv,{...Mat, valores:Mat.valores, actualizado:`Referencia: ${anterior.valores.codigo} - ${User.username}`});
      console.log('Quitadoxxxxxxxx', Mat.valores.actual)
    }
  }
  const fecha = datos.fecha; //moment(new Date()).format('YYYY-MM-DD');
  let movimiento = [];
  // let total = await IM.estimatedDocumentCount();
  const codigo = datos.codigo ? datos.codigo : await Serie({tabla:`${tabla_ing}`,id, cantidad:6});//Generar_codigo(total,'IMP');

  for (let i=0; i<datos.movimiento.length; i++){
    console.log('Agregando.......')
    let material =  datos.movimiento[i];
    let Mat = await MP.findOne({_id:material._id});
    if (egresar){
      Mat.valores.actual= Number(Mat.valores.actual) - Number(material.cantidad);
    }else{
      Mat.valores.actual= Number(Mat.valores.actual) + Number(material.cantidad);
    }
    
    // await MP.updateOne({_id:material._id},{valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`},{ upsert: true });
    await Guardar_data(User,tabla_inv,{...Mat, valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`});
    console.log('Agregadovvvvvvvvvvv',Mat.valores.actual)
    movimiento=[...movimiento,Movimiento(material)];
  }
  if (datos._id){
    // await IM.updateOne({_id:datos._id},{valores:datos, actualizado:`${User.username}`},{ upsert: true });
    await Guardar_data(User,tabla_ing,{...datos, valores:datos, multiples_valores:true});
    return {Respuesta:'Ok', datos}; 
  }
  let valores = {codigo, fecha, movimiento};
  let nuevo  = await Guardar_data(User,tabla_ing,{valores, multiples_valores:true});

  nuevo = nuevo[nuevo.length-1];
  return {Respuesta:'Ok', datos, nuevo};
}
const IngresarMaterial = async(props)=>{
  let {User, datos}=props.datos;
  const fecha = moment(new Date()).format('YYYY-MM-DD');
  const MP = Database('sistemachs_Inventariomp');
  // const IM = Database('sistemachs_Ingresomp');
  datos = JSON.parse(datos);
  let movimiento = [];
  // let total = await IM.estimatedDocumentCount();
  const codigo = await Serie({tabla:'sistemachs_Ingresomp',id:'IMP', cantidad:6});//Generar_codigo(total,'IMP');

  for (let i=0; i<datos.length; i++){
    let material =  datos[i];
    let Mat = await MP.findOne({_id:material._id});
    Mat.valores.actual= Number(Mat.valores.actual) + Number(material.cantidad);
    // await MP.updateOne({_id:material._id},{valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`},{ upsert: true });
    await Guardar_data(User,'sistemachs_Inventariomp',{...Mat, valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`});
    movimiento=[...movimiento,Movimiento(material)];
  }
  
  let valores = {codigo, fecha, movimiento};
  await Guardar_data(User,'sistemachs_Ingresomp',{valores, multiples_valores:true});
  return {Respuesta:'Ok', datos};
}
const Guardar_produccion = async (props)=>{
  let {User, datos}=props.datos;
  User= typeof User==='string' ? JSON.parse(User) : User;
    const fecha = moment(new Date()).format('YYYY-MM-DD');
    const Produccion = Database(`sistemachs_Produccion`);
    const MP = Database(`sistemachs_Inventariomp`);
    const PT = Database(`sistemachs_Inventariopt`);
    const EMPAQUE = Database(`sistemachs_Empaque`);
    const FORMULA = Database(`sistemachs_Formula`);
    // const EM = Database(`sistemachs_Egresomp`);
    // const EEM = Database(`sistemachs_Egresoem`);
    // const IPT = Database(`sistemachs_Ingresopt`);
    
    datos = JSON.parse(datos);
    let movimiento = [];
    let ref_movimiento = '';
    let movimiento_pt = [];
    let movimiento_em = [];
    for (var i=0; i< datos.produccion.length; i++){
      const produccion = datos.produccion[i];
      console.log(produccion)
      //Materia prima
      if (!produccion.producido && produccion.producir ){
        console.log('Guardar producion>>>>>')
        if (ref_movimiento!==''){
          ref_movimiento+=', ';
        }
        ref_movimiento+=produccion.mezcla
        
        for (var m=0; m<produccion.mp.length; m++){
          const mp=produccion.mp[m];
          let prima = await MP.findOne({_id:mp._id});
          prima= prima.valores ? prima.valores : prima;
          prima.actual = Number(prima.actual && prima.actual!=='' ? prima.actual : 0) - Number(mp.cantidadr);
          await MP.update({_id:mp._id},{valores:{...prima}, actualizado:`Referencia: ${datos.referencia} - ${User.username}`, local:true},{ upsert: true });
          
          //movimiento de egreso de materia prima
          movimiento = [...movimiento, Movimiento({...mp, cantidad: mp.cantidadr})
            // {
            // _id: mp._id, codigo:mp.codigo, unidad:mp.unidad, descripcion: mp.descripcion,
            // cantidad: mp.cantidadr
            // }
          ]
        }

        //Producto terminado
        for (var p=0; p<produccion.pt.length; p++){
          const pt=produccion.pt[p];
          let producto = await PT.findOne({_id:pt._id});
          if (producto === null)
            console.log(producto, pt)
          producto = producto.valores ? producto.valores : producto;
          producto.actual = Number(producto.actual && producto.actual!=='' ? producto.actual : 0) + Number(pt.cantidadFinalr);
          //movimiento de ingreso de producto terminado
          movimiento_pt=[...movimiento_pt, Movimiento({...producto, cantidad: Number(pt.cantidadFinalr)})
            // {
            // _id: producto._id, codigo:producto.codigo, unidad:producto.unidad, descripcion: producto.descripcion,
            // cantidad: Number(pt.cantidadFinalr)
            // }
          ]
          // Actualizar empaques 
          if (producto.empaque){
            let empaque = await EMPAQUE.findOne({_id:producto.empaque._id});
            empaque = empaque.valores ? empaque.valores : empaque;
            empaque.actual = Number(empaque.actual ? empaque.actual : 0)-Number(pt.cantidadFinalr);
            await EMPAQUE.update({_id:producto.empaque._id}, {valores:{...empaque}, actualizado:`Referencia: ${datos.referencia} - ${User.username}`, local:true},{ upsert: true });
            // movimiento de egreso de empaque
            if (Number(pt.cantidadFinalr)!==0){
              movimiento_em=[...movimiento_em, Movimiento({...empaque, cantidad: Number(pt.cantidadFinalr)})
                // {
                // _id: empaque._id, codigo:empaque.codigo, unidad:empaque.unidad, descripcion: empaque.descripcion,
                // cantidad: Number(pt.cantidadFinalr)
                // }
              ]
            }
          }
          //Actualizar la materia prima adicional
          if (producto.madicional){
            let materia = await MP.findOne({_id:producto.madicional._id});
            materia = materia.valores ? materia.valores : materia;
            materia.actual = Number(materia.actual ? materia.actual : 0) - Number(producto.cantidadm)
            await MP.update({_id:producto.madicional._id},{valores:{...materia}, actualizado:User.username, local:true},{ upsert: true });
            //movimiento de egreso de materia prima
            movimiento = [...movimiento,Movimiento({...materia, cantidad:producto.cantidadm})//{
              // _id: materia._id, codigo:materia.codigo, unidad:materia.unidad, descripcion: materia.descripcion,
              // cantidad: producto.cantidadm
            // }
            ]
          }
          await PT.update({_id:pt._id},{valores:{...producto}, actualizado:`Referencia: ${datos.referencia} - ${User.username}`, local:true},{ upsert: true });

        }

        let formula = await FORMULA.findOne({_id:produccion._id});
        formula = formula.valores ? formula.valores : formula;
        formula.actual = Number(formula.actual ? formula.actual : 0) + Number(produccion.resta);
        await FORMULA.update({_id:produccion._id},{valores:{...formula}, actualizado:`Referencia: ${datos.referencia} - ${User.username}`, local:true},{ upsert: true });
        datos.produccion[i]={...datos.produccion[i], producido:true}
      }
    }
    await Produccion.updateOne({_id:datos._id},{valores:{...datos}, actualizado:User.username, local:true},{ upsert: true });

    //Guardar el egreso de materia prima
    // let total = await EM.estimatedDocumentCount();
    let codigo = await Serie({tabla:'sistemachs_Egresomp',id:'EMP', cantidad:6});//Generar_codigo(total,'EMP')
    // let valores = {codigo, fecha, movimiento};
    // let cod_chs = await Codigo_chs({...valores});
    // let hash_chs = await Hash_chs({...valores, cod_chs})
    // const Nuevo = new EM({valores, cod_chs, hash_chs, actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`, local:true});
    // await Nuevo.save();
    let valores = {codigo, ref_movimiento, fecha, movimiento};
    await Guardar_data(User,'sistemachs_Egresomp',{valores,actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`, multiples_valores:true});
    //Guardar el egreso de empaque
    // total = await EEM.estimatedDocumentCount();
    codigo =  await Serie({tabla:'sistemachs_Egresoem',id:'EEM', cantidad:6});//Generar_codigo(total,'EEM')
    valores = {codigo, ref_movimiento, fecha, movimiento: movimiento_em};
    // cod_chs = await Codigo_chs({...valores});
    // hash_chs = await Hash_chs({...valores, cod_chs})
    // const NuevoE = new EEM({valores, cod_chs, hash_chs, actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`, local:true});
    // await NuevoE.save();
    await Guardar_data(User,'sistemachs_Egresoem',{valores,actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`, multiples_valores:true});
    
    //Guardar el ingreso producto terminado
    // total = await IPT.estimatedDocumentCount();
    codigo =  await Serie({tabla:'sistemachs_Ingresopt',id:'IPT', cantidad:6});//Generar_codigo(total,'IPT')
    valores = {codigo, ref_movimiento, fecha, movimiento:movimiento_pt};
    // cod_chs = await Codigo_chs({...valores});
    // hash_chs = await Hash_chs({...valores, cod_chs})
    // const NuevoI = new IPT({valores, cod_chs, hash_chs, actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`});
    // await NuevoI.save();
    await Guardar_data(User,'sistemachs_Ingresopt',{valores,actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`, multiples_valores:true});
     
    return({Respuesta:'Ok', datos});
  
}

const IngresarEmpaque = async(props)=>{
  let {User, datos}= props.datos;
  const fecha = moment(new Date()).format('YYYY-MM-DD');
  const EM = Database('sistemachs_Empaque');
  // const IE = Database('sistemachs_Ingresoem');
  datos = JSON.parse(datos);
  let movimiento = [];
  // let total = await IE.estimatedDocumentCount();
  const codigo =  await Serie({tabla:'sistemachs_Ingresoem',id:'IEM', cantidad:6});//Generar_codigo(total,'IEM')

  for (let i=0; i<datos.length; i++){
    let material =  datos[i];
    let Mat = await EM.findOne({_id:material._id});
    Mat.valores.actual= Number(Mat.valores.actual) + Number(material.cantidad);
    // await EM.updateOne({_id:material._id},{valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`},{ upsert: true });
    await Guardar_data(User,'sistemachs_Empaque',{...Mat, valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`});
    movimiento=[...movimiento, Movimiento(material)]
  }
  
  let valores = {codigo, fecha, movimiento};
  await Guardar_data(User,'sistemachs_Ingresoem',{valores, multiples_valores:true});
  return {Respuesta:'Ok', datos};
}
const PeticionSerial = async(props)=>{
  const {dato}= props.datos;
  const Recibo = await Serie(dato);
  return{Respuesta:'Ok', Recibo};
}
const Ventas = async(props)=>{
  let {datos} = props.datos;
  datos = datos ? JSON.parse(datos) : {};
  const VENTA = Database(datos.tipo==='Orden' ? 'sistemachs_Orden_Venta' : 'sistemachs_Venta');
  let ventas = datos && datos.estado 
        ? await VENTA.find({$and : [{"valores.estado":datos.estado},{$not:{"valores.eliminado":true}}]})
        : datos && datos.fecha
        ? await VENTA.find({$and : [{"valores.fecha":{$gte:datos.fecha.dia,$lte:datos.fecha.diaf}},{$not:{"valores.eliminado":true}}]})
        : await VENTA.find({$not:{"valores.eliminado":true}});
  
  let ventas_p= ventas.filter(f=>f.valores.pendiente);
  let ventas_c= ventas.filter(f=>!f.valores.pendiente);
  let total=0;
  let pendiente = 0;
  let facturado = 0;
  ventas.map(val=>{
    if (val.valores.formapago){
      let valor = val.valores.formapago['formapago-subtotal'];
      total+= Number(valor.total);
      // total= //valor.Tasa !==0  ? Number(total + valor.totalb / valor.Tasa) : total;
      pendiente+= Number(valor.restan);
      facturado+= Number(valor.cancelar);
    }
    return val
  })

  return {Respuesta:'Ok', ventas, ventas_p, ventas_c, total, pendiente, facturado};
}
//Una vez que se entrega la mercancia 
const Modificar_Entrega = async(User, fecha, datos)=>{
  const PT = Database('sistemachs_Inventariopt');
  const AV = Database(`sistemachs_Venta`);
  const EPT = Database(`sistemachs_Egresopt`);
  let anterior = await AV.findOne({_id:datos._id});
  if (anterior){
    anterior = anterior.valores;
  }
  console.log(anterior, datos);
  
  let movimiento = [];
  for (let i=0; i< anterior.orden_venta.producto.length; i++){
      let producto = anterior.orden_venta.producto[i];
      movimiento = [...movimiento, Movimiento({...producto, cantidad: producto.cantidad ? producto.cantidad : 1})]
  }

  for (let i=0; i< movimiento.length; i++){
      let producto = movimiento[i];
      let Prod = await PT.findOne({_id:producto._id});
      Prod.valores.actual+= producto.cantidad;
      // await PT.updateOne({_id:Prod._id},{valores:Prod.valores, actualizado:`Referencia: ${Recibo} - ${User.username}`},{ upsert: true });
      await Guardar_data(User,'sistemachs_Inventariopt',{_id:Prod._id, valores:Prod.valores, actualizado:`Referencia: ${anterior.recibo} - ${User.username}`});    
  }
  let anteriorpt = await EPT.findOne({"valores.recibo":anterior.recibo});
  if (anteriorpt!==null){
    await EPT.deleteOne({_id:anteriorpt._id});
  }
  // //Guardar el egreso producto terminado
  // let codigo = await Serie({tabla:'sistemachs_Egresopt', id:'EPT', cantidad:6});
  // let valores = {codigo, fecha, movimiento};
  // await Guardar_data(User,'sistemachs_Egresopt',{valores, multiples_valores:true});    
  return
}
const Procesar_Entrega = async(User, fecha, Recibo, datos)=>{
    const PT = Database('sistemachs_Inventariopt');
    let movimiento = [];
    for (let i=0; i< datos.orden_venta.producto.length; i++){
        let producto = datos.orden_venta.producto[i];
        movimiento = [...movimiento, Movimiento({...producto, cantidad: producto.cantidad ? producto.cantidad : 1})]
    }

    for (let i=0; i< movimiento.length; i++){
        let producto = movimiento[i];
        let Prod = await PT.findOne({_id:producto._id});
        Prod.valores.actual-= producto.cantidad;
        // await PT.updateOne({_id:Prod._id},{valores:Prod.valores, actualizado:`Referencia: ${Recibo} - ${User.username}`},{ upsert: true });
        await Guardar_data(User,'sistemachs_Inventariopt',{_id:Prod._id, valores:Prod.valores, actualizado:`Referencia: ${Recibo} - ${User.username}`});    
    }
    //Guardar el egreso producto terminado
    let codigo = await Serie({tabla:'sistemachs_Egresopt', id:'EPT', cantidad:6});
    let valores = {recibo:Recibo, codigo, fecha, movimiento};
    await Guardar_data(User,'sistemachs_Egresopt',{valores, multiples_valores:true});    
    return
}
//Genera la orden de venta
const EgresoVentas = async(props)=>{
  let {User, datos} = props.datos;
  // const PT = Database('sistemachs_Inventariopt');
  // const EPT= Database('sistemachs_Egresopt');
  // const VENTA = Database('sistemachs_Venta');
  datos = JSON.parse(datos);
  const fecha = moment(datos.orden_venta.fecha ? datos.orden_venta.fecha : new Date()).format('YYYY-MM-DD');
  console.log(datos)
  datos.fecha = fecha;
  if (datos.tipo===undefined){
    datos.tipo='Orden';
  }
  if (datos.formapago===undefined || datos.formapago===null || datos.formapago['formapago-subtotal'].restan>0){
    datos.pendiente=true;
    datos.estado='pendiente';
  }else{
    datos.pendiente=false;
    datos.estado='cancelado';
  }
  if (datos._id){
    if (datos.tipo==='Venta'){
      await Modificar_Entrega(User, fecha, datos);
      if (!datos.eliminado)
        await Procesar_Entrega(User, fecha, datos.recibo, datos)
    }
    await Guardar_data(User,datos.tipo==='Orden' ?'sistemachs_Orden_Venta' : 'sistemachs_Venta',{_id:datos._id, valores:datos, actualizado:`${User.username}`});
  }else{
    //Recibo
    let Recibo = await Serie({tabla:datos.tipo==='Orden' ? 'sistemachs_Orden_Venta' :'sistemachs_Venta', cantidad:6, id:datos.tipo==='Orden' ? 'O' : 'V'});//Generar_codigo(total,'V', 6);
    datos.orden_venta.recibo=Recibo;
    datos={...datos, recibo:Recibo, fecha};
    console.log('Nuevo>>>>>>>>', datos, Recibo, fecha);
    if (datos.tipo==='Venta'){
      await Procesar_Entrega(User, fecha,Recibo,datos)
    }
    //Guardar venta
    // cod_chs = await Codigo_chs({...datos});
    // hash_chs = await Hash_chs({...datos, cod_chs})
    // const NuevoV = new VENTA({valores:datos, cod_chs, hash_chs, actualizado:`${User.username}`});
    // await NuevoV.save();
    await Guardar_data(User, datos.tipo==='Orden' ?'sistemachs_Orden_Venta' : 'sistemachs_Venta',{valores:datos, multiples_valores:true});
  }
  return {Respuesta:'Ok', datos};
}
var sleepES5 = function(ms){
  var esperarHasta = new Date().getTime() + ms;
  while(new Date().getTime() < esperarHasta) continue;
};
//Funciones generales
const Guardar_data=async(User, tabla,newdatos, local=true)=>{
    //agregado para ingresar sede
    const sede = Ver_Valores().sede;
    if (newdatos.sede===null || newdatos.sede===undefined){
      newdatos = {...newdatos, sede};
    }
    //----------------------------
    const fecha = new Date();
    let DB = Database(tabla);
    if (newdatos._id){//(newdatos._id){
        const hash_chs = await Hash_chs({...newdatos});
        await DB.update({_id:newdatos._id},{...newdatos, hash_chs, actualizado:User.username, updatedAt:fecha, local},{ upsert: true });
    } else {
        const _id = ObjectID(fecha.getTime()).toHexString();
        let cod_chs = await Codigo_chs({...newdatos['multiples_valores'] ? newdatos.valores : newdatos});
        const hash_chs = await Hash_chs({...newdatos, cod_chs})
        
        await DB.insert({_id, ...newdatos, cod_chs, hash_chs, actualizado:User.username,createdAt: String(fecha), updatedAt:String(fecha), local});
    }
    let resultado = await DB.find();
    nuevo_Valores({sincronizado:!local})
    return resultado
}
const Movimiento = (dato)=>{
  return{
    _id: dato._id, codigo:dato.codigo, unidad:dato.unidad, descripcion: dato.descripcion,
    cantidad: dato.cantidad,
    ...dato.saco ? {saco:dato.saco} : {},
    ...dato.cantsaco ? {cantsaco:dato.cantsaco} : {}
  }
}
const Serie = async(dato)=>{
  const DB = Database(dato.tabla);
  let total = await DB.count({});
  // console.log('Cantidad ......', total)
  const Recibo = Generar_codigo(total,`${dato.id ? dato.id : 'S'}`, dato.cantidad ? dato.cantidad : 6);
  return Recibo;
}
const Generar_codigo = (valor, id='', cantidad=5)=>{
  let nuevo = String(Number(valor) + 1);
  let cero = cantidad-nuevo.length;
  for (var i=0; i<cero; i++){
    nuevo='0'+nuevo;
  }
  return `${id!=='' ? id+'-' : ''}${nuevo}`
}
//Leer valores
const Ver_datos = async (tablas, cantidad=20) =>{
    let datos={};
    try{
      return Promise.all(tablas.map(async(data)=>{
        let DB = Database(data);
        const count = await DB.count({});
        // console.log('peticion>>>', data, count);
        if (count>=cantidad){
          // console.log(count)
          let pagina= 0;
          datos[data]=[];
          // while (pagina*cantidad<= count){
            const dbs = await DB.find().limit(cantidad).skip(pagina*cantidad).exec();
            datos[data]=[...datos[data],...dbs];
            pagina+=1;
          // }
          // console.log('Cargados>>>>>',data, datos[data].length, datos[data].length)
        }else{
          const dbs = await DB.find();
          datos[data]=dbs;
        }
        
        datos[data+'_cantidad']=count;
        return data;
      })).then(()=>{
        return {Respuesta:'Ok', datos, dia: new Date()};
      });
    }catch(error) {
      console.log('Error-Getall',error);
      return {Respuesta:'Error'};
    }
}

//Leer valores por condicion 
const Ver_datos_C = async (tablas, condicion) =>{
    let datos={};
    try{
      return Promise.all(tablas.map(async(data)=>{
        let DB = Database(data);
        let dbs;
        if (['Ultimo', 'ultimo'].indexOf(condicion[data])!==-1 ){
          dbs = await DB.find().sort({$natural:-1}).limit(1);
        }else if(['cantidad', 'Cantidad'].indexOf(condicion[data])!==-1 ){
          dbs = await DB.count({});
        }else if( condicion[data] !==undefined && Object.keys(condicion[data]).indexOf('pagina')!==-1 && Object.keys(condicion[data]).indexOf('condicion')!==-1){
          dbs = await DB.find(condicion[data].condicion)
                              .sort(condicion[data].sort ? condicion[data].sort : {$natural:-1})//'-createdAt')
                              .limit(condicion[data].cantidad)
                              .skip(condicion[data].pag*condicion[data].cantidad).exec();
          // console.log('Paginando', condicion[data].pag,condicion[data].cantidad, data, condicion[data].condicion)
        }else if( Object.keys(condicion[data] !==undefined && condicion[data]).indexOf('pagina')!==-1){
          dbs = await DB.find()
                              .limit(condicion[data].cantidad)
                              .skip(condicion[data].pag*condicion[data].cantidad).exec();
          // console.log('Paginando', condicion[data].pag,condicion[data].cantidad, data)
        }else if (Object.keys(condicion[data]).length===0){
          dbs = await DB.find();
        }else if (Object.keys(condicion[data]).length!==0 && Object.keys(condicion[data]).indexOf('condicion')!==-1 && Object.keys(condicion[data]).indexOf('sort')!==-1){
          dbs = await DB.find(condicion[data].condicion).sort(condicion[data].sort);
        }else{
            //   await DB.createIndexes()
          dbs = await DB.find(condicion[data]);
          
        }
        //datos[data]=dbs.sort((a, b) => (a.createAt > b.createAt ? -1 : a.createAt < b.createAt ? 1 : 0));
        //Filtor por sede algo nuevo en el sistema solo local
        const sede = Ver_Valores().sede;
        datos[data]=dbs
          .filter(f=>(f.valores.sede===undefined && sede==='Coro') ||(f.valores.sede===sede) )
          .sort((a, b) => (a.createAt > b.createAt ? -1 : a.createAt < b.createAt ? 1 : 0));
        return data;
  
      })).then(()=>{
        return {Respuesta:'Ok', datos, dia: new Date()};
      });
    }catch(error) {
      console.log('Error-Getall',error);
      return {Respuesta:'Error'};
    }
  }