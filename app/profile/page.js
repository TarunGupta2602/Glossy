import ProfileClient from "./ProfileClient";

export const metadata = {
    title: "My Profile | The luxe jewels",
    alternates: {
        canonical: "/profile",
    },
    description: "Manage your orders, wishlist, and account details for The luxe jewels.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProfilePage() {
    return <ProfileClient />;
}
