
export const categoria_usuario=[
    {_id:0, titulo:'AdministradorCHS',
      permisos:['*','**','*CHS']},
    {_id:1, titulo:'Administrador',
    permisos:['*']},
    {_id:2, titulo:'personal',
      permisos:[]},
    {_id:3, titulo:'usuario',
      permisos:[]},
    {_id:4, titulo:'Operador',
      permisos:[]},
    {_id:5, titulo:'Personal indirecto',
      permisos:[]},
    
];


const Menu=[
  {value: 'Inicio', primary:'Inicio', icon:'home', libre:'true'},
  {value: 'Configuracion', primary:'Configuración', icon:'settings',
    childen:[
      {value: 'Datos', primary:'Datos', icon:'settingsbrightness'},
      {value: 'Tablas', primary:'Tablas', icon:'tableview'},
      {value: 'Listas', primary:'Listas', icon:'reorder'},
      {value: 'Titulos', primary:'Titulos en tablas', icon:'credit_card'},
      // {value: 'Subtotales', primary:'Pie de tabla', icon:'view_module'},
      {value: 'CrearFormulario', primary:'Crear Formulario', icon:'article'},
    ]
  },
  
]

const Menu_iconos=[
  {icon:'shoppingcart', title:'Carrito de Compra', value:'carrito'}
]
const Listas={
  lista_ejemplo: [
    {
        "_id": 0,
        "titulo": "Primera"
    },
    {
        "_id": 1,
        "titulo": "Segunda"
    },
    {
        "_id": 2,
        "titulo": "Tercera"
    }
  ],
  lista_tipo:[
    {_id:0, titulo:'Input', value:'input'},
    {_id:1, titulo:'Numero', value:'number'}, 
    {_id:2, titulo:'Input Multilineas', value:'multiline'}, 
    {_id:3, titulo:'Password', value:'password'},
    {_id:4, titulo:'Codigo de Barra', value:'Barcode'},
    {_id:5, titulo:'auto Codigo', value:'auto-codigo'},
    {_id:6, titulo:'Imagen', value:'Imagen'},
    {_id:7, titulo:'Camara', value:'Camara'},
    {_id:8, titulo:'Avatar', value:'Avatar'},
    {_id:9, titulo:'Checkbox', value:'Checkbox'},
    {_id:10, titulo:'Fecha', value:'Fecha'},
    {_id:11, titulo:'Video', value:'video'},
    {_id:12, titulo:'Lista', value:'lista_multiuso'},
    {_id:13, titulo:'Tabla', value:'Tabla'},
  ],
  lista_estatus:[
    {_id:1, titulo:'Por aprobar', value:'por-aprobar'}, 
    {_id:2, titulo:'Aprobado', value:'aprobado'}, 
    {_id:3, titulo:'Rechazado', value:'rechazado'},
    {_id:4, titulo:'En espera de compra', value:'esperando'},
    {_id:5, titulo:'Comprado (por ingresar)', value:'comprado'},
    {_id:6, titulo:'Comprado (Ingresado)', value:'ingresado'},
  ],
  lista_categoria: categoria_usuario,
}

