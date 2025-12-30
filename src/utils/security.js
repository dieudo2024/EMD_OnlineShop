const CONTROL_CHAR_REGEX = /[\u0000-\u001F\u007F]/g;
const TAG_REGEX = /<[^>]*>/g;

function coerceString(value) {
  return typeof value === "string" ? value : String(value ?? "");
}

export function sanitizeString(value, options = {}) {
  const { maxLength } = options;
  let sanitized = coerceString(value).replace(CONTROL_CHAR_REGEX, "");
  sanitized = sanitized.replace(TAG_REGEX, "");
  sanitized = sanitized.replace(/[<>]/g, "").trim();
  if (maxLength && Number.isFinite(maxLength) && maxLength > 0) {
    sanitized = sanitized.slice(0, maxLength);
  }
  return sanitized;
}

export function sanitizeReviewPayload(review) {
  return {
    rating: clampRating(review.rating),
    text: sanitizeString(review.text, { maxLength: 1000 }),
    reviewerName: sanitizeString(review.reviewerName, { maxLength: 120 }) || "Anonymous",
    date: review.date,
    source: review.source,
  };
}

function clampRating(value) {
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num)) return 5;
  if (num < 1) return 1;
  if (num > 5) return 5;
  return num;
}
