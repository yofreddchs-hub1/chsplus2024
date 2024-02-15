import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import Icon from '@mui/material/Icon';
import CircularProgress from '@mui/material/CircularProgress';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './styles.css';

import logo from '../../imagenes/logo512.png';
import { Iniciar_data, Ver_Valores, nuevo_Valores } from '../../constantes';


export default function PrimarySearchAppBar(props) {
  const {Config, conectado, conectadoserver, sincronizando, Cambiar_valores} = props; 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEla, setAnchorEla] = React.useState(null);
  const open = Boolean(anchorEla);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {props.User && props.User.username  
            ? <MenuItem 
                onClick={()=>{
                  props.Login()
                  handleMenuClose()
                }}
              >Salir</MenuItem>
        :<div>
          <MenuItem onClick={()=>{
                        if (props.Login) props.Login()
                        handleMenuClose()
                      }}
          >Iniciar</MenuItem>
          
        </div>
      }
      
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {Config.Menu_iconos.map((val,i)=>
        <MenuItem key={`menu-icono-r-${i}`}>
          <IconButton size="large" color="inherit" title={val.title}>
            <Badge badgeContent={0} color="error">
              <Icon >shopping_cart</Icon>
            </Badge>
          </IconButton>
          <p>{val.title}</p>
        </MenuItem>
      )}
      <MenuItem >
        {conectadoserver && sincronizando ? <CircularProgress /> : conectadoserver ? <Icon >cloud_queue</Icon> :<Icon >cloud_off</Icon>}
        {conectadoserver ? <p>Conecado</p> : <p>Desconectado</p> }
      </MenuItem>
      <MenuItem >
        {conectado ?<Icon >wifi</Icon> :<Icon >wifi_off</Icon>}
        {conectado ? <p>Conectado</p> : <p>Desconectado</p> }
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Perfil</p>
      </MenuItem>
    </Menu>
  );
  let persona=''
  if (props){
    if (props.User){
      persona=`${ props.User && props.User.username ? props.User.username.toUpperCase() : ''} `;
      // if(props.User.api==='wesi_chs_server'){
        // const lista = props.Config.Listas.lista_categoria;
        // persona=typeof props.User.categoria ==='object' ? props.User.categoria.titulo : lista[props.User.categoria].titulo;
      // }else{
      //   const lista = props.Config.Listas[`lista_${props.User.api}_categoria`];
      //   persona=lista[props.User.categoria].titulo;
      // }
      
    }

  }
  const http  = Ver_Valores() && Ver_Valores().valores ? Ver_Valores().valores.http : 'no encontrado';
  const lista_sedes=Ver_Valores().config.Listas.lista_sedes;
  let sede = Ver_Valores().sede;
  return (
      <Box>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(props.open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          { !props.open ? <img  src={ logo}  className={'logo'} 
                                style={{height:60, width:60, ...Config.Estilos.Logo ? Config.Estilos.Logo : {} }} 
                                alt="logo" 
                          /> 
                        : null}
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Búsqueda…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={props.Buscar ? props.Buscar : (value)=>console.log('Buscar =>',value.target.value)}
            />
          </Search> */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
            title={`Servidor : ${http}`}
          >
           {Config.Titulo ? Config.Titulo : 'CHS +'}
           
          </Typography>
          <MenuItem sx={{marginLeft:2 ,backgroundColor:'#000', opacity:0.6, borderRadius:2}}>
            <Typography variant="h6" textAlign="center" >{props.Seleccion ? props.Seleccion : 'Inicio'}</Typography>
          </MenuItem>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems:'center' }}>
            <IconButton  color="inherit"
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={async(event)=>{
                setAnchorEla(event.currentTarget);
              }}
            >
              <Typography
                variant="subtitle"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' }, margin:1, fontSize:14 }}
              >
                  
                  {sede}
              </Typography>
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEla}
              open={open}
              onClose={()=>setAnchorEla(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {lista_sedes.map(val=>
                <MenuItem key={val._id} onClick={()=>{
                    setAnchorEla(null);
                    nuevo_Valores({sede:val.titulo})
                    Cambiar_valores({sede:val.titulo});
                  }}
                >{val.titulo}
                </MenuItem>  
              )}
              
            </Menu>
            <Typography
              variant="subtitle"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' }, marginRight:1 }}
            >
              
              {persona}
            </Typography>
            {Config.Menu_iconos.map((val,i)=>
              <IconButton size="large" color="inherit" key={`menu-icono-${i}`} title={val.title} onClick={()=>props.Seleccion_pantalla(val.value)}>
                <Badge badgeContent={0} color="error">
                  <Icon >shopping_cart</Icon>
                </Badge>
              </IconButton>
            )}
            
            <IconButton size="large" color="inherit" 
              onClick={async()=>{
                
                confirmAlert({
                  title: 'Desea sincronizar data desde servidor',
                  buttons: [
                    {label: 'SI', onClick: async()=>{
                      await Iniciar_data();
                      await Ver_Valores().Sincronizar();
                    }},
                    {label:'NO'}
                  ]
                });
              }}
            >
              {conectadoserver && sincronizando ? <CircularProgress size={20}/> : conectadoserver ? <Icon title={'Conectado servidor'}>cloud_queue</Icon> :<Icon title={'Desconectado del servidor'}>cloud_off</Icon>}
            </IconButton>
            {conectado ?<Icon title={'Conectado a internet'}>wifi</Icon> :<Icon title={'Desconectado del internet'}>wifi_off</Icon>}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
  );
}