const Formularios = {
  Form_ejemplo: { columna:1,
    value:[
    {
      "key": "normal",
      "name": "normal",
      "placeholder": "Input normal",
      "icono":"tableview"
    },
    {
      "key": "ejemplo_lista",
      "name": "ejemplo_lista",
      "label": "Ejemplo de lista",
      "tipo": "lista_multiuso",
      "lista": "lista_ejemplo",
      "multiple": false,
      "getOptionLabel": [
          "titulo"
      ]
    },
    {
        "key": "aunto general codigo y no permitir editar",
        "name": "codigo",
        "label": "Codigo",
        "tipo": "auto-codigo",
        "disabled":true 
    },
    {
      "key": "password",
      "name": "password",
      "label": "Password",
      "tipo": "password",
    },
    {
      "key": "normal1",
      "name": "normal1",
      "placeholder": "Input normal1",
      "icono":"tableview"
    },
    {
      "key": "foto",
      "name": "foto",
      "label": "Foto",
      "tipo": "Camara"
    },
    // {
    //   "key": "cliente",
    //   "name": "cliente",
    //   "label": "Cliente",
    //   "tipo": "lista_multiuso",
    //   "lista": "Cliente", Nombre de la lista en base de datos
    //   "multiple": false, si la seleccion es multiple
    //   "getOptionLabel": [
    //       "nombres",
    //       "apellidos", lo que deseamos mostrar en la seleccion
    //   ],
    //   "agregar": true, si le damos la opcion de agregar
    //   "form": "Form_cliente_s", el nombre del fromulario a mostrar para agregar
    // },
    {
      "key": "descripcion, para un input multilinea",
      "name": "descripcion",
      "placeholder": "Descripción",
      "multiline": true,
      "numberOfLines": 4
    },
    
  ]},
  Form_Listas:{columna:1,
    value:[
      {
        "key": "select_a",
        "name": "select_a",
        "label": "Seleccionar lista",
        "tipo": "lista_multiuso",
        "lista": "lista_", 
        "multiple": false, 
        "getOptionLabel": [
            "titulo",
        ],
      },
    ]
  },
  Form_Listas_n:{ columna:1,
    value:[
    {
      "key": "nombre",
      "name": "nombre",
      "label": 'Nombre de la lista',
      "placeholder": "Nombre de la lista",
      required:true,
      mensaje_error:'Debe indicar el nombre de la lista a crear',
    },
  ]},
  Form_Listas_m:{ columna:2,
    value:[
    {
      "key": "titulo",
      "name": "titulo",
      "label": 'Titulo',
      "placeholder": "Titulo",
      required:true,
      mensaje_error:'Debe indicar el titulo a mostra',
    },
    {
      "key": "value",
      "name": "value",
      "label": 'Valor',
      "placeholder": "Valor",
      "title":"Valor que representa este inten en la lista",
    },
    {
      "key": "permisos",
      "name": "permisos",
      "label": 'Permisos',
      "placeholder": "Permisos",
      "title":"Permisos (solo para categoria)",
    },
  ]},
  Form_Cabezera_m:{ columna:2,
    value:[
    {
      "key": "title",
      "name": "title",
      "label": 'Titulo',
      "placeholder": "Titulo",
      "title":"Titulo a mostrar en la tabla",
      required:true,
      mensaje_error:'Debe indicar el titulo a mostra',
    },
    {
      "key": "field",
      "name": "field",
      "label": 'Campo',
      "placeholder": "Campo",
      "title":"Campo que representa de la data",
      required:true,
      mensaje_error:'Debe indicar el campo a mostra',
    },
    {
      "key": "tipo",
      "name": "tipo",
      "label": 'Tipo de valor',
      "placeholder": "Tipo de valor",
      "title":"Tipo de valor que representa",
    },
    {
      "key": "default",
      "name": "default",
      "label": 'Valor por defecto',
      "placeholder": "valor por defecto",
      "title":"Valor por defecto del campo",
    },
    {
      "key": "editable",
      "name": "editable",
      "label": 'Editable/No Editable',
      "placeholder": "Editable",
      "title":"Si el campo es editable o no",
      "tipo": "Checkbox"
    },
    {
      "key": "type",
      "name": "type",
      "label": 'Type',
      "placeholder": "Type",
      "title":"Tipo del campo generico",
    },
    {
      "key": "formato",
      "name": "formato",
      "label": 'Formato',
      "placeholder": "Formato",
      "title":"Formato del valor",
      "multiline": true,
      "numberOfLines": 2
    },
  ]},
  Form_form:{columna:1,
    value:[
      {
        "key": "lista",
        "name": "lista",
        "label": "Formularios",
        "tipo": "lista_multiuso",
        "lista": "lista_",
        "multiple": false,
        "getOptionLabel": [
            "titulo"
        ]
      },
      {
        "key": "columna",
        "name": "columna",
        "label": 'Columnas',
        "title": "Cantidad de columnas del formulario",
        required:true,
        mensaje_error:'Debe indicar la cantidad de columna',
        type:'number'
      },
      {
        "key": "input",
        "name": "input",
        "label": "Entradas de datos",
        "tipo": "lista_multiuso",
        "lista": "lista_",
        "multiple": false,
        "getOptionLabel": [
            "titulo"
        ]
      }
    ]
  },
  Form_agregaritem:{ columna:1,
    value:[
    {
      "key": "tipo",
      "name": "tipo",
      "label": "Tipo",
      "tipo": "lista_multiuso",
      "lista": "lista_tipo",
      "multiple": false,
      "mensaje_error":'Debe seleccionar tipo',
      required:true,
      "getOptionLabel": [
          "titulo"
      ]
    },
    {
      "key": "nombre",
      "name": "nombre",
      "label": 'Nombre del item',
      "placeholder": "Nombre del campo",
      required:true,
      mensaje_error:'Debe indicar el nombre del nuevo item',
    },
    {
      "key": "label",
      "name": "label",
      "label": 'Etiqueta',
      "placeholder": "Etiqueta",
      "title":"Etiqueta con la que quiere se identifique",
    },
    {
      "key": "lista",
      "name": "lista",
      "label": "lista",
      "tipo": "lista_multiuso",
      "lista": "lista_",
      "multiple": false,
      disabled:true,
      "getOptionLabel": [
          "titulo"
      ]
    },
  ]},
  Form_agregaritemt:{ columna:1,
    value:[
      {
        "key": "nombre",
        "name": "nombre",
        "label": 'Nombre del item',
        "placeholder": "Nombre del campo",
        required:true,
        mensaje_error:'Debe indicar el nombre del nuevo item',
      },
      {
        "key": "tipo",
        "name": "tipo",
        "label": "Tipo",
        "tipo": "lista_multiuso",
        "lista": "lista_tipo",
        "multiple": false,
        "mensaje_error":'Debe seleccionar tipo',
        required:true,
        "getOptionLabel": [
            "titulo"
        ]
      },
      {
        "key": "label",
        "name": "label",
        "label": 'Etiqueta',
        "placeholder": "Etiqueta",
        "title":"Etiqueta con la que quiere se identifique",
      },
      {
        "key": "placeholder",
        "name": "placeholder",
        "label": 'Placeholder',
        "placeholder": "Placeholder",
        "title":"Etiqueta que aparece cuando no hay datos",
      },
      {
        "key": "title",
        "name": "title",
        "label": 'Titulo al colocar mouse',
        "title":"Titulo al colocar mouse arriba",
      },
      {
        "key": "required",
        "name": "required",
        "label": 'Obligatorio/No Obligatorio',
        "title":"Si el dato a ingresar es obligatorio",
        "tipo": "Checkbox"
      },
      {
        "key": "mensaje_error",
        "name": "mensaje_error",
        "label": 'Mensaje Error',
        "placeholder": "Mensaje Error",
        "title":"Mensaje de error al no colocar dato",
      },
      {
        "key": "disabled",
        "name": "disabled",
        "label": 'Activo/Inactivo',
        "title":"Si desea que este activo o no",
        "tipo": "Checkbox"
      },
      {
        "key": "numberOfLines",
        "name": "numberOfLines",
        "label": 'Numero de linea',
        "title":"Numero de lineas",
        "type":'number',
        disabled:true,
      },
      {
        "key": "lista",
        "name": "lista",
        "label": "Lista a mostrar",
        "tipo": "lista_multiuso",
        "lista": "lista_",
        "multiple": false,
        disabled:true,
        "getOptionLabel": [
            "titulo"
        ]
      },
      {
        "key": "getOptionLabel",
        "name": "getOptionLabel",
        "label": 'Opciones a mostrar',
        "title":"Opcciones a mostrar",
        "value":[
          "titulo"
        ],
        disabled:true,
      },
      {
        "key": "agregar",
        "name": "agregar",
        "label": 'Agregar/No Agregar',
        "title":"Si desea agregar un nuevo item o no",
        "tipo": "Checkbox",
        "disabled":true,
      },
      {
        "key": "form",
        "name": "form",
        "label": "Formulario para agregar",
        "tipo": "lista_multiuso",
        "lista": "lista_",
        "multiple": false,
        disabled:true,
        "getOptionLabel": [
            "titulo"
        ]
      },
      {
        "key": "titulos",
        "name": "titulos",
        "label": "Cabezera de la tabla",
        "tipo": "lista_multiuso",
        "lista": "lista_",
        "multiple": false,
        disabled:true,
        "getOptionLabel": [
            "titulo"
        ]
      },
      {
        "key": "Subtotal",
        "name": "Subtotal",
        "label": "Subtotales",
        "tipo": "lista_multiuso",
        "lista": "lista_",
        "multiple": false,
        disabled:true,
        "getOptionLabel": [
            "titulo"
        ]
      },
  ]},
  Form_nuevodatabase:{ columna:1, 
    value:[
    {
      "key": "archivo",
      "name": "archivo",
      "label": 'Archivo',
      "placeholder": "Nombre del tabla",
      required:true,
      mensaje_error:'Nombre de la nueva tabla',
    },
    {
      "key": "codigo",
      "name": "codigo",
      "label": 'Modelo',
      "placeholder": "Codigo del modelo",
      required:true,
      mensaje_error:'Debe indicar codigo del modelo',
      "multiline": true,
      "numberOfLines": 10
    },
  ]},
  Form_eliminardatabase:{ columna:1,
    value:[
    {
      "key": "lista",
      "name": "lista",
      "label": "DataBase",
      "tipo": "lista_multiuso",
      "lista": "lista_",
      "multiple": false,
      "mensaje_error":'Debe seleccionar DataBase',
      required:true,
      "getOptionLabel": [
          "titulo"
      ]
    }
  ]},
  Form_login: { columna:1,
    value:[
    {
      "key": "username",
      "name": "username",
      "placeholder": "Username",
      mensaje_error:'Indique username',
      required: true
    },
    {
      "key": "password",
      "name": "password",
      "label": "Contraseña",
      "tipo": "password",
      mensaje_error:'Indique contraseña',
      required: true
    },
  ]},
  Form_User_api: {columna:2, 
    value:[
    {
      "key": "foto",
      "name": "foto",
      "label": "Foto",
      "tipo": "Avatar",
    },
    {
      "key": "username",
      "name": "username",
      "placeholder": "Username",
      mensaje_error:'Indique username',
      required: true,
      no_modificar:true,
    },
    {
      "key": "categoria",
      "name": "categoria",
      "label": "Categoria Usuario",
      "tipo": "lista_multiuso",
      "lista": "lista_categoria",
      "multiple": false,
      "getOptionLabel": [
          "titulo"
      ]
    },
    {
      "key": "password",
      "name": "password",
      "label": "Contraseña",
      "tipo": "password",
      comparar:'true', con:'passwordc',
      mensaje_error:'Contraseñas no son iguales',
      no_mostrar:true
    },
    {
      "key": "passwordc",
      "name": "passwordc",
      "label": "Contraseña Confirmar",
      "tipo": "password",
      comparar:'true', con:'password',
      mensaje_error:'Contraseñas no son iguales',
    },
    {
      "key": "nombres",
      "name": "nombres",
      "placeholder": "Nombre y Apellido"
    },
  ]},
  Form_Cliente: {columna:2, 
    value:[
    {
      "key": "rif",
      "name": "rif",
      "label": "Cedula / Rif",
      "tipo": "input",
      mensaje_error:'Indique documento de identidad',
      required: true,
    },
    {
      "key": "nombre",
      "name": "nombre",
      "label": "Nombre",
      mensaje_error:'Indique nombre del proveedor ',
      required: true,
    },
    {
      "key": "telefono",
      "name": "telefono",
      "label": "Telefono de contacto",
    },
    {
      "key": "email",
      "name": "email",
      "label": "Correo electronico",
    },
    {
      "key": "direcion",
      "name": "direccion",
      "label": 'Dirección',
      "multiline": true,
      "numberOfLines": 4
    },
    
  ]},
  Form_Proveedor: {columna:2, 
    value:[
    {
      "key": "rif",
      "name": "rif",
      "label": "Cedula / Rif",
      "tipo": "input",
      mensaje_error:'Indique documento de identidad',
      required: true,
    },
    {
      "key": "nombre",
      "name": "nombre",
      "label": "Nombre",
      mensaje_error:'Indique nombre del proveedor ',
      required: true,
    },
    {
      "key": "telefono",
      "name": "telefono",
      "label": "Telefono de contacto",
    },
    {
      "key": "email",
      "name": "email",
      "label": "Correo electronico",
    },
    {
      "key": "direcion",
      "name": "direccion",
      "label": 'Dirección',
      "multiline": true,
      "numberOfLines": 4
    },
    
  ]},
  Form_Proveedor_Art:{columna:1,
    value:[
      {
        "key": "select_a",
        "name": "select_a",
        "label": "Selecciona Proveedor",
        "tipo": "lista_multiuso",
        "lista": "Proveedor", 
        "multiple": false, 
        "getOptionLabel": [
            "rif",
            "nombre", 
        ],
      },
    ]
  },
  Form_Articulo: {columna:2, 
    value:[
    {
      "key": "codigo",
      "name": "codigo",
      "label": "Codigo",
      "tipo": "Barcode",
      mensaje_error:'Indique codigo del articulo',
      required: true,
    },
    {
      "key": "nombre",
      "name": "nombre",
      "label": "Nombre",
      mensaje_error:'Indique nombre de articulo',
      required: true,
    },
    {
      "key": "detalle",
      "name": "detallle",
      "label": 'Detalle del Articulo',
      "multiline": true,
      "numberOfLines": 5
    },
    {
      "key": "proveedor",
      "name": "proveedor",
      "label": "Proveedores",
      "tipo": "lista_multiuso",
      "lista": "Proveedor", 
      "multiple": true, 
      "getOptionLabel": [
          "rif",
          "nombre", 
      ],
      "agregar": true, 
      "form": "Form_Proveedor", 
    },
    {
      "key": "proveedores",
      "name": "proveedores",
      "label": "Precio de proveedores",
      "tipo": "Tabla",
      "titulos": "Titulos_Proveedor_Art", 
      "Form":'Form_Proveedor_Art',
      
    },
  ]},
  Form_Orden_Art:{columna:1,
    value:[
      {
        "key": "select_a",
        "name": "select_a",
        "label": "Selecciona Articulo",
        "tipo": "lista_multiuso",
        "lista": "Articulo", 
        "multiple": false, 
        "getOptionLabel": [
            "codigo",
            "nombre", 
        ],
      },
    ]
  },
  Form_Orden: {columna:2, 
    value:[
    {
      "key": "codigo",
      "name": "codigo",
      "label": "Codigo",
      "tipo": "auto-codigo",
      required: true,
    },
    {
      "key": "fecha",
      "name": "fecha",
      "label": "Fecha",
      "tipo": "Fecha",
      mensaje_error:'Indique fecha',
      required: true,
    },
    {
      "key": "proveedor",
      "name": "proveedor",
      "label": "Proveedores",
      "tipo": "lista_multiuso",
      "lista": "Proveedor", 
      "multiple": false, 
      "getOptionLabel": [
          "rif",
          "nombre", 
      ],
      "agregar": true, 
      "form": "Form_Proveedor", 
    },
    {
      "key": "estatus",
      "name": "estatus",
      "label": "Estatus",
      "tipo": "lista_multiuso",
      "lista": "lista_estatus", 
      "multiple": false, 
      "getOptionLabel": [
          "titulo",
      ],
      
    },
    {
      "key": "articulos",
      "name": "articulos",
      "label": "Articulos",
      "tipo": "Tabla",
      "titulos": "Titulos_Articulo_ord", 
      "Form":'Form_Orden_Art',
      'funcion':`(dato, nuevo)=>{
        console.log(dato.proveedor, nuevo)
        if (dato.proveedor.rif){
          const es= nuevo.proveedores.filter(f=> f.rif===dato.proveedor.rif)
          console.log(es[0], es[0].precio)
          nuevo.costo=es[0].precio
        }
        return nuevo
      }`,
      "Subtotal":"Subtotal_orden"
      // [
      //   [{title:'Subtotal'},{title:' '},{field:'subtotal', default:0 ,formato: '(dato, resultado)=> (Number(dato.costo) * Number(dato.cantidad)) + Number(resultado.subtotal)'}],
      //   [{title:'Iva'},{default: 6, tipo:'input', title:'%', field:'iva'},{default:0, field:'subiva', formato: '(dato,resultado)=> Number(resultado.subtotal) * Number(resultado.iva)/100'}],
      //   [{title:'Total'},{title:' '},{default:0, field:'total', formato: '(dato,resultado)=> Number(resultado.subtotal) + Number(resultado.subiva) + Number(resultado.total)'}],
      // ]
    },
    
  ]},

  Form_Producto: {columna:2, 
    value:[
    {
      "key": "codigo",
      "name": "codigo",
      "label": "Codigo",
      "tipo": "Barcode",
      mensaje_error:'Indique codigo del articulo',
      required: true,
    },
    {
      "key": "nombre",
      "name": "nombre",
      "label": "Nombre",
      mensaje_error:'Indique nombre del producto',
      required: true,
    },
    {
      "key": "descripcion",
      "name": "descripcion",
      "label": 'Descripcion del Producto',
      "multiline": true,
      "numberOfLines": 5
    },
    {
      "key": "presentacion",
      "name": "presentacion",
      "label": 'Presentacion del Producto',
      "multiline": true,
      "numberOfLines": 3
    },
    {
      "key": "uso",
      "name": "uso",
      "label": 'Uso del Producto',
      "multiline": true,
      "numberOfLines": 3
    },
    {
      "key": "docis",
      "name": "docis",
      "label": 'Docis del Producto',
      "multiline": true,
      "numberOfLines": 3
    },
    {
      "key": "imagen",
      "name": "imagen",
      "label": 'Imagen',
      "tipo": 'imagen'
    },
  ]},
  Form_Portada: {columna:1, 
    value:[
    {
      "key": "title",
      "name": "title",
      "label": "Titulo",
    },
    {
      "key": "img",
      "name": "img",
      "label": 'Imagen',
      "tipo": 'imagen'
    },
  ]},
}

