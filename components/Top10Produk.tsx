import { ChevronUpIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const Top10Produk = ({dataItem}:{dataItem:Produk[]}) => {
  const dataRes = dataItem.sort((a,b) => b.jumlah_barang - a.jumlah_barang)
  return (
    <Collapsible className='flex w-full flex-col items-start gap-4'>
      <ul className='flex w-full flex-col gap-4'>
        {dataRes.slice(0, 5).map(item => (
          <li key={item.id_produk} className='flex items-start gap-4'>
            <Avatar>
              <AvatarImage src={item.foto_produk?.split('||')[0] ?? 'https://placehold.co/600x400/png'} alt={item.nama_produk} />
              <AvatarFallback>{item.nama_produk}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-col'>
              <div className='text-sm font-medium'>{item.nama_produk}</div>
              <p className='text-muted-foreground text-xs'>{item.nama_kategori}</p>
            </div>
            <span className='text-muted-foreground text-sm'>{`${item.jumlah_barang}`}</span>
          </li>
        ))}
        <CollapsibleContent className='flex flex-col gap-2'>
          {dataRes.slice(5).map(item => (
            <li key={item.id_produk} className='flex items-start gap-4'>
              <Avatar>
                <AvatarImage src={item.foto_produk?.split('||')[0] ?? 'https://placehold.co/600x400/png'} alt={item.nama_produk} />
                <AvatarFallback>{item.nama_produk}</AvatarFallback>
              </Avatar>
              <div className='flex flex-1 flex-col'>
                <div className='text-sm font-medium'>{item.nama_produk}</div>
                <p className='text-muted-foreground text-xs'>{item.nama_kategori}</p>
              </div>
              <span className='text-muted-foreground text-sm'>{`${item.jumlah_barang}`}</span>
            </li>
          ))}
        </CollapsibleContent>
      </ul>
      <CollapsibleTrigger asChild>
        <Button variant='outline' size='sm'>
          <span className='[[data-state=open]>&]:hidden'>Show more</span>
          <span className='[[data-state=closed]>&]:hidden'>Show less</span>
          <ChevronUpIcon className='[[data-state=closed]>&]:rotate-180' />
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  )
}

export default Top10Produk
