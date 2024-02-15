import * as React from 'react';
import Logo from '../../../imagenes/enconstruccion.png'
import Scrollbars from '../scrolbars';

export default function Enconstruccion() {
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
