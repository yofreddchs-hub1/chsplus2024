import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {General} from './items';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height:window.innerHeight * 0.76,

}));

const Titulo =  styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    width:'100%',
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    ...global.estilos.Barra_menu ? global.estilos.Barra_menu : {},
}));

const Cell =  styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
  textAlign: 'center',
  width:'100%',
  cursor:'pointer',
}));

export default function Page(props) {
  const [select,setSelect] = React.useState(null)
  const [enviando,setEnviando] = React.useState(false)
  global.estilos = props.Config ? props.Config.Estilos : {};
  let  Grupos = props.Grupos ? props.Grupos : {};
  const Entro = (index) =>(e)=>{
    e.preventDefault()
  }
  const Salio = (index) =>(e)=>{
    e.preventDefault()
  }
  const Comienza = (index)=>(e) =>{
    setSelect(index)
  }
  const Soltado = (index)=>(e) =>{
    setSelect(null)
  }
  const Dentro = (indice)=>{
    let Ngrupos = {...Grupos}
    if (indice!== select.grupo){
      // console.log(select, indice);
      Ngrupos[select.grupo].Datos = Ngrupos[select.grupo].Datos.filter((f,i)=> i!==select.pos)
      Ngrupos[indice].Datos = [...Ngrupos[indice].Datos, select.datos]
      
      props.Actualizar(Ngrupos)
      
    } 
  
  }
  const Enviar= async()=>{
    setEnviando(true);
    await props.Enviar(Grupos);
    setEnviando(false);

  }
  const Modificar = (e) =>{
    const {name, value}=e.target;
    let valores = name.split('-');
    Grupos[valores[0]].Datos[valores[1]][valores[2]]= value;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {Object.keys(Grupos).map((grupo, i)=>{
          const val = Grupos[grupo];
          return(
            <Grid key={grupo} xs={val.Espacio ? val.Espacio : 1}>
              {val.Item 
                ? val.Item({grupo, val, Entro, Salio, Dentro, Comienza, Soltado, Modificar, Config: props.Config ? props.Config : {}})
                : <General {...{grupo, val, Entro, Salio, Dentro, Comienza, Soltado, Modificar, Config: props.Config ? props.Config : {}}} />
              }
              
            </Grid>
          )
        })}
        
        
      </Grid>

      <div style={{marginTop:10}} />
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button variant="contained" onClick={Enviar} 
                sx={{...props.Config ? props.Config.Estilos.Botones.Aceptar : {}, color:'#fff'}}
                title={'Guarda cambios'}
                disabled={enviando} 
        >
            Guardar
        </Button>
        {props.props.Eliminar 
        
          ? props.props.Eliminar
          : null
        }
      </Stack>
    </Box>
  );
}