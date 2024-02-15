import { Ver_Valores } from ".";
import funcionesespeciales from './fespeciales';
export const Form_todos = (key, config=null)=>{
    const Form= config===null ? Ver_Valores().config.Formularios[key.trim()] : config.Formularios[key.trim()];
    return Form
            ? Form
            : {columna:1,
                value:[ 
                    {"key":"xnonex", "name":"xnonex", placeholder:"Sin formulario asignado" },
                ]
              }
};

export const Titulos_todos = (key, config=null)=>{
    let Form= config===null ? Ver_Valores().config.Titulos[key.trim()] : config.Titulos[key.trim()];
    Form= Form
            ? Form
            : [ 
                {title:'_id',field:'_id'},
                {title:'Creado',field:'createdAt'},
             ]
    return Dar_formato(Form)
};

const Dar_formato =(Form)=>{
    let nuevo= Form.map(v=>{
        let valor={...v}
        if (Object.keys(v).indexOf('formato')!==-1){
            
            if (typeof v.formato ==='string'){
                valor['formato']=Funciones_Especiales(v.formato)//eval(v.formato)    
            }else{
                valor['formato']=v.formato
            }
        }
        if (valor.tipo){ 
            if(valor.tipo.indexOf('lista_')!==-1){
                const lista= Ver_Valores().config.Listas[valor.tipo];
                valor.formato= (dato)=> {
                    // console.log(dato.valores, valor.tipo, lista, typeof dato.valores[valor.field])
                    if (dato.valores && typeof dato.valores[valor.field]==='string')
                    return `${lista[dato.valores[valor.field]].titulo}`
                    if (dato.valores && typeof dato.valores[valor.field]==='object')
                    return `${dato.valores[valor.field].titulo}`
                    return `${lista[dato[valor.field]].titulo}`
                }
            }
        }
        return valor
    })
    return nuevo
}

export const Funciones_Especiales = (funcion) =>{
    // console.log(funcion)
    let formato;
    try{
        formato = eval(funcion);
    }catch(e){
        // console.log(e)
        // console.log('No es funcion', funcion)
    }
    
    if (typeof formato ==='function'){
        return formato;
    }else{
        formato = funcionesespeciales[funcion];
        if (formato===undefined){
            formato= funcion
        }
    }
    
    return formato

}
