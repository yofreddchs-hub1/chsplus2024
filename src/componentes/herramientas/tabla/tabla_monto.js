import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {formatoBolivar, formatoDolar} from '../../procesos/servicios';

import { fade, makeStyles, withStyles } from '@mui/material/styles';



///Tabla simple solo informacion 
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
  
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    cursor:'pointer'
  },
}))(TableRow);

const useStyles = makeStyles((theme) =>({
  root: {
    minWidth: 275,
    margin:theme.spacing(2)
  },
  title: {
    fontSize: 24,
  },
  pos: {
    marginBottom: 12,
  },
  titulos:{
    fontColor:'#ffffff',
    backgroundColor:'#000000'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginRight: 0,
    marginLeft:theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    backgroundColor: fade(theme.palette.common.black, 0.35),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
  },
  container: {
    height:window.innerHeight* 0.50,
    maxHeight: 440,
  },
  Paginacion:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagen:{
    objectFit: 'cover',
    width: '80%',
  },
}));

function Tabla (props) {
  const classes = useStyles();
  const {titulos, datos, Accion}= props;
  const alto=window.innerHeight* 0.40;

  const valor_lista = (lista,valor) =>{
    let resultado=lista.filter(lis => String(lis._id)===String(valor));
    if (resultado.length===0){
      resultado=[{
        titulo:'No aplica',
      }]
    }
    return resultado[0];
  }

  const Imagen = (pos,campo,dato) =>{
    if (!dato[campo+'_'+pos+'_url'] ){
      return ''
    }
    return( 
      <img alt={campo+'_'+pos+'_url'}
                      src={String(dato[campo+'_'+pos+'_url']) }
            className={classes.imagen}           
      />
    )
  }
  const Imagenweb = (pos,campo,dato) =>{
    
    return( 
      <img alt={'capture'}
            src={`${dato[pos]}` }
           style={{objectFit: 'cover',
           width: '80%',}}           
      />
    )
  }

  const Objetos = (dato) =>{
    const result= dato && dato.titulo!==undefined ? dato.titulo : '';
    return result
  }

  return (
    <div>
        <TableContainer component={Paper} style={{height:alto}}>
          <Table  stickyHeader aria-label="sticky table">
            <TableHead >
              <TableRow >
                <StyledTableCell align="center">ID</StyledTableCell>
                {titulos && titulos !== undefined ? titulos.map(valor=>
                  <StyledTableCell  key={'title-'+valor.field}
                              align="center"
                              
                  >
                    {valor.title}
                  </StyledTableCell>

                ):null}

              </TableRow>
            </TableHead>
            <TableBody>
              {datos.length!==0 ? datos.map((data,i) => (
                <StyledTableRow key={'data-'+i}
                                hover role="checkbox"
                                onClick={Accion ? ()=>Accion(data): null}
                >
                    <StyledTableCell key={'id-'+i} align='center'>{i+1}</StyledTableCell>
                  {titulos.map(campo=>
                    <StyledTableCell
                                key={'col-'+i+campo.field}
                                align={campo.align}
                                
                    >
                      { 
                        campo.tipo===undefined ?
                        data[campo.field]:
                        campo.tipo==='lista' ?
                        valor_lista(campo.lista,data[campo.field]).titulo:            
                        campo.tipo==='object' ?
                        Objetos(data[campo.field]) : 
                        campo.tipo==='moneda-bolivar' ?  
                        formatoBolivar.format(data[campo.field]):
                        campo.tipo==='moneda-dolar' ?
                        formatoDolar.format(data[campo.field]):
                        campo.tipo==='imagen' ?
                        Imagen(i,campo.field,data):
                        campo.tipo==='imagen-web' ?
                        Imagenweb(i,campo.field,campo.datos):
                        campo.tipo
                      }
                    </StyledTableCell>
                  )}

                </StyledTableRow>
              )):null}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
  )
}

export default Tabla;
