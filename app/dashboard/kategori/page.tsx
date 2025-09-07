"use client";
import { getKategori } from "@/api/kategoriApi";
import { ModalAddKategori } from "@/components/ModalAddKategori";
import { TableKategori } from "@/components/TableKategori";
import { Button } from "@/components/ui/button";
import { downloadExcel } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import React from "react";

const page = () => {
  const kategoriRes = useQuery({
    queryKey: ["kategori"],
    queryFn: getKategori,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="relative space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl">Kategori</h1>
          <p className="text-gray-500">
            Here's a list of All of your Kategori!
          </p>
        </div>
        <div className="flex items-center gap-2">
          {kategoriRes.isLoading ? (
            "Loading..."
          ) : (
            <Button
              variant="outline"
              className="border-primary border-dashed shadow-none"
              onClick={() =>
                downloadExcel(kategoriRes.data?.content, "data-kategori")
              }
            >
              <DownloadIcon />
              Download
            </Button>
          )}
          <ModalAddKategori />
        </div>
      </div>
      {kategoriRes.isLoading ? (
        "Loading..."
      ) : (
        <TableKategori dataItem={kategoriRes.data?.content ?? []} />
      )}
    </div>
  );
};

export default page;
