import Home from './home';
import Dashboard from './sistema/dashboard'
import Reportes from './sistema/reportes';

import IngresosModificar from './sistema/ingresos/modificar';

import Venta from './sistema/venta';
import Cobrar from './sistema/venta/porcobrar';
import Ventas from './sistema/venta/ventas';
import OrdenVenta from './sistema/venta/oredenventa';
import Planificacion from './sistema/planificacion';
import Produccion from './sistema/produccion';
import Registros from './sistema/registros';

import SubMenu from './sistema/procesos/submenu';

import WhatsApp from './sistema/whatsapp';
import Pruebas from './prueba';
import Tabla_A from './prueba/nuevatabla';

export const pantallas={
    Home,
    Inicio:Home,
    Dashboard,
    Reportes,
    Ingresos:{
        Ingresos:(props)=> <SubMenu {...props} submenu={['Ingresos']}/>,
        'Ingreso Material':(props)=> 
                <IngresosModificar {...props}  
                    table='sistemachs_Ingresomp'
                    Titulo={'Ingreso Materia Prima'}
                />,
        'Ingresar Empaque':(props)=> 
                <IngresosModificar {...props}  
                    table='sistemachs_Ingresoem' Form='Form_formula_em' 
                    label='Empaques' titulos='Titulos_formula_em'
                    tabla_inv= 'sistemachs_Empaque'
                    id='IEM'
                    Titulo={'Ingreso Empaque'}
                />,
        'Ingresar Producto':(props)=> 
                <IngresosModificar {...props}  
                    table='sistemachs_Ingresopt' Form='Form_formula_pt' 
                    label='Productos Terminados' titulos='Titulos_formula_pt'
                    tabla_inv= 'sistemachs_Inventariopt'
                    id='IPT'
                    Titulo={'Ingreso Producto Terminado'}
                />,
    },
    Egresos:{
        Egresos: (props)=> <SubMenu {...props} submenu={['Egresos']}/>,
        // 'Egreso Material':EMP,
        // 'Egreso Producto Terminado':EProducto,
        'Egreso Material':(props)=> 
                <IngresosModificar {...props}  
                    table='sistemachs_Egresomp' 
                    label='Materia Prima' 
                    id='EMP'
                    Titulo={'Egreso Materia Prima'}
                    Egresar
                />,
        'Egreso Empaque':(props)=> 
                <IngresosModificar {...props}  
                    table='sistemachs_Egresoem' Form='Form_formula_em' 
                    label='Empaques' titulos='Titulos_formula_em'
                    tabla_inv= 'sistemachs_Empaque'
                    id='EEM'
                    Titulo={'Egroso Empaque'}
                    Egresar
                />,
        'Egreso Producto Terminado':(props)=> 
                <IngresosModificar {...props}  
                    table='sistemachs_Egresopt' Form='Form_formula_pt' 
                    label='Productos Terminados' titulos='Titulos_formula_pt'
                    tabla_inv= 'sistemachs_Inventariopt'
                    id='EPT'
                    Titulo={'Egreso Producto Terminado'}
                    Egresar
                />,
    },
    Administrativo:{
        Administrativo: (props)=> <SubMenu {...props} submenu={['Administrativo']}/>,
        ordenesdeventa: OrdenVenta,
        Venta,
        cobrar:Cobrar,
        Ventas
    },
    Planificar:Planificacion,
    Produccion,
    Registros,
    WhatsApp,
    Pruebas,
    PruebasT:Tabla_A
    //Verificar porque se recarga a cada rato
    // Nuevos:{
    //     // Nuevos: (props)=> <SubMenu {...props} submenu={['Nuevos']}/>,
    //     Nuevos: (props)=><Prueba {...props}/>,
    //     Formulas
    // }

}