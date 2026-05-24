'use client';
import { DataInModal, useModalStore } from "@/store/ModalStore";
import Image from "next/image";

type ClickeableImageProps = {
    key: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    eventType: 'renderAssets' | 'gotoLink' | 'other';
    payload: DataInModal
}

export default function ClickeableImage({ key, src, alt, width, height, className='',eventType, payload}: ClickeableImageProps) {
    const {setData, setIsOpen} = useModalStore();
    const handleOnClick = () => {
        switch (eventType) {
            case 'renderAssets':
                setData(payload);
                setIsOpen(true);
                console.log('trato de renderizar modal')
                return;
            case 'gotoLink':
                
                return;
            case 'other':
                return;
            default:
                return;
        }
    }

    return (
        <Image  
            key={key}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onClick={handleOnClick}
        />
    );

}