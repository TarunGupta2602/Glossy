import sharp from "sharp";

const MAX_EDGE = 1600;
const WEBP_QUALITY = 78;

/**
 * Resize and convert uploads to WebP so Next.js / browsers never fetch multi‑MB originals.
 * Falls back to the original buffer if sharp fails.
 */
export async function optimizeImageUpload(buffer, contentType = "") {
    try {
        const image = sharp(buffer, { failOn: "none" }).rotate();
        const meta = await image.metadata();
        const width = meta.width || 0;
        const height = meta.height || 0;
        const longest = Math.max(width, height);

        let pipeline = image;
        if (longest > MAX_EDGE) {
            pipeline = pipeline.resize({
                width: width >= height ? MAX_EDGE : undefined,
                height: height > width ? MAX_EDGE : undefined,
                fit: "inside",
                withoutEnlargement: true,
            });
        }

        const optimized = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
        return {
            buffer: optimized,
            contentType: "image/webp",
            ext: "webp",
        };
    } catch (error) {
        console.error("optimizeImageUpload failed, using original:", error?.message || error);
        return {
            buffer,
            contentType: contentType || "application/octet-stream",
            ext: null,
        };
    }
}

/** Swap file extension to .webp when we converted the payload. */
export function withWebpPath(path, ext) {
    if (!ext || !path) return path;
    return path.replace(/\.[a-z0-9]+$/i, `.${ext}`);
}
