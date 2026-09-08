"use client";

import { useId, useState } from "react";

/**
 * FAQ accordion.
 * variant="editorial" — cream/gold homepage style with circle +/−
 * variant="card" — bordered card (category guides / legacy)
 */
export default function FaqAccordion({ items = [], variant = "editorial", idPrefix }) {
    const reactId = useId().replace(/:/g, "");
    const prefix = idPrefix || `faq-${reactId}`;
    const [openIndex, setOpenIndex] = useState(-1);

    if (!items.length) return null;

    const isEditorial = variant === "editorial";

    return (
        <div
            className={
                isEditorial
                    ? "divide-y divide-[#e8e2da]"
                    : "divide-y divide-gray-200 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm"
            }
        >
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `${prefix}-panel-${index}`;
                const buttonId = `${prefix}-button-${index}`;

                return (
                    <div key={`${item.question}-${index}`} className={isEditorial ? "" : ""}>
                        <h3 className="m-0">
                            <button
                                id={buttonId}
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                className={
                                    isEditorial
                                        ? "flex w-full items-center justify-between gap-5 py-5 md:py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b89a6a]"
                                        : "flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-gray-900 hover:bg-gray-50/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E91E63]"
                                }
                            >
                                <span
                                    className={
                                        isEditorial
                                            ? "font-playfair text-[17px] sm:text-[18px] md:text-[19px] font-medium text-[#2a2724] leading-snug pr-2"
                                            : "text-[15px] leading-snug"
                                    }
                                >
                                    {item.question}
                                </span>

                                {isEditorial ? (
                                    <span
                                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors"
                                        style={{
                                            borderColor: isOpen ? "#b89a6a" : "#d4cbc0",
                                            color: isOpen ? "#b89a6a" : "#8a847c",
                                        }}
                                        aria-hidden="true"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        >
                                            <path d="M12 5v14" className={isOpen ? "opacity-0" : ""} />
                                            <path d="M5 12h14" />
                                        </svg>
                                    </span>
                                ) : (
                                    <svg
                                        className={`w-5 h-5 shrink-0 text-[#E91E63] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                )}
                            </button>
                        </h3>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            hidden={!isOpen}
                            className={
                                isEditorial
                                    ? `overflow-hidden ${isOpen ? "pb-5 md:pb-6" : "pb-0"}`
                                    : `px-5 overflow-hidden transition-all duration-200 ${isOpen ? "pb-5" : "pb-0"}`
                            }
                        >
                            {isOpen && (
                                <p
                                    className={
                                        isEditorial
                                            ? "text-[14px] sm:text-[15px] text-[#6b6560] leading-relaxed max-w-2xl pr-10"
                                            : "text-sm text-gray-600 leading-relaxed"
                                    }
                                >
                                    {item.answer}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
