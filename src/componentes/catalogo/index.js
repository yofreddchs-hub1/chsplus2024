import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Grid';

import Skeleton from '@mui/material/Skeleton';
// import { conexiones } from '../../procesos/servicios';
import Dialogo from '../herramientas/dialogo';

// import Tarjeta from './tarjeta';
import Item from './item';

export default function Catalogo(props) {
  const [itemData, setItemData] = React.useState([]);
  const [dialogo]= React.useState({
    open:false,  tam:'lg'
  });
  // const Inicio =async()=>{
  //   let resultados= await conexiones.Leer_C(['Producto'], 
  //       {
  //         'Producto':{},
  //       }
  //   );
    
  //   if (resultados.Respuesta==='Ok'){
  //       let productos=resultados.datos.Producto.map(val=>{

  //           return {
  //               ...val, 
  //               img: val.valores.imagen,
  //               author: val.valores.codigo,
  //               title: val.valores.nombre,
                
  //           }
  //       })
  //       // productos.push({img:'https://res.cloudinary.com/dtu1dwuwf/video/upload/v1645729310/videochs_s6y6hk.mp4', author:'yofredd', title:'Video'})
  //       setItemData(productos)
  //   }
  // }

  React.useEffect(()=>{
    if (props.datos){
      let productos=props.datos.map(val=>{

        return {
            ...val, 
            img: val.valores.imagen,
            author: val.valores.codigo,
            title: val.valores.nombre,
            
        }
      })
      // productos.push({img:'https://res.cloudinary.com/dtu1dwuwf/video/upload/v1645729310/videochs_s6y6hk.mp4', author:'yofredd', title:'Video'})
      setItemData(productos)
    }
  }, [props])

  // const Abrir = async(valores) =>{
  //   setDialogo({
  //       ...dialogo, 
  //       open: !dialogo.open,
  //       Titulo:valores.valores.nombre,
  //       Cuerpo:<Tarjeta datos={valores.valores}/>,
  //       Cerrar: ()=>setDialogo({...dialogo,open:false}),
  //   })
  // }

  return (
    <Paper elevation={3} sx={{ bgcolor:'#0000ff', color:'#ffffff', overflow:'hide', marginBottom:0.5, padding:0.5, height:window.innerHeight * 0.86}}>
      <Grid container spacing={2}>
          <Grid item xs={12}>
              <Box sx={{ width: '100%', height:'100%',overflow:'hidden',bgcolor:'#0f0', padding:0.5}}>
                <Box sx={{bgcolor:'#000', width:'100%'}}>
                  <Typography variant="h5" gutterBottom>
                    {props.titulo ? props.titulo : 'Catalogo'}
                  </Typography>
                </Box>
                <ImageList  cols={2}  sx={(theme) => ({
                    
                    overflow: 'hidden auto',
                    '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        border: '2px solid',
                        borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                        backgroundColor: 'rgba(0 0 0 / 0.5)',
                    },
                    
                })}> 
                            
                
                  {/* <ImageListItem key="Subheader" cols={3}>
                    <ListSubheader component="div">{props.titulo ? props.titulo : 'Catalogo'}</ListSubheader>
                  </ImageListItem> */}
                  {itemData.length===0
                    ? [0,1,2,3,4,5,6,7,8].map(item =>
                      <ImageListItem key={item}>
                        <Skeleton variant="rectangular"  height={141} />
                        <ImageListItemBar
                          title={<Skeleton variant="text" />}
                          subtitle={<Skeleton variant="text" />}
                          actionIcon={<Skeleton variant="circular" width={40} height={40} />}
                        />
                  
                      </ImageListItem>
                      )
                  
                    : itemData.map((item, i) => (
                      <Item key={item.img+'-'+i} {...item}/>
                      // <ImageListItem key={item.img+'-'+i}>
                      //   <img
                      //     src={`${item.img}?w=121&h=121&fit=crop&auto=format`}
                      //     srcSet={`${item.img}?w=121&h=121&fit=crop&auto=format&dpr=2 2x`}
                      //     alt={item.title}
                      //     style={{height:200}}
                      //     loading="lazy"
                          
                      //   />
                      //   <ImageListItemBar
                      //     title={String(item.title).toUpperCase()}
                      //     subtitle={<span>{item.author}</span>}
                      //     actionIcon={
                      //       <IconButton
                      //         sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      //         aria-label={`Informacion sobre ${item.title}`}
                      //         onClick={()=> Abrir(item)}
                      //       >
                      //         <InfoIcon />
                      //       </IconButton>
                      //     }
                      //   />
                      // </ImageListItem>
                  ))}
                </ImageList>
              </Box>
          </Grid>
      </Grid>
      <Dialogo  {...dialogo} config={props.Config}/>
    </Paper>
  );
}

// const itemData = [
//   {
//     img: 'https://res.cloudinary.com/dtu1dwuwf/image/upload/v1645541339/cif2mlqw7wgzc6oezbk8.png',
//     title: 'Logo',
//     author: '@bkristastucchio',
//   },
//   {
//     img: 'https://res.cloudinary.com/dtu1dwuwf/video/upload/v1645729310/videochs_s6y6hk.mp4',
//     title: 'Video',
//     author: '@rollelflex_graphy726',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
//     title: 'Camera',
//     author: '@helloimnik',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
//     title: 'Coffee',
//     author: '@nolanissac',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
//     title: 'Hats',
//     author: '@hjrc33',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
//     title: 'Honey',
//     author: '@arwinneil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
//     title: 'Basketball',
//     author: '@tjdragotta',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
//     title: 'Fern',
//     author: '@katie_wasserman',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
//     title: 'Mushrooms',
//     author: '@silverdalex',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//     author: '@shelleypauls',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//     author: '@peterlaster',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//     author: '@southside_customs',
//   },
// ];
