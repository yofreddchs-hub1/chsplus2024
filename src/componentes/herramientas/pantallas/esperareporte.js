import * as React from 'react';
import Logo from '../../../imagenes/esperarreporte.png'
import Scrollbars from '../scrolbars';

export default function EsperaReporte() {
  return (
    <Scrollbars sx={{ display:'flex', alignItems:'center', justifyContent:'center',  height:'100%' }}>
            <img
                src={Logo}
                alt={'En Contruccion'}
                loading="lazy"
                style={{height:window.innerHeight * 0.8}}
            />
    </Scrollbars>
  );
}