const Titulos = {
  Titulos_ejemplo:[
    {title:'Normal',field:'normal', formato : (dato)=> dato.valores.normal },
    {title:'Lista',field:'ejemplo_lista', formato : (dato)=> dato.valores.ejemplo_lista },
    {title:'Codigo',field:'codigo', formato : (dato)=> dato.valores.codigo },
    {title:'password',field:'password', formato : (dato)=> dato.valores.password},
    {title:'Foto',field:'foto', formato : (dato)=> dato.valores.foto},
    {title:'Descripcion',field:'descripcion', formato: '(dato)=> `${dato.username}= ${dato.foto}`'},
  ],
  Titulos_Listas:[
    {title:'_id',field:'_id'},
    {title:'Titulo',field:'titulo'},
    {title:'Valor',field:'value'},
    {title:'Permisos',field:'permiso'},
  ],
  Titulos_Cabezera:[
    {title:'Titulo',field:'title'},
    {title:'Campo',field:'field'},
    {title:'Formato',field:'formato'},
    {title:'Tipo',field:'tipo'},
  ],
  Titulos_User_api:[
    {title:'Foto',field:'foto', tipo:'foto'},
    {title:'Username',field:'username'},
    {title:'Categoria',field:'categoria', tipo:'lista_categoria' },
    {title:'Nombres',field:'nombres' },
  ],
  Titulos_Orden:[
    {title:'Orden',field:'orden', formato: '(dato)=> `${dato.valores.codigo}`'},
    {title:'Estatus',field:'estatus', formato: '(dato)=> `${dato.valores.estatus ? dato.valores.estatus.titulo : ""}`'},
    {title:'Proveedor',field:'proveedor', formato: '(dato)=> `${dato.valores.proveedor ? dato.valores.proveedor.nombre : ""}`'},
    {title:'Fecha',field:'fecha', formato: '(dato)=> `${dato.valores.fecha}`'},
  ],
  Titulos_Cliente:[
    {title:'Cedula / Rif',field:'rif', formato: '(dato)=> `${dato.valores.rif}`'},
    {title:'Nombre',field:'nombre', formato: '(dato)=> `${dato.valores.nombre}`'},
    {title:'Telefono',field:'telefono', formato: '(dato)=> `${dato.valores.telefono}`'},
    {title:'Correo electronico',field:'email', formato: '(dato)=> `${dato.valores.email}`'},
  ],
  Titulos_Proveedor:[
    {title:'Cedula / Rif',field:'rif', formato: '(dato)=> `${dato.valores.rif}`'},
    {title:'Nombre',field:'nombre', formato: '(dato)=> `${dato.valores.nombre}`'},
    {title:'Telefono',field:'telefono', formato: '(dato)=> `${dato.valores.telefono}`'},
    {title:'Correo electronico',field:'email', formato: '(dato)=> `${dato.valores.email}`'},
  ],
  Titulos_Proveedor_Art:[
    {title:'Cedula / Rif',field:'rif'},
    {title:'Nombre',field:'nombre'},
    {title:'Precio',field:'precio', formato: '(dato)=> Number(`${dato.precio}`)', default: 0, editable: true, type: 'number'},
    
  ],
  Titulos_Articulo:[
    {title:'Codigo',field:'codigo', formato: '(dato)=> `${dato.valores.codigo}`'},
    {title:'Nombre',field:'nombre', formato: '(dato)=> `${dato.valores.nombre}`'},
  ],
  Titulos_Articulo_ord:[
    {title:'Codigo',field:'codigo'},
    {title:'Nombre',field:'nombre'},
    {title:'Costo',field:'costo', formato: '(dato)=> Number(`${dato.costo}`)', default: 0, editable: true, type: 'number'},
    {title:'Cantidad',field:'cantidad', align:'center', formato: '(dato)=> Number(`${dato.cantidad}`)', default: 1, editable: true, type: 'number'},
    {title:'Total',field:'total', formato: '(dato)=> `${Number(dato.costo)  * Number(dato.cantidad)}`', type: 'number'},
  ],
  Titulos_Producto:[
    {title:'Codigo',field:'codigo', formato: '(dato)=> `${dato.valores.codigo}`'},
    {title:'Nombre',field:'nombre', formato: '(dato)=> `${dato.valores.nombre}`' },
    {title:'Imagen',field:'imagen', tipo:'imagen' , formato: '(dato)=> `${dato.valores.imagen}`'},
  ],
  Titulos_Portada:[
    {title:'Imagen',field:'img', tipo:'imagen' , formato: '(dato)=> `${dato.valores.img}`'},
    {title:'Titulo',field:'titulo', formato: '(dato)=> `${dato.valores.titulo ? dato.valores.titulo : ""}`' },
  ],
}

