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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pen } from "lucide-react";
import { useForm } from "react-hook-form";
import { editKategoriSchema, TEditKategoriSchema } from "@/lib/validations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editKategori } from "@/api/kategoriApi";
import { toast } from "sonner";
import { Kategori } from "@/types/kategori";

export default function ModalEditKategori({dataEach}:{dataEach:Kategori}) {
  const form = useForm<TEditKategoriSchema>({
    resolver: zodResolver(editKategoriSchema),
    defaultValues: {
      id_kategori: Number(dataEach.id_kategori),
      nama_kategori: dataEach.nama_kategori,
    },
  });

  const queryClient = useQueryClient();

  const editKategoriMutation = useMutation({
    mutationFn: editKategori,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
    },
    onError: (err) => {
      toast.error("edit data error");
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
    },
  });

  const handleSubmit = (data: TEditKategoriSchema) => {
    if(!data.nama_kategori.trim()){
      return
    }
    editKategoriMutation.mutate(data)
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group flex items-center" variant={'outline'}>
          <Pen size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Kategori</DialogTitle>
              <DialogDescription>
                Edit Kategori to your form here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <FormField
                control={form.control}
                name={"nama_kategori"}
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
