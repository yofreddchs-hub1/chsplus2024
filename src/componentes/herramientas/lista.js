import React, {Fragment} from 'react';
import { makeStyles } from '@mui/styles';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LensIcon from '@mui/icons-material/Lens';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { green } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import VideoCallIcon from '@material-ui/icons/VideoCall';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  botoness:{
    float:'right',
  },
  input: {
    display: 'none',
  },
}));

export default function Lista(props) {
  const classes = useStyles();
  const {valor, cambio, abierto, subtitulo, alto}=props;
  console.log('.............',props.Config);
  const altol= alto ? alto : window.innerHeight* 0.85;
  let mostrar={};
  let agregar={};
  Object.keys(valor.value).map(val=>{
    mostrar[val]=abierto;
    agregar[val]=false;
    return val;
  });

  // const [valor_original,setValororiginal]=React.useState(valor.value);
  const [open, setOpen] = React.useState(mostrar);
  const [mas, setMas] = React.useState(agregar);
  // console.log(',,,,,,,,,,,',open);
  // const [lista, setLista] = React.useState(valor.value);
  const lista = valor.value;
  const [agregarsub, setAgregarsub] = React.useState(false);
  const [seleccion, setSeleccion] = React.useState(['null','null']);

  // const cancelartodoClik = () => {
    // setOpen(mostrar);
    // setMas(agregar);
    // console.log(valor_original);
    // setLista(valor_original);
  // };

  const handleClick = (camp)=>(event) => {
    setOpen({...open, [camp]:!open[camp]});
  };

  const agregarClik = (camp) => (event)=>{
    setMas({...agregar, [camp]:true});
  }

  const cerraragregarClik = (camp) => (event)=>{
    if (camp==='nuevo_sub'){
      setAgregarsub(false);
    }else{
      setMas({...agregar, [camp]:false});
    }

  }

  const aceptarClik = (camp) => (event) =>{
    const nuevo=document.getElementById('nuevo-'+camp).value;
    if (camp==='nuevo_sub'){
      // setLista({...lista, [nuevo]:[]});
      Modificar({...lista, [nuevo]:[]});
      setAgregarsub(false);
    }else{
      // setLista({...lista, [camp]:[...lista[camp],nuevo]})
      Modificar({...lista, [camp]:[...lista[camp],{titulo:nuevo}]});
      setMas({...agregar, [camp]:false});
    }
  }

  const eliminarsubClik = (camp) => (event) =>{
    let nlista={}
    Object.keys(lista).map(val=>{
      nlista= val!==camp ? {...nlista, [val]:lista[val]} : nlista;
      return val;
    })
    // setLista({...nlista})
    Modificar(nlista);
  }

  const agregarsubClik = () =>{
    setAgregarsub(true);
  }

  const eliminaritemClik = (pos, sub)=>(e) =>{
    let nlista= {};
    // nlista[sub].splice(pos, 1);
    Object.keys(lista).map(val=>{
      if (val===sub){
        nlista[val]=lista[val].filter((it,i)=> i!== pos)
      }else{
        nlista[val]=lista[val];
      }
      return val
    })
    // setLista({...nlista});
    Modificar(nlista);
  }

  const moverClik = (pos, sub, nueva) => (e) =>{
    let nlista={}
    const aux=lista[sub][pos];
    const auxlista= lista[sub].filter((d,i)=> i !== pos);
    let laux=[];
    auxlista.map((dat,i)=>{
      laux= i===nueva ? [...laux,aux,dat]: [...laux,dat];
      return dat
    })
    if (nueva===auxlista.length){
      laux=[...laux,aux];
    }
    nlista={...lista, [sub]:laux}
    console.log(nlista);
    Modificar({...nlista});
    // setLista({...nlista});
  }

  const Modificar = (nuevo) =>{
    cambio({target:{name:valor.name,value:nuevo}});
    // setLista({...nlista});
  }

  // const aceptarTodoClik = () =>{
  //   cambio({target:{name:valor.name,value:lista}});
  //   setValororiginal({...lista});
  // }

  const Compopen = (props) =>{
    const {dato}=props;
    return (
      <div key={'Comp_open-'+dato}>
        {valor.editable ? <IconButton
                    className={classes.margin}
                    onClick={agregarClik(dato)}
                    key={'listiconb-'+dato}
        >
          <AddCircleIcon key={'listicona-'+dato}  style={{ color: green[500] }}/>
        </IconButton> : null}
        <IconButton
                    className={classes.margin}
                    onClick={handleClick(dato)}
                    key={'listicone-'+dato}
        >
          <ExpandLess key={'listex-'+dato} />
        </IconButton>
      </div>
    )
  }

  const Compclose =(props)=>{
    const {dato}=props;
    return (
          <div key={'Comp_close'+dato}>
             {valor.editable ? <IconButton
                          className={classes.margin}
                          onClick={eliminarsubClik(dato)}
                          key={'Comp_eliminar-'+dato}
             >
               <DeleteIcon key={'Comp_eliminiar-icon-'+dato} color="secondary"/>
             </IconButton> : null}
             <IconButton
                         className={classes.margin}
                         onClick={handleClick(dato)}
                         key={'listiconem-'+dato}
             >
               <ExpandMore key={'listexm-'+dato}/>
             </IconButton>
           </div>
    )
  }

  const Agregar = (props) =>{
    let {dato}=props;
    return(
      <ListItem key={'Agregar-'+dato} className={classes.nested}>
        <TextField label="Nuevo" style= {{ margin: 8 }} variant="filled"
                   margin="normal" fullWidth key={'textA-'+dato}
                   id={'nuevo-'+dato}
        />
        <IconButton
                    className={classes.margin}
                    onClick={aceptarClik(dato)}
                    key={'buton-aceptar-'+dato}
        >
          <DoneIcon key={'icon-aceptar-'+dato} style={{ color: green[500] }}/>
        </IconButton>
        <IconButton
                    className={classes.margin}
                    onClick={cerraragregarClik(dato)}
                    key={'buton-cancel-'+dato}
        >
          <CancelIcon key={'icon-cancel-'+dato}  color="secondary"/>
        </IconButton>

      </ListItem>
    )
  }

  const Principal = (props) =>{
    const {valor}=props;
    return(
      <div key={'Principal-'+valor.name} className={classes.botoness}>
        <IconButton title='Agregar sub-titulo'
                    className={classes.margin}
                    onClick={agregarsubClik}
                    key={'buton-aceptar-'+valor.name}
        >
          <AddCircleIcon key={'icon-aceptar-'+valor.name} style={{ color: green[500] }}/>
        </IconButton>
        {//lista!==valor.lista ?
          // <div key={'Cambios-'+valor.name} className={classes.botoness}>
          //   <IconButton
          //             title='Aceptar los cambios'
          //             className={classes.margin}
          //             onClick={aceptarTodoClik}
          //             key={'buton-aceptar-'+valor.name}
          //   >
          //     <DoneIcon key={'icon-aceptar-'+valor.name} style={{ color: green[500] }}/>
          //   </IconButton>
          //   <IconButton title='Cancelar todos los cambios'
          //               className={classes.margin}
          //               onClick={cancelartodoClik}
          //               key={'buton-cancel-'+valor.name}
          //   >
          //     <CancelIcon key={'icon-cancel-'+valor.name}  color="secondary"/>
          //   </IconButton>
          // </div>: null
        }

      </div>
    )
  }

  const Botones = (props) =>{
    const {pos, valor, dato}= props;
    return (
      <ListItemSecondaryAction key={'Botones-'+pos+valor.titulo}>

        {pos>0 ? <IconButton
                     className={classes.margin}
                     onClick={moverClik(pos, dato, pos-1)}
                     key={'boton-subir-'+pos+valor.titulo}
                     title={'Mover arriba '+valor.titulo}
        >
          <ArrowUpwardIcon key={'boton_subir-icon-'+pos+valor.titulo} />
        </IconButton>: null}
        {pos<lista[dato].length-1 ? <IconButton
                     className={classes.margin}
                     onClick={moverClik(pos, dato, pos+1)}
                     key={'boton-bajar-'+pos+valor}
                     title={'Mover abajo '+valor}
        >
          <ArrowDownwardIcon key={'boton_bajar-icon-'+pos+valor.titulo} />
        </IconButton>:null}
        <IconButton
                     className={classes.margin}
                     onClick={eliminaritemClik(pos, dato)}
                     key={'boton-eliminar-'+pos+valor.titulo}
                     title={'Eliminar '+valor.titulo}
        >
          <DeleteIcon key={'boton_eliminiar-icon-'+pos+valor} color="secondary"/>
        </IconButton>

      </ListItemSecondaryAction>
    )
  }

  const subClik = (dato)=> () =>{
    setSeleccion([dato,'null'])
    if (valor.onClick !== undefined && valor.onClick !== null){
        valor.onClick([dato]);
    }else{
      console.log('Click', dato);
    }
  }

  const itemsClik = (dato,val) => () =>{

    setSeleccion([dato,val.titulo])
    if (valor.onClick !== undefined && valor.onClick !== null){
        valor.onClick(val);
    }else{
      console.log('Click', dato, val);
    }
  }

  return (
    <Fragment key={'listado-v-'+valor.name} >
        <List
          key={'lista-v-'+valor.name}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader key={'list-titulo-'+valor.name} component="div" id={'list-titulo-'+valor.name}>
              {valor.label}
              {valor.editable ? <Principal valor={valor}/> : null}
            </ListSubheader>
          }
          className={classes.root}
          style={{maxHeight: altol}}
        >
          { agregarsub ? <Agregar  dato='nuevo_sub'/> : null}
          {Object.keys(lista).map(dato=>
            <div key={'listado-grupo-'+dato}>
              <ListItem button key={'list-'+dato}
                        selected={seleccion[0] === dato}
                        onClick={subClik(dato)}
              >
                <ListItemIcon key={'listicon-'+dato}>
                  <FormatListBulletedIcon key={'listicons-'+dato}/>
                </ListItemIcon>
                <ListItemText primary={dato} key={'listtext-'+dato}/>
                {open[dato] ? <Compopen dato={dato}/>
                   : <Compclose dato={dato}/>
                  }
              </ListItem>

              <Collapse in={open[dato]} timeout="auto" unmountOnExit key={'listcoll-'+dato}>
                <List component="div" disablePadding key={'list-list-'+dato}>
                  {mas[dato] ? <Agregar dato={dato}/> : null}
                  {lista[dato].map((lis,i)=>
                    <ListItem key={'listitem-'+dato+'-'+lis.titulo}
                              button
                              className={classes.nested}
                              onClick={itemsClik(dato,lis)}
                              selected={seleccion[0] === dato && seleccion[1]=== lis.titulo}

                    >
                      <ListItemIcon key={'listicon-'+dato+'-'+lis.titulo}>
                        <LensIcon key={'listlenicon-'+dato+'-'+lis.titulo}/>
                      </ListItemIcon>
                      <ListItemText
                          key={'listtext-'+dato+'-'+lis}
                          primary={
                            <React.Fragment>
                              <Typography
                                 component="span"
                                 variant="body2"
                                 className={classes.inline}
                                 color="textPrimary"
                                 noWrap
                               >
                                 {lis.titulo}
                               </Typography>
                               { !subtitulo && lis.subtitulo ?
                                 <Typography noWrap>
                                  {lis.subtitulo}
                                 </Typography> : null
                               }
                            </React.Fragment>

                          }

                      />
                      {valor.editable ? <Botones pos={i} valor={lis} dato={dato}/> : null}
                    </ListItem>
                  )}
                </List>
              </Collapse>
            </div>
          )}
        </List>
    </Fragment>
  );
}
