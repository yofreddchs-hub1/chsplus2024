import React, {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import {MenuItem, Grid} from '@mui/material';
// import clsx from 'clsx';
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import Autocomplete from './autocomplete';//'@mui/material/Autocomplete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DatePicker from "react-datepicker";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import QRCode from "react-qr-code";
// import { green, red, blueGrey } from '@material-ui/core/colors';
// import Scrollbars from './MyScrollbars';
import CircularProgress from '@mui/material/CircularProgress';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { green } from '@mui/material/colors';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Icon from '@mui/material/Icon';
import Alert from '@mui/material/Alert';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { LocalizationProvider } from '@mui/x-date-pickers'
import esLocale from 'date-fns/locale/es';
// import MobileDatePicker from '@mui/lab/MobileDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider, deDE  } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Lista from './lista';
import ListaRepresentados from './lista_representados';
import TipoJson from './tipojson';
// import moment from "moment";
import Video from './video';
import { Ver_Valores, Titulos_todos } from '../../constantes';
import Tabla from './tablaeditar';

// import { delete } from 'request-promise';
// import Lista from './lista';
// import Listavideo from './lista_video';

const Inputc = styled('div')(({ theme }) => ({
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
    width: '100%',
    
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
    //   [theme.breakpoints.up('md')]: {
    //     width: '20ch',
    //   },
    },
    '& .Mui-disabled':{
        backgrounColor:'#fff',
        color:'#fff'
    }
}));
//Estilo para Botones
const Botones_theme = createTheme({
  palette: {
    primary: {
      main:'#000',
    },
    secondary: {
        main: '#C80401',
        // dark: will be calculated from palette.secondary.main,
        contrastText: '#ffffff',
    },

  },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.

});

function Estilo (estilo){
  
    const useStyles = makeStyles((theme) => ({
      textField: {

        marginRight: theme.spacing(1),
        width: '100%',
        textAlign: 'left',
        ...estilo
      },   

    }))
    return useStyles()
 
  
}

