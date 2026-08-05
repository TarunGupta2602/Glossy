import AdminLayoutGuard from "./AdminLayoutGuard";

export const metadata = {
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
    return <AdminLayoutGuard>{children}</AdminLayoutGuard>;
}
