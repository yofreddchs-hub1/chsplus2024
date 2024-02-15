import React from 'react';
import { makeStyles } from '@mui/styles';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { green } from '@mui/material/colors';

const useStyles = {//makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
    // backgroundColor: '#000000',
    border:1,
  },
  nested: {
    paddingLeft: 4//theme.spacing(4),
  },
  agregar:{
    display: 'flex',
    flexDirection:'row',
    marginBottom: 10,
  }
}
// }));

export default function Lista_Representantes(props) {
  const classes = useStyles//();
  // const [open, setOpen] = React.useState(true);

  // const handleClick = () => {
  //   setOpen(!open);
  // };
  const {Config} = props;
  const {valor, cambio} = props;
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [value, setValue] = React.useState(valor.value);
  const [nuevo, setNuevo] = React.useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const Eliminar = (dato) =>{
    // console.log(valor.name,dato)
    let nuevovalor= value.filter(val => val._id!==dato._id);
    setValue(nuevovalor);
    cambio({target:{name:valor.name,value:nuevovalor}});
  }

  const agregarsubClik = () =>{
    if (nuevo!==null){
      console.log(nuevo)
      let nuevovalor= value ? value.filter(val => val.cedula===nuevo.cedula && val.nombres===nuevo.nombres && val.apellidos===nuevo.apellidos): [];
      if (nuevovalor.length===0){
        //Modificar al modificar condicion de estudiante
        let nuevovalue=[...value, {
          _id: nuevo._id, cedula:nuevo.cedula, nombres:nuevo.nombres, apellidos:nuevo.apellidos, 
          grado:nuevo.grado, seccion:nuevo.seccion, beca: nuevo.beca, estatus: nuevo.estatus
        }];
        setValue(nuevovalue)
        cambio({target:{name:valor.name,value:nuevovalue}});
      }
    }
  }
  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {valor.label}
          {valor.activar ? 
            <div style={classes.agregar}>
                <Autocomplete
                  disabled={!valor.activar}
                  options={valor.lista}
                  getOptionLabel={valor.getOptionLabel ? valor.getOptionLabel : (option) => `${option.cedula} ${option.nombres} ${option.apellidos}`}
                  style={{ width:'96%'}}
                  renderInput={(params) => <TextField {...params} label="Estudiantes" variant="outlined" />}
                  onChange={(event, newValue) => {
                    if (newValue!==null){
                      // values.Cambio({target:{name:valor.name, value:newValue}})
                      setNuevo(newValue);
                    }
                  }}
                />
                <IconButton title='Agregar sub-titulo'
                          style={classes.margin}
                          onClick={agregarsubClik}
                          key={'buton-aceptar-'+valor.name}
                          disabled={!valor.activar}
                >
                  <AddCircleIcon key={'icon-aceptar-'+valor.name} style={{ color: green[500] }} fontSize="large"/>
                </IconButton>
            </div> : null
          }
        </ListSubheader>
      }
      style={classes.root}
    >
      {value ? value.map((val,i)=>
        <ListItem button
            key={val.cedula}
            selected={selectedIndex === i}
            onClick={(event) => handleListItemClick(event, i)}
        >

          <ListItemText key={'text-'+val.cedula} primary={`${val.cedula} ${val.nombres} ${val.apellidos}`} sx={{...Config ? {color:Config.Estilos.Input_label.color} :{}}}/>
          <ListItemSecondaryAction key={'boton-'+val.cedula}>
            {valor.activar ? 
              <IconButton disabled={!valor.activar} key={'eliminar-'+val.cedula} edge="end" aria-label="delete" onClick={() => Eliminar(val)}>
                <DeleteIcon />
              </IconButton>: null
            }
          </ListItemSecondaryAction>
        </ListItem>  
        
      ):null}
      
    </List>
  );
}