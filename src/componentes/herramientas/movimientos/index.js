import * as React from 'react';
import Box from '@mui/material/Box';
import Page from './page';
import Dialogo from '../dialogo';
import {ItemMP, ItemFormula} from './items';

export default class Movimientos extends React.Component {
    constructor(props) {
        super(props);
  
        this.state = {
            cargando:true,
            props: this.props,
            ...this.props,
            Dialogo:{
                open:false,
                Titulo:'Mi cuenta',
                tam:'xs',
                Cerrar: this.Cerrar_dialogo,
            },
            Actualizar : this.Actualizar,
            Enviar: this.Enviar,
            Inicio: this.Inicio
        }
    }
    Actualizar = (Grupos) =>{
        
        this.setState({Grupos})
    } 
    Enviar = (Grupos) =>{
        console.log(Grupos)
        if (this.state.props.Enviar){
            this.state.props.Enviar(Grupos)
        }
        return
    }  
    async componentDidMount(){
        if (Object.keys(this.state.props.Grupos).length!==0){
            this.Inicio(this.state.props.Grupos);
        }
        let libres = [
            {label:'1'},
            {label:'2'},
            {label:'3'},
            {label:'4'},
            {label:'5'},
            {label:'6'},
            {label:'7'},
            {label:'8'},
            {label:'9'},
            {label:'10'},
            {label:'11'},
            {label:'12'},
            {label:'13'},
            {label:'14'},
            {label:'15'},
            {label:'16'},
            {label:'17'},
            {label:'18'},
            {label:'19'}
        ]
        let seleccionados = [
            
        ]
        let Grupos = {
            MateriaPrima:{
                Titulo:'Materia Prima',
                Espacio:4,
                // Style:{height:window.innerHeight * 0.4},
                Datos:libres,
                Item: (props) => ItemMP(props)
            }, 
            Formula:{
                Titulo:'Formula',
                Espacio:8,
                Datos:seleccionados,
                Item: (props) => ItemFormula(props),
                Alto : '63%',

            },
        }
            
        // this.setState({Grupos})
    }
  
    Inicio = (Grupos)=>{
        console.log('>>>>>>>>>>>>>>>.',Grupos)

        this.setState({Grupos})

    }
    static getDerivedStateFromProps(props, state) {
  
      if (props !== state.props) {
        let Grupos = {};
        if (Object.keys(props.Grupos).length!==0){
            Grupos = props.Grupos;
        }

        return {
          props,
          Config:props.Config,
          Grupos
        };
      }
      // No state update necessary
      return null;
    }
    
    
    render(){
      
        return (
            <div>
                <Page  {...this.state}/>
                
            </div>
        )
    }
}