const Subtotales ={
  Subtotal_orden:[
    [{title:'Subtotal'},{title:' '},{field:'subtotal', default:0 ,formato: '(dato, resultado)=> (Number(dato.costo) * Number(dato.cantidad)) + Number(resultado.subtotal)'}],
    [{title:'Iva'},{default: 6, tipo:'input', title:'%', field:'iva'},{default:0, field:'subiva', formato: '(dato,resultado)=> Number(resultado.subtotal) * Number(resultado.iva)/100'}],
    [{title:'Total'},{title:' '},{default:0, field:'total', formato: '(dato,resultado)=> Number(resultado.subtotal) + Number(resultado.subiva) + Number(resultado.total)'}],
  ]
}

const Estilos={
  Logo:{
    height:60, width:60
  },
  Input_label:{
    color:'#fff',
    textAlign:'left'
  },
  Input_helper:{
    color:'#F92C2C',
    textAlign:'left'
  },
  Input_fondo:{
    backgroundColor:"rgba(0, 0, 0,1)"
  },
  Input_input:{
    color:'#ffffff'
  },
  Input_input_disabled:{
    color:'#CEBAB6'
  },
  Input_icono:{
    color:'#ffffff'
  },
  Barra_menu:{
    backgroundColor:'rgba(0, 0, 0)',
    color:'#ffffff'
  },
  Lista_menu_fondo:{
    bgcolor:'#7ABC32', padding:0.2, height:'100%'
  },
  Lista_menu_cuerpo:{
    primary: { main: 'rgb(102, 157, 246)' }, //Color de letra
    background: { paper: 'rgb(5, 30, 52)' }, //Color de fondo de la barra
  },
  Dialogo_cuerpo:{
    backgroundColor:'rgb(5, 30, 52)',
  },
  Tabla_titulo:{ // Titulo de la tabla
    color:'#ffffff'
  },
  Tabla_cabezera:{//donde esta titulo, botones y busqueda
    backgroundImage: 'linear-gradient(0deg, #080303 0, #524D4D 90% )'
  },
  Tabla_buscar_fondo:{
    backgroundColor:"rgba(0, 0, 0,1)"
  },
  Tabla_buscar_input:{
    color:'#ffffff'
  },
  Tabla_buscar_icono:{
    color:'#ffffff'
  },
  Tabla_titulos:{
    backgroundColor:'rgba(0, 0, 0)',
    color:'#ffffff'
  },
  Botones:{
    Aceptar:{
      backgroundImage: 'linear-gradient(0deg, #19A203 0, #0E5003 50% )'
    },
    Cancelar:{
      backgroundImage: 'linear-gradient(0deg, #524D4D 0, #080303 50% )'
    },
    Eliminar:{
      backgroundImage: 'linear-gradient(0deg, #DB1007 0, #880904 50% )'
    }
  },
  barra_menu:{
    backgroundColor:'rgba(0, 19, 36)',// 'rgba(0, 99, 169)',
  },

};

const Funciones={
  Funcion_orden:`(dato, nuevo)=>{
    console.log(dato.proveedor, nuevo)
    if (dato.proveedor.rif){
      const es= nuevo.proveedores.filter(f=> f.rif===dato.proveedor.rif)
      console.log(es[0], es[0].precio)
      nuevo.costo=es[0].precio
    }
    return nuevo
  }`
}
export const Valord={
  Titulo:'CHS +',
  Logo: "/api/imagen/logo.png",
  Sindatos:"/api/imagen/sindatos.png".
  categoria_usuario,
  Menu,
  Menu_iconos,
  Estilos,
  Listas,
  Formularios,
  Titulos,
  Funciones,
  Subtotales
}
