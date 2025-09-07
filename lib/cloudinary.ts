import {v2 as cloudinary} from 'cloudinary'
import config from './config'

cloudinary.config({
    cloud_name: config.env.cloudinary.name,
    api_key: config.env.cloudinary.apiKey,
    api_secret: config.env.cloudinary.secretKey
})

export async function uploadImages(img:string,imgName:string, folder: string) {
        const getFolder = folder.slice(0,1).includes('/') ? folder.slice(1,folder.length) : folder; //kalo berawalan (/) ambil setelahnya, jika ngk ada langsung taro.
        
        const res = await cloudinary.uploader.upload(img,{
            public_id: `${imgName.concat(Date.now().toString())}`,
            folder: `test-erlangga/${getFolder}`,
            resource_type: "auto",
            eager: [{width: 600,height:400,fetch_format:"auto",quality:"auto"}]
        });
        
        return res.eager[0].secure_url;
}