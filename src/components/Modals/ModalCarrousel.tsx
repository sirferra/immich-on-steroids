import { Asset, AssetType } from "@/models/Asset"
import Image from "next/image";
import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

type ModalCarrouselProps ={
    assets: AssetType[];
}
export default function ModalCarrousel({assets}:ModalCarrouselProps){
    if(!assets){
        return 'No hay assets para este link. Esto es un error';
    }
    return (
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper w-xl h-max">
            {assets.map((asset:AssetType)=>new Asset(asset)).map((asset: Asset)=>(
                (asset.type === 'VIDEO' &&
                <SwiperSlide key={asset.id}>
                <video key={asset.id} src={asset.getSrc()} controls></video>
                </SwiperSlide>)
                || 
                (<SwiperSlide key={asset.id}>
                    <Image key={asset.id} src={asset.getSrc()} alt={asset.originalFileName} width={100} height={100} />
                </SwiperSlide>)
            ))}
        </Swiper>
    )
}