import { permanentRedirect } from "next/navigation";

export const metadata = {
    title: "Jewellery Gifts Under ₹499",
    alternates: { canonical: "/gifts/under-499" },
};

/** One gift page: under ₹499. Keep this URL so old links still resolve. */
export default function GiftsUnder999Page() {
    permanentRedirect("/gifts/under-499");
}
