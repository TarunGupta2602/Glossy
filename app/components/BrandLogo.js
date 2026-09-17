import Image from "next/image";
import Link from "next/link";

const SIZES = {
    sm: { box: 28, text: "text-[1.05rem] sm:text-lg", the: "text-[8px]" },
    md: { box: 36, text: "text-xl sm:text-[1.35rem]", the: "text-[9px]" },
    lg: { box: 44, text: "text-2xl sm:text-3xl", the: "text-[9px]" },
};

/**
 * Brand mark + wordmark for navbar/footer.
 * Uses optimized logo asset with alt text for SEO/a11y.
 */
export default function BrandLogo({
    href = "/",
    size = "md",
    showWordmark = true,
    className = "",
    onClick,
    priority = false,
}) {
    const s = SIZES[size] || SIZES.md;

    const content = (
        <span className={`inline-flex items-center gap-2.5 min-w-0 ${className}`}>
            <span
                className="relative shrink-0 overflow-hidden rounded-[22%] bg-[#fdfbf7] ring-1 ring-[#efeae4]"
                style={{ width: s.box, height: s.box }}
            >
                <Image
                    src="/logo.png"
                    alt=""
                    width={s.box * 2}
                    height={s.box * 2}
                    priority={priority}
                    className="h-full w-full object-cover"
                />
            </span>
            {showWordmark ? (
                <span className="leading-none min-w-0">
                    <span
                        className={`block font-medium uppercase tracking-[0.28em] mb-0.5 ${s.the}`}
                        style={{ color: "#E91E63" }}
                    >
                        The
                    </span>
                    <span
                        className={`font-playfair font-medium tracking-tight text-[#2a2724] whitespace-nowrap ${s.text}`}
                    >
                        Luxe Jewels
                    </span>
                </span>
            ) : null}
        </span>
    );

    if (!href) return content;

    return (
        <Link
            href={href}
            onClick={onClick}
            prefetch={href === "/" ? false : undefined}
            className="group flex-shrink-0 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E91E63]/40 rounded-sm"
            aria-label="The Luxe Jewels home"
        >
            {content}
        </Link>
    );
}