const useStyles = makeStyles({
  root: {
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'center',
    marginTop:10,
    marginBottom: 7,//10,
    
    // height:window.innerHeight - theme.spacing(21),//window.innerHeight * 0.85,
    // overflow: 'auto',
    paddingLeft:20,
    // backgroundColor:'#000000'
    
  },
  textField: {

    marginRight: 10,
    width: '100%',
    textAlign: 'left',
    
  },
  item: {
    width: '99%',
    marginBottom:10,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent:'center',
    paddingRight:10,
  },
  selectEmpty: {
    marginTop: 20,
  },
  input: {
    display: 'none',
  },
  media:{
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'center',
    // width:'90%',
    marginLeft:10,
    marginTop: -10,

  },
  imagen: {
    objectFit: 'cover',
    width: '80%',
  },
  paper: {
    padding: 10,
    textAlign: 'center',
    // color: theme.palette.text.secondary,
  },
  large: {
    width: 200,
    height: 200,
  },
  avatar:{
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'center',
  },
  barra_botones:{
    marginTop:10,
    marginBottom:20,
    // color: theme.palette.text.secondary,
  },
  cont_imagen:{
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'center',

  },
  listados: {
    width: '100%',
    maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  button:{
    marginLeft:5,
    backgroundColor: (props)=> props.color ==='success' ?'#ffffff' :null
  },

});

const Entrada = (props)=>{
    const Config= props.config ? props.config : Ver_Valores().config;
    const estos = Object.keys(props).filter(f=> 
      ['helperText', 'margin', 'no_modificar','no_mostrar', 'Subtotal', 'getOptionLabel', 'getOptionSelected', 'agregar', 'comparar', 'InputProps'].indexOf(f)===-1)
    let permitidos={}
    
    estos.map(v=>{
        permitidos[v]=props[v]
        return v
    })
    permitidos.type= props.tipo==='number' ? 'number' : props.tipo==='Fecha' ? 'date': permitidos.type;
    permitidos.inputprops = props.InputProps;
  
    return(
        <div style={{alignItems: 'start',
            justifyContent: 'left',}}>
            <InputLabel style={{color:'#fff', textAlign:'left', ...Config.Estilos.Input_label ? Config.Estilos.Input_label : {}}}
            >
                {props.label}
            </InputLabel>
            <Inputc style={{...Config.Estilos.Input_fondo ? Config.Estilos.Input_fondo : {}}}>
                { props.icono
                    ?   <SearchIconWrapper>
                            <Icon sx={{...Config.Estilos.Input_icono ? Config.Estilos.Input_icono : {}}}>
                                {props.icono}
                            </Icon>
                        </SearchIconWrapper> 
                    :   null
                }   
                <StyledInputBase
                    {...permitidos}
                    title={props.title ? props.title : props.placeholder}
                    minRows={props.maxRows}
                    multiline={props.multiline}
                    disabled={false}
                    readOnly={props.disabled ? props.disabled : false}
                    style={{
                      marginLeft: props.icono ? `calc(1em + 40})` : -50 , 
                      ...Config.Estilos.Input_input 
                        ? props.disabled
                        ? Config.Estilos.Input_input_disabled 
                        : Config.Estilos.Input_input 
                        : {}
                    }}
                    endAdornment={props.tipo==='password' ?
                        props.endAdornment : null
                    }
                >
                    {props.lista 
                        ? props.lista.map((lis,i)=>
                            <MenuItem key={'lista-'+i+lis.titulo} value={lis._id}>
                                {lis.titulo}
                            </MenuItem>
                          )
                        : null
                    }
                </StyledInputBase>
                
            </Inputc>
            <InputLabel style={{fontSize:14, color:'#A00202', textAlign:'left', ...Config.Estilos.Input_helper ? Config.Estilos.Input_helper : {}}}
            >
                {props.helperText}
            </InputLabel>
        </div>
    )
}


// const Boton = styled(({ color, ...other }) => <Button {...other} />)({
//   background: (props) =>
//     props.color === 'success'
//       ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
//       : null,
//   marginLeft:5,
// });

const mas ={
    "backgroundColor": "rgba(0,0,0, 0.10)",
                    "color": "#ffffff",
                    "& .MuiInputLabel-formControl": {
                        "color": "rgba(216,55,0, 1)"
                    },
                    "& label.Mui-focused": {
                        "color": "rgba(216,55,0, 1)"
                    },
                    "& .MuiInput-underline:after": {
                        "borderBottomColor": "green",
                        "backgrounColor": "#ffffff"
                    },
                    "& .MuiOutlinedInput-root": {
                        "color": "#ffffff",
                        "& fieldset": {
                            "borderColor": "#000000"
                        },
                        "&:hover fieldset": {
                            "borderColor": "rgba(46,7,253,1)"
                        },
                        "&.Mui-focused fieldset": {
                            "borderColor": "green"
                        }
                    }
}
export default function Page(props) {
  const Config= props.config ? props.config : Ver_Valores().config;
  const classes = useStyles();
  let values = {
  };
  let form =[]
  let {datos, http_server} = props;
  const [showPassword,setShowPassword]= React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const Form = (lista) =>{
    let resultados = {...values.resultados};
    const listado= Object.keys(lista).map(valor =>{
        resultados[valor]=resultados[valor] ? resultados[valor] : '';
        return lista[valor].multiples ? {
            multiples:true,
            lista:Form(lista[valor].value)
        }:{
          ...lista[valor],
          id: "filled-"+valor,
          key: "filled-"+valor,
          name: valor,
          value: values.resultados[valor]!==null && values.resultados[valor]!==undefined ? values.resultados[valor]: '',
          label: lista[valor].label,
          type: lista[valor].type,
          lista:lista[valor].lista,
          required:Boolean(lista[valor].required),
          onChange: values.Cambio,
          error:values.resultados['Error-'+valor] !== '' ? true : false,
          helperText:values.resultados['Error-'+valor],
          // rowsMax: lista[valor].row,
        }

      })
    return listado;
  }

  const Imagen = (valor, values) =>{
    let imagen=true;
    if (values.resultados[valor.name]){
      if (values.resultados[valor.name][0].type){
        imagen= values.resultados[valor.name][0].type.indexOf('image')!==-1
        
      }else{
        imagen = ['png', 'jpg', 'jpeg', 'ico'].indexOf(values.resultados[valor.name].split('.').pop())!==-1
      }
    }
    return imagen ? (
      <img alt={valor.label ? valor.label : 'Imagen'}
            src={values.resultados[valor.name+'_url'] ?
                  String(values.resultados[valor.name+'_url']) :
                  values.resultados[valor.name] === '' ? null :
                  `${values.resultados[valor.name]}`
            }
            className={classes.imagen}
      />
    ): (
      <video alt={valor.label ? valor.label : 'Video'}
              src={values.resultados[valor.name+'_url'] ?
                  String(values.resultados[valor.name+'_url']) :
                  values.resultados[valor.name] === '' ? null :
                  `${values.resultados[valor.name]}`
              }
              className={classes.imagen}
              autoPlay
              loop
      />
    )
  }

  const renderForm =(valor)=>{
    let valorEstilo
    try{
     valorEstilo = valor.style ? Estilo(valor.style).textField : classes.textField;
     valorEstilo =Estilo(mas).textField
    }catch (e){
      valorEstilo = classes.textField;
    }
    
    return valor.multiples ? (
      <Grid container spacing={1} key={valor.lista[0]+'G'}>
        {valor.lista.map((lis,it) =>
          <Grid item xs key={'GI-'+it}>
            {renderForm(lis)}
          </Grid>
        )}
      </Grid>
    ): ['avatar', 'Avatar'].indexOf(valor.tipo)!==-1 ?(
        <div key={'avatar-'+valor.name} className={classes.avatar}>
          <input accept="image/*"
                 className={classes.input}
                 id={"icon-button-avatar-"+valor.name}
                 type="file"
                 onChange={values.Cambio_A}
                 name={valor.name}
                 key={'avatar-i-'+valor.name}
          />
          <label key={'avatar-l-'+valor.name} htmlFor={"icon-button-avatar-"+valor.name}>
            <IconButton key={'avatar-b-'+valor.name} color="primary" aria-label="upload picture" component="span">
              <Avatar alt={valor.label}
                      src={values.resultados[valor.name+'_url'] ?
                           String(values.resultados[valor.name+'_url']) :
                           values.resultados[valor.name] === '' ? null :
                           `${values.resultados[valor.name]}`
                      }
                      className={classes.large}
                      key={'avatar-a-'+valor.name}
              />
            </IconButton>
          </label>
        </div>
    ): ['imagen','Imagen','Camara'].indexOf(valor.tipo)!==-1 ?(
      <div key={'imagen-'+valor.name} className={classes.cont_imagen}>
        
        <InputLabel style={{color:'#fff', ...Config.Estilos.Input_label ? Config.Estilos.Input_label : {},  textAlign:'rigth'}}
        >
            {valor.placeholder}
        </InputLabel>
        
        <input accept=".png, .jpg, .jpeg, .ico, .mp4"
               className={classes.input}
               id={"icon-button-imagen-"+valor.name}
               type="file"
               onChange={values.Cambio_A}
               name={valor.name}
               key={'imagen-i-'+valor.name}
               title={valor.label}
        />
        <label key={'imagen-l-'+valor.name} htmlFor={"icon-button-imagen-"+valor.name}>
          <ButtonBase
            focusRipple
            key={'imagen-b-'+valor.name}
            color="primary"
            focusVisibleClassName={classes.focusVisible}
            component="span"
          >

            { values.resultados[valor.name] !== '' || values.resultados[valor.name+'_url'] ?
              Imagen(valor,values):
              <PhotoCamera color="primary" sx={{...Config.Estilos.Input_icono ? Config.Estilos.Input_icono : {}}}/>
            }
          </ButtonBase>
        </label>
      </div>
    ): valor.tipo==='video' ? (
      <Video values={values} valor={valor} http_server={http_server}/>
    ): ['select', 'Lista'].indexOf(valor.tipo)!==-1 ? (
      <div>
        <div style={{ display: 'flex', flexDirection:'row'}}>
          <Autocomplete valor={valor} values={values} Config={Config}/>
          {valor.agregar 
            ? <IconButton title='Agregar sub-titulo'      
                style={{ marginLeft:10}}
                onClick={()=>values.Mas(valor)}
                key={'buton-aceptar-'+valor.name}
              >
                <AddCircleIcon key={'icon-aceptar-'+valor.name} style={{ color: green[500] }} fontSize="large"/>
              </IconButton>
            : null
          }
        </div>
        {valor.error && valor.helperText &&(valor.value=== undefined || valor.value==='' || valor.value===null)
          ? <div style={{paddingLeft:20, marginTop:-5, textAlign:'justify'}}> 
              <label style={{color:'red', fontSize: 12}}>{valor.helperText ? valor.helperText : 'Debe indicar datos'}</label>
            </div>
          : null
        }
      </div>
    ): valor.tipo==='lista' ? (
      <Lista key={'Listados-'+valor.name} valor={valor} cambio={values.Cambio} config={Config}/>

    ): valor.tipo==='lista_representados' ? (
      <ListaRepresentados key={'Listados-'+valor.name} valor={valor} cambio={values.Cambio} Config={Config}/>
      
    ): valor.tipo==='password' ? (
      <Entrada
       {...valor}
       config={Config}
       name={valor.name}
       type={showPassword ? 'text' : 'password'}
       onKeyPress={
          valor.onKeyPress ? 
          (event) =>{
            if (event.key==='Enter')
              values.Responder(valor.onKeyPress,values.resultados, valor.validar, valor.pos ? valor.pos : 0)
          } : null 
        }
       onChange={values.Cambio}
       style= {{ margin: 8}}
       variant="outlined"
       margin="normal"
       fullWidth
       className={valorEstilo}
       color={'primary'}
    
      endAdornment={
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ marginRight:-3}}
              >
                {showPassword 
                  ? <Visibility sx={{...Config.Estilos.Input_icono ? Config.Estilos.Input_icono : {}}}/> 
                  : <VisibilityOff sx={{...Config.Estilos.Input_icono ? Config.Estilos.Input_icono : {}}}/>}
              </IconButton>
      }
    />
    ): valor.tipo==='time' ? (
      <DatePicker
        {...valor}
        name={valor.name}
        className={classes.textField}
        selected={valor.value}
        onChange={date => values.Cambio({target:{name:valor.name, value:date}})}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="h:mm aa"
        
      />
    ) : valor.tipo==='Checkbox' ? (
      <FormControlLabel
        disabled={valor.disabled}
        sx={{color:Config ? Config.Estilos.Input_label.color : '#fff', '.MuiFormControlLabel-label':{color:Config ? Config.Estilos.Input_label.color : '#fff'}}}
        control={
          <Checkbox
            checked={['true',true].indexOf(valor.value)!==-1 ? true : false}
            onChange={(event) => values.Cambio({target:{name:valor.name, value:event.target.checked}})}
            inputprops={{ 'aria-label': 'primary checkbox' }}
            name={valor.name}
            sx={{
              color: Config ? Config.Estilos.Input_label.color : '#fff',
              '&.Mui-checked': {
                color: Config ? Config.Estilos.Input_label.color : '#fff',
              },
            }}
          />}
        label={['true',true].indexOf(valor.value)!==-1 ? valor.label.split('/')[0] : valor.label.split('/')[1]}
      />
      
    ):valor.tipo==='Json'? (
      <TipoJson {...{valor,values, config:Config }}/>
    ):valor.tipo==='Tabla'? (
      <Tabla  Titulo={valor.label}
              Config={Config}
              nopaginar={valor.nopaginar}
              editables={valor.editables}
              noeliminar={valor.noeliminar}
              agregartodos = {valor.agregartodos}
              style={valor.style}
              titulos={Titulos_todos(valor.titulos)}
              table={valor.tabla}
              cantidad={ valor.value ? valor.value.length : 0 }
              cargacompleta={null}
              datos={values.resultados[valor.name]}
              externos = {values.resultados}
              Accion={null}
              cargaporparte={ null }
              acciones={null}
              acciones1={null}
              sinpaginacion={true}
              name={valor.name}
              Cambio={values.Cambio}
              Subtotalvalor={valor.Subtotalvalor ? valor.Subtotalvalor : values.resultados[valor.name+'-subtotal']}
              Subtotal={valor.Subtotal}
              enformulario={{
                ...valor,
                onChange:(dato)=> {
                  const {name,resultados}=dato
                  if (valor.funcion){
                    const f= eval(valor.funcion)
                    resultados[name]=f(values.resultados, resultados[name])
                  }
                  let d= values.resultados[valor.name] 
                    ? [...values.resultados[valor.name],... resultados[name].length ? resultados[name] : [{...resultados[name], id:values.resultados[valor.name].length}]] 
                    : resultados[name].length 
                      ? resultados[name] 
                      : [{...resultados[name],id:0}];
                  d = d.map((v,i)=>{
                    return {...v, id:i}
                  })
                  // console.log( values.resultados[valor.name] ,d);
                  values.Cambio({target:{name:valor.name, value:d}})
                }
              }}
      />
    ): valor.tipo==='Fecha' ? (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'} 
          localeText={esLocale}
      >
        <MobileDatePicker
          {...valor}
          label={valor.label}
          value={valor.value}
          className={valorEstilo}
          onChange={(newValue) => {
            values.Cambio({target:{name:valor.name, value:newValue['$d']}});
          }}
          renderInput={(params) => <Entrada {...params} tipo={valor.value ? '' : 'Fecha'} config={Config}/>}
        />
      </LocalizationProvider>
      
    ): ['Qrimagen','QRimagen'].indexOf(valor.tipo)!==-1 ? (
      <QRCode value={valor.value ? valor.value : 'CHS hola'} />
    ):(
        // <TextField
        //   {...valor}
          
        //   minRows={valor.maxRows}
        //   multiline={valor.multiline}
        //   variant="outlined"
        //   margin="normal"
        //   fullWidth
        //   className={valorEstilo}
        //   style= {{margin:8, backgroundColor:'#000'}}
        // >
        // {valor.lista ? valor.lista.map((lis,i)=>
        //   <MenuItem key={'lista-'+i+lis.titulo} value={lis._id}>
        //     {lis.titulo}
        //   </MenuItem>

        // ):null}
        // </TextField>
        <Entrada {...valor} config={Config}/>
    )

  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const Inicio = ()=>{
    values = datos ? {...values,...datos}: values;

    form = values.form ? Form(values.form): [];
  }
  // useEffect(()=>{
  //   Inicio();
  // },[datos])
  Inicio()

  return form.length===0 && !values.botones ? (
    <div className={[classes.root, classes.item]}>
      <Skeleton />
      <Skeleton animation={false} />
      <Skeleton animation="wave" />
    </div>
  ) :(
    
    <div className={classes.root} style={datos.estilospage ? datos.estilospage : {}} key={'formt'}>
      {/* <Scrollbars autoHide maxHeight={window.innerHeight * 0.95}> */}
      <div style={{height:'100%', overflowY:'hidden', overflowX:'hidden', paddingRight:0}}>
      {form.map((valor,i) =>
        <div key= {'div'+i} className={classes.item}>
          {renderForm(valor)}
        </div>
      )}
      {props.datos.Agregar 
          ? <div>
              <IconButton
                className={classes.margin}
                onClick={props.datos.Agregar_formulario}
                          
             >
               <AddCircleIcon color="secondary" style={{color:'green'}}/>
             </IconButton>
             <IconButton
                className={classes.margin}
                onClick={props.datos.Remover_formulario}
                          
             >
               <RemoveCircleIcon style={{color:'red'}}/>
             </IconButton>
            </div>
          : null
      }
      <div className={classes.item}>
        {props.datos.Mensaje.tipo && props.datos.Mensaje
          ? props.datos.Mensaje.tipo==='Error' || props.datos.Mensaje.tipo==='Error_c' 
          ? <Alert severity="error" >{props.datos.Mensaje.mensaje ? props.datos.Mensaje.mensaje : props.datos.Mensaje.Mensaje}</Alert>
          : <Alert severity="success">Proceso realizado con exito</Alert>
          : null
        }
      </div>
      {values.botones ? (
        <div className={classes.barra_botones}>
          {values.botones.map((boton,i)=>{
            // const validar= boton.validar;
            // delete boton.validar
            return (<ThemeProvider theme={Botones_theme} key={boton.name}>
                      <Button
                        {...boton}
                        key={'boton-'+ boton.name}
                        className={classes.button}
                        disabled={boton.disabled || Boolean(boton.esperar)}
                        startIcon={Boolean(boton.esperar) ? 
                          <CircularProgress  size={20}
                            thickness={5}
                          /> : typeof boton.icono ==='string' 
                             ?  <Icon>{boton.icono}</Icon>
                             : boton.icono
                          
                        }
                        onClick={Boolean(boton.esperar) 
                          ? null 
                          : boton.confirmar
                          ? handleClick
                          : ()=>values.Responder(boton.onClick, values.resultados, boton.validar, i)
                        }
                      >
                        {Boolean(boton.esperar) ? Boolean(boton.mesperar) ? Boolean(boton.mesperar) : 'Enviando...' : boton.label}
                      </Button>
                      {boton.confirmar 
                        ?
                          <Popover
                            key={'popover-'+ boton.name}
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                          >
                            <Typography sx={{ p: 2 }}>
                              {boton.confirmar_mensaje && boton.confirmar_campo
                                ? `${boton.confirmar_mensaje} "${values.resultados[boton.confirmar_campo] 
                                                                  ? values.resultados[boton.confirmar_campo].value
                                                                  ? values.resultados[boton.confirmar_campo].value
                                                                  : values.resultados[boton.confirmar_campo].titulo
                                                                  ? values.resultados[boton.confirmar_campo].titulo
                                                                  : values.resultados[boton.confirmar_campo] 
                                                                  : ''
                                                                }" ?`
                                : boton.confirmar_mensaje
                                  ? `${boton.confirmar_mensaje}`
                                  : `Confirma operación?`
                              }
                            </Typography>
                            <ButtonGroup 
                                variant="contained" 
                                aria-label="outlined primary button group"
                                sx={{paddingX:10, paddingBottom:1}}
                            >
                              <Button 
                                onClick={()=>{
                                  values.Responder(boton.onClick, values.resultados, boton.validar, i);
                                  handleClose()
                                }}
                              >
                                Si
                              </Button>
                              <Button onClick={handleClose} >No</Button>
                            </ButtonGroup>
                          </Popover>
                        : null
                      }
                    </ThemeProvider>
                    )
            }
          )}

        </div>
        ): null
      }
      </div>
    </div>
    
  );
}
