"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Definir o tipo do estado
interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Criar o contexto com valores padrão
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Tipo das props do Provider
interface SidebarProviderProps {
  children: ReactNode; // ReactNode permite qualquer nó React válido
}

// Componente Provider para envolver o restante da aplicação
export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook para consumir o contexto
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
