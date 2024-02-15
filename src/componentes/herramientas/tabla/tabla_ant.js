import React from 'react';
import { Table,  ConfigProvider } from 'antd';
import { styled, alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import LinearProgress from '@mui/material/LinearProgress';
import Pagination from '@mui/material/Pagination';
import './styles.css'
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import { Ver_Valores } from '../../../constantes';
import Scrollbars from '../scrolbars';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(0),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  
const columns = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.name < b.name,
    
    className:'probando'
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
    width: 150,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
    width: 150,
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  },
];
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    codigo: `Manuel ${i}`,
    age: 32,
    fecha: `London Park no. ${i}`,
  });
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
}));

const Columnas = (titulos) =>{
    let columna=[]
    if (titulos)
        titulos.map((val, i)=>{
            columna = [
                ...columna,
                {
                    key:val.field + i,
                    
                    fixed: val.fixed,                    
                    title: val.title,
                    width: val.width ? val.width : 240,
                    dataIndex: val.field,
                    key: val.field,
                    render:(text, record, index)=>{
                        return (
                        <Box >
                            {val.formato ? val.formato(record) : text}
                        </Box>
                    )},
                    // defaultSortOrder: 'descend',
                    sorter: (a, b) =>{
                        const A =  val.formato ? val.formato(a) : a[val.field];
                        const B =  val.formato ? val.formato(b) : b[val.field];
                        return A < B
                    },
                    className:'columnas'
                    
                },
            ]
            return val;
        })
    return columna
}

