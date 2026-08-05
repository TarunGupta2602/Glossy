/** Blog listing page size — keep in sync with app/blog/page.js */
export const BLOG_PAGE_SIZE = 6;

export function getBlogPageCount(totalPosts) {
    return Math.max(1, Math.ceil((totalPosts || 0) / BLOG_PAGE_SIZE));
}
