import { BookOpen, CircleDollarSign, Shirt, Users } from "lucide-react";

type SummaryCardsProps = {
  studentCount: number;
  maleCount: number;
  femaleCount: number;
  paid: number;
  partial: number;
  none: number;
  sizes: { size: string; count: number }[];
  workshops: { workshop: string; count: number }[];
};

export default function SummaryCards({ studentCount, maleCount, femaleCount, paid, partial, none, sizes, workshops }: SummaryCardsProps) {
  return (
    <div className="mx-auto mb-7 grid max-w-[920px] gap-4 sm:grid-cols-2">
      <EnrollmentSummaryCard total={studentCount} maleCount={maleCount} femaleCount={femaleCount} />
      <PaymentSummaryCard paid={paid} partial={partial} none={none} />
      <ShirtSummaryCard sizes={sizes} />
      <WorkshopSummaryCard workshops={workshops} />
    </div>
  );
}

function EnrollmentSummaryCard({ total, maleCount, femaleCount }: { total: number; maleCount: number; femaleCount: number }) {
  return (
    <div className="min-h-[150px] rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_8px_24px_rgba(45,65,45,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8d8283]">Total de inscritos</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40"><Users size={18} /></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <PaymentCount label="Total" value={total} />
        <PaymentCount label="Niños" value={maleCount} />
        <PaymentCount label="Niñas" value={femaleCount} />
      </div>
    </div>
  );
}

function PaymentSummaryCard({ paid, partial, none }: { paid: number; partial: number; none: number }) {
  return (
    <div className="min-h-[150px] rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_8px_24px_rgba(45,65,45,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8d8283]">Estado de pagos</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40"><CircleDollarSign size={18} /></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <PaymentCount label="Pagado completo" value={paid} />
        <PaymentCount label="Abono parcial" value={partial} />
        <PaymentCount label="Sin pago" value={none} />
      </div>
    </div>
  );
}

function ShirtSummaryCard({ sizes }: { sizes: { size: string; count: number }[] }) {
  return (
    <div className="min-h-[150px] rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_8px_24px_rgba(45,65,45,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8d8283]">Total de tallas</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40"><Shirt size={18} /></div>
      </div>
      <table className="mt-3 w-full text-xs">
        <tbody>
          {sizes.length ? sizes.map(({ size, count }, index) => (
            <tr key={size} className={index ? "border-t border-[#edf0ed]" : ""}>
              <td className="py-1.5 text-[#665b5c]">{size}</td>
              <td className="py-1.5 text-right font-semibold text-[#3D2D2E]">{count}</td>
            </tr>
          )) : <tr><td className="py-1.5 text-xs text-[#9b9091]">Sin tallas registradas</td><td /></tr>}
        </tbody>
      </table>
    </div>
  );
}

function WorkshopSummaryCard({ workshops }: { workshops: { workshop: string; count: number }[] }) {
  return (
    <div className="min-h-[150px] rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_8px_24px_rgba(45,65,45,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#8d8283]">Inscripciones por taller</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ADEBB3]/40"><BookOpen size={18} /></div>
      </div>
      <table className="mt-3 w-full text-xs">
        <tbody>
          {workshops.map(({ workshop, count }, index) => (
            <tr key={workshop} className={index ? "border-t border-[#edf0ed]" : ""}>
              <td className="py-1.5 text-[#665b5c]">{workshop}</td>
              <td className="py-1.5 text-right font-semibold text-[#3D2D2E]">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentCount({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span className="text-[25px] font-bold leading-none tracking-tight">{value}</span>
      <p className="mt-1 text-[10px] leading-4 text-[#9b9091]">{label}</p>
    </div>
  );
}
