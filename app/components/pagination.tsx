"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, totalCount, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#edf0ed] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-[#94898a]">Mostrando <span className="font-semibold text-[#3D2D2E]">{totalCount ? (page - 1) * 10 + 1 : 0}-{Math.min(page * 10, totalCount)}</span> de <span className="font-semibold text-[#3D2D2E]">{totalCount}</span> registros</p>
      <div className="flex max-w-full items-center gap-1.5 overflow-x-auto">
        <button disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e8ece8] text-[#756a6b] hover:bg-[#e4eee4] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Página anterior"><ChevronLeft size={16} /></button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} onClick={() => onPageChange(number)} className={`h-8 min-w-8 shrink-0 rounded-lg px-2 text-xs font-semibold ${page === number ? "bg-[#ADEBB3] text-[#3D2D2E]" : "text-[#827778] hover:bg-[#e2ece2]"}`}>{number}</button>)}
        <button disabled={page === totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e8ece8] text-[#756a6b] hover:bg-[#e4eee4] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Página siguiente"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}
