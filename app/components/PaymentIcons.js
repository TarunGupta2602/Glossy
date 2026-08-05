export default function PaymentIcons() {
    return (
        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
            <span className="inline-flex items-center justify-center h-8 px-2.5 rounded-md bg-white border border-gray-200 text-[10px] font-black text-gray-700 tracking-wide">
                UPI
            </span>
            <span className="inline-flex items-center justify-center h-8 px-2.5 rounded-md bg-white border border-gray-200 text-[10px] font-black text-[#1A1F71] tracking-wide">
                VISA
            </span>
            <span className="inline-flex items-center justify-center h-8 px-2.5 rounded-md bg-white border border-gray-200 text-[10px] font-black text-[#EB001B] tracking-wide">
                MC
            </span>
            <span className="inline-flex items-center justify-center h-8 px-2.5 rounded-md bg-white border border-gray-200 text-[10px] font-black text-gray-700 tracking-wide">
                RuPay
            </span>
        </div>
    );
}
