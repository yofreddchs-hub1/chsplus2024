import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Tarjeta(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Card sx={{ maxWidth: '100%' }}>
            
                <CardMedia
                    component="img"
                    
                    image={props.datos.imagen}
                    alt={props.datos.nombre}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {props.datos.uso}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton aria-label="agregar a carrito">
                        <AddShoppingCartIcon />
                    </IconButton>
                    
                    <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="Ver mas"
                    >
                    <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Codigo: {props.datos.codigo}</Typography>
                        {props.datos.descripcion
                            ?   <div>
                                    <Typography paragraph>Descripcion:</Typography>
                                    <div style={{paddingLeft:20}}>
                                        {props.datos.descripcion.split('.\n').map((texto, i)=> 
                                            texto!==''                                           
                                            ?  <Typography paragraph key={`parrafo-${i}`}>
                                                    {texto}.
                                                </Typography>
                                            :   null    
                                        )}
                                        
                                    </div>
                                    
                                </div>
                            : null
                        }
                        {props.datos.presentacion
                            ? <Typography paragraph>Presentacion: {props.datos.presentacion}</Typography>
                            : null
                        }                        
                        
                    
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    </Grid>
  );
}
