import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { conexiones } from '../../constantes';
// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

export default function Listados(props) {
  const {valor, values, Config}=props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState(valor.lista && typeof valor.lista==='object' ? valor.lista : []);
  const loading = open && options.length === 0;
  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      // await sleep(1e3); // For demo purposes.
        
      if (valor.lista && typeof valor.lista!=='string'){
        setOptions([...valor.lista]);
      }else if(valor.lista.indexOf('lista_')!==-1){
        let lista = Config.Listas[valor.lista]
        if (lista===undefined) lista=[]
        setOptions([...valor.antes ? valor.antes : [], ...lista, ...valor.despues ? valor.despues : []]);
      }else{
        console.log(valor.lista)
        const listado = await conexiones.Leer_C([valor.lista],{[valor.lista]:valor.condicion ? valor.condicion : {}})
        if (listado.Respuesta==='Ok'){
          let lista= listado.datos[valor.lista].map( v=>{
            return {...v.valores ? {_id:v._id, ...v.valores, key:v._id} : v}
          })
          if (active) {
            setOptions([...valor.antes ? valor.antes : [], ...lista, ...valor.despues ? valor.despues : []]);
          }
          
        }else{
          console.log('Error')
        }
      }
        // setOptions([...topFilms]);
      
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    // if (!open) {
    //   setOptions(valor.lista && typeof valor.lista!=='string' ? valor.lista : []);
    // }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setOptions(valor.lista && typeof valor.lista!=='string' ? valor.lista : []);
    }
  }, [props]);

  return (
    <Autocomplete
      multiple={valor.multiple}
              
      sx={{ width:'100%', 
          // border:0,
          // borderColor:'transparent',
          // bgcolor:'#f0f',
          '.MuiAutocomplete-inputRoot':{
              marginLeft:-1,
              
          },
          '.MuiAutocomplete-input:disabled':{
            bgcolor:'#696757',
            
          },
          '.MuiAutocomplete-input':{
              bgcolor: Config.Estilos.Input_fondo ? Config.Estilos.Input_fondo.backgroundColor : '#000',
              color: Config.Estilos.Input_input ? Config.Estilos.Input_input.color : '#fff',
          },
          '.MuiAutocomplete-popupIndicator':{
              color:Config.Estilos.Icon_lista ? Config.Estilos.Icon_lista.color : '#fff'
          },
          '.Mui-focused':{
          },
          '.MuiAutocomplete-clearIndicator':{
              color: Config.Estilos.Icon_lista ? Config.Estilos.Icon_lista.color :  '#fff'
          },
          '.MuiAutocomplete-listbox':{
              bgcolor:'#0f0'
          },
          
          // '.Mui-focused':{
          //     borderColor:'transparent'
          // }
      }}
      disabled={valor.disabled}
      options= {options}
      getOptionDisabled= {(option)=> option.disabled}
      // getoptionselected={valor.getOptionSelected ? valor.getOptionSelected : (option) => option.titulo}
      getOptionLabel= {valor.getOptionLabel ? valor.getOptionLabel :(option) => option.titulo}
      id={'select-'+valor.name}
      autoComplete
      
      value={valor.multiple 
              ?   valor.value 
              ?   valor.value 
              :   [] 
              :   valor.value=== undefined || valor.value==='' 
              ?   null 
              :   typeof valor.value ==='string' || typeof valor.value === 'number'
              ?   valor.lista[valor.value]
              :   valor.value
      }
      // inputValue={ valor.value=== undefined ? '' : valor.value.titulo}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      noOptionsText='No hay opciones'
      onChange={(event, newValue) => {
        // console.log(newValue)
        // if (newValue!==null){
          // console.log(newValue)
          values.Cambio({target:{name:valor.name, value:newValue}})
        // }
      }}
      label={valor.label ? valor.label : valor.placeholder}

      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      
      loading={loading}
      loadingText={'Cargando...'}
      renderInput={(params) => (
        <TextField
          {...params}
          label={valor.label ? valor.label : valor.placeholder}
          margin="normal"
          style= {{ margin: 8}}
          name={valor.name}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
];
