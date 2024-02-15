import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Titulos_todos } from '../../../../constantes';
const Item = styled(Box)(({ theme }) => ({
    color:'#000', padding:2, border: '2px solid black'
}));
const Itemd = styled(Box)(({ theme }) => ({
    color:'#000', padding:2, //border: '1px solid grey'
}));

export default function TablaReporte(props) {
    const[cabezera,setCabezera]= React.useState();
    const[data,setData]= React.useState();
    // console.log(props);
    const Cabezera = ()=>{

        return(
            <Grid container xs={12} spacing={0}>
                {cabezera.map(val=>
                    <Grid key={val.field} xs={val.flex ? val.flex : 12/cabezera.length}>
                        <Item component="div" >
                            <Typography color={'#00000'} 
                                    align={'center'}
                                    fontSize={13}
                                    sx={{ fontWeight:'bold' }}
                                    noWrap          
                            >
                                {val.title}
                            </Typography>
                        </Item>
                        
                    </Grid>    
                )}
            </Grid>
        )
    }
    const Datos = ()=>{

        return data.map(dat=>

            <Grid key={dat._id} container xs={12} spacing={0}>
                {cabezera.map(val=>
                    <Grid key={dat._id + val.field} xs={val.flex ? val.flex : 12/cabezera.length}>
                        <Itemd component="div" >
                            <Typography color={'#00000'} 
                                    align={val.type && val.type==='number' ? 'right':'left'}
                                    fontSize={12}
                                    
                                    noWrap          
                            >
                                {val.type && val.type==='number' ? Number(dat[val.field]).toFixed(2) : dat[val.field]}
                            </Typography>
                        </Itemd>
                        
                    </Grid>    
                )}
            </Grid>
        )
    }
    
    React.useEffect(()=>{
        const Iniciar = ()=>{
            const titulos = Titulos_todos(props.titulos);
            setCabezera(titulos);
            const datos =  props && props.datos ? props.datos : [];
            setData(datos)
        }
        Iniciar();
    },[props])
    return (
        <Box sx={{ flexGrow: 1, ...props.style ? props.style : {} }}>
            
            <Grid container spacing={0.5}>
                {cabezera 
                    ?   <Cabezera />
                    :   
                        <Grid container xs={12} spacing={0}>
                            <Grid xs>
                            <Item>xs</Item>
                            </Grid>
                            <Grid xs>
                            <Item>xs</Item>
                            </Grid>
                            <Grid xs>
                            <Item>xs</Item>
                            </Grid>
                        </Grid>
                        
                }
                {data 
                    ?   <Datos />
                    :   <Grid container xs={12} spacing={0}>
                            <Grid xs>
                            <Item>xs</Item>
                            </Grid>
                            <Grid xs>
                            <Item>xs</Item>
                            </Grid>
                            <Grid xs>
                            <Item>xs</Item>
                            </Grid>
                        </Grid>

                }
                
                
            </Grid>
        </Box>
    );
}
