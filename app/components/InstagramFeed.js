import Link from "next/link";
import Image from "next/image";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/constants";
import { fetchInstagramPosts, INSTAGRAM_FALLBACK_IMAGES } from "@/lib/instagram";

export default async function InstagramFeed() {
    const posts = await fetchInstagramPosts(4);
    const usingLiveFeed = Boolean(posts?.length);

    return (
        <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-pink-50/40 border-t border-gray-100">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#E91E63] mb-3">
                    {INSTAGRAM_HANDLE}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                    Follow Our Jewellery Journey
                </h2>
                <p className="text-gray-600 max-w-xl mx-auto mb-10">
                    Styling tips, new drops, and behind-the-scenes from The Luxe Jewels on Instagram.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {usingLiveFeed
                        ? posts.map((post, i) => (
                              <a
                                  key={post.id}
                                  href={post.permalink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                              >
                                  <Image
                                      src={post.imageUrl}
                                      alt={
                                          post.caption
                                              ? post.caption.slice(0, 120)
                                              : `The Luxe Jewels Instagram post ${i + 1}`
                                      }
                                      fill
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                                      unoptimized
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                              </a>
                          ))
                        : INSTAGRAM_FALLBACK_IMAGES.map((src, i) => (
                              <a
                                  key={src}
                                  href={INSTAGRAM_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                              >
                                  <Image
                                      src={src}
                                      alt={`The Luxe Jewels Instagram highlight ${i + 1}`}
                                      fill
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                              </a>
                          ))}
                </div>

                <Link
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gray-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E91E63]"
                >
                    View on Instagram
                </Link>
            </div>
        </section>
    );
}
