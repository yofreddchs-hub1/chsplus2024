import React, {useRef} from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import jsPDF from 'jspdf'
import NotaEntrega from './notaentrega';
import NotaEntregaFormato from './notaformato';
import GuiaTraslado from './guiatraslado';
import EsperaReporte from '../../../../componentes/herramientas/pantallas/esperareporte';
import { genera_formulario, Form_todos, Ver_Valores, nuevo_Valores } from '../../../../constantes';
import Formulario from '../../../../componentes/herramientas/formulario';
import Enconstruccion from '../../../../componentes/herramientas/pantallas/enconstruccion';
import Factura from './factura';

export default function Reporte(props) {
    const [pdf,setPdf]= React.useState();
    const [formula,setFormula] = React.useState();
    const [datos,setDatos] = React.useState();
    // let datos = Ver_Valores().datos_reporte;
    const reportTemplateRef = useRef(null);
    let {tipo} = props;
    const generarPdf=()=>{
        const doc = new jsPDF("p", "pt", "letter");

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				// await doc.save('document');
                
                setPdf(doc.output('bloburl'));
			},
		});
    }
    const Cambio = (valores)=>{
        const datos = Ver_Valores().datos_reporte;
        let nuevo = {...datos ? datos : formula.datos} 
        nuevo[valores.name]=valores.resultados[valores.name];
        nuevo_Valores({datos_reporte:nuevo});
        setDatos(nuevo)
        console.log(nuevo);
        tipo = nuevo.tipo.titulo;
        return valores;
    }
    
    React.useEffect(()=>{
        const Inicio = async() =>{
            let {tasa, config}=Ver_Valores();
            tasa = props.datos 
                    && props.datos.valores 
                    && props.datos.valores.formapago 
                    && props.datos.valores.formapago.totales
                    && props.datos.valores.formapago.totales.Tasa
                    ?   props.datos.valores.formapago.totales.Tasa
                    :   tasa && tasa.USD!=='error' ? tasa.USD : tasa.dolartoday.sicad2;
            let nuevos = await genera_formulario({
                valores:{
                    tasa, moneda:{id:0,titulo:'Bs'}, 
                    destino:'CORO-PUNTO FIJO', 
                    tipo:{id:0, titulo: "Nota de Entrega Blanca",value: "notaentregablanca",}
                }, campos: Form_todos('Form_reporte_venta') });
            nuevos.botones=[
                {
                  name:'imprimir', label:'Generar Impresion', title:'Crea pdf para imprimir',
                  variant:"contained", color:"success", 
                  onClick: generarPdf, validar:'true', icono:'print',
                  sx:{...config.Estilos.Botones ? config.Estilos.Botones.Aceptar : {}},
                }
            ]
           
            nuevo_Valores({datos_reporte:nuevos.datos});
            setFormula(nuevos);
        }
        if (formula===undefined){
            Inicio();
        }else if (formula && formula.titulos[1].value.tasa.onChange===undefined){
            let nuevos ={...formula};
            // if (tipo==='ORDEN DE TRASLADO'){
            //     nuevos.titulos[1].value.destino.onChange=Cambio;
            //     // nuevos.titulos[1].value.destino.value='CORO-PUNTO FIJO';
            // }else{
            //     delete nuevos.titulos[1];
            // }
            nuevos.titulos[0].value.moneda.onChange=Cambio;
            nuevos.titulos[1].value.tasa.onChange=Cambio;
            nuevos.titulos[1].value.destino.onChange=Cambio;
            nuevos.titulos[0].value.tipo.onChange=Cambio;
            nuevos.titulos[1].value.tasa.label=`Tasa cambio en el momento de realizar venta`;
            nuevos.titulos[1].value.tasa.label=`TasaCambio (BCV ${Ver_Valores().tasa.USD}, DT ${Ver_Valores().tasa.dolartoday.dolartoday} )`;
            
            nuevo_Valores({datos_reporte:nuevos.datos});
            setFormula(nuevos);
        }
        // setTimeout(()=>{
            // generarPdf();
        // },1000)
        
    })
    React.useEffect(()=>{
        if (formula){
            setDatos(formula.datos);
            nuevo_Valores({datos_reporte:formula.datos});
        }
    },[formula]);
    console.log(datos)
    return (
        <div>
            <Grid container spacing={0.5}>
                <Grid xs={5.5}>
                    {formula ? <Formulario {...formula}/> : null }
                    <div ref={reportTemplateRef}>
                        {datos===undefined ? null : datos.tipo.titulo==='Nota de Entrega Blanca'
                            ?   <NotaEntrega {...props} Condicion={datos}/>
                            :   datos.tipo.titulo==='Nota de Entrega Formato'
                                ? <NotaEntregaFormato {...props} Condicion={datos} />
                                : datos.tipo.titulo==='Orden Traslado Blanca'
                                ? <GuiaTraslado {...props} Condicion={datos}/>
                                : datos.tipo.titulo==='Orden Traslado Formato'
                                ? <NotaEntregaFormato {...props} Condicion={datos} />
                                : datos.tipo.titulo==='Factura'
                                ?   <Factura {...props} Condicion={datos}/>
                                :   <Enconstruccion />
                        }
                    </div>
                </Grid>
                <Grid xs={6.5}>
                    {pdf 
                        ?   <embed src={`${pdf}#view=Fit&toolbar=1&navpanes=1&scrollbar=1`} type="application/pdf" width="100%" height={'100%' } />
                        :   <EsperaReporte />
                    }
                </Grid>
            </Grid>
        </div>
    );
}
