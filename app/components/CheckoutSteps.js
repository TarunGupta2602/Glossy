export default function CheckoutSteps({ current = 1 }) {
    const steps = [
        { id: 1, label: "Bag" },
        { id: 2, label: "Details" },
        { id: 3, label: "Payment" },
    ];

    return (
        <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-10" aria-label="Checkout progress">
            {steps.map((step, index) => {
                const isActive = step.id === current;
                const isComplete = step.id < current;

                return (
                    <li key={step.id} className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isActive
                                        ? "bg-[#E91E63] text-white"
                                        : isComplete
                                          ? "bg-gray-900 text-white"
                                          : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                {isComplete ? "✓" : step.id}
                            </span>
                            <span className={`text-xs font-semibold uppercase tracking-wide ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <span className="hidden sm:block w-8 h-px bg-gray-200" aria-hidden="true" />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
