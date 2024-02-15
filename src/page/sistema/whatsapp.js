import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import QRCode from "react-qr-code";
import { styled } from '@mui/material/styles';
import { conexiones, Ver_Valores } from '../../constantes';
import Scrollbars from '../../componentes/herramientas/scrolbars';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function WhatsApp() {
    const [qr,setQr]= React.useState('');
    React.useEffect(()=>{
        const Inicio = async()=>{
            console.log('Pro aluqioeoeooe slj adfap ')
            const resp= await conexiones.WhatsappQR();
            console.log(resp)
            if (resp.Respuesta==='Ok' && resp.QR){
                setQr(resp.QR);
            }
            
            Ver_Valores().socket.on('whatsappqr',data=>{
                setQr(data.qr);
            })
        }
        Inicio();
    })
    return (
        <Scrollbars sx={{ width: '100%', height:window.innerHeight * 0.88}}>
            <Stack spacing={2}>
                <Item sx={{bgcolor:'#fff', height:window.innerHeight * 0.85, p:5}}>
                    {qr===''
                        ?   <Item>No se ha recibido codigo QR</Item>   
                        :   <QRCode value={qr} size={window.innerHeight * 0.75}/>
                    }
                </Item>
                <Item>Item 1</Item>
            </Stack>
        </Scrollbars>
    );
}
