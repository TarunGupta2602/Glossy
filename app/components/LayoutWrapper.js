"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";
import AnnouncementBar from "./AnnouncementBar";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <AnnouncementBar />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
