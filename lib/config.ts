const config = {
    env:{
        databaseUrl: process.env.DATABASE_URL,
        baseUrl: process.env.BASE_URL,
        cloudinary:{
            name: process.env.CLOUDINARY_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            secretKey: process.env.CLOUDINARY_API_SECRET
        }
    }
}

export default config;