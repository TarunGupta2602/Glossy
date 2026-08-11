"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { adminFetch } from "@/lib/adminApi";
import { normalizeBlogSlug, truncateMetaDescription } from "@/lib/seo";

function parseKeywords(value) {
    return String(value || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
}

function countMarkdownH1(content) {
    return (String(content || "").match(/^# (?!#)/gm) || []).length;
}

function demoteMarkdownH1(content) {
    return String(content || "").replace(/^# (?!#)/gm, "## ");
}

function suggestKeywordsFromTitle(title) {
    const stop = new Set([
        "a", "an", "the", "and", "or", "for", "to", "of", "in", "on", "at", "with",
        "how", "why", "what", "when", "your", "you", "from", "without", "into",
    ]);
    const words = String(title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stop.has(w));

    const phrases = [];
    if (words.length >= 2) phrases.push(words.slice(0, 3).join(" "));
    phrases.push(...words.slice(0, 5));
    phrases.push("anti tarnish jewellery", "jewellery tips india");

    return [...new Set(phrases)].slice(0, 6);
}

function metaDescTone(length) {
    if (length === 0) return "text-gray-400";
    if (length < 120) return "text-amber-600";
    if (length <= 160) return "text-emerald-600";
    return "text-red-600";
}

export default function BlogForm({ initialData, onSubmit, submitLabel = "Publish Blog Post" }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(
        initialData?.slug ? normalizeBlogSlug(initialData.slug) : ""
    );
    const [author, setAuthor] = useState(initialData?.author || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [datePosted, setDatePosted] = useState(
        initialData?.date_posted || new Date().toISOString().split("T")[0]
    );
    const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
    const [metaDescription, setMetaDescription] = useState(
        initialData?.meta_description || ""
    );
    const [metaKeywords, setMetaKeywords] = useState(initialData?.meta_keywords || "");
    const [faqs, setFaqs] = useState(initialData?.faqs || []);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image || null);
    const [loading, setLoading] = useState(false);

    const generateSlug = (text) => normalizeBlogSlug(text);

    const h1Count = useMemo(() => countMarkdownH1(content), [content]);
    const keywords = useMemo(() => parseKeywords(metaKeywords), [metaKeywords]);
    const suggestedKeywords = useMemo(() => suggestKeywordsFromTitle(title), [title]);

    const handleTitleChange = (value) => {
        setTitle(value);
        if (!initialData?.slug) {
            setSlug(generateSlug(value));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addFaq = () => {
        setFaqs([...faqs, { question: "", answer: "" }]);
    };

    const updateFaq = (index, field, value) => {
        const updated = [...faqs];
        updated[index][field] = value;
        setFaqs(updated);
    };

    const removeFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const applyMetaDescriptionTrim = () => {
        const source = metaDescription.trim() || description.trim();
        if (!source) return;
        setMetaDescription(truncateMetaDescription(source, 160).replace(/…$/, ""));
    };

    const fillMetaDescriptionFromSummary = () => {
        if (!description.trim()) return;
        setMetaDescription(truncateMetaDescription(description.trim(), 160).replace(/…$/, ""));
    };

    const convertH1ToH2 = () => {
        setContent(demoteMarkdownH1(content));
    };

    const addSuggestedKeyword = (keyword) => {
        const existing = new Set(parseKeywords(metaKeywords).map((k) => k.toLowerCase()));
        if (existing.has(keyword.toLowerCase())) return;
        const next = [...parseKeywords(metaKeywords), keyword];
        setMetaKeywords(next.join(", "));
    };

    const applySuggestedKeywords = () => {
        const merged = [...parseKeywords(metaKeywords)];
        const existing = new Set(merged.map((k) => k.toLowerCase()));
        for (const suggestion of suggestedKeywords) {
            if (!existing.has(suggestion.toLowerCase())) {
                merged.push(suggestion);
                existing.add(suggestion.toLowerCase());
            }
        }
        setMetaKeywords(merged.join(", "));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalContent = content;
        if (countMarkdownH1(finalContent) > 0) {
            const ok = confirm(
                `Found ${countMarkdownH1(finalContent)} markdown H1 (#) heading(s).\n\nConvert them to ## before saving? (Recommended — the post title is already the page H1.)`
            );
            if (ok) finalContent = demoteMarkdownH1(finalContent);
        }

        let finalMetaDescription = metaDescription.trim();
        if (finalMetaDescription.length > 160) {
            const ok = confirm(
                `Meta description is ${finalMetaDescription.length} characters (over 160).\n\nTrim at a word boundary before saving?`
            );
            if (ok) {
                finalMetaDescription = truncateMetaDescription(finalMetaDescription, 160).replace(
                    /…$/,
                    ""
                );
                setMetaDescription(finalMetaDescription);
            }
        } else if (!finalMetaDescription && description.trim()) {
            finalMetaDescription = truncateMetaDescription(description.trim(), 160).replace(
                /…$/,
                ""
            );
        }

        if (!parseKeywords(metaKeywords).length) {
            const ok = confirm(
                "No keywords set. Tag pages (/blog/tag/...) won’t be created for this post.\n\nContinue without keywords?"
            );
            if (!ok) return;
        }

        setLoading(true);

        try {
            let finalImageUrl = initialData?.image || "";

            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                if (initialData?.image) {
                    formData.append("oldImageUrl", initialData.image);
                }

                const uploadRes = await adminFetch("/api/blogs/upload", {
                    method: "POST",
                    body: formData,
                });
                const uploadData = await uploadRes.json();

                if (!uploadData.success) {
                    throw new Error(uploadData.error || "Failed to upload image");
                }

                finalImageUrl = uploadData.url;
            }

            if (finalContent !== content) setContent(finalContent);

            const blogData = {
                title,
                slug: generateSlug(slug || title),
                author,
                description,
                content: finalContent,
                date_posted: datePosted,
                meta_title: metaTitle,
                meta_description: finalMetaDescription,
                meta_keywords: metaKeywords,
                faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
                image: finalImageUrl,
            };

            await onSubmit(blogData);
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                        Blog Title *
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. How to Choose the Perfect Necklace"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            URL Slug *
                        </label>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-400 mr-1">/blog/</span>
                            <input
                                type="text"
                                placeholder="your-blog-slug"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all font-mono text-sm"
                                value={slug}
                                onChange={(e) => setSlug(generateSlug(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            Author *
                        </label>
                        <input
                            type="text"
                            placeholder="Author name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                        Date Posted
                    </label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                        value={datePosted}
                        onChange={(e) => setDatePosted(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                        Short Description
                    </label>
                    <textarea
                        placeholder="Brief summary of the blog post..."
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Blog Content
                        </label>
                        {h1Count > 0 && (
                            <button
                                type="button"
                                onClick={convertH1ToH2}
                                className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 hover:bg-amber-100"
                            >
                                Convert {h1Count} H1 → H2
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2 px-1">
                        Write in <strong>Markdown</strong>. Use <code>## Heading</code> for sections
                        (avoid a single <code>#</code> H1 — the page title is already the H1).
                    </p>
                    {h1Count > 0 && (
                        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            Found <strong>{h1Count}</strong> markdown <code>#</code> H1 heading
                            {h1Count === 1 ? "" : "s"}. Prefer <code>##</code> so the post keeps a
                            single H1.
                        </div>
                    )}
                    <textarea
                        placeholder={
                            "## Styling tip\n\nWrite your article in Markdown...\n\n- Point one\n- Point two"
                        }
                        rows="12"
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-1 outline-none transition-all resize-y font-mono text-sm ${
                            h1Count > 0
                                ? "border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                                : "border-gray-200 focus:border-[#E91E63] focus:ring-[#E91E63]"
                        }`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900 px-1">Featured Image</h2>
                <div className="space-y-4">
                    {imagePreview && (
                        <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden bg-gray-100">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                sizes="(max-width: 768px) 100vw, 448px"
                                className="object-cover"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-[#E91E63] hover:file:bg-pink-100 transition-all cursor-pointer"
                        onChange={handleImageChange}
                    />
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900 px-1">SEO Optimization</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            Meta Title
                        </label>
                        <input
                            type="text"
                            placeholder="SEO title without brand (e.g. How to Pick the Perfect Necklace)"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                        />
                        <p
                            className={`text-xs mt-1 px-1 ${
                                metaTitle.length > 60 ? "text-amber-600" : "text-gray-400"
                            }`}
                        >
                            {metaTitle.length}/60 characters recommended. Do not add “| The Luxe
                            Jewels” — it is appended automatically.
                        </p>
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                Meta Description
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {description.trim() && (
                                    <button
                                        type="button"
                                        onClick={fillMetaDescriptionFromSummary}
                                        className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100"
                                    >
                                        Use short description
                                    </button>
                                )}
                                {metaDescription.length > 160 && (
                                    <button
                                        type="button"
                                        onClick={applyMetaDescriptionTrim}
                                        className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-100"
                                    >
                                        Trim at word boundary
                                    </button>
                                )}
                            </div>
                        </div>
                        <textarea
                            placeholder="Brief description for search engines (aim for 155–160 characters)..."
                            rows="3"
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-1 outline-none transition-all resize-none ${
                                metaDescription.length > 160
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-200 focus:border-[#E91E63] focus:ring-[#E91E63]"
                            }`}
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                        />
                        <p className={`text-xs mt-1 px-1 ${metaDescTone(metaDescription.length)}`}>
                            {metaDescription.length}/160 characters
                            {metaDescription.length === 0
                                ? " — add one for richer search snippets"
                                : metaDescription.length < 120
                                  ? " — a bit short; aim for ~155–160"
                                  : metaDescription.length <= 160
                                    ? " — good length"
                                    : " — too long; trim at a full word"}
                        </p>
                        {metaDescription && (
                            <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                    Google-style preview
                                </p>
                                <p className="text-lg text-[#1a0dab] leading-snug truncate">
                                    {(metaTitle || title || "Post title") + " | The Luxe Jewels"}
                                </p>
                                <p className="text-sm text-[#4d5156] mt-1 line-clamp-2">
                                    {truncateMetaDescription(metaDescription, 160)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                Meta Keywords (tags)
                            </label>
                            {suggestedKeywords.length > 0 && (
                                <button
                                    type="button"
                                    onClick={applySuggestedKeywords}
                                    className="text-xs font-semibold text-[#E91E63] bg-pink-50 border border-pink-100 rounded-lg px-3 py-1.5 hover:bg-pink-100"
                                >
                                    Apply suggestions
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="jewellery tips, necklace guide, anti tarnish earrings..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all"
                            value={metaKeywords}
                            onChange={(e) => setMetaKeywords(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1 px-1">
                            Comma-separated. Each keyword becomes a tag page like{" "}
                            <code>/blog/tag/jewellery-tips</code>.
                        </p>

                        {suggestedKeywords.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {suggestedKeywords.map((keyword) => {
                                    const active = keywords.some(
                                        (k) => k.toLowerCase() === keyword.toLowerCase()
                                    );
                                    return (
                                        <button
                                            key={keyword}
                                            type="button"
                                            onClick={() => addSuggestedKeyword(keyword)}
                                            disabled={active}
                                            className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
                                                active
                                                    ? "bg-pink-100 border-pink-200 text-pink-700 cursor-default"
                                                    : "bg-white border-gray-200 text-gray-600 hover:border-[#E91E63] hover:text-[#E91E63]"
                                            }`}
                                        >
                                            {active ? "✓ " : "+ "}
                                            {keyword}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {keywords.length > 0 ? (
                            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Tag pages that will work
                                </p>
                                {keywords.map((keyword) => {
                                    const tagSlug = normalizeBlogSlug(keyword);
                                    return (
                                        <p key={keyword} className="text-sm text-gray-700 font-mono">
                                            /blog/tag/{tagSlug}
                                            <span className="text-gray-400 font-sans ml-2">
                                                ({keyword})
                                            </span>
                                        </p>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                No keywords yet — this post won’t appear on any{" "}
                                <code>/blog/tag/...</code> pages until you add some.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 px-1">FAQs</h2>
                        <p className="text-xs text-gray-400 mt-1 px-1">
                            FAQs are rendered as structured data for SEO (FAQ Schema)
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addFaq}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add FAQ
                    </button>
                </div>

                {faqs.length === 0 ? (
                    <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm text-gray-400">
                            No FAQs added yet. Click &quot;Add FAQ&quot; to start.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="p-5 bg-gray-50 rounded-xl border border-gray-100 relative"
                            >
                                <button
                                    type="button"
                                    onClick={() => removeFaq(index)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove FAQ"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <div className="space-y-3 pr-8">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Question {index + 1}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. How do I maintain my jewellery?"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all text-sm"
                                            value={faq.question}
                                            onChange={(e) =>
                                                updateFaq(index, "question", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Answer
                                        </label>
                                        <textarea
                                            placeholder="Write a detailed answer..."
                                            rows="3"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all resize-none text-sm"
                                            value={faq.answer}
                                            onChange={(e) =>
                                                updateFaq(index, "answer", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 mt-4"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </span>
                ) : (
                    submitLabel
                )}
            </button>
        </form>
    );
}
