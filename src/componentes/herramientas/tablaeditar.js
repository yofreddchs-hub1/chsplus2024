import React, {useEffect} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
// import PropTypes from 'prop-types';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  // GridToolbar,
  GridActionsCellItem,
  GridOverlay,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
// import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
// import {
//   randomCreatedDate,
//   randomTraderName,
//   randomUpdatedDate,
// } from '@mui/x-data-grid-generator';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Formulario from './formulario';
import {Form_todos, Ver_Valores, genera_formulario, nuevo_Valores, Funciones_Especiales} from '../../constantes';
import { conexiones } from '../../constantes';
import moment from 'moment';

function customCheckbox(theme) {
  return {
    '& .MuiCheckbox-root svg': {
      width: 16,
      height: 16,
      backgroundColor: 'transparent',
      border: `1px solid ${
        theme.palette.mode === 'light' ? '#d9d9d9' : 'rgb(67, 67, 67)'
      }`,
      borderRadius: 2,
    },
    '& .MuiCheckbox-root svg path': {
      display: 'none',
    },
    '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
      backgroundColor: '#1890ff',
      borderColor: '#1890ff',
    },
    '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
      position: 'absolute',
      display: 'table',
      border: '2px solid #fff',
      borderTop: 0,
      borderLeft: 0,
      transform: 'rotate(45deg) translate(-50%,-50%)',
      opacity: 1,
      transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
      content: '""',
      top: '50%',
      left: '39%',
      width: 5.71428571,
      height: 9.14285714,
    },
    '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
      width: 8,
      height: 8,
      backgroundColor: '#1890ff',
      transform: 'none',
      top: '39%',
      border: 0,
    },
  };
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 1,
  color:
    theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnHeader':{
    backgroundColor:theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
    border:2, 
    borderColor:'#f0f',
  },

  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-cell': {
    color:
      theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  },
  
  ...customCheckbox(theme),
}));

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

// const columns = [
//   { field: 'name', headerName: 'Name', width: 180, editable: true },
//   { field: 'age', headerName: 'Age', type: 'number', editable: true },
//   {
//     field: 'dateCreated',
//     headerName: 'Date Created',
//     type: 'date',
//     width: 180,
//     editable: true,
//   },
//   {
//     field: 'lastLogin',
//     headerName: 'Last Login',
//     type: 'dateTime',
//     width: 220,
//     editable: true,
//   },
// ];

