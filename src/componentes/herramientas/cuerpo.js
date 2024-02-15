import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Scrollbars from './scrolbars';
import { Ver_Valores } from '../../constantes';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const blue = {
  50: '#7ABC32',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: 'rgb(5, 30, 52)', //Color de fondo de la barra completa
  600: '#ffffff',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    // fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    
    fontFamily: 'IBM Plex Sans, sans-serif',
    // color: 'white',
    cursor: 'pointer',
    // fontSize: '0.875rem',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    
    padding: '12px 16px',
    margin: '6px 6px',
    border: 'none',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',

    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      backgroundColor: blue[400]
    },
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor:blue[50],
      
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);


export default function UnstyledTabsCustomized(props) {
  const theme = useTheme();
  const {Bloques, Config }=props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  // if (Bloques && Object.keys(Bloques).length < value+1){
  //   setValue(0);
  // }
  const {tipo} = Ver_Valores();
  return (
    <Container fixed disableGutters  maxWidth="xl">
      <Grid container spacing={0}  >
        <Grid item xs={12}>
          <Box sx={{width: '100%',}}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: {
                    '&.Mui-disabled': { opacity: 0.3 },
                  },
                  backgroundColor: blue[500],
                  borderRadius: '8px',
                  width:tipo==='Web' ? '93%' : '100%', 
                  ...Config ? Config.Estilos.barra_menu : {}
                }}
              >
                {Bloques 
                    ?
                        Object.keys(Bloques).map((valor,i)=>
                            <StyledTab key={valor+ i} label={valor}>
                                {valor}
                            </StyledTab>
                        )
                    :
                        <StyledTab>
                          <Skeleton animation="wave" height={20} width="80%" />
                        </StyledTab>
                }
                
              </Tabs>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {Bloques
            ?
                Object.keys(Bloques).map((valor,i)=>
                  value===i  && (
                        <Scrollbars key={i+'-'+valor} elevation={3} 
                          sx={{  marginTop: 0, height:tipo==='Web' ? '102%' : '100%', 
                                  width:tipo==='Web' ? '93%' : '100%', 
                                  bgcolor:'#000000', color:'#ffffff', overflowX:'auto', 
                                  ... Config ? Config.Estilos.Dialogo_cuerpo :{}
                              }}
                        >
                            {Bloques[valor]}
                        </Scrollbars>
                  )
                )
            :
                
                    <Paper elevation={3} sx={{  height:'82vh', bgcolor:'#000000', color:'#ffffff', padding:2}}>
                      <Skeleton sx={{ height: '80vh' }} animation="wave" variant="rectangular" />
                    </Paper>
                
          }
        </Grid> 
      </Grid>
      {/* <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {Bloques 
              ?
                  Object.keys(Bloques).map((valor,i)=>
                      <Tab key={valor+ i} label={valor} {...a11yProps(i)}>
                          {valor}
                      </Tab>
                  )
              :
                  <Tab>
                    <Skeleton animation="wave" height={20} width="80%" />
                  </Tab>
          }
        </Tabs>
      </AppBar>
      
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
          
        {Bloques
            ?
                Object.keys(Bloques).map((valor,i)=>
                  value===i  && (
                      <TabPanel key={i+'-'+valor} value={value} index={i} dir={theme.direction}>
                        <Paper  elevation={3} sx={{  marginTop: 0, height:'82vh', bgcolor:'#000000', color:'#ffffff', overflowX:'auto'}}>
                            {Bloques[valor]}
                        </Paper>
                      </TabPanel>
                  
                  )
                )
            :
                
                    <Paper elevation={3} sx={{  height:'82vh', bgcolor:'#000000', color:'#ffffff', padding:2}}>
                      <Skeleton sx={{ height: '80vh' }} animation="wave" variant="rectangular" />
                    </Paper>
                
        } */}
    </Container> 
  );
}
