import moment from "moment";
import { Ver_Valores } from "./valores";
export default{
    Editores_formapago:(params)=>{
        let editable=true;
        if ((params.row.titulo==='Debito' && ['bancod'].indexOf(params.field)!==-1) 
            || ((['Efectivo Bolívar','Efectivo Dolar'].indexOf(params.row.titulo)!==-1) 
                && ['fecha','bancoo','bancod'].indexOf(params.field)!==-1)
            ||  (params.field==='moneda' && params.row.titulo!=='Otro')
            ){ 
            editable=false;
        } 
        
        return editable; 
    },
    Subtotal_formapago_total:(dato, resultado)=> {
        // console.log(dato.value, dato.moneda, dato.monto, (dato.value==='otro' && dato.moneda==='Bs'))
        let monto = Number(dato.monto ? dato.monto : 0); 
        // if (['efectivodolar','zelle','otro'].indexOf(dato.value)===-1 ||(dato.value==='otro' && dato.moneda==='Bs')){
        //     monto=0;
        // }
        // console.log(monto)
        return monto + Number(resultado.total);
    },
    Subtotal_formapago_totalb:(dato, resultado, tasa)=> {
        let monto = Number(dato.montobs); 
        // if (['efectivodolar','zelle'].indexOf(dato.value)!==-1 ||(dato.value==='otro' && dato.moneda==='$')){
        //     monto=0;
        // }
        return monto + Number(resultado.totalb)
    },
    Subtotal_formapago_restan:(dato,resultado,tasa)=> {
        let total = Number(resultado.cancelar); 
        // let totalb = Number(resultado.cancelarb); 
        let cancel= Number(resultado.total ? resultado.total : 0); 
        // let cancelb= Number(resultado.totalb ? resultado.totalb : 0);
        let resul = Number((total-cancel).toFixed(2)); 
        // let resulb = Number((totalb-cancelb).toFixed(2)); 
        // resul-=Number((cancelb/tasa).toFixed(2)); 
        // resulb-= Number((cancel*tasa).toFixed(2)); 
        
        return resul
    },
    Subtotal_formapago_restanb:(dato,resultado, tasa)=> {
        // let total = Number(resultado.cancelar); 
        let totalb = Number(resultado.cancelarb); 
        // let cancel= Number(resultado.total ? resultado.total : 0);
        let cancelb= Number(resultado.totalb ? resultado.totalb : 0);
        // let resul = Number((total-cancel).toFixed(2)); 
        let resulb = Number((totalb-cancelb).toFixed(2)); 
        // resul-=Number((cancelb/tasa).toFixed(2)); 
        // resulb-= Number((cancel*tasa).toFixed(2)); 
        return resulb
    },
    Titulo_fecha:(dato)=> {
        const fecha =moment(dato.valores ? dato.valores.fecha: dato.fecha).format('DD/MM/YYYY');
        return `${fecha}`
    },
    TasaCambio:(dato)=>{
        dato = dato.row ? dato.row : dato;
        const tasa = ['Bs', undefined, ''].indexOf(dato.tasa)!==-1 
                        ? Ver_Valores().tasa && Ver_Valores().tasa.USD
                        ? Ver_Valores().tasa.USD
                        : 0
                        : Number(dato.tasa); 
        return tasa
    },
    MontoBolivares:(dato)=>{
        dato = dato.row ? dato.row : dato;
        let monto = (dato.monto!==0 && dato.monto!==undefined && dato.monto!==null)
                    ||(dato.montobs===0 || dato.montobs===undefined || dato.montobs===null)
                    ? Number(dato.tasa) * Number(dato.monto ? dato.monto : 0) 
                    : dato.montobs;
        return  monto;
    },
    MontoDolar: (dato)=>{
        dato = dato.row ? dato.row : dato;
        
        let monto = dato.monto===0 || dato.monto===undefined || dato.monto===null
                    ?  Number(dato.montobs ? dato.montobs : 0) / Number(dato.tasa) 
                    : dato.monto;
        return  monto;
    }
}