export default function AntDesignGrid(props) {
  
  const {Titulo, titulos, datos, externos, nopaginar, editables, noeliminar, style, poderseleccionar, Config}= props;
  
  let Subtotalvalor= externos[props.name+'-subtotal'] ?  externos[props.name+'-subtotal'] : props.Subtotalvalor;
  // const { data } = useDemoData({
  //   dataSet: 'Commodity',
  //   rowLength: 10,
  //   maxColumns: 10,
  // });
  // console.log(props)
  // console.log(datos)
  const [Seleccion, setSeleccion] = React.useState(null);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [columnsm, setColumnsM] = React.useState();
  const [tasa, setTasa] = React.useState(0);
  const seleccion = async()=>{
    if (props.enformulario.Form===undefined && props.enformulario.form===undefined){
      setSeleccion(
        <div style={{marginTop:-45, marginBottom:-50}}>
        
        </div>
      )
      return
    }
  
    let nuevos = await genera_formulario({valores:{}, campos: Form_todos(`${props.enformulario.Form ? props.enformulario.Form : props.enformulario.form}`) })
    
    nuevos.titulos.select_a.lista= props.enformulario && props.enformulario.lista ? props.enformulario.lista : nuevos.titulos.select_a.lista;
    if(nuevos.titulos.select_a)
      nuevos.titulos.select_a.onChange=props.enformulario.onChange;
    let formulario ={
      ...nuevos,
    }
    setSeleccion(
      <div style={{marginTop:-25, marginBottom:-35}}>
        <Formulario {...formulario}/>
      </div>
    )
  }
  if (props.enformulario && Seleccion===null){
    seleccion()
  }

    // console.log(data)
  
  const [editRowsModel, setEditRowsModel] = React.useState({});

  
  const InicarColumnas=(rows)=>{
    let width= titulos ? window.innerWidth * 0.50 / titulos.length : window.innerWidth;
    let columnsM ={}
    const columnas= titulos 
      ? titulos.map(titulo=>{
        // console.log(titulo.nomostrar);
        columnsM[titulo.field]=!titulo.nomostrar;
        return {
          headerAlign: 'center', 
          headerName:titulo.title,
          minWidth: titulo.width ? titulo.width : 153.0,
          flex: titulo.flex ? titulo.flex : 1,
          width,
          ...titulo,
          valueGetter:(dato)=>{
            // console.log(dato)
            
            let valor =titulo.formato ? titulo.formato(dato) : dato.value; 
            if (!valor || valor==='NaN'){
              if (titulo.type==='date' && titulo.default==='actual'){
                titulo.formato=(dato)=>{
                  return moment(new Date()).format('DD/MM/YYYY');
                }
              }
              valor=titulo.formato ? titulo.formato(dato.row): dato.row[titulo.field] ;
            }
            if (!valor || valor==='NaN')
              valor=titulo.formato && rows[dato.id]!==undefined ? titulo.formato(rows[dato.id]) : null
            if (valor===null)
              valor= titulo.default ? titulo.default : '';
            if (typeof valor==='object')
              valor = valor.value ? valor.value : valor.titulo;
            
            if(typeof valor==='string'){
              if (valor && valor.split(',')[0]==='listar'){
                const listar = valor.split(',');
                let resulta= '';
                dato.value.map(v=>{
                  let texto='';
                  for (var i=1; i<listar.length; i++){
                    texto+= `${String(v[listar[i]]).toUpperCase()} `;
                  }
                  resulta += `${texto},`;
                  return v
                })
                valor=resulta;
              }
            } 
            // console.log('>>>>>>',valor)
            
            // if (dato.field==='total')
            // console.log(valor, typeof valor, rows[dato.id]) 
            return titulo.type==='number' ? Number(['NaN',NaN].indexOf(String(valor))===-1 ? valor : 0).toFixed(2).toLocaleString() : valor
          }//titulo.formato ? titulo.formato : null
        }
      })
      : []
    setColumns([...!noeliminar
        ? [{
            field: 'actions',
            type: 'actions',
            headerAlign: 'center', 
            
            width: 50,
            getActions: (data) => [
              <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={()=>Eliminar(data, rows)}/>,
            ],
          }]
        :[],
      ...columnas,
    ])
    setColumnsM(columnsM);
  }

  const Eliminar=(data, rows)=>{
    const {name}=props;
    let nuevo=[...rows]
    nuevo=nuevo.filter(f=>Number(f.id)!==Number(data.id)).map((v,i)=>{return {...v, id:i}})
    if(props.Cambio){
      props.Cambio({target:{name, value:nuevo}})
    }
  }

  const Tasa_cambio = async() =>{
    let {tasa} = Ver_Valores();
    // if (tasa===undefined){
    //   let resp = await conexiones.ValorCambio();
    //   if (resp.Respuesta==='Ok'){
    //     nuevo_Valores({tasa:resp.valor});
    //     setTasa(resp.valor === undefined ? 0 : resp.valor.USD!=='error' ? resp.valor.USD : resp.valor.dolartoday.sicad2);
    //   }
    // }else{
      setTasa( tasa && tasa.USD!=='error' ? tasa.USD : tasa && tasa.dolartoday ? tasa.dolartoday.sicad2 : 0);
    // }
    
    
    let nuevo = datos 
        ? datos.map((data,i)=>{
          let resultado={...data, id: data.id ? data.id : i}
          if (titulos){
            titulos.map(titulo=>{
              if (titulo.type==='date'&& resultado[titulo.field]){
                titulo.formato = (resultado)=>{
                  let fecha = resultado[titulo.field] ? resultado[titulo.field] : resultado.row[titulo.field]
                  return moment(new Date(fecha)).format('DD/MM/YYYY');
                }
              }
              let valor =titulo.formato ? titulo.formato(resultado) : null
              valor= String(valor)==='NaN' 
                      ? titulo.default
                      ? titulo.default
                      : 0
                      : valor
              resultado[titulo.field]= resultado[titulo.field] ? resultado[titulo.field] : valor
              return titulo
            })
          }

          return resultado
        })
        : []
    setRows(nuevo);
    InicarColumnas(nuevo);
    if (props.enformulario){
      seleccion()
    }
  }

  useEffect(() => {
      
      
      Tasa_cambio();
  }, [props]);

  const handleEditRowsModelChange = (model) => {
    setEditRowsModel(model);
    // setTimeout(()=>{
      Cambio(model)
    // },500)
    
  };

  const Cambio =(model)=>{
    const {name}=props;
    const row= Object.keys(model)[0];
    if (row){
      const colmn=Object.keys(model[row])[0]
      let nuevo=[...rows]
      
      nuevo[row][colmn]=model[row][colmn].value
      
      if (titulos){
        titulos.map(t=>{
          nuevo[row][t.field]=nuevo[row][t.field];//t.formato ? t.formato(nuevo[row]) : nuevo[row][t.field];
          return t
        })
      }
      setRows(nuevo)
      
      if(props.Cambio){
      
        props.Cambio({target:{name, value:rows}})
      }
      // InicarColumnas(nuevo)
    }else if(props.Cambio){
      
      props.Cambio({target:{name, value:rows}})
    }
  };
  // const Cambio_Sub= (dato)=>{
  //   console.log(dato);
  //   //props.Cambio
  // }
  const StyledGridOverlay = styled(GridOverlay)(({ theme }) => ({
    flexDirection: 'column',
    '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
  }));

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>Sin datos</Box>
      </StyledGridOverlay>
    );
  }
  
  const AgregarTodos = async() =>{
    console.log(props.enformulario)
    if (props.enformulario && props.enformulario.lista){
      console.log('Con lista')
    }else if (props.enformulario && (props.enformulario.Form || props.enformulario.form)){
      let nuevos = await genera_formulario({valores:{}, campos: Form_todos(`${props.enformulario.Form ? props.enformulario.Form : props.enformulario.form}`) })
      let lista = nuevos.titulos.select_a.lista;
      const resp = await conexiones.Leer_C([lista],{[lista]:{}})
      if (resp.Respuesta==='Ok'){
        lista = resp.datos[lista].map(v=>{return{_id:v._id, ...v.valores}})
      }
      
      props.enformulario.onChange({name:'select_a', resultados:{select_a:lista}})
    }
  }

  return columnsm=== undefined ? null : (
    <div style={{ height: '100%', width: '100%', marginTop:15, marginBottom:15, }}>
      <Stack direction="row" 
             spacing={1}
             justifyContent="flex-start"
             alignItems="center"
             sx={{marginBottom:2}}
      >
        <Typography variant="h6" gutterBottom component="div" sx={{...Config ? {color:Config.Estilos.Input_label}: {}}}>
          {Titulo ? Titulo : 'Titulo'}
        </Typography>
        <div style={{width:'45%'}}>
          {Seleccion}
        </div>
        {props.enformulario && props.agregartodos
          ?
            <IconButton size="large" onClick={AgregarTodos} color="inherit" title={`Agregar Todos los ${props.enformulario ? props.enformulario.label : '' }`}>
                  <Icon >done_all</Icon>
            </IconButton>
          : null
        }
      </Stack>
       
      <StyledDataGrid
        initialState={{
          columns: {
            columnVisibilityModel: 
              columnsm,
            // {
            //   // Hide columns status and traderName, the other columns will remain visible
            //   totalp: false,
            // },
          },
        }}
        // checkboxSelection
        // hideFooter
        components={{
          Pagination: !nopaginar ? CustomPagination : null,
          NoRowsOverlay: CustomNoRowsOverlay,
          Footer: props.Subtotal 
                    ? () =>SubTotales({name:props.name, Subtotal:props.Subtotal, Cambio:props.Cambio, Subtotalvalor, rows, Config, tasa, externos}) 
                    : undefined
        }}
        hideFooter= {props.Subtotal ? false : true}
        localeText={local}
        columns={columns}
        rows={rows}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
        disableSelectionOnClick={!poderseleccionar}
        isCellEditable={(params) => {
          // console.log(params)
          if (editables){
            const formato = Funciones_Especiales(editables);
            // const formato = eval(editables);
            const respuesta = formato(params);
            return respuesta;
          }else{
            return true;
          }
        }}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
          '& .MuiDataGrid-cell--editable': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#068E17' : 'rgb(217 243 190)',
          },
          ...style ? style : {}
        }}
      />
    </div>
  );
}