const Tabla_A = (props) => {
    const {titulos, datos, Config, Titulo, acciones, acciones1, actualizando, Accion, paginacion, Cambio, alto, anchop} = props;//progreso,
    const [Seleccion, setSeleccion] = React.useState(null);
    const width = anchop ? anchop :Ver_Valores().tipo ==='Web' 
            ?   window.innerWidth * 0.80
            :   window.innerWidth * 0.81;
    const heigth = alto ? alto : Ver_Valores().tipo ==='Web' 
            ? window.innerHeight * 0.63 
            : window.innerHeight * 0.67;
    let ancho =0;
    
    let columna=Columnas(titulos);
    columna = columna.map((v,i)=>{
        let filters = []
        datos.map(data=>{
            filters=[
                ...filters,
                {
                    text: titulos[i].formato ? titulos[i].formato(data) : data[v.field],
                    value: titulos[i].formato ? titulos[i].formato(data) : data[v.field],
                }
            ]
            return data;
        })
        ancho+=v.width ? v.width : 100;
        
        const filtrar =  (value, record) => {
            let valor= titulos[i].formato ? titulos[i].formato(record) : record[titulos[i].field]; 
            console.log(value, valor, valor===value)
            return valor.includes(value) || value===valor
        }
        return {...v, filters, onFilter: filtrar}
    })
    
    
    const ndatos = datos;//Nuevo_Dato(datos,titulos);
    return(
      <Box sx={{width:width, marginLeft: Ver_Valores().tipo ==='Web' ? -0 :-0}}>
          <AppBar position="static" style={{padding:10, ...Config.Estilos.Tabla_cabezera ? Config.Estilos.Tabla_cabezera : {} }}>
              <Grid container spacing={0.5} justifyContent="center" alignItems="center">
              <Grid item xs={3}>
                  <Typography variant="h5" gutterBottom component="div" align={'left'} 
                              style={{...Config.Estilos.Tabla_titulo ? Config.Estilos.Tabla_titulo : {}}}
                  >
                  {Titulo}
                  </Typography>
              </Grid>
              <Grid item xs={6} align={'left'}>
                  {acciones? acciones : props.enformulario ? Seleccion  :null}
              </Grid>
              <Grid item xs={3}>
                  <Search style={{...Config.Estilos.Tabla_buscar_fondo ? Config.Estilos.Tabla_buscar_fondo : {}}}>
                  <SearchIconWrapper>
                      <SearchIcon sx={{...Config.Estilos.Tabla_buscar_icono ? Config.Estilos.Tabla_buscar_icono : {}}}/>
                  </SearchIconWrapper>
                  <StyledInputBase
                      placeholder="Búsqueda…"
                      inputprops={{ 'aria-label': 'search' }}
                      onChange={props.Buscar ? props.Buscar : (value)=>console.log('Buscar =>',value.target.value)}
                      style={{...Config.Estilos.Tabla_buscar_input ? Config.Estilos.Tabla_buscar_input : {}}}
                  />
                  </Search>
              </Grid>
              {acciones1 
                  ? <Grid item xs={12}>
                      {acciones1}
                  </Grid>
                  : null
              
              }
              <Grid item xs={12}>
                  {
                  // datos.length===0
                  //   ? <Typography variant="h6" gutterBottom component="div" align={'center'} 
                  //           style={{...Config.Estilos.Tabla_titulo ? Config.Estilos.Tabla_titulo : {}}}
                  //     >
                  //       Sin datos encontrados
                  //     </Typography>
                  //   : 
                  actualizando 
                      ? <Box sx={{ width: '100%' }}>
                          {/* <LinearProgressWithLabel value={progreso!==undefined ? progreso : 0} /> */}
                          <LinearProgress color="inherit"/>
                      </Box>
                      : null
                  }
              </Grid>
              </Grid>
          </AppBar>
          <Scrollbars sx={{height:heigth}}>
          <ConfigProvider
              theme={{
                  token:{
                      colorBgContainer:'#232323',
                      borderRadius:0,
                      colorText:'#fff',
                      colorSplit:'#000',
                      fontSize:16,
                      colorIcon:'#fff',
                      controlItemBgActive:'#f0f'
                  },
                  
                  components: {
                      Table:{
                          headerBg:'#000',
                          headerColor:'#fff',
                          borderColor:'transparent',
                          rowHoverBg:'#525252',
                          rowSelectedBg:'#f00'
                          // fixedHeaderSortActiveBg:'#f00'
                          
                      }
                  },
              }}
          >
              <Table
                bordered
                columns={columna}
                rowKey={(record)=>record._id}
                dataSource={ndatos}
                size="large"
                rowClassName={(record,index)=> index % 2=== 0 ? "par" : "impar"}
                scroll={{
                    x: `calc(${ancho}px + 10%)`,
                    // y: heigth,
                }}
                pagination={false}
                tableLayout='auto'
                onRow={(record, rowIndex) => {
                    
                    return {
                      onClick: (event) => Accion(record), // click row
                    //   onDoubleClick: (event) => {}, // double click row
                    //   onContextMenu: (event) => {}, // right button click row
                    //   onMouseEnter: (event) => {}, // mouse enter row
                    //   onMouseLeave: (event) => {}, // mouse leave row
                    };
                }}
                sticky={{
                    offsetHeader: 0,
                }}
              />
          </ConfigProvider>
          </Scrollbars>
          
          {props.sinpaginacion
  ? null 
  : paginacion && paginacion !== undefined && paginacion.paginas.length > 1 ?
    <div style={{padding:5, backgroundColor:'#000000', ...Config.Estilos.Tabla_titulos ? Config.Estilos.Tabla_titulos : {}}}>
      <Grid container spacing={0.5} justifyContent="center" alignItems="center">
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <div style={{textAlign:'center', display:'inline-flex'}}>
            <Pagination count={paginacion.paginas.length}
                        shape="rounded"
                        onChange={Cambio }
            />
          </div>
        </Grid>
        <Grid item xs={3}>
          {/* <Typography variant="subtitle1" gutterBottom component="div" align={'right'} 
                    style={{...Config.Estilos.Tabla_titulo ? Config.Estilos.Tabla_titulo : {}}}
          >
            {paginacion.total}
          </Typography> */}
        </Grid>
      </Grid>
      
    </div>:
    null
  
  // : <TablePagination
  //     rowsPerPageOptions={[10, 25, 50, 100]}
  //     component="div"
  //     count={datos.length}
  //     rowsPerPage={rowsPerPage}
  //     page={page}
  //     onPageChange={handleChangePage}
  //     onRowsPerPageChange={handleChangeRowsPerPage}
  //   />
}
      </Box>
    )
};
export default Tabla_A;