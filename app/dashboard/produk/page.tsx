"use client";
import { getProduk } from "@/api/produkApi";
import { ModalAddProduk } from "@/components/ModalAddProduk";
import { TableProduk } from "@/components/TableProduk";
import { Button } from "@/components/ui/button";
import { downloadExcel } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import React from "react";

const page = () => {
  const produkRes = useQuery({
    queryKey: ["produk"],
    queryFn: getProduk,
    staleTime: 5 * 60 * 1000,
  });
  return (
    <div className="relative space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl">Produk</h1>
          <p className="text-gray-500">Here's a list of All of your Produk!</p>
        </div>
        <div className="flex items-center gap-2">
          {produkRes.isLoading ? (
            "Loading..."
          ) : (
            <Button
              variant="outline"
              className="border-primary border-dashed shadow-none"
              onClick={() =>
                downloadExcel(produkRes.data?.content, "data-produk")
              }
            >
              <DownloadIcon />
              Download
            </Button>
          )}
          <ModalAddProduk />
        </div>
      </div>
      {produkRes.isLoading ? (
        "Loading..."
      ) : (
        <TableProduk dataItem={produkRes.data.content ?? []} />
      )}
    </div>
  );
};

export default page;
