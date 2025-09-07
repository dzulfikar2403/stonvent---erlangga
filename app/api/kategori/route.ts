import { pool } from "@/lib/db";
import { TEditKategoriSchema, TPostKategoriSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => {
    const sp = req.nextUrl.searchParams;
    const totalKategori = sp.get('totalKategori')
    const kategoriCountProduk = sp.get('kategoriCountProduk')
    
    try {
        if(totalKategori){
            const res = await pool.query(`
                select count(distinct tk.id_kategori) as total_kategori_this_week
                from tbl_kategori tk;`);
        
            return NextResponse.json({message: `success get total unique kategori`,content:res.rows[0]},{status: 200})
        }else if(kategoriCountProduk){
            const res = await pool.query(`
                select tk.id_kategori,
                        tk.nama_kategori,
                        count(distinct tp.id_produk) as total_produk
                from tbl_produk tp 
                inner join tbl_kategori tk on (tp.id_kategori = tk.id_kategori )
                group by tk.id_kategori,tk.nama_kategori
                order by tk.nama_kategori;`);
        
            return NextResponse.json({message: `success get total produk by kategori`,content:res.rows},{status: 200})
        }
        
        const res = await pool.query(`
            select tk.id_kategori,
                    tk.nama_kategori 
            from tbl_kategori tk`);
    
        return NextResponse.json({message: `success get kategori`,content:res.rows},{status: 200})
    } catch (error) {
        return NextResponse.json({message: `error failed: ${error as Error}`,content:null},{status: 500})
    }
}

export const POST = async (req:NextRequest) => {
    const {nama_kategori}:TPostKategoriSchema = await req.json();


    try {
        const res = await pool.query(`
            insert into tbl_kategori(nama_kategori)
            values ($1)
            returning *`,[nama_kategori]);
    
        return NextResponse.json({message: `success post kategori`,content:res.rows},{status: 200})
    } catch (error) {
        return NextResponse.json({message: `error failed: ${error as Error}`,content:null},{status: 500})
    }
}

export const PUT = async (req:NextRequest) => {
    const {id_kategori,nama_kategori}:TEditKategoriSchema = await req.json();

    try {
        const res = await pool.query(`
            update tbl_kategori
            set nama_kategori = ($2)
            where id_kategori = $1
            returning *`,[id_kategori,nama_kategori]);
    
        return NextResponse.json({message: `success edit kategori`,content:res.rows},{status: 200})
    } catch (error) {
        return NextResponse.json({message: `error failed: ${error as Error}`,content:null},{status: 500})
    }
}