import {const_procesos, nuevo_Valores, Ver_Valores} from '../constantes';
import moment from 'moment';
// import {categoria_usuario} from '../../constantes/datos';
// import {categorias} from '../datos/usuarios';
// localStorage.setItem(const_procesos.dir_config,null);
import {conexiones} from './conexiones';
import {encriptado} from './encriptado';
import { read, utils, writeFile } from 'xlsx';
// import {ExcelRenderer} from 'react-excel-renderer';

let categoria_usuario;

export const Moneda = (valor, moneda='Bs', mostrar=true)=>{
  
  if (moneda==='Bs'){
    let resultado = formatoBolivar.format(valor);
    resultado = resultado.replace('VED',mostrar ? 'Bs.' : '')
    return resultado
  }else{
    let resultado = formatoDolar.format(valor);
    resultado = resultado.replace('$', mostrar ? '$' : '');
    return resultado
  }
}
export const formatoBolivar = new Intl.NumberFormat('es-VE', {
  style: 'currency',
  currency: 'VED',
  minimumFractionDigits: 2
})

export const formatoDolar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export const Inicio_api=async(nombre)=>{
  const api= {
    "_id":  "63ab26c2890b4c1228554f48",
    "seq_chs": 1,
    "api": "sistemachs",
    "key": "9571bc1f6ad51c15dae19f32c22332b2e65e6e1a20ce8065a92d6bc2bd710f57",
    "cod_chs": "9571bc1f6ad51c15dae19f32c22332b2e65e6e1a20ce8065a92d6bc2bd710f57",
    "master": false,
    "hash_chs": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RfY2hzIjoiOTU3MWJjMWY2YWQ1MWMxNWRhZTE5ZjMyYzIyMzMyYjJlNjVlNmUxYTIwY2U4MDY1YTkyZDZiYzJiZDcxMGY1NyIsImFwaSI6Indlc2lfY2hzX3NlcnZlciIsImtleSI6Ijk1NzFiYzFmNmFkNTFjMTVkYWUxOWYzMmMyMjMzMmIyZTY1ZTZlMWEyMGNlODA2NWE5MmQ2YmMyYmQ3MTBmNTciLCJpYXQiOjE2NzIxNjA5NjJ9.jfk_nbQkGGyB7UpjnwCw2Apkz1pr5qWBAYtsJnv5pmw",
  }
  //await conexiones.Ver_api(nombre);
  // let archivo='data/datos.js';
  // const respuesta = await conexiones.Leer_data(archivo, api);
  nuevo_Valores({[nombre]:{api}})
  return {api}
}
export const Estadolinea = ()=>{
  const estado = navigator.onLine ? true : false;
  nuevo_Valores({online: estado});
  console.log('Estado de linea', estado);
  return estado
}
export const Inicio=async()=>{
  //si se cambia wesi_chs_server hay que cambiarlo en conexiones
  Tasa_cambio({})
  let valores = await fetch("utilidad/json/config.json")
      .then(response => response.json())
      .then(datos => {
        return datos
      })
      .catch(err => {
        console.log(err);
        // this.setState({cargando:false, progreso:0})
        return {}
      } );
  let dir = window.location.protocol;
  console.log('>>>>>>>>>>', dir)
  if (dir==='http:'){
    valores.http = valores.http;
  }else{
    valores.http = valores.https
  }
  console.log('>>>>>>>>>>....', valores.http)
  let config = await fetch(`utilidad/json/Api_${valores.app}.json`)
      .then(response => response.json())
      .then(datos => {
        return datos
      })
      .catch(err => {
        console.log(err);
        // this.setState({cargando:false, progreso:0})
        return {}
      } );
  //implementado para verificar si es electron
  let tipo = 'Web';
  try{
    // const remote = require('electron').remote;
    window.verificar.verificar()
    tipo='Electron';
  }catch(e){
    // console.log('sin electron')
  }
  nuevo_Valores({tipo, valores});
  const api= await conexiones.Ver_api(valores.app);
  window.addEventListener('online', Estadolinea);
  window.addEventListener('offline', Estadolinea);
  //   await localStorage.setItem(const_procesos.dir_config,respuesta.datos);
  
  categoria_usuario= config.Listas.lista_categoria;
  // console.log(config, categoria_usuario)
  nuevo_Valores({config, categoria_usuario, api, valores})
  return config
}
export const Tasa_cambio = async(props)=>{
  let {dato, status}= props;
  status = status===undefined ? 'Leer' : status;
  if (status==='Leer'){
    try{
      let tasa = await localStorage.getItem(const_procesos.dir_tasa);
      if (tasa!==null){
        tasa= JSON.parse(tasa);
        tasa =  tasa.tasa ? tasa.tasa : tasa;
        nuevo_Valores({tasa})
      }
      console.log('>>>>>>>>Tasa de cambio',tasa)
      return tasa
    }catch(error){
      return null
    }
  }else if (status==='Guardar'){
    localStorage.setItem(const_procesos.dir_tasa, JSON.stringify(dato.tasa));
  }
}
export const Usuario = async(props)=>{
  let {status,dato, api} = props ? props : {}
  status = status===undefined ? 'Leer' : status;
  api = api===undefined ? '' : `_${api}`;
  if (status==='Leer'){
    try{
      let User = await localStorage.getItem(const_procesos.dir_user+api);
      if (User!==null) 
        User = await encriptado.desencriptado(User);
        
      User = JSON.parse(User);
      conexiones.Inicio(User)
      return User
    }catch(error){
      return null
    }
  }else if (status==='Guardar'){
    conexiones.Inicio(dato)
    let User= await encriptado.Encriptado(JSON.stringify(dato));
    localStorage.setItem(const_procesos.dir_user+api, User);
  }else{
    localStorage.setItem(const_procesos.dir_user+api,null);
    conexiones.Inicio(null)
  }  
  
}
export const MaysPrimera=(string)=>{
  let lista = string.split(' ');
  let resulta = '';
  for (var i=0; i<lista.length; i++){
    resulta+= lista[i].charAt(0).toUpperCase()+ lista[i].slice(1) + ' ';
  }
  return resulta;
  // return string.charAt(0).toUpperCase() + string.slice(1);
}

