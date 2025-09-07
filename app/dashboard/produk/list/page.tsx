"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ModalAddProduk } from "@/components/ModalAddProduk";
import { ModalAddKategori } from "@/components/ModalAddKategori";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduk } from "@/api/produkApi";
import { getKategori } from "@/api/kategoriApi";
import { Kategori } from "@/types/kategori";
import { useEffect, useState } from "react";

const kat = [
  {
    id: 1,
    nama_kategori: "snack",
  },
  {
    id: 2,
    nama_kategori: "rice",
  },
];


export default function page() {
  const [defValKat, setDefValKat] = useState('')
  const route = useRouter();
    const produkRes = useQuery({
    queryKey: ["produk"],
    queryFn: getProduk,
    staleTime: 5 * 60 * 1000,
  });
  
    const kategoriRes = useQuery({
    queryKey: ["kategori"],
    queryFn: getKategori,
    staleTime: 5 * 60 * 1000,
  });

  
  useEffect(() => {
    if(kategoriRes.data && kategoriRes.isSuccess){

      setDefValKat(kategoriRes.data?.content[0].nama_kategori)
    }
  },[kategoriRes.data,kategoriRes.isSuccess])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl">Produk - Card</h1>
          <p className="text-gray-500">Here's a list of All of your Produk - Card!</p>
        </div>
        <div className="flex items-center gap-2">
          <ModalAddKategori />
          <ModalAddProduk />
        </div>
      </div>
      <Tabs defaultValue={defValKat??'snacks'} className="space-y-4">
        <TabsList>
          {kategoriRes.data?.content.map((el:Kategori) => (
            <TabsTrigger key={el.id_kategori} value={el.nama_kategori} className="min-w-28 capitalize">
              {el.nama_kategori}
            </TabsTrigger>
          ))}
        </TabsList>
        {kategoriRes.data?.content.map((el:Kategori) => (
          <TabsContent
            key={el.id_kategori}
            value={el.nama_kategori}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {produkRes.data?.content.length > 0 ?
              produkRes.data?.content
                .filter((dt:Produk) => dt.nama_kategori === el.nama_kategori)
                .map((item:Produk) => (
                  <div
                    key={item.id_produk}
                    className="relative rounded-xl  overflow-hidden pt-0 shadow-lg"
                  >
                    <div className="flex h-60 items-center justify-center ">
                      <img
                        src={item.foto_produk?.split('||')[0] ?? "https://placehold.co/600x400"}
                        alt={item.nama_produk}
                        // className="w-75"
                      />
                    </div>
                    <Card className="border-none">
                      <CardHeader>
                        <CardTitle className="text-2xl capitalize">
                          {item.nama_produk}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline">{item.nama_kategori}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium uppercase">
                            Stock:
                          </span>
                          <span className="text-xl font-semibold">
                            {item.jumlah_barang}
                          </span>
                        </div>
                        <Button size="lg" onClick={() => route.push(item.id_produk.toString())}>Detail</Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))
              :(
                <p>{produkRes.isLoading ? 'loading' : 'data not found'}</p>
              )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
