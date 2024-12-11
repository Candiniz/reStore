'use client'

import { useSidebar } from "@/contexts/SidebarContext"; // Importa o hook do contexto
import { UserNav } from "../common/user-nav";
import { MdMenuBook } from "react-icons/md";

export default function UserAppHeader() {
  const { toggleSidebar } = useSidebar(); // Pega a função toggleSidebar do contexto

  return (
    <header>
      <nav className="flex justify-between items-center text-white bg-gray-900 w-full py-2 px-5 fixed top-0 left-0 z-50">
        <div className="">
          <button
            onClick={toggleSidebar} // Chama o toggleSidebar aqui
            className="align-middle lg:hidden relative text-white pr-5 text-3xl hover:text-[#869dac]"
          >
            <MdMenuBook />
          </button>
          <span className="align-middle font-extrabold text-2xl">re<span className="font-extralight">Stora</span></span>
        </div>
        <UserNav />
      </nav>
    </header>
  );
}
