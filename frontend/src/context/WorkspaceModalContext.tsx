"use client";

import { createContext, useContext, useState } from "react";

interface WorkspaceModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const WorkspaceModalContext = createContext<WorkspaceModalContextType | null>(null);

export function WorkspaceModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <WorkspaceModalContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </WorkspaceModalContext.Provider>
  );
}

export const useWorkspaceModal = () => {
  const ctx = useContext(WorkspaceModalContext);
  if (!ctx) throw new Error("useWorkspaceModal must be used inside WorkspaceModalProvider");
  return ctx;
};