const SubTotales= (props) =>{
  const {Subtotalvalor, Cambio, name, tasa, externos}=props;
  
  const [resultado, setResultado] = React.useState(()=>{
    return Subtotalvalor ? Subtotalvalor : {}
  
  });
  const [modificado, setModificado] = React.useState(()=>{
    return Subtotalvalor ? Subtotalvalor : {}
  
  });
  const {rows}=props;
  // const [rows, setRows] = React.useState(props.rows);
  // const height=40;
  // const width=150;
  const igual =(primero, segundo)=>{
    let ig=true;
    if (Object.keys(segundo).length===0){
      return false;
    }
    Object.keys(primero).map(val=>{
      if(primero[val]!==segundo[val]) ig=false;
      return val
    })
    return ig
  }
  const Calcular =(valor)=>{
    // console.log('Por calcular>>>>>>>>', valor, modificado,externos[name+'-subtotal'])
    
    props.Subtotal.map(val=>{
      val.map(col=>{
        if (col.field && (valor[col.field]===undefined || col.tipo!=='input')){
          if (col.defaultf){
            const formato = eval(col.defaultf)
            valor[col.field]= formato(valor);
          }else{
            valor[col.field]= col.default ? col.default : 0;
          }
        }
        return col;
      })
      return val
    })
    
    
    rows.map(r=>{
      props.Subtotal.map(val=>{
        val.map(col=>{
          if (col.field && col.formato){
            //const formato = eval(col.formato);
            const formato = Funciones_Especiales(col.formato);
            valor[col.field]= formato(r,valor,tasa)
          }
          return col;
        })
        return val;
      })
      return r;
    })
    
    setResultado(valor);
    
    if (!igual(valor,modificado)){
      
      // setModificado({...valor})
      Cambio({target:{name: name+'-subtotal', value:valor}})
    }
    
  }

  useEffect(() => {
    // console.log('Refrescar subtotales');
    Calcular({...resultado})
  }, []);
  
  const {Config} = props;
  
  
  return(
    <Stack sx={{padding:1, backgroundColor:'#1D1D1D',
                  border: 2,
                  borderColor: 'primary.light',
                  '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                  },
                ...Config ? Config.Estilos.Tabla_subtotal : {}
              }} 
      spacing={0.1} 
    >
      {props.Subtotal.map((val, i)=>
        
        <Stack  key={i+'-fila'} 
            direction="row" 
            spacing={4}
            justifyContent="flex-end"
            alignItems="center"
            sx={{padding:0}}
      >
        {val.map((col,j)=>
          <Stack key={i+'-'+j} direction="row" justifyContent="flex-end" sx={{}}>
            {col.tipo==='input'
              ? <Stack direction="row">
                <Typography variant="h6" gutterBottom component="div">{col.titled ? col.titled : ''}</Typography>
                  <TextField
                    hiddenLabel
                    name={col.field}
                    id="filled-hidden-label-small"
                    value= {resultado[col.field]}
                    variant="filled"
                    size="small"
                    style={{width:col.width ? col.width : 60}}
                    type={'number'}
                    onChange={(event)=>{
                      const {name, value}=event.target;
                      // console.log(value, !isNaN(value));
                      let nuevo={...modificado, [name]:value};
                      
                      setModificado(nuevo)
                      console.log(nuevo)
                      Calcular({...nuevo})
                    }}
                  />
                  <Typography variant="h6" gutterBottom component="div">{col.title ? col.title : ''}</Typography>
                </Stack>
              : <Typography variant="h6" gutterBottom component="div" sx={col.style ? col.style : {}}>
                  {col.title && !col.field
                    ? col.title 
                    : col.field && col.title
                    ? `${col.title} ${Number(resultado[col.field]).toFixed(2).toLocaleString()}`
                    : col.field
                    ? `${Number(resultado[col.field]).toFixed(2).toLocaleString()}`
                    : 'nada' 
                  }
                </Typography>
            }
          </Stack>
          
        )}
      </Stack>
      )}
      
    </Stack>
  )
}


