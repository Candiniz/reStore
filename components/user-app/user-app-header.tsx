'use client'

import { useSidebar } from "@/contexts/SidebarContext"; // Importa o hook do contexto
import { UserNav } from "../common/user-nav";
import { MdMenuBook } from "react-icons/md";
import Image from "next/image";

export default function UserAppHeader() {
  const { toggleSidebar } = useSidebar(); // Pega a função toggleSidebar do contexto

  return (
    <header>
      <nav className="flex justify-between h-[50px] items-center text-white bg-gray-900 w-full py-2 px-5 fixed top-0 left-0 z-50">
        <div className="flex">
          <button
            onClick={toggleSidebar} // Chama o toggleSidebar aqui
            className="align-middle lg:hidden relative text-white pr-5 text-3xl hover:text-[#869dac]"
          >
            <MdMenuBook />
          </button>
          <div className="w-[120px] lg:w-fit">
            <Image alt='Logo' src='/logo2.png' width={150} height={30} />
          </div>
        </div>
        <UserNav />
      </nav>
    </header>
  );
}
