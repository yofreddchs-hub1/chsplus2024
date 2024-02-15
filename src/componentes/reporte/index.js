import React, {useRef} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import jsPDF from 'jspdf'

import EsperaReporte from '../../componentes/herramientas/pantallas/esperareporte';
import { Ver_Valores, nuevo_Valores } from '../../constantes';
import Formulario from '../../componentes/herramientas/formulario';



export default function Reporte(props) {
    const [pdf,setPdf]= React.useState();
    const [formula,setFormula] = React.useState();
    // let datos = Ver_Valores().datos_reporte;
    const reportTemplateRef = useRef(null);
    const Reportar = props.reporte ? props.reporte : null;
    const sizePagina = props.sizePagina ? props.sizePagina : {width:612, height:790};
    const sizeLetra = props.sizeLetra ? props.sizeLetra : {Tletra:11, Tletrad:9};
    
    const generarPdf=()=>{
        const doc = new jsPDF("p", "pt", "letter");

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				// await doc.save('document');
                
                // doc.autoPrint()
                setPdf(doc.output('bloburl'));
			},
		});
    }
    
    React.useEffect(()=>{
        const Inicio = async() =>{
            let {config}=Ver_Valores();
            
            let nuevos = {datos:{},titulos:{}}
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
        }
        // setTimeout(()=>{
            // generarPdf();
        // },1000)
        console.log(reportTemplateRef.current);
        
    })
    React.useEffect(()=>{
        if (formula){
            
            nuevo_Valores({datos_reporte:formula.datos});
        }
    },[formula]);

    return (
        <div>
            <Grid container spacing={0.5}>
                <Grid xs={5} item style={{backgroundColor:'#DFDFE1', padding:10}}>
                    <div ref={reportTemplateRef}>
                        {Reportar
                            ?   <Reportar {...props} datos={ props.datos ? props.datos : []} sizePagina={sizePagina} sizeLetra={sizeLetra}/>
                            :   null
                        }
                    </div>
                </Grid>
                <Grid xs={1.5} item style={{backgroundColor:'#DFDFE1', padding:10}} >
                    {formula ? <Formulario {...formula}/> : null }
                </Grid>
                <Grid xs={5.5} item style={{backgroundColor:'#DFDFE1', padding:10}}>
                    {pdf 
                        ?   <embed src={`${pdf}#view=Fit=1&toolbar=1&navpanes=0&scrollbar=1`} type="application/pdf" width="100%" height={'88%' } />
                        :   <EsperaReporte />
                    }
                </Grid>
            </Grid>
        </div>
    );
}
