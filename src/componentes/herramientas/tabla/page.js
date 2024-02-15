import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import {Form_todos, genera_formulario, Generar_id, Moneda} from '../../../constantes';
import Formulario from '../formulario';
import Sindatos from '../pantallas/sindatos';
import moment from 'moment';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" color="success" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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


export default function Tabla(props) {
  
  const {titulos, datos, Config, Titulo, acciones, acciones1, actualizando, Accion, paginacion, Cambio} = props;//progreso,
  // const alto= props.sinpaginacion ? window.innerHeight* 0.77 : window.innerHeight* 0.73;
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const [Seleccion, setSeleccion] = React.useState(null);
  const seleccion = async()=>{
    let nuevos = await genera_formulario({valores:{}, campos: Form_todos(`${props.enformulario.Form}`) })
    
    nuevos.titulos.select_a.onChange=props.enformulario.onChange
    let formulario ={
      ...nuevos,
    }
    setSeleccion(
      <div style={{marginTop:-45, marginBottom:-50}}>
        <Formulario {...formulario}/>
      </div>
    )
  }
  if (props.enformulario && Seleccion===null){
    seleccion()
  }
  
  const colorlocal = Config.Estilos && Config.Estilos.Tabla_row_colorlocal ? Config.Estilos.Tabla_row_colorlocal.backgroundColor : '#F8AE1A';
  return (
    <Paper sx={{ width: '100%', height:'100%' }}>
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
      <TableContainer sx={{ 
            height: props.alto ? props.alto :
                    paginacion && paginacion !== undefined && paginacion.paginas.length > 1 
                    ? '80%' 
                    : actualizando ? '87.5%' : '88%', 
                    overflow: 'auto auto',
            '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: 8,
                border: '2px solid',
                // borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                backgroundColor: 'rgba(0 0 0 / 0.5)',
            },}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>       
            <TableRow>
              {titulos 
                ? titulos.map((column,i) => {
                  let ncolumn={}
                  Object.keys(column).map(v=>{
                    if (['formato'].indexOf(v)===-1){
                      ncolumn[v]=column[v];
                    }
                    return v
                  })
                  return(
                    <TableCell
                      {...ncolumn}
                      key={column.title}
                      align={column.align ? column.align : "center"}
                      style={{ minWidth: column.minWidth, fontSize:16, fontWeight:'bold',
                                ...Config.Estilos.Tabla_titulos ? Config.Estilos.Tabla_titulos : {}, 
                            }}
                      
                    >
                      {column.title}
                    </TableCell>
                  )})
                : null
              }
              
            </TableRow>
          </TableHead>
          {datos.length===0
            ? null
            :  <TableBody >
                {datos
                  .map((row, j) => {
                    return (
                      <StyledTableRow 
                            hover role="checkbox" 
                            tabIndex={-1} 
                            key={row._id ? row._id : Generar_id(j)} 
                            onClick={()=>Accion(row)}
                            sx={(theme)=>({
                              ...!row.local
                              ?
                                { '&:nth-of-type(odd)': {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                }
                              :{},
                              bgcolor:row.local ? colorlocal :'',
                            })}
                            title={row.local? 'Esta data no a sido actualizado en el servidor': ''}
                      >
                        {titulos.map((column,i) => {
                          const value = row[column.field];
                          return (
                            <StyledTableCell key={column.field+i+j} align={column.align ? column.align : column.type==='number' ? 'right' : 'left'} {...column.props ? column.props : {}} 
                              sx={i===0 ? {position:'relative'} : {}}
                            >
                              {column.tipo && column.tipo==='monto' 
                                ? <div style={{textAlign:'right'}}>
                                    {Moneda(column.formato ? column.formato(row): value, column.moneda ? column.moneda : 'Bs', true)}
                                  </div>
                                : column.format && typeof value === 'number'
                                ? column.format(value)
                                : column.tipo && column.tipo==='foto'
                                  ? <div style={{display:'flex', justifyContent:'center', justifyItems:'center',alignItems:'center',}}>
                                      <Avatar
                                        alt={column.field}
                                        src={column.formato ? column.formato(row) : value}
                                        sx={{ width: 56, height: 56 }}
                                      />
                                    </div>
                                  : column.tipo && column.tipo==='imagen'
                                    ? <div style={{display:'flex', justifyContent:'center', justifyItems:'center',alignItems:'center',}}>
                                        <img
                                          alt={column.field}
                                          src={column.formato ? `${column.formato(row)}?w=248&fit=crop&auto=format` : `${value}?w=48&fit=crop&auto=format`}
                                          srcSet={column.formato ? `${column.formato(row)}?w=248&fit=crop&auto=format` : `${value}?w=48&fit=crop&auto=format&dpr=1 1x`}
                                          loading="lazy"
                                          style={{ width: 66 }}
                                        />
                                      </div>
                                    : column.tipo && column.tipo==='representados' && typeof column.formato(row) ==='object'
                                      ? <div style={{ }}>
                                          {column.formato(row).map(val=>
                                            <Typography key={val.cedula} variant="body1" gutterBottom>
                                            {val.cedula + ' ' + val.nombres + ' ' + val.apellidos}
                                            </Typography>  
                                            
                                          )}
                                        </div>
                                      : column.tipo && column.tipo==='fecha' && column.formato
                                        ? moment(column.formato(row)).format('DD/MM/YYYY')
                                        : column.formato
                                          ? typeof column.formato(row)==='object' && !column.tipo
                                            ? String(column.formato(row))
                                            : column.formato(row)
                                          : value
                                }
                            </StyledTableCell>
                          );
                        })}
                      </StyledTableRow>
                    );
                  })}
               </TableBody>
          }
        </Table>
        {actualizando 
          ? <Box sx={{ width: '100%' }}>
              <LinearProgress color="inherit"/>
            </Box>
          : datos.length===0
          ? <Sindatos />
          : null
        }
      </TableContainer>
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
    </Paper>
  );
}
