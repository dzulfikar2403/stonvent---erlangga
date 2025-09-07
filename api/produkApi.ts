import axiosInstace from "@/lib/axios"
import { TEditProdukSchema, TPostProdukSchema } from "@/lib/validations"

export const getProduk = async() => {
    const res = await axiosInstace.get('/api/produk')

    return res.data
}

export const getProdukById = async(id:string) => {
    const res = await axiosInstace.get(`/api/produk/${id}`)

    return res.data
}

export const getProdukByLimit = async(limit:number) => {
    const res = await axiosInstace.get(`/api/produk?limit=${limit}`)

    return res.data
}

export const getTotalUniqueProduk = async() => {
    const res = await axiosInstace.get('/api/produk?totalProduk=true')

    return res.data
}

export const getTotalUniqueProdukThisWeek = async() => {
    const res = await axiosInstace.get('/api/produk?totalProduk=true&thisWeek=true')

    return res.data
}

export const postProduk = async(credential:TPostProdukSchema) => {
    const formData = new FormData();
    formData.append("nama_produk", credential.nama_produk);
    formData.append("jumlah_barang", String(credential.jumlah_barang));
    formData.append("id_kategori", String(credential.id_kategori));
    
    if (credential.foto_produk) {
        credential.foto_produk.forEach((file) => {
        formData.append("foto_produk", file); // multiple files
        });
    }

    const res = await axiosInstace.post('/api/produk',formData)

    return res.data
}

export const editProduk = async(credential:TEditProdukSchema) => {
    const res = await axiosInstace.put('/api/produk',credential)

    return res.data
}