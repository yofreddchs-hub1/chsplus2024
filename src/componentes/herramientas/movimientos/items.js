import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Scrollbars from '../scrolbars';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import MensajeTool from '../mensaje';
import Logo from '../../../imagenes/trompo.png';

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

const Cell =  styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5),
  textAlign: 'center',
  width:'100%',
  cursor:'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  marginTop:1,
  marginBottom:1.5,
  borderRadius:10
}));

export const General = ({grupo, val, Entro, Salio, Dentro, Comienza, Soltado, Config}) =>{

    return(
        <Item sx={{...val.Style ? val.Style : {}}}>
            <Titulo>
                <Typography variant="h6">{val.Titulo ? val.Titulo : `Titulo Grupo ${grupo}`}</Typography>
            </Titulo>
            <Scrollbars sx={{flexGrow: 1, height: val.Style && val.Style.height ? val.Style.height - 65 :'90.5%',...Config ? Config.Estilos.Dialogo_cuerpo : {}}}>
                <div  onDragOver={Entro(grupo)}
                    onDragLeave={Salio(grupo)}
                    onDrop={()=>Dentro(grupo)}
                    style={{height:'100%'}} 
                >
                
                    {val.Datos.map((val,i)=>{
                        return (
                        <Cell key={val.label} sx={{width:'100%'}}
                                elevation={6}
                                draggable={true}
                                onDragStart={Comienza({datos:{...val}, grupo, pos:i})}
                                onDragEnd={Soltado(val)} 
                        >
                            <Typography variant="h6">{val.label}</Typography>
                        </Cell>
                        )
                    })}
                </div>
            </Scrollbars>
        </Item>
    )
}

export const ItemMP = ({grupo, val, Entro, Salio, Dentro, Comienza, Soltado, Config}) =>{
    const alto = val.Alto ? val.Alto : val.Style && val.Style.height ? val.Style.height - 65 :'90.5%';
    
    return(
        <Item sx={{height: 'auto'}}>
            <Titulo>
                <Typography variant="h6">{val.Titulo ? val.Titulo : `Titulo Grupo ${grupo}`}</Typography>
            </Titulo>
            <Scrollbars sx={{flexGrow: 1, padding:0.5, height: alto,...Config ? Config.Estilos.Dialogo_cuerpo : {}}}>
                <div  onDragOver={Entro(grupo)}
                    onDragLeave={Salio(grupo)}
                    onDrop={()=>Dentro(grupo)}
                    style={{height:'100%'}} 
                >
                    {val.Datos.map((val,i)=>{
                        return (
                        <Cell key={val.label} sx={{width:'100%', textAlign: 'left', paddingLeft:2, paddingRight:2}}
                                elevation={6}
                                draggable={true}
                                onDragStart={Comienza({datos:{...val}, grupo, pos:i})}
                                onDragEnd={Soltado(val)} 
                        >
                            <MensajeTool
                                title={
                                    <React.Fragment>
                                        <Typography color="inherit">{val.label}</Typography>
                                    </React.Fragment>
                                }
                            >
                                <Typography noWrap variant="h6">{val.label}</Typography>
                            </MensajeTool>
                        </Cell>
                        )
                    })}
                </div>
            </Scrollbars>
        </Item>
    )

}

export const ItemFormula = ({grupo, val, Entro, Salio, Dentro, Comienza, Soltado, Modificar, Config}) =>{
    const altoi = val.Style && val.Style.height ? val.Style.height *0.25 : window.innerHeight * 0.20;
    const alto = val.Alto ? val.Alto : val.Style && val.Style.height ? val.Style.height - val.Style.height *0.45 :'90.5%';
    
    return(
        <Item sx={{height: 'auto'}}>
            <img
                src={ Logo}
                alt={'Trompo'}
                loading="lazy"
                style={{height:altoi}}
            />
            <Titulo>
                <Typography variant="h6">{val.Titulo ? val.Titulo : `Titulo Grupo ${grupo}`}</Typography>
            </Titulo>
            <Scrollbars sx={{flexGrow: 1, padding:0.5, height: alto,...Config ? Config.Estilos.Dialogo_cuerpo : {}}}>
                <div  onDragOver={Entro(grupo)}
                    onDragLeave={Salio(grupo)}
                    onDrop={()=>Dentro(grupo)}
                    style={{height:'100%'}} 
                >
                    {val.Datos.map((valor,i)=>{
                        return (
                            <Cell key={valor.label} sx={{width:'100%', textAlign: 'left', paddingLeft:2,  paddingRight:2}}
                                    elevation={6}
                                    draggable={true}
                                    onDragStart={Comienza({datos:{...valor}, grupo, pos:i})}
                                    onDragEnd={Soltado(valor)} 
                            >
                                <MensajeTool
                                    title={
                                        <React.Fragment>
                                            <Typography color="inherit">{valor.label}</Typography>
                                        </React.Fragment>
                                    }
                                >
                                    <Grid container spacing={1}>
                                        <Grid item xs={10}>
                                            <Box >
                                                <Typography noWrap variant="h6">{valor.label}</Typography>
                                            </Box>    
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Box >
                                                <TextField
                                                    id="standard-number"
                                                    name ={`${grupo}-${i}-cantidad`}
                                                    type="number"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <Typography variant="caption" sx={{marginLeft:1}}>{valor.unidad ? valor.unidad.value : 'Und'}</Typography>
                                                        ),
                                                      }}
                                                    variant="standard"
                                                    onChange={Modificar}
                                                    defaultValue ={valor.cantidad}
                                                />
                                            </Box>    
                                        </Grid>
                                    </Grid>
                                </MensajeTool>
                            </Cell>
                        )
                    })}
                </div>
            </Scrollbars>
        </Item>
    )

}