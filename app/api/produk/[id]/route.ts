import { pool } from "@/lib/db";
import {NextResponse, type NextRequest } from "next/server"

export const GET = async (req:NextRequest,{ params }: { params: { id: string } }) => {
    const { id } = params;
    
    try {
        const res = await pool.query(`
                        select tp.id_produk,
                        tk.id_kategori ,
                        tk.nama_kategori ,
                            tp.nama_produk ,
                            tp.kode_produk ,
                            tp.foto_produk ,
                            tp.tgl_register as tgl_update_produk,
                            ts.jumlah_barang ,
                            ts.tgl_update as tgl_update_stok
                    from tbl_produk tp 
                    inner join tbl_kategori tk on (tp.id_kategori = tk.id_kategori )
                    inner join tbl_stok ts on (tp.id_produk = ts.id_produk )
                    where tp.id_produk = $1;
                    `,[id]);
        
        if (res.rows.length === 0) {
            return NextResponse.json({ message: "produk tidak ditemukan", content: null },{ status: 404 });
        }

        return NextResponse.json({message: `success get produk by id`,content:res.rows[0]},{status: 200})
    } catch (error) {
        return NextResponse.json({message: `error failed: ${error as Error}`,content:null},{status: 500})
    }
}