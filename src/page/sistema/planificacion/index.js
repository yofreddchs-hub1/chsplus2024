import * as React from 'react';
import Box from '@mui/material/Box';
import Page from './page';
import Cargando from '../../../componentes/esperar/cargar';
import moment from "moment";
import Grid from '@mui/material/Unstable_Grid2';
import { Form_todos ,conexiones, genera_formulario, Ver_Valores } from '../../../constantes'; 
import Divider from '@mui/material/Divider';
import Produccion from './produccion';

export default class Planificacion extends React.Component {
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
                datos= {...dat[0].valores, _id:dat[0]._id, }
            }else{
                datos={dia: dia!==null ? dia : datos.dia, produccion:[]}
            }
        }

        let nuevos = await genera_formulario({valores:{cantidad:1}, campos: Form_todos('Form_planificar_formula') })
        nuevos.titulos[0].value.formula.onChange=this.Seleccion;//({...state, Seleccion:nuevos, cargando:false})
        nuevos.titulos[0].value.cantidad.onChange=this.Seleccion;
        
        this.setState({Seleccion:nuevos, cargando:false, datos})
    }

    Seleccion = async(valores)=>{
        let valor= {...valores.resultados.formula};//{...valores.formula};
        const cantidad = Number(valores.resultados.cantidad);
        valor.formulas= valor.formulas.map(v=>{
            return {...v, cantidadT: cantidad * Number(v.cantidad)}
        })
        let condicion = {$or:[]};
        valor.formulas.map(v=>{
            condicion['$or'].push({_id:v._id})
            return v
        });
        const Resp =  await conexiones.Leer_C(['sistemachs_Inventariopt','sistemachs_Inventariomp'],
            {
                sistemachs_Inventariopt:{},
                sistemachs_Inventariomp:condicion,
                sistemachs_Empaque:{}
            }
        );
        let ProductoTerminado =[];
        
        if(Resp.Respuesta==='Ok'){
            const materiales = Resp.datos.sistemachs_Inventariomp;
            let formulas = valor.formulas.map(v=>{
                const pos = materiales.findIndex(f=>f._id===v._id);
                const actual = materiales[pos].valores.actual!=='' ? Number(materiales[pos].valores.actual) : 0;
                return {_id:v._id, codigo:v.codigo, descripcion:v.descripcion, cantidad:v.cantidad, cantidadT:v.cantidadT, proveedor:v.proveedor, unidad:v.unidad, actual}
            });
            valor.formulas=formulas;
            const empaques = Resp.datos.sistemachs_Empaque;
            ProductoTerminado = Resp.datos.sistemachs_Inventariopt.filter(f=>f.valores.formula && f.valores.formula._id && f.valores.formula._id===valor._id).map(v=>{
                const pos = empaques.findIndex(f=> v.valores.empaque && f._id===v.valores.empaque._id);
                let cantidadE= 0;
                if (pos!==-1){
                    cantidadE = empaques[pos].valores.actual ?  Number(empaques[pos].valores.actual) : 0;
                }
                return {...v.valores, cantidadE, _id:v._id}
            });
            
        }
        let resulta = this.Calcular(Number(valor.actual ? valor.actual : 0),valor.formulas, ProductoTerminado);
        ProductoTerminado= resulta.productor;
        this.setState({Formula:{_id:valor._id, mezcla:valor.mezcla, cantidad, actual:Number(valor.actual ? valor.actual : 0)},MateriaPrima: valor.formulas, ProductoTerminado, Total:resulta.Total, Resta:resulta.total, Producir:resulta.producir});
        return 
    }

    Calcular = (anterior , formula, producto, cantidades=null)=>{
        // console.log(anterior , cantidades)
        let total = 0;
        let producir= true;
        let menor=-1;
        let menorp=0;
        let productor=[...producto].sort((a,b)=> Number(a.cantidadf)>Number(b.cantidadf) ? -1 : 1);
        formula.map(v=>{
            total+= Number(v.cantidadT);
            if (Number(v.cantidad)>Number(v.actual)){
                producir=false;
            }
            return v;
        })
        total+=anterior;
        const Total = total;
        if (cantidades===null){
            productor = productor.map((v, i)=>{
                if (menor===-1 || menorp>Number(v.cantidadf)){
                    menor = i;
                    menorp = Number(v.cantidadf);
                }
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
            productor = productor.map((v,i)=>{
                let cantidadFinal = 0;
                if ( Object.keys(cantidades)[0] !== v._id && (menor===-1 || menorp>Number(v.cantidadf))){
                    menor = i;
                    menorp = Number(v.cantidadf);
                }
                if (v.cantidadf<= total && v.cantidadFinal===0){
                    cantidadFinal = Math.trunc(total/Number(v.cantidadf));
                    total-=cantidadFinal * Number(v.cantidadf);
                }else{
                    cantidadFinal=v.cantidadFinal;
                }
                return {...v, cantidadFinal}
            });
        }
        // if (total>0){
        //     productor[menor].cantidadFinal = Number(total/Number(productor[menor].cantidadf)).toFixed(2)
        //     // total-=total;
        // }
        console.log(menor, productor[menor], cantidades, total);
        return {Total, total, productor, producir}

    }

    CambioMP = async(event)=>{
        let {name, value} = event.target;
        let {MateriaPrima,ProductoTerminado, Formula} = this.state;
        const pos = MateriaPrima.findIndex(p=> String(p._id)===name);
        if (pos!==-1){
            MateriaPrima[pos].cantidad = value;
            MateriaPrima[pos].cantidadT = value * Formula.cantidad;
        }
        let resulta = this.Calcular(Formula.actual, MateriaPrima, ProductoTerminado);
        ProductoTerminado= resulta.productor;
        
        this.setState({MateriaPrima, ProductoTerminado, Total:resulta.Total, Resta:resulta.total, Producir:resulta.producir})
    }

    CambioPT = async(event)=>{
        let {name, value} = event.target;
        let {MateriaPrima,ProductoTerminado, Formula} = this.state;
        let resulta = this.Calcular(Formula.actual, MateriaPrima, ProductoTerminado,{[name]:value});
        ProductoTerminado= resulta.productor;
        this.setState({ProductoTerminado, Total:resulta.Total, Resta:resulta.total, Producir:resulta.producir})
    }

    Agregar = async() =>{
        let {Formula, MateriaPrima, Total, Resta, ProductoTerminado, datos} = this.state;
        let produccion = datos.produccion ? datos.produccion : [];
        const pos = produccion.findIndex(f=>f._id===Formula._id);
        if (pos===-1){
            produccion= [...produccion, {...Formula, mp:MateriaPrima, pt:ProductoTerminado, total:Total, resta:Resta}];
        }else{
            produccion[pos]={...Formula, mp:MateriaPrima, pt:ProductoTerminado, total:Total, resta:Resta};
        }
        this.setState({datos:{...datos, produccion}})
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
        // let valor = valores.resultados[valores.name]; 
        this.Inicio(valores['$d'])
        // this.setState({datos:{...this.state.datos, dia:valor}})  
    }
    
    QuitardeProduccion = async(valores) =>{
        if (!valores.producido){
            let {datos}= this.state;
            let produccion = datos.produccion ? datos.produccion : [];
            produccion = produccion.filter(f=>f._id!==valores._id);
            this.setState({datos:{...datos, produccion}})
        }
    }
    GuardarProduccion = async()=>{
        let {datos} = this.state;
        let referencia=datos.referencia;
        if (datos._id===undefined){
            const resp= await conexiones.Serial({tabla:'sistemachs_Produccion', id:'P', cantidad:6})
            if (resp.Respuesta==='Ok'){
                referencia= resp.Recibo;
            }
        }
        let nuevos= await conexiones.Guardar({_id:datos._id ,valores:{...datos, referencia, dia: moment(datos.dia).format('MM/DD/YYYY')}, multiples_valores:true},'sistemachs_Produccion');
        this.Inicio(datos.dia);
    }
    EliminarProduccion = async()=>{
        console.log('Eliminar');
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
            <Grid container spacing={1}>
                <Grid item xs={6.7}>
                    <Page {...this.state} CambioMP={this.CambioMP} CambioPT={this.CambioPT} Agregar={this.Agregar}/>
                </Grid>
                
                <Divider orientation="vertical" flexItem>
                    .
                </Divider>
                
                <Grid item xs={5} >
                    <Produccion 
                        Seleccionar_dia={this.Seleccionar_dia} 
                        datos={this.state.datos} 
                        QuitardeProduccion={this.QuitardeProduccion}
                        GuardarProduccion={this.GuardarProduccion}
                        EliminarProduccion={this.EliminarProduccion}
                        Config={this.state.Config}
                    />
                </Grid>
            </Grid>
            <Cargando open={this.state.cargando}/>
        </Box>
      )
    }
}

