import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
// import People from '@mui/icons-material/People';
// import PermMedia from '@mui/icons-material/PermMedia';
// import Dns from '@mui/icons-material/Dns';
// import Public from '@mui/icons-material/Public';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Icon from '@mui/material/Icon';
import { Permiso, Ver_Valores } from '../../constantes';
// const data = [
//   { icon: <People />, label: 'Authentication' },
//   { icon: <Dns />, label: 'Database' },
//   { icon: <PermMedia />, label: 'Storage' },
//   { icon: <Public />, label: 'Hosting' },
// ];

const FireNav = styled(List)({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
    minWidth:256
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export default function CustomizedList(props) {
  const [Listado, setListado] = React.useState(null)
  const [open, setOpen] = React.useState({});
  const [selectedIndex, setSelectedIndex] = React.useState(props.selected);
  const {Config, User}=props;
  
  // if (Listado===null){
  //   Inicio_listado()
  // }
  
  React.useEffect(()=>{
    const {User} = Ver_Valores();
    console.log(User)
    const filtrar_lista = async(lista) =>{
      
      let resultado = [];
      for (var i=0; i<lista.length; i++){
        let f= lista[i];
        if (f.childen){
          let nuevo = await filtrar_lista(f.childen);
          f.childen= nuevo;
        } 
        
        const permiso=props.Api ? await Permiso(f.value, props.Api) : await Permiso(f.value);
        f.libre = f.libre===true || f.libre ==='true' ? 'true' : 'false';
        f.app_chs = f.app_chs===true || f.app_chs ==='true' ? 'true' : 'false';
        const prueba = !f.prueba || (User && (User.categoria==='0' || User.categoria.permisos.indexOf('**')!==-1)) 
        if ((f.libre ==='true' || permiso) && prueba){
          resultado=[...resultado,f];   
        }
        
      }
      return resultado;
    }
    const Inicio_listado =async()=>{
      if (Config.Menu.length===1 ){
          setListado(Config.Menu)
      }else{
          let nuevo= await filtrar_lista(Config.Menu);//[];
          console.log(nuevo)
          // for (var i=0; i<Config.Menu.length;i++){
          //     let f=Config.Menu[i];
          //     console.log(f);
          //     const permiso=props.Api ? await Permiso(f.value, props.Api) : await Permiso(f.value);
          //     f.libre = f.libre===true || f.libre ==='true' ? 'true' : 'false';
          //     f.app_chs = f.app_chs===true || f.app_chs ==='true' ? 'true' : 'false';
              
          //     if (f.libre ==='true' || permiso){
          //         nuevo=[...nuevo,f];   
          //     }
              
          // }
          setListado(nuevo) 
          if (selectedIndex===undefined) setSelectedIndex(nuevo[0].value)
      } 
    }
    Inicio_listado()
  },[User])
  const handleListItemClick = (event, index, padre) => {
    let nopen={...open,[index.value]:!open[index.value]};
    setOpen(nopen);
    setSelectedIndex(index.value);
    if (index.link){
      window.location.pathname=index.link;
    }
    if (props.Seleccion_pantalla){
        props.Seleccion_pantalla(index, padre)
    }
  };

  const render = (lista, padre=null) =>{
    return (
        lista===undefined || lista===null || lista.length===0
        ?
            <FireNav component="nav" disablePadding >
                <ListItem
                    component="div" disablePadding
                    
                >
                    <ListItemButton sx={{ height: 56 }}>
                        <ListItemIcon>
                            <Icon color={'primary'}>settings</Icon>
                        </ListItemIcon>
                        <ListItemText   primary="Configuración"
                                        primaryTypographyProps={ {
                                            color: 'primary',
                                            fontWeight: 'medium',
                                            variant: 'body2',
                                        }}
                        />
                        
                    </ListItemButton>
                </ListItem>
                
            </FireNav>
        :
        lista.map((valor,index)=>
            <FireNav component="nav" disablePadding key={'div-'+index}>
                <ListItem
                    key={valor.primary+index}
                    
                    component="div" disablePadding
                    selected={selectedIndex === valor.value}
                    onClick={(event) => handleListItemClick(event, valor, padre)}
                >
                    <ListItemButton sx={{ height: 56 }}>
                        <ListItemIcon>
                            <Icon color={'#fff'}>{valor.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText  {...valor} 
                                        primaryTypographyProps={selectedIndex === valor.value ? {
                                            color: 'primary',
                                            fontWeight: 'medium',
                                            variant: 'body2',
                                        }:{}}
                        />
                        {valor.childen ?  (open[valor.value] ? <ExpandLessIcon style={{color:'#ffffff'}}/> : <ExpandMoreIcon style={{color:'#ffffff'}}/>) : null}
                    </ListItemButton>
                </ListItem>
                {valor.childen ?(
                    <Collapse key={'collapse-'+index+valor.primary} in={open[valor.value]} timeout="auto" unmountOnExit>
                        <List component="div" style={{paddingLeft:10}}>
                            {render(valor.childen, valor)}
                        </List>
                    </Collapse>
                ): null}
            </FireNav>
        )
    )
  }
  
  return (
    <Box sx={{ display: 'flex', bgcolor:'#7ABC32', padding:0.2, height:'100%',
               overflowX:'hidden', 
               ...Config.Estilos.Lista_menu_fondo ? Config.Estilos.Lista_menu_fondo : {}
            }}
    >
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: 'dark',
            primary: { main: 'rgb(102, 157, 246)' }, //Color de letra
            background: { paper: 'rgb(5, 30, 52)' }, //Color de fondo de la barra
            ...Config.Estilos.Lista_menu_cuerpo ? Config.Estilos.Lista_menu_cuerpo : {}
          },
        })}
      >
        <Paper elevation={0} 
                sx={(theme)=>({ width:'100%', height:'100%',   overflowX:'hidden', overflowY:'auto', 
                        '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: 8,
                            border: '2px solid',
                            borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                            backgroundColor: 'rgba(0 0 0 / 0.5)',
                        },    
                    })}
        >
    
            {render(Listado)}
          
        </Paper>
      </ThemeProvider>
    </Box>
  );
}
