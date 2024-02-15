
import * as React from 'react';
import Cargando from '../../../componentes/esperar/cargar';
// import { makeStyles} from '@mui/styles';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Movimientos from '../../../componentes/herramientas/movimientos';
import {ItemMP, ItemFormula} from '../../../componentes/herramientas/movimientos/items';
import Formulario from '../../../componentes/herramientas/formulario';
import { Form_todos, conexiones,genera_formulario } from '../../../constantes';
import Dialogo from '../../../componentes/herramientas/dialogo';

// function Estilos(Estilos){
//     const useStyles = makeStyles((theme) => ({
//         root: {
//             height:window.innerHeight* 0.78,
//             position: "relative",
            
//         },
//     }))
//     return useStyles()
// }

export default function Formulas(props) {
    const [cargando, setCargando] = React.useState(true);
    const [grupo, setGrupo] = React.useState({});
    const [formula, setFormula] = React.useState({})
    // const classes= Estilos(props.Config ? props.Config.Estilos : {});
    const [dialogo, setDialogo]= React.useState({
        open:false,  
    });

    const Crear = async(datos) =>{
        let valores = {
            mezcla: datos.nombre,
            actual:0,
            formulas:[]
        };
        let resp = await conexiones.Guardar({valores, multiples_valores:true},'sistemachs_Formula');
        if (resp.Respuesta==='Ok'){
            console.log(resp.resultado[resp.resultado.length-1]);
            Inicio({_id:resp.resultado[resp.resultado.length-1]._id,...resp.resultado[resp.resultado.length-1].valores});
            setDialogo({...dialogo,open:false});    
        }
    }
    const Guardar = async(datos)=>{
        console.log(datos.Formula.Datos, formula)
        let nuevo = {//...formula.datos,
            _id:formula.datos._id,
            mezcla:formula.datos.mezcla,
            actual: Number(formula.datos.actual),
            formulas: datos.Formula.Datos.map(val=>{return {...val, cantidad: Number(val.cantidad)}})
        }
        console.log(nuevo)
        let resp = await conexiones.Guardar({_id:formula.datos._id, valores:nuevo, multiples_valores:true},'sistemachs_Formula');
        console.log(resp)
    }
    const Eliminar = async() =>{
        await conexiones.Eliminar(formula.datos, ['sistemachs_Formula']);
        Inicio();
        setDialogo({...dialogo,open:false});
    }
    const Confirmar = () =>{
        console.log('Confirmar Eliminar')
        const Config = props.Config;
        const formulario ={
            
            botones:[
                {
                    name:'si', label:'Si', title:'Eliminar',
                    variant:"contained", color:"success", icono:<CheckIcon/>,
                    onClick: Eliminar, validar:'true', 
                    sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                    // disabled: !pguardar,
                },
                {
                    name:'no', label:'No', title:'No Eliminar',
                    variant:"contained",  icono:<CancelIcon/>,
                    sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
                    onClick: ()=>setDialogo({...dialogo,open:false})
                },
            ]
        }
        setDialogo({
            ...dialogo, 
            open: !dialogo.open,
            tam:'xs',
            Titulo:`Desea Eliminar ${formula.datos.mezcla}?`,
            Cuerpo:<Formulario {...formulario}/>,
            Cerrar: ()=>setDialogo({...dialogo,open:false}),
        })
    }
    const Seleccion = async(valores)=>{
        
        if (valores.resultados.formula.mezcla==='Nueva Mezcla'){
            const Config = props.Config;
            let nuevos = await genera_formulario({valores:{}, campos: Form_todos('Form_Listas_n') });
            nuevos.titulos.nombre.label='Nombre';
            nuevos.titulos.nombre.placeholder='Nombre';
            // const pguardar=await Permiso('guardar');
            const formulario ={
                ...nuevos,
                botones:[
                    {
                        name:'guardar', label:'Crear', title:'Crear Mezcla',
                        variant:"contained", color:"success", icono:<CheckIcon/>,
                        onClick: Crear, validar:'true', 
                        sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                        // disabled: !pguardar,
                    },
                    {
                        name:'cancelar', label:'Cancelar', title:'Cancelar',
                        variant:"contained",  icono:<CancelIcon/>,
                        sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
                        onClick: ()=>{
                            setDialogo({...dialogo,open:false});
                            Inicio();
                        }
                    },
                ]
            }
            setDialogo({
                ...dialogo, 
                open: !dialogo.open,
                tam:'xs',
                Titulo:'Nueva Mezcla',
                Cuerpo:<Formulario {...formulario}/>,
                Cerrar: ()=>{
                    setDialogo({...dialogo,open:false});
                    Inicio();
                },
            })
        }else{
            Inicio(valores.resultados.formula);
        }
        
        
    }
    const Inicio = async(formulas={_id:null})=>{
        let resp = await conexiones.Leer_C(['sistemachs_Inventariomp','sistemachs_Formula'],{sistemachs_Inventariomp:{}, sistemachs_Formula:{}});
        let dat1 = {formulas:[]};
        let formulasl=[];
        if (resp.Respuesta==='Ok'){
            let dat = resp.datos.sistemachs_Inventariomp.map(val=>{return {_id:val._id, ...val.valores, label:`${val.valores.codigo}-${val.valores.descripcion}`}});
            formulasl=resp.datos.sistemachs_Formula.map(val=>{return {...val, valores:{_id:val._id, ...val.valores}}});
            if (formulas._id!==null){
                dat1 = formulasl.filter(f=>f._id===formulas._id);
                dat1= dat1[0].valores;
                dat1.formulas = dat1.formulas.map(val=>{return {...val, label:`${val.codigo}-${val.descripcion}`}})
            }
            
            let datos = {
                MateriaPrima:{
                    Titulo:'Materia Prima',
                    Espacio:4,
                    Style:{height:window.innerHeight * 0.62},
                    Datos:dat,
                    Item: (props) => ItemMP(props)
                }, 
                Formula:{
                    Titulo:'Formula',
                    Espacio:8,
                    Style:{height:window.innerHeight * 0.65},
                    Datos:dat1.formulas,
                    Item: (props) => ItemFormula(props),
                    // Alto : '63%',
    
                },
            }
            setGrupo(datos);
            setCargando(false);
        }

        let nuevo = await genera_formulario({valores:{...dat1, formula:formulas._id!==null ? formulas : null, actual : Number(dat1.actual ? dat1.actual : 0).toFixed(2)}, campos:Form_todos('Form_formula_mov') });
        nuevo.titulos[0].value.formula.onChange=(valores) =>Seleccion(valores);
        // nuevo.titulos[0].value.formula.lista= formulasl;

        nuevo.titulos[0].value.formula.antes= [{actual:"", formulas: [], key: "9n9n9n9n9n999n9n9n9n9n9n9",
            mezcla: "Nueva Mezcla", _id: "9n9n9n9n9n9n99n"}];
        setFormula(nuevo);
    }
    React.useEffect(()=>{
        Inicio();
    },[props])
    
    return (
        <div style={{
            height:window.innerHeight* 0.78,
            position: "relative",
        }}>
            <Formulario {...formula}/>
            <Movimientos  Config={props.Config} Grupos={grupo} 
                Enviar={Guardar}
                Eliminar={
                    <div >
                        <Button variant="contained" onClick={Confirmar} 
                            sx={{...props.Config ? props.Config.Estilos.Botones.Eliminar : {}, color:'#fff'}}
                            title={'Eliminar Mezcla'}
                            disabled={formula.datos && formula.datos._id===undefined}
                        >
                            Eliminar
                        </Button>
                    </div>
                }
            
            />
            <Cargando Config={props.Config} open={cargando}/>
            <Dialogo {...dialogo} config={props.Config}/>
        </div>
    )

}