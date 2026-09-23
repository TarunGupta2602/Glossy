function emptySummary() {
    return { count: 0, average: 0 };
}

export function getReviewSummary(reviewCounts, productId) {
    const entry = reviewCounts?.[productId];
    if (!entry) return emptySummary();
    if (typeof entry === "number") return { count: entry, average: 0 };
    return {
        count: Number(entry.count) || 0,
        average: Number(entry.average) || 0,
    };
}

export function reviewCardProps(reviewCounts, productId) {
    const { count, average } = getReviewSummary(reviewCounts, productId);
    return { reviewCount: count, reviewAverage: average };
}
