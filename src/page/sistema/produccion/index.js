import * as React from 'react';
import Box from '@mui/material/Box';
import Cargando from '../../../componentes/esperar/cargar';
import moment from "moment";
import { Form_todos, conexiones, genera_formulario, Ver_Valores } from '../../../constantes';
import Page from './page';

export default class Produccion extends React.Component {
    constructor(props) {
        super(props);
  
        this.state = {
            cargando:true,
            props: this.props,
            Config:this.props.Config,
            datos:{dia:new Date(), produccion:[]}
        }
    }
  
    Inicio = async(dia=null)=>{
        let {datos}=this.state;
        const {tipo} = Ver_Valores();
        
        if (dia!==null){
            datos.dia = dia;
        }
        
        const Resp =  await conexiones.Leer_C(['sistemachs_Produccion'],
            {
                sistemachs_Produccion:tipo==='Electron' 
                    ? {"valores.dia":moment(datos.dia).format('MM/DD/YYYY')}
                    : {$text: {$search: moment(datos.dia).format('MM/DD/YYYY'), $caseSensitive: false}}
            }
        );
        if (Resp.Respuesta==='Ok'){
            let dat= Resp.datos.sistemachs_Produccion.filter(f=>f.valores.dia === moment(datos.dia).format('MM/DD/YYYY') );
            if (dat.length!==0){
                let produccion = dat[0].valores.produccion.map(val=>{
                    let mp= val.mp.map(m=>{return {...m, cantidadr:m.cantidadT}});
                    let pt= val.pt.map(m=>{
                        return {...m, cantidadFinalr: [undefined, null, '', false].indexOf(m.cantidadFinalr)===-1 ? m.cantidadFinalr : m.cantidadFinal}
                    });
                    return {...val, mp, pt}
                })
                datos= {...dat[0].valores, _id:dat[0]._id, produccion}
            }else{
                datos={dia: dia!==null ? dia : datos.dia, produccion:[]}
            }
        }

        let nuevos = await genera_formulario({valores:{cantidad:1}, campos: Form_todos('Form_planificar_formula') })
        nuevos.titulos[0].value.formula.onChange=this.Seleccion;//({...state, Seleccion:nuevos, cargando:false})
        nuevos.titulos[0].value.cantidad.onChange=this.Seleccion;
        // console.log(datos)
        this.setState({Seleccion:nuevos, cargando:false, datos})
    }

    Seleccion = async(valores)=>{
        let valor= {...valores.resultados.formula};//{...valores.formula};
        const cantidad = Number(valores.resultados.cantidad);
        valor.formulas= valor.formulas.map(v=>{

            return {...v, cantidad: cantidad * Number(v.cantidad)}
        })
        let condicion = {$or:[]};
        valor.formulas.map(v=>{
            condicion['$or'].push({_id:v._id})
            return v
        })
        const Resp =  await conexiones.Leer_C(['sistemachs_Inventariopt','sistemachs_Inventariomp'],
            {
                sistemachs_Inventariopt:{},
                sistemachs_Inventariomp:condicion
            }
        );
        let ProductoTerminado =[];
        if(Resp.Respuesta==='Ok'){
            const materiales = Resp.datos.sistemachs_Inventariomp;
            let formulas = valor.formulas.map(v=>{
                const pos = materiales.findIndex(f=>f._id===v._id);
                const actual = materiales[pos].valores.actual!=='' ? Number(materiales[pos].valores.actual) : 0;
                return {_id:v._id, codigo:v.codigo, descripcion:v.descripcion, cantidad:v.cantidad, proveedor:v.proveedor, unidad:v.unidad, actual}
            });
            valor.formulas=formulas;
            ProductoTerminado = Resp.datos.sistemachs_Inventariopt.filter(f=>f.valores.formula._id===valor._id).map(v=>{return {...v.valores}});
        }
        let resulta = this.Calcular(valor.formulas, ProductoTerminado);
        ProductoTerminado= resulta.productor;
        this.setState({Formula:{_id:valor._id, mezcla:valor.mezcla, cantidad},MateriaPrima: valor.formulas, ProductoTerminado, Total:resulta.Total, Resta:resulta.total, Producir:resulta.producir});
        return 
    }

    Calcular = (formula, producto, cantidades=null)=>{
        let total = 0;
        let producir= true;
        let productor=[...producto].sort((a,b)=> Number(a.cantidadf)>Number(b.cantidadf) ? -1 : 1);
        formula.map(v=>{
            total+= Number(v.cantidad);
            if (Number(v.cantidad)>Number(v.actual)){
                producir=false;
            }
            return v;
        })
        const Total = total;
        if (cantidades===null){
            productor = productor.map(v=>{
                let cantidadFinal = 0;
                if (v.cantidadf<= total){
                    cantidadFinal = Math.trunc(total/Number(v.cantidadf));
                    total-=cantidadFinal * Number(v.cantidadf);
                }
                return {...v, cantidadFinal}
            })
        }else{
            productor = productor.map(v=>{
                let cantidadFinal = 0; 
                return {...v, cantidadFinal}
            });
            Object.keys(cantidades).map(v=>{
                const pos = productor.findIndex(f=>String(f._id)===String(v));
                if (pos!==-1){
                    productor[pos].cantidadFinal=Number(cantidades[v]);
                    total -=Number(cantidades[v]*productor[pos].cantidadf);
                }
                return v
            });
            productor = productor.map(v=>{
                let cantidadFinal = 0;
                if (v.cantidadf<= total && v.cantidadFinal===0){
                    cantidadFinal = Math.trunc(total/Number(v.cantidadf));
                    total-=cantidadFinal * Number(v.cantidadf);
                }else{
                    cantidadFinal=v.cantidadFinal;
                }
                return {...v, cantidadFinal}
            });
        }
        
        return {Total, total, productor, producir}

    }

    async componentDidMount(){
      this.Inicio()
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
    
    Seleccionar_dia = async(valores) =>{
        // console.log(valores)
        // let valor = valores.resultados[valores.name]; 
        // console.log(valor)
        this.Inicio(valores['$d'])
        // this.setState({datos:{...this.state.datos, dia:valor}})  
    }
    
    GuardarProduccion = async()=>{
        let {datos} = this.state;
        // console.log('Guardar', datos);
        let nuevos= await conexiones.Guardar({_id:datos._id ,valores:{...datos, dia: moment(datos.dia).format('MM/DD/YYYY')}, multiples_valores:true},'sistemachs_Produccion');
        // console.log(nuevos)
    }
    
    render(){
      
      return (
        <Box sx={(theme) => ({ flexGrow: 1, 
                    height:'100%',
                    overflow: 'hidden auto',
                    '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        border: '2px solid',
                        borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                        backgroundColor: 'rgba(0 0 0 / 0.5)',
                    },
                })}
        >
            <Page Seleccionar_dia={this.Seleccionar_dia} Refrescar={this.Inicio} {...this.state}/>
            <Cargando open={this.state.cargando}/>
        </Box>
      )
    }
}
