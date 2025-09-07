// import { auth } from "@/auth"
import axiosInstace from "@/lib/axios"
import { TEditKategoriSchema, TPostKategoriSchema } from "@/lib/validations"

export const getKategori = async() => {
    const res = await axiosInstace.get('/api/kategori')

    return res.data
}

export const getTotalUniqueKategori = async() => {
    const res = await axiosInstace.get('/api/kategori?totalKategori=true')

    return res.data
}

export const getKategoriCountProduk = async() => {
    const res = await axiosInstace.get('/api/kategori?kategoriCountProduk=true')

    return res.data
}

export const postKategori = async(credential:TPostKategoriSchema) => {
    const res = await axiosInstace.post('/api/kategori',credential)

    return res.data
}

export const editKategori = async(credential:TEditKategoriSchema) => {
    const res = await axiosInstace.put('/api/kategori',credential)

    return res.data
}