import {Cloudinary} from "@cloudinary/url-gen";
import axios from "axios";
const App = () => {
  const cld = new Cloudinary({cloud: {cloudName: 'dtu1dwuwf'}});
};

export const uploadImagen = async(file, carpeta='chsplus', cloud_name='dtu1dwuwf') =>{
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", carpeta);
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    let options = {
        url: cloudinaryUrl,
        method:'POST',
        timeout: 8000,
        headers: {
          'Accept': 'application/json',
          'Content-type': 'multipart/form-data' 
        },
        data,    
    };
    const res = await axios(options)
        .then((response)=>{
            console.log(data)
            return response.data["secure_url"]
        })
        .catch(err => {
            console.log(err);
            // this.setState({cargando:false, progreso:0})
            return null
        });

    return res;
}