export const ArrayMaysPrimera=(datos)=>{
  return datos.map((valor)=> MaysPrimera(valor))
}

export const Titulo_default=(datos)=>{
  return Object.keys(datos).map((valor)=> {
    // if (valor === 'categoria') {
    //   return { title: MaysPrimera(valor), field: valor, lookup: categorias }
    // }else
    if (['createdAt','updatedAt','fecha', 'Fecha'].indexOf(valor)!==-1){
      return { title: MaysPrimera(valor), field: valor , editable: 'never' , fecha:true}
    }else if (['_id','__v','createdAt','updatedAt',
               'actualizado', 'cod_chs', 'seq_chs', 'hash_chs'].indexOf(valor)!==-1){
      return { title: MaysPrimera(valor), field: valor , editable: 'never'}
    }else{
      return { title: MaysPrimera(valor), field: valor }
    }
  })
}

export const Permiso =  async(accion, api, superadmin=false, Categoria = null) =>{
  let User = api ? await Usuario({api}) : await Usuario()//JSON.parse(localStorage.getItem(const_procesos.dir_user));
  if (User===null) return false
  let categoria = Categoria ? Categoria: api ? Ver_Valores()['config']['Listas'][`lista_${api}_categoria`] : categoria_usuario;
  categoria = categoria.map(val=>{
    return {...val, permisos: typeof val.permisos==='string' ? val.permisos.split(',') : val.permisos}
  })
  User.categoria = typeof User.categoria==='object' ? User.categoria._id : User.categoria;
  let resultado=categoria.filter(lis => String(lis._id)===String(User.categoria));
  if (!superadmin) {
    if (resultado.length!==0 && resultado[0].permisos!==undefined &&
          (resultado[0].permisos.indexOf(accion)!==-1 || resultado[0].permisos.indexOf('*')===0)
        ) {
        
      return true;

    }else {
      return false;
    }
  }else{
    if (resultado.length!==0 && resultado[0].permisos!==undefined && resultado[0].permisos.indexOf('**')===1) {
      return true;
    }else{
      return false;
    }
  }


}

