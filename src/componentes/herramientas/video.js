import React, {Fragment} from 'react';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import {Paper, Grid} from '@mui/material';
import Lista from './lista';

const useStyles = makeStyles((theme) => ({
  cont_video:{
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'center',
    padding:5,
  },
  input: {
    display: 'none',
  },
  video:{
    width: '100%',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


function Videos (props) {
  const classes = useStyles();
  const {values, valor}=props;
  const videos=values.resultados[valor.name];
  // const videos_url=values.resultados[valor.name+'_url'];
  // console.log(valor.name+'_lista',values.resultados[valor.name+'_lista']);
  let valorlista=values.resultados[valor.name+'_lista'] === undefined ?
      {
        name:valor.name+'_lista',
        label:valor.label,
        editable:true,
        value:values.resultados[valor.name+'_lista'] ? values.resultados[valor.name+'_lista'] : {},
      } : values.resultados[valor.name+'_lista'];
  ;
  // console.log('>>>>>>>>>>>>',valorlista);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedIndexurl, setSelectedIndexurl] = React.useState(0);
  const handleListItemClick = (nombre) => {

    let index=0;
    let indexf=-1;
    if (videos.length!==0) {

      videos.map((val,i)=>{
        if (typeof val==='string' && val===nombre.subtitulo){
          index=i;
        }else if (typeof val!=='string'){
          indexf+=1;
          if (val.name===nombre.subtitulo){
            index=i;
            setSelectedIndexurl(indexf)
          }
        }
        return val;
      })

      setSelectedIndex(index);
    }
    values.Sel_grupo(nombre, valorlista);
  };
  // console.log('>>>>>>>>>>>>>>>>>',valor);
  // let valorlista={
  //   name:'video-'+valor.name,
  //   label:valor.label,
  //   value:{
  //
  //   },
  //   onClick:handleListItemClick,
  // }
  valorlista.onClick=handleListItemClick;
  return (
    <Fragment key={'videos-'+valor.name} >
      <input accept="video/*"
             className={classes.input}
             id={"icon-button-video-"+valor.name}
             type="file"
             onChange={values.Cambio_A}
             name={valor.name}
             key={'video-i-'+valor.name}
             multiple={valor.multiple}
      />
      <label key={'video-l-'+valor.name} htmlFor={"icon-button-video-"+valor.name}>
        <IconButton key={'video-b-'+valor.name} color="primary"
                    aria-label="upload picture" component="span"
                    title={'Agregar video'}
        >
            <VideoCallIcon key={'vidos-icon-'+valor.name}/>
        </IconButton>
      </label>
      <Grid container spacing={2}>
        {valor.multiple ?
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Lista key={'Listados-video-'+valor.name}
                     valor={valorlista}
                     cambio={values.Cambio}
                     abierto

              />
            </Paper>
          </Grid>: null
        }
        <Grid item xs={valor.multiple ? 6 : 12}>
          { (values.resultados[valor.name] !== undefined) &&
            (values.resultados[valor.name] !== '' || values.resultados[valor.name+'_url']) ?
            <div>
              <label>{typeof videos[selectedIndex]==='object' ?
                                videos[selectedIndex].name :
                                videos[selectedIndex]
                      }
              </label>
              <video alt={valor.label}
                     controls
                     className={classes.video}
                     src={typeof videos[selectedIndex]==='object' && values.resultados[valor.name+'_url'] ?
                            values.resultados[valor.name+'_url'][selectedIndexurl] :
                            `${values.resultados[valor.name]}`
                     }
              >

              </video>
            </div>:
            <div />
          }
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default Videos;
