"use client";
import { CircleAlertIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartPieKategori } from "@/components/ChartPieKategori";
import {
  getKategoriCountProduk,
  getTotalUniqueKategori,
} from "@/api/kategoriApi";
import { useQuery } from "@tanstack/react-query";
import {
  getProdukByLimit,
  getTotalUniqueProduk,
  getTotalUniqueProdukThisWeek,
} from "@/api/produkApi";
import randomColor from "randomcolor";
import { ChartConfig } from "@/components/ui/chart";
import Top10Produk from "@/components/Top10Produk";
import { useSession } from "next-auth/react";

const page = () => {
  const { data } = useSession();
  const user = data?.user;

  const produkByLimitRes = useQuery({
    queryKey: ["produk"],
    queryFn: () => getProdukByLimit(10),
    staleTime: 5 * 60 * 1000,
  });

  const totalKategoriUniqueRes = useQuery({
    queryKey: ["total_unique_kategori"],
    queryFn: getTotalUniqueKategori,
    staleTime: 5 * 60 * 1000,
  });

  const totalProdukUniqueRes = useQuery({
    queryKey: ["total_unique_produk"],
    queryFn: getTotalUniqueProduk,
    staleTime: 5 * 60 * 1000,
  });

  const totalProdukUniqueWeekRes = useQuery({
    queryKey: ["total_unique_produk_week"],
    queryFn: getTotalUniqueProdukThisWeek,
    staleTime: 5 * 60 * 1000,
  });

  const totalProdukByKategori = useQuery({
    queryKey: ["total_produk_by_kategori"],
    queryFn: getKategoriCountProduk,
    staleTime: 5 * 60 * 1000,
  });

  const mapKategoriToChartData = (data: any[]) => {
    return data.map((item) => {
      const color = randomColor({ luminosity: "bright", format: "hex" });
      return {
        nama_kategori: item.nama_kategori.toLowerCase(),
        total_produk: Number(item.total_produk),
        fill: color, // 🎨 hex color random
      };
    });
  };

  const injectChartConfig = (
    data: ReturnType<typeof mapKategoriToChartData>
  ): ChartConfig => {
    const config: ChartConfig = {
      visitors: { label: "Visitors" },
      desktop: { label: "Desktop" },
      mobile: { label: "Mobile" },
    };

    data.forEach((item) => {
      config[item.nama_kategori] = {
        label: item.nama_kategori,
        color: item.fill,
      };
    });

    return config;
  };

const chartDataTotalProdukByKategori = totalProdukByKategori.isSuccess
  ? mapKategoriToChartData(totalProdukByKategori.data?.content ?? [])
  : [];

  const chartDataConfigTotalProdukByKategori = injectChartConfig(
    chartDataTotalProdukByKategori ?? []
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-medium">
          Hello {user?.name}, Great to see you again!
        </h1>
        <Badge variant="secondary">{user?.email}</Badge>
      </div>
      <Alert className="bg-primary/10 border-none">
        <CircleAlertIcon />
        <AlertTitle>Overview Of Summary Data.</AlertTitle>
        <AlertDescription>
          Summary of the latest product and category data. View weekly developments, overall performance, and the most popular products.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="min-w-[20%]">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-bold">
              Total Unique Produk this Week
            </CardTitle>
            <CardAction>
              <CircleAlertIcon size={20} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              +{" "}
              {totalProdukUniqueWeekRes.isLoading
                ? "..."
                : totalProdukUniqueWeekRes.data?.content
                    ?.total_produk_this_week}
            </p>
            <small className="text-xs">+180.1% from last month</small>
          </CardContent>
        </Card>
        <Card className="min-w-[20%]">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-bold">
              Total Unique Kategori this Week
            </CardTitle>
            <CardAction>
              <CircleAlertIcon size={20} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              +{" "}
              {totalKategoriUniqueRes.isLoading
                ? "..."
                : totalKategoriUniqueRes.data?.content
                    ?.total_kategori_this_week}
            </p>
            <small className="text-xs">+180.1% from last month</small>
          </CardContent>
        </Card>

        <Card className="min-w-[20%]">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-bold">
              Total Unique Produk All Time
            </CardTitle>
            <CardAction>
              <CircleAlertIcon size={20} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalProdukUniqueRes.isLoading
                ? "..."
                : totalProdukUniqueRes.data?.content?.total_produk}
            </p>
            <small className="text-xs">+180.1% from last month</small>
          </CardContent>
        </Card>
        <Card className="min-w-[20%]">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-bold">
              Total Unique Kategori this Week
            </CardTitle>
            <CardAction>
              <CircleAlertIcon size={20} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalKategoriUniqueRes.isLoading
                ? "..."
                : totalKategoriUniqueRes.data?.content
                    ?.total_kategori_this_week}
            </p>
            <small className="text-xs">+180.1% from last month</small>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {totalProdukByKategori.isLoading ? '...' : <ChartPieKategori dataItem={chartDataTotalProdukByKategori} chartConfig={chartDataConfigTotalProdukByKategori} />}
        <Card>
          <CardHeader>
            <CardTitle className="font-medium">Top 10 Produk</CardTitle>
            <CardDescription>By Quantity</CardDescription>
          </CardHeader>
          <CardContent>
            <Top10Produk dataItem={produkByLimitRes.data?.content ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