export const Quitar_valores = (props) =>{
  const {datos,quitar}=props;
  let resultado={}
  Object.keys(datos).map((campo)=>{
    if (quitar.indexOf(campo)===-1){
      resultado={...resultado,[campo]:datos[campo]};
    }
    return campo;
  })
  return resultado;
}

export const Resultado_encontrados = (datos,valor) =>{
  let resultado=[];
  
  if (datos !== undefined && datos.length!==0)
    datos.map((dato)=>{
      
      if (Ver_igualdad(dato,valor)){
        resultado.push(dato);
      }
      return valor;
    })
  return resultado
}


export const Ver_igualdad = (dato, valor)=>{
    
    if (dato=== null || dato ===undefined)
      return false;
    const campos= Object.keys(dato);
    delete dato['$setOnInsert']
    const no=['password','passwordA','token'];
    let resultado=false;
    
    try{
     campos.map((campo)=>{
       if (typeof dato[campo]==='object' && dato[campo]!==null){
          
          if (dato[campo].length){
            dato[campo].map( val=>{
              if (Ver_igualdad(val,valor)){
                resultado=true;
              }
              return val
            })
          }else{
            if (Ver_igualdad(dato[campo],valor)){
              resultado=true;
            }
          }
        }
       const val= '' + dato[campo];
       if ((no.indexOf(campo)===-1 && val.toLowerCase().indexOf(valor.toLowerCase())!==-1)|| valor===''){
         resultado=true;
       }
       return campo
     })
    }catch(error) {
      console.log('Ver_igualdad',error, dato, valor, campos);
      
    }
    return resultado;
}

export const Resultado_encontrados_k = (datos,valor) =>{
  let resultado=[];
  datos.map((dato)=>{
    if (Ver_igualdad_K(dato,valor)){
      resultado.push(dato);
    }
    return valor;
  })
  return resultado
}

export const Resultado_encontrados_k_p = (datos,valor) =>{
  let resultado=-1;
  for(let i=0; i<datos.length;i++){
    if (Ver_igualdad_K(datos[i],valor)){
      resultado=i;
      break;
    }

  }
  return resultado
}

export const Ver_igualdad_K = (dato, valor)=>{
    const campos= Object.keys(valor);
    let resultado=false;
    let cont=0;
     campos.map((campo)=>{
       if (''+dato[campo]===''+valor[campo]){
         cont++;
       }
       return campo
     })

     if (cont>=campos.length){
       resultado=true;
     }
    return resultado;
}

export const Buscar_array = (datos,valor) => {
  let resultado=[];
  datos.map((dato)=>{
    let igual =0;

    valor.map((v,i)=> {
      if (v===dato[i]) {
        igual++;
      }
      return v;
    })
    if (igual===valor.length){
      resultado.push(dato);
    }

    return dato;
  })
  return resultado;
}
export const Buscar_array_posicion = (datos,valor) => {
  let resultado=-1;
  for (let i=0;i < datos.length;i++){

      if (valor===datos[i][0]){
        resultado=i;
        break;
      }
  }
  return resultado;
}

export const Paginas = (props) =>{
  let rdatos=[];
  let paginas=[1];
  // let cont=0;
  // let contp=2;
  const {datos,cantp,pagina,buscar, ctotal}=props;
  const inicio=cantp*(pagina-1);
  const fin=inicio+cantp;
  const datosE=Resultado_encontrados(datos,buscar);
  
  for (var i=0;i<datosE.length;i++){
    if (i>inicio-1 && i < fin){
        rdatos.push({...datosE[i],id:i+1});
    }
   
  }
  
  paginas=[1];
  const ttotal= ctotal ? ctotal : datosE.length
  for ( i=2; i<(ttotal/cantp)+1;i++){
    paginas.push(i);
  }
  
  const comienza=inicio+1;
  const finaliza= datosE.length< fin ? datosE.length : fin;
  const total='('+comienza+' al '+finaliza+') <> (Total:'+datosE.length+')';
  return {datos:rdatos,paginas:paginas,total:total}

}

// export const Excell = async(archivo)=>{
//   // console.log(archivo.target.files[0])
//   let resultado={}
//   let fileObj = archivo.target.files[0];
//   //just pass the fileObj as parameter
//   await ExcelRenderer(fileObj, (err, resp) => {
//     if(err){
//       console.log(err);            
//     }
//     else{
//       resultado={
//         cols: resp.cols,
//         rows: resp.rows,
//       };
//       return {filename: fileObj.name , datos:resultado}
//     }
//     return {filename: fileObj.name , datos:resultado}
//   });
  
