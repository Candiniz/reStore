'use client'

import { motion } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext"; // Importa o hook do contexto
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";



export function Sidebar() {
  const { isSidebarOpen } = useSidebar(); // Obtém o estado da sidebar do contexto
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // Considera 1024px como limite para 'lg'
    };

    // Adiciona evento de resize
    window.addEventListener("resize", handleResize);

    // Chama a função imediatamente para pegar o estado inicial
    handleResize();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative pb-12 text-white">
      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-gray-800 transition-all duration-300 
          ${isSmallScreen ? 'lg:hidden' : 'lg:block'}`}
        initial={{ x: isSmallScreen ? '-100%' : 0 }}
        animate={{ x: isSidebarOpen ? 0 : (isSmallScreen ? '-100%' : 0) }}
        exit={{ x: isSmallScreen ? '-100%' : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="space-y-4 py-4 mt-16">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              IA's
            </h2>
            <div className="space-y-1">
              <Link href="https://replicate.com" target="blank">
                <Button variant="ghost" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M12 2l1.45 4.55L18 7.95l-3.55 3.45 1.55 4.95-4.55-2.45-4.55 2.45L9 11.4 5.45 7.95l4.55-.9z" />
                  </svg>
                  Explore as IA's
                </Button>
              </Link>
              <Link href='/funcionalidades-ia'>
                <Button variant="ghost" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                  Funcionalidades IA
                </Button>
              </Link>

            </div>
          </div>

          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Meus Trabalhos
            </h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6" />
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path d="M12 12H3" />
                  <path d="M16 6H3" />
                  <path d="M12 18H3" />
                </svg>
                Compare o Resultado
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="8" cy="18" r="4" />
                  <path d="M12 18V2l7 4" />
                </svg>
                Projetos Recentes
              </Button>
            </div>
          </div>

          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Meus Arquivos
            </h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Meus Arquivos
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
