import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import Empaques from './empaques';
import IMP from './materiaprima';


export default function Ingresos(props) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const {Config}= props;
    const {Menu}= Config;
    const pos = Menu.findIndex(f=>f.value==='Sistema');
    let menu=[];
    let pos1= -1;
    if (pos!==-1){
        pos1 = Menu[pos].childen.findIndex(f=>f.value==='Ingresos')
        if (pos1!==-1){
            menu = Menu[pos].childen[pos1].childen;
        }
    }
    const handleListItemClick = (event, index) => {
        
        console.log(index)
        setSelectedIndex(index.value);
    };
    return selectedIndex===0 
        ?   (
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <nav aria-label="main mailbox folders">
                        <List>
                            {menu.map(valor=>
                                <ListItem key={valor.value} disablePadding onClick={(event) => handleListItemClick(event, valor)}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Icon color={'#fff'}>{valor.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={valor.primary} />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </List>
                    </nav>
                    <Divider />
                </Box>
            )
        :   selectedIndex==='Ingreso Material'
        ?   <IMP {...props}/>
        :   selectedIndex==='Ingresar Empaque'
        ?   <Empaques {...props}/>
        :   null
}
