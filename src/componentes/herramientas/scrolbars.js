import React from 'react';
import Box from '@mui/material/Box';

//Barra scrolbars con estilo 
export default function Scrollbars (props) {
    return(
        <Box sx={(theme) => ({
            overflow: 'hidden auto',
            '&::-webkit-scrollbar': { height: 10, width:10, WebkitAppearance: 'none' },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: 8,
                border: '2px solid',
                borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
                backgroundColor: 'rgba(0 0 0 / 0.5)',
            },
            ...props.sx ? props.sx : {}
        })} >
            {props.children}
        </Box>
    )

}