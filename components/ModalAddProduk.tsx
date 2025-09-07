"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { postProdukSchema, TPostProdukSchema } from "@/lib/validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getProduk } from "@/api/produkApi";
import { getKategori } from "@/api/kategoriApi";
import { useEffect, useState } from "react";
import { Kategori } from "@/types/kategori";
import { postProduk } from "@/api/produkApi";
import { toast } from "sonner";

export function ModalAddProduk() {
  const queryClient = useQueryClient()
  const form = useForm<TPostProdukSchema>({
    resolver: zodResolver(postProdukSchema),
    defaultValues: {
      nama_produk: "",
      id_kategori: undefined, // biarin kosong dulu
      jumlah_barang: 1,
      foto_produk: null,
    },
  });

  const kategoriListRes = useQuery({
    queryKey: ["kategori"],
    queryFn: getKategori,
    staleTime: 5 * 60 * 1000,
  });

  const postProdukMutation = useMutation({
    mutationFn: postProduk,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['produk'] })
    },
    onError: (err) => {
      console.log(err);
      
      toast.error('post data error');
      queryClient.invalidateQueries({ queryKey: ['produk'] })
    }
  })

  const handleSubmit = (data: TPostProdukSchema) => {
    postProdukMutation.mutate(data);
    form.reset();
  };


  useEffect(() => {
    if (kategoriListRes.isSuccess && kategoriListRes.data.length > 0) {
      form.reset({
        ...form.getValues(),
        id_kategori: kategoriListRes.data[0].id_kategori, // otomatis pilih kategori pertama
      });
    }
  }, [kategoriListRes.isSuccess, kategoriListRes.data, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group flex items-center">
          <p>Add Produk</p>
          <Plus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Produk</DialogTitle>
              <DialogDescription>
                Add Produk to your form here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <FormField
                control={form.control}
                name={"nama_produk"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id_kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()} // ✅ gunakan value, bukan defaultValue
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {kategoriListRes.data && kategoriListRes.isSuccess &&  kategoriListRes?.data.content.map((kat: Kategori) => (
                          <SelectItem
                            key={kat.id_kategori}
                            value={`${kat.id_kategori}`}
                          >
                            {kat.nama_kategori}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"jumlah_barang"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"foto_produk"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          field.onChange(files); // simpan sebagai File[]
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
