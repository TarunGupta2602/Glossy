/**
 * Default E-E-A-T author profiles for the journal.
 * Posts can override with author + author_bio fields from the CMS.
 */
export const DEFAULT_BLOG_AUTHOR = {
    name: "Priya Sharma",
    role: "Jewellery Stylist & Editor",
    bio: "Priya writes The Luxe Jewels journal — practical anti-tarnish care, everyday styling, and gifting guidance for shoppers across Noida, Delhi NCR, and India.",
};

export function resolveBlogAuthor(blog) {
    const raw = typeof blog?.author === "string" ? blog.author.trim() : "";
    const useDefault = !raw || /luxe\s*jewels/i.test(raw);
    const name = useDefault ? DEFAULT_BLOG_AUTHOR.name : raw;
    const bio =
        (typeof blog?.author_bio === "string" && blog.author_bio.trim()) ||
        (useDefault ? DEFAULT_BLOG_AUTHOR.bio : null);
    const role = useDefault ? DEFAULT_BLOG_AUTHOR.role : "Contributor";

    return { name, bio, role };
}
