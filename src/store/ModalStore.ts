import { AssetType } from '@/models/Asset';
import {create} from 'zustand';

export type DataInModal = AssetType[]| string | object

type modalTypes = 'carrousel'

interface ModalState{
    data: DataInModal | null;
    modalType: modalTypes
    isOpen: boolean;
    setData: (data: DataInModal) => void; 
    setIsOpen: (isOpen: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
    data: null,
    modalType: 'carrousel',
    isOpen: false,
    setData: (data: DataInModal) => set(() => ({data})),
    setIsOpen: (isOpen: boolean) => set(() => ({isOpen})),
}))

