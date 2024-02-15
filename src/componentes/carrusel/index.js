import React from "react";
import "./styles.css";

import Box from "@mui/material/Box";
// import Fade from "@mui/material/Fade";
// import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';
import Carousel from 'react-bootstrap/Carousel';
// import ReactPlayer from 'react-player/lazy';
// import { Player, BigPlayButton } from 'video-react';
import Skeleton from '@mui/material/Skeleton';
import Dialogo from '../herramientas/dialogo';
import { Ver_Valores } from '../../constantes';

// const itemData = [
//     {
//       img: 'https://res.cloudinary.com/dtu1dwuwf/video/upload/v1645729310/videochs_s6y6hk.mp4',
//       title: '',
//     },
//     {
//         img: 'https://res.cloudinary.com/dtu1dwuwf/image/upload/v1645731250/emgede85xsjsvdb8eiam.png',
//         title: 'Breakfast',
//       },
//     {
//       img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
//       title: 'Burger',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
//       title: 'Camera',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
//       title: 'Coffee',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
//       title: 'Hats',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
//       title: 'Honey',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
//       title: 'Basketball',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
//       title: 'Fern',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
//       title: 'Mushrooms',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//       title: 'Tomato basil',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//       title: 'Sea star',
//     },
//     {
//       img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//       title: 'Bike',
//     },
// ];

class Carrusel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        props:this.props,
        datos:[],
        index:0,
        dialogo:{open:false, tam:'lg' }
    };

    
  }

  async componentDidMount() {
      this.setState({datos:this.props.datos})
    
  }

  static getDerivedStateFromProps(props, state) {

    if (props !== state.props) {
        const {datos}= props;    
        return {
            props,
            datos
        };
    }
    // No state update necessary
    return null;
  }

  componentWillUnmount() {
    
  }
 
  Seleccion = (index) =>{

    this.setState({
        dialogo:{
            ...this.state.dialogo,
            open:true,
            Titulo:index.title,
            Cuerpo:<div 
                        style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent:'center',
                                width: '100%',
                                height:'100%',   
                        }}
                    >
                        <img 
                            
                            src={`${index.img}`}
                            srcSet={`${index.img}`}
                            alt={index.title}
                            loading="lazy"
                            style={{
                                
                                overflow: 'hidden',
                                objectFit: 'cover',
                                
                            }}
                        />
                    </div>,
            Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo, open:false}}),
        }
    })
  }

  Imagen = (step, i)=>{
    
    const imagen = ['mp4', 'avi'].indexOf(step.img.split('.').pop())!==-1;
    return !imagen ? (
      <div key={`${step.title}-${i}`}  
            style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'center',
                    width: '100%',
                    height:'100%',   
            }}
            onClick={()=>this.Seleccion(step,i)}
      >
        <img 
              
              src={`${step.img}`}
              srcSet={`${step.img}`}
              alt={step.title}
              loading="lazy"
              style={{
                  height: this.state.props.height ? this.state.props.height - this.state.props.height *0.06 : '74vh',
                  overflow: 'hidden',
                  objectFit: 'cover',
                  
              }}
        />
      </div>
    ):(
      <div key={`${step.title}-${i}`} 
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:'center',
                width: '100%',
                height:'100%',
            }}
      >
        {/* <Player
          src={`${step.img}`}
          fluid={false}
          autoPlay={i===this.state.index}
          playsInline
          height={window.innerHeight * 0.74 }
        >
           <BigPlayButton position="center" /> 
           
        </Player> */}
       
      </div>
    )
    
  }

  handleSelect = (selectedIndex, e) => {
    this.setState({index: selectedIndex});
  };

  render() {
    const Config = this.state.props.Config ? this.state.props.Config : Ver_Valores().config;
    return (
    <Box sx={{    }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{
                    width: '99%',
                    height: this.state.props.height ? this.state.props.height : '80vh',
                    margin: '20px auto',
                    border: '3px solid rgba(122, 188, 50, 0.911)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Carousel fade style={{width:'100%', height:'100%'}} interval={8000}
                              activeIndex={this.state.index} onSelect={this.handleSelect}
                    >
                        {this.state.datos.length===0
                            ?   <Skeleton variant="rectangular"  height={window.innerHeight * 0.8} />
                            : this.state.datos.map((d,i)=>
                                <Carousel.Item key={`${d.valores.title}-${i}`}>
                                    {this.Imagen(d.valores,i)}
                                    <Carousel.Caption>
                                        <h3>{`${d.valores.title}`}</h3>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            )
                        }
                        
                    </Carousel>
                </Box>
            </Grid>
        </Grid>
        <Dialogo  {...this.state.dialogo} config={Config}/>
    </Box>
    );
  }
}

export default Carrusel;