const local={
  // Root
  noRowsLabel: 'Sin datos',
  noResultsOverlayLabel: 'No se han encontrado resultados.',
  errorOverlayDefaultLabel: 'Ocurrió un error.',

  // Density selector toolbar button text
  toolbarDensity: 'Densidad',
  toolbarDensityLabel: 'Densidad',
  toolbarDensityCompact: 'Compacto',
  toolbarDensityStandard: 'Estándar',
  toolbarDensityComfortable: 'Amplio',

  // Columns selector toolbar button text
  toolbarColumns: 'Columnas',
  toolbarColumnsLabel: 'Seleccionar columnas',

  // Filters toolbar button text
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,

  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Descargar como CSV',
  toolbarExportPrint: 'Imprimir',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Buscar columna',
  columnsPanelTextFieldPlaceholder: 'Título de la columna',
  columnsPanelDragIconLabel: 'Reordenar columna',
  columnsPanelShowAllButton: 'Mostrar todo',
  columnsPanelHideAllButton: 'Ocultar todo',

  // Filter panel text
  filterPanelAddFilter: 'Añadir filtro',
  filterPanelDeleteIconLabel: 'Borrar',
  filterPanelOperators: 'Operators',
  filterPanelOperatorAnd: 'Y',
  filterPanelOperatorOr: 'O',
  filterPanelColumns: 'Columnas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor del filtro',

  // Filter operators text
  filterOperatorContains: 'contains',
  filterOperatorEquals: 'equals',
  filterOperatorStartsWith: 'starts with',
  filterOperatorEndsWith: 'ends with',
  filterOperatorIs: 'is',
  filterOperatorNot: 'is not',
  filterOperatorAfter: 'is after',
  filterOperatorOnOrAfter: 'is on or after',
  filterOperatorBefore: 'is before',
  filterOperatorOnOrBefore: 'is on or before',
  filterOperatorIsEmpty: 'is empty',
  filterOperatorIsNotEmpty: 'is not empty',
  filterOperatorIsAnyOf: 'is any of',

  // Filter values text
  filterValueAny: 'any',
  filterValueTrue: 'true',
  filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Mostrar columnas',
  columnMenuFilter: 'Filtro',
  columnMenuHideColumn: 'Ocultar',
  columnMenuUnsort: 'Unsort',
  columnMenuSortAsc: 'Ordenar por ASC',
  columnMenuSortDesc: 'Ordenar por DESC',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: 'Mostrar filtros',
  columnHeaderSortIconLabel: 'Ordenar',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} filas seleccionadas`
      : `${count.toLocaleString()} fila seleccionada`,

  // Total rows footer text
  footerTotalRows: 'filas totales:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Selección de casilla',
  checkboxSelectionSelectAllRows: 'Seleccionar todas las filas',
  checkboxSelectionUnselectAllRows: 'Deseleccionar todas las filas',
  checkboxSelectionSelectRow: 'Seleccionar fila',
  checkboxSelectionUnselectRow: 'Deseleccionar fila',

  // Boolean cell text
  booleanCellTrueLabel: 'true',
  booleanCellFalseLabel: 'false',

  // Actions cell more text
  actionsCellMore: 'more',

  // Column pinning text
  pinToLeft: 'Pin to left',
  pinToRight: 'Pin to right',
  unpin: 'Unpin',

  // Tree Data
  treeDataGroupingHeaderName: 'Group',
  treeDataExpand: 'see children',
  treeDataCollapse: 'hide children',

  // Grouping columns
  groupingColumnHeaderName: 'Group',
  groupColumn: (name) => `Group by ${name}`,
  unGroupColumn: (name) => `Stop grouping by ${name}`,

  // Master/detail
  expandDetailPanel: 'Expand',
  collapseDetailPanel: 'Collapse',

  // Used core components translation keys
  MuiTablePagination: {},
}
