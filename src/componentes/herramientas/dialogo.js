import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';

import logo from '../../imagenes/logo512.png';
import { Ver_Valores } from '../../constantes';
import Scrollbars from './scrolbars';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    backgroudColor:'#000'
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, config, ...other } = props;
  
  return (
    <DialogTitle 
      sx={{ m: 0, p: 2, display:'flex', height:70, alignItems: 'center',...config.Estilos.Barra_menu ? config.Estilos.Barra_menu :{} }} 
      {...other}
    >
      <img src={ logo}  alt="logo" 
            style={{height:60, width:60, ...config.Estilos.Logo ? config.Estilos.Logo : {} }}
      />
      <div style={{width:20, backgroundColor:'#f0f'}} />
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[200],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Dialogo(props) {
  // const [open, setOpen] = React.useState(false);
  let {open, Cerrar, Titulo, Cuerpo, Botones, tam, fullScreen, config}= props;
  
  config = config.Estilos ? config : Ver_Valores().config;
  // const handleClickOpen = () => {
  //   // setOpen(true);
  // };
  const handleClose = () => {
    // setOpen(false);
    if (Cerrar){
      Cerrar()
    }
  };

  return (
    <div>
      <BootstrapDialog
        fullScreen= {fullScreen ? fullScreen : false}
        fullWidth={true}
        maxWidth={tam ? tam : 'md'}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose} config={config}>
          {Titulo}
        </BootstrapDialogTitle>
        {/* <DialogContent dividers 
          style={{backgroundColor:'rgba(0, 0, 0,0.8)', 
                  ...config.Estilos.Dialogo_cuerpo ? config.Estilos.Dialogo_cuerpo :{}
                }}
        > */}
          <Scrollbars sx={{flexGrow: 1, padding:0.5, ...config.Estilos.Dialogo_cuerpo ? config.Estilos.Dialogo_cuerpo :{}}}>
            {Cuerpo!==undefined ? Cuerpo : null }
          </Scrollbars>
        {/* </DialogContent> */}
        {
          Botones ?
              <DialogActions>
                {Botones.map((val,i) =>
                  <Button key={'Boton-'+i} {...val}>
                    {val.titulo}
                  </Button>
                )}
              </DialogActions> : null
        }
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
      </BootstrapDialog>
    </div>
  );
}
