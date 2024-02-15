import * as React from 'react';
import Grid from '@mui/material/Grid';

import Scrollbars from '../../componentes/herramientas/scrolbars';
import Carrusel from '../../componentes/carrusel';
import CarruselPdf from '../../componentes/carrusel_pdf';
import Catalogo from '../../componentes/catalogo';

// import {conexiones}from '../../procesos/servicios'


// import Tabla_multiple from '../tabla/tabla_multiple';

export default class Home extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          props: this.props,
          Config:this.props.Config,
          portada:[],
          porducto:[]
          
      }
  }
 
    async componentDidMount(){
      
        // let resultados= await conexiones.Leer_C(['Portada', 'Producto'], 
        //     {
        //     'Portada':{},
        //     'Producto':{},
        //     }
        // );
        // if (resultados.Respuesta==='Ok'){
        //     this.setState({
        //         portada:[
        //             ...resultados.datos.Portada, 
        //             // {valores:{
        //             //             img: 'https://res.cloudinary.com/dtu1dwuwf/video/upload/v1645729310/videochs_s6y6hk.mp4',
        //             //             title: '',
        //             //         }
        //             // }
        //         ],
        //         producto:resultados.datos.Producto
        //     })
        // }
    }

    static getDerivedStateFromProps(props, state) {

        if (props !== state.props) {
            
        return {
            props,
            Config:props.Config,
        };
        }
        // No state update necessary
        return null;
    }

  render(){
    const {Config, portada, producto}=this.state
    return (
        <Scrollbars sx={{ flexGrow: 1, height:'100%', ...Config.Estilos.Dialogo_cuerpo,
        
        }}>
            <Grid container spacing={0}>
                {portada.length===0
                    ? null
                    :
                    <Grid item xs={12}>
                        <Carrusel datos={portada}/>
                    </Grid>
                }
                <Grid item xs={12}>
                    <CarruselPdf datos={portada}/>
                </Grid>
               
            </Grid>
        </Scrollbars>
    )
  }
}
