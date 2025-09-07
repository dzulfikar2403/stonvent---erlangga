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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { postKategoriSchema, TPostKategoriSchema } from "@/lib/validations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKategori } from "@/api/kategoriApi";
import { toast } from "sonner";

export function ModalAddKategori() {
  const form = useForm<TPostKategoriSchema>({
    resolver: zodResolver(postKategoriSchema),
    defaultValues: {
      nama_kategori: "",
    },
  });

  const queryClient = useQueryClient();

  const postKategoriMutation = useMutation({
    mutationFn: postKategori,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
    },
    onError: (err) => {
      toast.error("post data error");
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
    },
  });

  const handleSubmit = (data: TPostKategoriSchema) => {
    if(!data.nama_kategori.trim()){
      return
    }
    postKategoriMutation.mutate(data)
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group flex items-center">
          <p>Add Kategori</p>
          <Plus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Kategori</DialogTitle>
              <DialogDescription>
                Add Kategori to your form here. Click save when you&apos;re
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
