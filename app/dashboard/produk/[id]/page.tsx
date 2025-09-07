"use client";
import { getProdukById } from "@/api/produkApi";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [mainFoto, setMainFoto] = useState<string | null>(null);

  const produkRes = useQuery({
    queryKey: ["produk", id],
    queryFn: () => getProdukById(id as string),
    staleTime: 5 * 60 * 1000,
  });

  const data = produkRes.data?.content ?? null;

  // selalu dipanggil, tidak conditional return lagi
  const listFoto =
    data?.foto_produk && data.foto_produk.trim() !== ""
      ? data.foto_produk.split("||")
      : ["https://placehold.co/600x400/png"];

  useEffect(() => {
    if (listFoto.length > 0) {
      setMainFoto(listFoto[0]);
    }
  }, [data?.foto_produk]);

  const handleMainFoto = (urlFoto: string) => setMainFoto(urlFoto);

  return (
    <div>
      {/* kondisi loading */}
      {produkRes.isLoading && <div>Loading...</div>}

      {/* kondisi error / kosong */}
      {!produkRes.isLoading && !data && <div>Produk tidak ditemukan</div>}

      {/* kondisi sukses */}
      {!produkRes.isLoading && data && (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-2">
            <div className="relative w-full md:flex-1 h-80 border-2 rounded overflow-hidden">
              <Image
                src={mainFoto ?? listFoto[0]}
                alt={data.nama_produk}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {listFoto.map((foto: string, index: number) => (
                <div
                  key={index}
                  className="relative w-16 h-16 border-2 rounded overflow-hidden cursor-pointer"
                  onMouseOver={() => handleMainFoto(foto)}
                >
                  <Image
                    src={foto}
                    alt={`${data.nama_produk}-${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:flex-1 space-y-4">
            <p>
              4.4 ~{" "}
              <span className="underline underline-offset-2">
                Based on 124 Reviews
              </span>
            </p>
            <h1 className="font-bold text-4xl capitalize">
              {data.nama_produk} - KODE0098
            </h1>
            <div>
              <h2>senin</h2>
              <Badge variant="secondary">Snacks</Badge>
            </div>
            <div>
              <p>Stok:</p>
              <h3 className="text-2xl font-bold">80</h3>
            </div>
            <div>
              <p className="font-semibold text-lg">Overview:</p>
              <p className="text-sm">Mollis eu elementum laoreet netus mi justo mus amet. Bibendum
              lobortis ut semper felis phasellus turpis libero. Facilisis amet
              nisl netus tempor feugiat ipsum metus fringilla massa nibh quis.
              Gravida congue per pellentesque dapibus nisi. Pulvinar lacinia
              eget eleifend ullamcorper sagittis rhoncus dictumst enim.
              Venenatis diam massa ligula nec condimentum etiam. Conubia rhoncus
              viverra tellus justo neque dignissim ullamcorper sed. Posuere <br /><br />
              auctor sollicitudin cras nisl sed feugiat ullamcorper. Rutrum
              blandit eleifend scelerisque praesent at sagittis quis. Justo
              letius morbi condimentum venenatis id faucibus blandit habitant
              odio amet. Consequat odio donec malesuada ex cras mollis curabitur
              platea. Malesuada nascetur aenean eleifend finibus vulputate
              interdum potenti augue at molestie ullamcorper. Morbi hac
              condimentum id sit fames ultricies.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
