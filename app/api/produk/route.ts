import { uploadImages } from "@/lib/cloudinary";
import { pool } from "@/lib/db";
import { TEditProdukSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export const GET = async (req:NextRequest) => {
    const sp = req.nextUrl.searchParams;
    const totalProduk = sp.get('totalProduk')
    const thisWeek = sp.get('thisWeek')
    const limit = sp.get('limit')

    try {
        if(totalProduk && thisWeek){
            const res = await pool.query(`
                select count(id_produk) as total_produk_this_week
                from tbl_produk
                where tgl_register >= now() - interval '7day';
                `)

            return NextResponse.json({message: `success get total unique produk`,content:res.rows[0]},{status: 200})
        }else if(totalProduk){
            const res = await pool.query(`
                select count(id_produk) as total_produk
                from tbl_produk;
                `)

            return NextResponse.json({message: `success get total unique produk this week`,content:res.rows[0]},{status: 200})
        }else if(limit){
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
            limit $1`,[limit]);

            return NextResponse.json({message: `success get total unique produk this week`,content:res.rows},{status: 200})
        }

        

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
            `);
        
        return NextResponse.json({message: `success get produk`,content:res.rows},{status: 200})
    } catch (error) {
        return NextResponse.json({message: `error failed: ${error as Error}`,content:null},{status: 500})
    }
}

export const POST = async (req:NextRequest) =>{
    const uuid = uuidv4();
    const formData = await req.formData()
    
    const files = formData.getAll("foto_produk") as File[];
    const jumlah_barang = formData.get("jumlah_barang") as string;
    const id_kategori = formData.get("id_kategori") as string;
    const nama_produk = formData.get("nama_produk") as string;
    
    const client = await pool.connect()

    try {
        await client.query("COMMIT");
         // --- 1. Upload semua file ---
        const uploadedUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const buffer = Buffer.from(await file.arrayBuffer());
            
            // convert buffer → dataURL
            const base64 = buffer.toString("base64");
            const dataUrl = `data:${file.type};base64,${base64}`;
            
            const url = await uploadImages(dataUrl, `${nama_produk}-${uuid.slice(0, 4)}`, "produk");
            uploadedUrls.push(url);
        }
        
        // --- 2. Gabungkan URL jadi satu string ---
        const fotoUrlToSave = uploadedUrls.join('||');
        
        // --- 3. Insert produk ---

        const produkResult = await client.query(
        `
        INSERT INTO tbl_produk (nama_produk, foto_produk, kode_produk, id_kategori)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [nama_produk, fotoUrlToSave, "KODE-" + uuid.slice(0, 4), id_kategori]
        );

        const produk = produkResult.rows[0];

        // --- 4. Insert stok ---
        await client.query(
        `
        INSERT INTO tbl_stok (id_produk, jumlah_barang)
        VALUES ($1, $2)
        `,
        [produk.id_produk, jumlah_barang]
        );

        await client.query("COMMIT");

        return NextResponse.json({message: `success post produk`,content:produk},{status: 200})
    } catch (error) {
        await client.query('rollback')
        return NextResponse.json({message: `error failed: ${error as Error}`,content:null},{status: 500})
    } finally{
        client.release()
    }
}

export const PUT = async (req:NextRequest) =>{
    const {id_kategori,jumlah_barang,nama_produk,id_produk}:TEditProdukSchema = await req.json();
    
    const client = await pool.connect()

    try {
        await client.query("COMMIT");

        // --- 1. put produk ---
        const produkResult = await client.query(
        `
        update tbl_produk
        set nama_produk = $1,
            id_kategori = $2
        where id_produk = $3
        returning *
        `,
        [nama_produk, id_kategori, id_produk]
        );

        const produk = produkResult.rows[0];

        // --- 2. Insert stok ---
        await client.query(
        `
        update tbl_stok
        set jumlah_barang = $1
        where id_produk = $2
        returning *
        `,
        [jumlah_barang,produk.id_produk]
        );

        await client.query("COMMIT");

        return NextResponse.json({message: `success update produk`,content:produk},{status: 200})
    } catch (error) {
        await client.query('rollback')
        return NextResponse.json({message: `error failed: ${error as Error}`,content:null},{status: 500})
    } finally{
        client.release()
    }
} 