import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// import { fade, makeStyles, withStyles } from '@mui/material/styles';
import { withStyles } from '@mui/material/styles';


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

// const useStyles = makeStyles((theme) =>({
//   root: {
//     minWidth: 275,
//     margin:theme.spacing(2)
//   },
//   title: {
//     fontSize: 24,
//   },
//   pos: {
//     marginBottom: 12,
//   },
//   titulos:{
//     fontColor:'#ffffff',
//     backgroundColor:'#000000'
//   },
//   search: {
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     marginRight: 0,
//     marginLeft:theme.spacing(1),
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//       marginLeft: theme.spacing(3),
//       width: 'auto',
//     },
//   },
//   searchIcon: {
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   inputRoot: {
//     color: 'inherit',
//   },
//   inputInput: {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '20ch',
//     },
//     backgroundColor: fade(theme.palette.common.black, 0.35),
//     '&:hover': {
//       backgroundColor: fade(theme.palette.common.black, 0.25),
//     },
//     borderRadius: theme.shape.borderRadius,
//   },
//   container: {
//     height:window.innerHeight* 0.50,
//     maxHeight: 440,
//   },
//   Paginacion:{
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   }
// }));

function Tabla (props) {
  // const classes = useStyles();
  const {titulos, datos}= props;
  const alto=window.innerHeight* 0.35;

  const valor_lista = (lista,valor) =>{
    let resultado=lista.filter(lis => String(lis._id)===String(valor));
    // console.log(resultado);
    return resultado[0];
  }
  
  return (
    <div>
        <TableContainer component={Paper} style={{height:alto}}>
          <Table  stickyHeader aria-label="sticky table">
            <TableHead >
              <TableRow >
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
                >
                  {titulos.map(campo=>
                    <StyledTableCell
                                key={'col-'+i+campo.field}
                                
                    >
                      { 
                        campo.tipo===undefined ?
                        data[campo.field]:
                        campo.tipo==='lista' ?
                        valor_lista(campo.lista,data[campo.field]).titulo:            
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
