
export  const  renderText =   (componentMode,clickType) => {
    if(componentMode === 'lightControl' && clickType ){
        return "ON"
    }else  if(componentMode === 'lightControl' && clickType ){
        return "OFF"
    }
    return "OFF"
}