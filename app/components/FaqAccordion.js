"use client";

import { useState } from "react";

export default function FaqAccordion({ items }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="divide-y divide-gray-200 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `faq-panel-${index}`;
                const buttonId = `faq-button-${index}`;

                return (
                    <div key={item.question}>
                        <h2 className="m-0">
                            <button
                                id={buttonId}
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-gray-900 hover:bg-gray-50/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E91E63]"
                            >
                                <span>{item.question}</span>
                                <svg
                                    className={`w-5 h-5 shrink-0 text-[#E91E63] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </h2>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            hidden={!isOpen}
                            className={`px-5 overflow-hidden transition-all duration-200 ${isOpen ? "pb-5" : "pb-0"}`}
                        >
                            {isOpen && (
                                <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
