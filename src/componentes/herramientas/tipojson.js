import React, {useState} from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/es';
import IconButton from '@mui/material/IconButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Dialogo from './dialogo';

export default function TipoJson ({valor, values, config}) {
    const [state, setState]= useState({});
    const [dialogo, setDialogo]= useState({
        open:false,  
    });
    const cambiarState = (nuevostate)=>{
        setState({...state, ...nuevostate, cambio:true})
    }
    const handleClick =()=>{
        values.Cambio({target:state.target});
        setDialogo({...dialogo,open:false});
        setState({});
    }

    const Abrir = () =>{
        setDialogo({
            ...dialogo, 
            open: !dialogo.open, 
            Cerrar: ()=>setDialogo({...dialogo,open:false}),
            Titulo: valor.name,

        })
    }
    const Cuerpo =
        <div style={{textAlign:'justify', height:window.innerHeight * 0.7, width:'100%', flexGrow: 1, display: 'flex'}}>
            <JSONInput
                {...valor}
                height={'100%'}
                width={'95%'}
                placeholder={valor.value} // data to display
                theme="dark_vscode_tribute"
                locale={locale}
                onChange={(valores) => {
                    if (!valores.error) 
                    //values.Cambio({target:{name:valor.name, value:valores.jsObject}})
                    cambiarState({target:{name:valor.name, value:valores.jsObject}})
                }}
            />
            {!state.cambio ? null :
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClick}
                    edge="end"
                    variant='filled'
                    title={'Aceptar los cambios'}
                >
                    <DoneAllIcon style={{color:'#0DAD18'}}/>
                </IconButton>
            }
        </div>
    return(
        <div>
            <div style={{textAlign:'justify', height:valor.height, width:valor.width, flexGrow: 1, display: 'flex', paddingBottom:15}}>
                <div sytle={{width:'100%',}}>
                    {valor.label}
                    <JSONInput
                        {...valor}
                        height={'100%'}
                        width={window.innerWidth * 0.72}
                        placeholder={valor.value} // data to display
                        theme="dark_vscode_tribute"
                        locale={locale}
                        onChange={(valores) => {
                            if (!valores.error) 
                            //values.Cambio({target:{name:valor.name, value:valores.jsObject}})
                            cambiarState({target:{name:valor.name, value:valores.jsObject}})
                        }}
                    />
                </div>
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={Abrir}
                    edge="end"
                    variant='filled'
                    title={'Ampliar'}
                >
                    <ZoomInIcon style={{color:'#0DAD96'}}/>
                </IconButton>
                {!state.cambio ? null :
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClick}
                        edge="end"
                        variant='filled'
                        title={'Aceptar los cambios'}
                    >
                        <DoneAllIcon style={{color:'#0DAD18'}}/>
                    </IconButton>
                }
            </div>
        <Dialogo  {...dialogo} Cuerpo={Cuerpo} config={config}/>
        </div>
    )
    
}