//   return {filename: fileObj.name , datos:resultado}
// }
//Abrir Archivo excell
export const Excell = async(archivo)=>{
  
  let resultados_xlsx = {};
  const promise = new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(archivo.target.files[0]);

    fileReader.onload = (e) => {
      const bufferArray = e.target.result;

      const wb = read(bufferArray, { type: "buffer" });

      const wsname = wb.SheetNames[0];

      resultados_xlsx.paginas= wb.SheetNames.map((val,i)=>{
        return {id:i, titulo:val }
      });
      resultados_xlsx.datos = {};
      wb.SheetNames.map(val=>{
        const w = wb.Sheets[val];
        const rows = utils.sheet_to_json(w, { header: 1 });
        /* column objects are generated based on the worksheet range */
        const range = utils.decode_range(w["!ref"]||"A1");
        const cols = Array.from({ length: range.e.c + 1 }, (_, i) => ({
          /* for an array of arrays, the keys are "0", "1", "2", ... */
          key: String(i),
          /* column labels: encode_col translates 0 -> "A", 1 -> "B", 2 -> "C", ... */
          name: utils.encode_col(i)
        }));
        resultados_xlsx.datos[val]={cols, rows}
        return val
      })
      
      
      resolve(resultados_xlsx);
      
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  resultados_xlsx = await promise.then((d) => {
    console.log(d)
    return d
    
  });
  
  let fileObj = archivo.target.files[0];
  
  
  return {filename: fileObj.name , datos:resultados_xlsx}
}
//Guardar de json a excell
export const AExcell = async(data, pagina='Hoja 1', archivo='excellchs.xlsx')=>{
  var wb =utils.book_new(), ws=utils.json_to_sheet(data);
  utils.book_append_sheet(wb,ws,pagina);
  writeFile(wb,archivo); 
}

const item_form = async(val, valores, _id)=>{
  let resultado={
    ...val,
    tipo: val.tipo ? val.tipo : '',
    placeholder: val.placeholder ? val.placeholder : val.label ? val.label : '',
    label: val.label ? val.label : val.placeholder ? val.placeholder : '',
    value: valores[val.name] && val.no_mostrar!==true ? valores[val.name] : val.value ? val.value : '', 
    required: val.required,
    mensaje_error: val.mensaje_error ? val.mensaje_error : val.error,
    disabled: val.disabled
              ? val.disabled
              : valores[val.name] && val.no_modificar
              ? true
              : false
  }
  if (val.tipo==='Lista'){
    // console.log('En lista',val, valores[val.name], typeof valores[val.name], val.lista[valores[val.name]])

    resultado={
      ...resultado,
      value: typeof valores[val.name]==='object' ? valores[val.name]._id : val.lista[valores[val.name]],
      getOptionLabel: val.tipo==='Lista' ? (option)=> `${option.title ? option.title : option.titulo ? option.titulo : option.label}` : null,
      getOptionSelected: val.tipo==='Lista' ? (option)=> `${option.value ? option.value : option.titulo}` : null

    }
  }else if (val.multiline){
    resultado={
      ...resultado,
      multiline:true,
      maxRows: val.numberOfLines ? val.numberOfLines : val.maxRows ?  val.maxRows : 4,
    }
  }else if (val.tipo==='auto-codigo'){
    let cod = 'S';
    let numeracion = 10;
    let cant = 6;
    
    if (val.mensaje_error){
      let dat = val.mensaje_error.split(';');
      if (dat.length===1){
        cod=dat[0];
      }else if (dat.length===2){
        cod=dat[0];
        numeracion=dat[1];
      }else if (dat.length===3){
        cod=dat[0];
        numeracion=dat[1];
        cant=dat[2];
      }

    }
    resultado={
      ...resultado,
      tipo:'',
      value:valores[val.name] ? valores[val.name] : Generar_id(cod, numeracion, cant)

    }
  }else if (val.tipo==='lista_multiuso'){
    let lista  
    const table=val.lista;
    // if (typeof val.lista==='string' && val.lista.indexOf('lista_')===-1) {  
    //   const listado = await conexiones.Leer_C([val.lista],{[val.lista]:{}})
    //   lista= listado.datos[val.lista].map( v=>{
    //     return {...v.valores ? {_id:v._id, ...v.valores} : v}
    //   })
    // }else 
    // if (val.lista.indexOf('lista_')!==-1){
    //   lista = Ver_Valores()['config']['Listas'][val.lista]
    //   if (lista===undefined) lista=[]
    // }else {
      lista= val.lista
    // };
    
    resultado={
      ...resultado,
      lista,
      value: typeof valores[val.name]==='object' ? valores[val.name] : lista[valores[val.name]], 
      tipo:'Lista',
      table,
      getOptionLabel:(option) => {
        let mostrar=''
        val.getOptionLabel.map(vl=>{ 
          const datan= vl.indexOf('.')!==-1 ? option[vl.split('.')[0]][vl.split('.')[1]] : option[vl];
          mostrar = mostrar + datan + ' ';
          return vl
        })
        
        return mostrar;
      },
      getOptionSelected:(option) => {
        let mostrar=''
        val.getOptionLabel.map(vl=>{ 
          mostrar = mostrar + option[vl] + ' ';
          return vl
        })
        
        return mostrar;
      },
    }
    
  }else if (val.tipo==='lista_representados'){
    let listado = await conexiones.Leer_C([val.lista],{[val.lista]:{}})
    const table=val.lista;
    const lista = listado.datos[val.lista].map( v=>{
      return {...v.valores}
    })
    let result=lista;
    
    if (val.filtro){
      const filtrado =eval(val.filtro)
      result=filtrado(lista) 
    }
    resultado={
      ...resultado,
      lista:result, 
      table,
      getOptionLabel:(option) => {
        let mostrar=''
        val.getOptionLabel.map(vl=>{ 
          mostrar = mostrar + option[vl] + ' ';
          return vl
        })
        
        return mostrar;
      },
    }
    
    
  }else if (val.tipo==='Checkbox'){
    let result={}
    Object.keys(resultado).map(v =>{
      if (['getOptionLabel','agregar','Subtotal'].indexOf(v)===-1){
        result[v]=resultado[v]
      }
      return v
    })
    resultado={
      ...result,
      label:val.label.indexOf('/')!==-1 ? val.label :'Seleccionado/No Seleccionado',
      value:valores[val.name]

    }
  }else if (val.tipo==='Fecha'){
    resultado={
      ...resultado,
      type:'date'

    }
  }else if (val.tipo==='Tabla'){
    let Subtotal = Ver_Valores()['config']['Subtotales'][val.Subtotal]
    
    resultado={
      ...resultado,
      value:valores[val.name],
      Subtotal: typeof Subtotal==='object' ? Subtotal : val.Subtotal
    }
  }else if (val.tipo==='Resultado'){
    console.log(valores)
    const formula = eval(val.resultado);
    resultado ={
      ...resultado,
      value: formula(valores) 
    }
  }

  delete resultado.numberOfLines
  return resultado
}

export const genera_formulario = async (datos, columnas=1)=>{
  let {campos, valores,_id} = datos;
  columnas=campos.columna;
  campos=campos.value;
  let titulos={};
  
  // campos.map(async val=>{
  const filas= Math.ceil(campos.length/columnas);
  for (var i=0; i<filas; i++){
    titulos[i]={ multiples:true, listo:false, value:{}}
  }
  for (var j=0; j<campos.length; j++){
      const val = campos[j];
      // delete val.numberOfLines
      if (columnas===1){
        titulos[val.name]= await item_form(val, valores, _id)
      }else{
        if (val.multiline || ['lista_representados', 'Avatar', 'avatar', 'Tabla'].indexOf(val.tipo)!==-1){
          // col=1;
          // fila=fila+1;
          // titulos[val.name]= await item_form(val, valores, _id);
          let pos= Object.keys(titulos).findIndex(f=> !titulos[f].listo && Object.keys(titulos[f].value).length===0);
          if (pos===-1) {
            titulos[Object.keys(titulos).length]={ multiples:true, listo:false, value:{}}
            pos=Object.keys(titulos).length-1;
          }
          titulos[pos].value[val.name]= await item_form(val, valores, _id);
          
          titulos[pos].listo=true ;
        }else{
          let pos= Object.keys(titulos).findIndex(f=> !titulos[f].listo && Object.keys(titulos[f].value).length<columnas);
          if (pos===-1) {
            titulos[Object.keys(titulos).length]={ multiples:true, listo:false, value:{}}
            pos=Object.keys(titulos).length-1;
          }
          
          titulos[pos].value[val.name]= await item_form(val, valores, _id);
          if (titulos[pos].value[val.name].length===columnas) titulos[pos].listo=true ;
        } 
        
        // if(col<columnas){
          
        //   if (!titulos[fila]) titulos[fila]={ multiples:true,value:{}}
        //   titulos[fila].value[val.name]= await item_form(val, valores, _id);
        //   // console.log(val.name)
        //   col=col+1
        // }else{
          
        //   fila=fila+1;
        //   col=1;
        //   titulos[fila]={ multiples:true,value:{}}
        //   titulos[fila].value[val.name]=await item_form(val, valores, _id);
        // }
      }
      
      // return val
  }//)
  
  titulos= Filtar_vacios(titulos);
  
  // console.log(titulos, valores)
  return {titulos, datos:{_id,...valores}}
}

const Filtar_vacios = (titulos) =>{
  let nuevotitulo={}
  Object.keys(titulos).map(val=>{
    if ((titulos[val].multiples && Object.keys(titulos[val].value).length!==0)||(!titulos[val].multiples)){
      nuevotitulo[val]=titulos[val]
    }
    return val
  })

  return nuevotitulo
}

export const crear_campos = async(campos, Form_origen)=>{
  let resultado=[]
  const list=Object.keys(campos)
  // Object.keys(campos).map(async val=>{
  // console.log(Form_origen)
  for (var i=0;i<list.length;i++){
      const val=list[i]
      if (campos[val].multiples){
          const otros= await crear_campos(campos[val].value, Form_origen)
          resultado=[...resultado,...otros.value]
      }else{

          let valor= campos[val]
          const pos= Form_origen.value.findIndex(v=> v.name===valor.name)
          
          if (Form_origen.value[pos] && (Form_origen.value[pos].tipo==='lista_multiuso' || Form_origen.value[pos].tipo==='lista_representados')){
              valor={
                  ...valor,
                  tipo:Form_origen.value[pos].tipo,
                  lista:Form_origen.value[pos].lista,
                  getOptionLabel:Form_origen.value[pos].getOptionLabel
              }
          }
          resultado=[...resultado, valor]
          
      }
      // return val;
  }//)
  
  return {columna:Form_origen.columna, value:resultado}
}

export const Generar_id =(id, numeracion=10, cant=6)=>{
  const id1 = Math.random().toString(numeracion).slice(-cant);
  // console.log('Id con math >>>', id1)
  return `${id ? id+'-' :''}${id1}`
  // return `${id ? id+'-' :''}${moment().format('x')}` 
}

export const Generar_codigo = (valor, id='', cantidad=5)=>{
  let nuevo = String(Number(valor) + 1);
  let cero = cantidad-nuevo.length;
  for (var i=0; i<cero; i++){
    nuevo='0'+nuevo;
  }
  return `${id!=='' ? id+'-' : ''}${nuevo}`
}

export const Dias_mes = (fecha=new Date())=>{
    var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getUTCDate();
    var mes = moment(fecha).format('MM');
    var ano = moment(fecha).format('YYYY');
    let meses = [];
    for (var dia=1; dia<=ultimoDia;dia++){
      const campo = `${ano}-${mes}-${dia<10 ? '0' + dia : dia}`;
      meses=[...meses, campo]
    }    
    return meses;
}
export var numeroALetras = (function() {
  // Código basado en el comentario de @sapienman
  // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num) {

      switch (num) {
          case 1:
              return 'UN';
          case 2:
              return 'DOS';
          case 3:
              return 'TRES';
          case 4:
              return 'CUATRO';
          case 5:
              return 'CINCO';
          case 6:
              return 'SEIS';
          case 7:
              return 'SIETE';
          case 8:
              return 'OCHO';
          case 9:
              return 'NUEVE';
          default:
              return '';//colocardo para quitar alvertencia
      }

      // return '';
  } //Unidades()

  function Decenas(num) {

      let decena = Math.floor(num / 10);
      let unidad = num - (decena * 10);

      switch (decena) {
          case 1:
              switch (unidad) {
                  case 0:
                      return 'DIEZ';
                  case 1:
                      return 'ONCE';
                  case 2:
                      return 'DOCE';
                  case 3:
                      return 'TRECE';
                  case 4:
                      return 'CATORCE';
                  case 5:
                      return 'QUINCE';
                  default:
                      return 'DIECI' + Unidades(unidad);
              }
          case 2:
              switch (unidad) {
                  case 0:
                      return 'VEINTE';
                  default:
                      return 'VEINTI' + Unidades(unidad);
              }
          case 3:
              return DecenasY('TREINTA', unidad);
          case 4:
              return DecenasY('CUARENTA', unidad);
          case 5:
              return DecenasY('CINCUENTA', unidad);
          case 6:
              return DecenasY('SESENTA', unidad);
          case 7:
              return DecenasY('SETENTA', unidad);
          case 8:
              return DecenasY('OCHENTA', unidad);
          case 9:
              return DecenasY('NOVENTA', unidad);
          case 0:
              return Unidades(unidad);
          default:
              return '';//colocardo para quitar alvertencia
      }
  } //Unidades()

  function DecenasY(strSin, numUnidades) {
      if (numUnidades > 0)
          return strSin + ' Y ' + Unidades(numUnidades)

      return strSin;
  } //DecenasY()

  function Centenas(num) {
      let centenas = Math.floor(num / 100);
      let decenas = num - (centenas * 100);

      switch (centenas) {
          case 1:
              if (decenas > 0)
                  return 'CIENTO ' + Decenas(decenas);
              return 'CIEN';
          case 2:
              return 'DOSCIENTOS ' + Decenas(decenas);
          case 3:
              return 'TRESCIENTOS ' + Decenas(decenas);
          case 4:
              return 'CUATROCIENTOS ' + Decenas(decenas);
          case 5:
              return 'QUINIENTOS ' + Decenas(decenas);
          case 6:
              return 'SEISCIENTOS ' + Decenas(decenas);
          case 7:
              return 'SETECIENTOS ' + Decenas(decenas);
          case 8:
              return 'OCHOCIENTOS ' + Decenas(decenas);
          case 9:
              return 'NOVECIENTOS ' + Decenas(decenas);
          default:
            return Decenas(decenas);//colocardo para quitar alvertencia
      }

      // return Decenas(decenas);
  } //Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let letras = '';

      if (cientos > 0)
          if (cientos > 1)
              letras = Centenas(cientos) + ' ' + strPlural;
          else
              letras = strSingular;

      if (resto > 0)
          letras += '';

      return letras;
  } //Seccion()

  function Miles(num) {
      let divisor = 1000;
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
      let strCentenas = Centenas(resto);

      if (strMiles === '')
          return strCentenas;

      return strMiles + ' ' + strCentenas;
  } //Miles()

  function Millones(num) {
      let divisor = 1000000;
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
      let strMiles = Miles(resto);

      if (strMillones === '')
          return strMiles;

      return strMillones + ' ' + strMiles;
  } //Millones()

  return function NumeroALetras(num, currency) {
      currency = currency || {};
      let data = {
          numero: num,
          enteros: Math.floor(num),
          centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
          letrasCentavos: '',
          letrasMonedaPlural: currency.plural || 'PESOS CHILENOS', //'PESOS', 'Dólares', 'Bolívares', 'etcs'
          letrasMonedaSingular: currency.singular || 'PESO CHILENO', //'PESO', 'Dólar', 'Bolivar', 'etc'
          letrasMonedaCentavoPlural: currency.centPlural || 'CHIQUI PESOS CHILENOS',
          letrasMonedaCentavoSingular: currency.centSingular || 'CHIQUI PESO CHILENO'
      };

      if (data.centavos > 0) {
          data.letrasCentavos = 'CON ' + (function() {
              if (data.centavos === 1)
                  return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
              else
                  return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
          })();
      };

      if (data.enteros === 0)
          return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
      if (data.enteros === 1)
          return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
      else
          return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  };

})();