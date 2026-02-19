import logo from '@public/assets/logo.png';
import Image from 'next/image';
import { SearchBar } from './SearchBar';
export default function TopBar(){

    return (
        <header className="w-full shrink-0 border-b border-[var(--mantine-color-default-border)] bg-[var(--mantine-color-body)] p-4">
            <div className="w-100vh flex justify-around">
                <div className="left_column flex items-center ml-0 mr-10">
                    <Image src={logo} alt="Logo" className="h-8 w-8 mouse-cursor-pointer"/>
                    <h1 className="text-xl font-bold">Immich on Steroids</h1>
                </div>
                <div className="center_column ml-0 mr-auto">
                    <SearchBar />
                </div>
                <div className="right_column mr-0 ml-auto bg-amber-200">
                    {/* User profile */}
                </div>
            </div>
        </header>
    )
}