

let Valores={}

export const Ver_Valores = ()=>{
    return Valores
}
  
export const nuevo_Valores = (nuevo)=>{
    Valores={...Valores, ...nuevo}
}