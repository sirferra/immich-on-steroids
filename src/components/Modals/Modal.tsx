'use client'
import { useModalStore } from "@/store/ModalStore";
import { Button } from "@mantine/core";
import ModalCarrousel from "./ModalCarrousel";
import { AssetType } from "@/models/Asset";

export default function Modal() {
    // meter esto en un modal padre. Renderizar el contenido en modalCarrousel. 
    const {isOpen,setIsOpen, modalType, data} = useModalStore();
    const renderModalType = () => {
        switch (modalType) {
            case 'carrousel':
                return <ModalCarrousel assets={data as AssetType[]} />;
            default:
                return null;
        }
    }
    return (
        isOpen && 
        <div className="modal-container w-full h-full">
            <div className="modal-background w-full h-full fixed top-0 left-0 z-99 bg-black opacity-50" onClick={() =>  setIsOpen(false)}></div>
            <div className="modal-content w-full h-full fixed top-0 left-0 z-100 flex justify-center items-center" >
                {renderModalType()}            
            </div>
        </div>
            
    );
}