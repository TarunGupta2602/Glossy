import ProfileClient from "./ProfileClient";

export const metadata = {
    title: "My Profile",
    description: "Manage your orders, wishlist, and account details for The Luxe Jewels.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProfilePage() {
    return <ProfileClient />;
}
