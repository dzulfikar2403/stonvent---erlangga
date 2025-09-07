import {z} from 'zod'

// schema
export const postProdukSchema = z.object({
    nama_produk: z.string().nonempty({message: 'can not empty!'}).trim(),
    id_kategori: z.number().min(1),
    jumlah_barang: z.number().min(1),
    foto_produk: z.union([z.array(z.instanceof(File)),z.null()])
})

export const editProdukSchema = z.object({
    id_produk: z.number().min(1),
    nama_produk: z.string().nonempty({message: 'can not empty!'}).trim(),
    id_kategori: z.number().min(1),
    jumlah_barang: z.number().min(1)
})


export const postKategoriSchema = z.object({
    nama_kategori: z.string().nonempty({message: 'can not empty!'}).trim()
})

export const editKategoriSchema = z.object({
    id_kategori: z.number().min(1),
    nama_kategori: z.string().nonempty({message: 'can not empty!'}).trim()
})

// type-schema
export type TPostProdukSchema = z.infer<typeof postProdukSchema>
export type TEditProdukSchema = z.infer<typeof editProdukSchema>
export type TEditKategoriSchema = z.infer<typeof editKategoriSchema>
export type TPostKategoriSchema = z.infer<typeof postKategoriSchema>