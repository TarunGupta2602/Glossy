import ProfileClient from "./ProfileClient";

export const metadata = {
    title: "My Profile | The luxe jewels",
    alternates: {
        canonical: "/profile",
    },
    description: "Manage your acquisitions and curated wishlist.",
};

export default function ProfilePage() {
    return <ProfileClient />;
}
