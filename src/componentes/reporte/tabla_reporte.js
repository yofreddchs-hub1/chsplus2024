import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Titulos_todos, Moneda } from '../../constantes';
const Item = styled(Box)(({ theme }) => ({
    color:'#000', padding:1, border: '2px solid black'
}));
const Itemd = styled(Box)(({ theme }) => ({
    color:'#000',  
    paddingLeft:1, paddingTop:0.5, paddingRight:3 //border: '1px solid grey'
}));

export default function TablaReporte(props) {
    const[cabezera,setCabezera]= React.useState();
    const[data,setData]= React.useState();
    // console.log(props);
    const {Condicion} = props;
    const color = '#000000';
    const Tletra = 9;
    const Cabezera = ()=>{

        return(
            <Grid container xs={12} spacing={0}>
                {cabezera.map(val=>
                    <Grid key={val.field} xs={val.flex ? val.flex : 12/cabezera.length}>
                        <Item component="div" >
                            <Typography color={color} 
                                    align={'center'}
                                    fontSize={Tletra}
                                    sx={{ fontWeight:'bold' }}
                                    noWrap          
                            >
                                {['total'].indexOf(val.field)!==-1
                                    ?  `${val.title} ${Condicion && Condicion.moneda._id===1 ? '$' : 'Bs.' }`
                                    :  val.title
                                }
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
                {cabezera.map(val=>{
                    let valor = typeof dat[val.field]==='object' ? dat[val.field].titulo : val.type && val.type==='number' ? Number(dat[val.field]).toFixed(2) : dat[val.field];
                    if (['precio','total'].indexOf(val.field)!==-1){
                        valor = Condicion 
                                && Condicion.moneda 
                                && Condicion.moneda._id===1 
                                ? Moneda(Number(dat[val.field]),'$',false)
                                : Moneda(Number(dat[val.field] * Number(Condicion.tasa)),'Bs', false)
                    }
                    
                    return(
                        <Grid key={dat._id + val.field} xs={val.flex ? val.flex : 12/cabezera.length}>
                            <Itemd component="div" >
                                <Typography color={color} 
                                        align={val.type && val.type==='number' ? 'right':'left'}
                                        fontSize={Tletra-1} noWrap          
                                >
                                    {valor}
                                </Typography>
                            </Itemd>
                            
                        </Grid>
                    )}    
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
            
            <Grid container spacing={0}>
                {cabezera && !props.nomostrar 
                    ?   <Cabezera />
                    :   
                        <Grid container xs={12} spacing={0}>
                            <div style={{height:20}}/>
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
