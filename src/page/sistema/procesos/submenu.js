import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';


export default function SubMenu(props) {
    const {Config}= props;
    const {Menu}= Config;
    const primer = props.submenu ? props.submenu[0] : 'Sistema';
    // const segundo = props.submenu ? props.submenu[1] : '';
    const pos = Menu.findIndex(f=>f.value===primer);
    let menu=[];
    // let pos1= -1;
    // if (pos!==-1){
        // pos1 = Menu[pos].childen.findIndex(f=>f.value=== segundo)
        if (pos!==-1){
            menu = Menu[pos].childen;
        }
    // }
    const handleListItemClick = (event, index) => {
        // console.log(index)
        props.Seleccion_pantalla(index)
    };
    return (
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
}
