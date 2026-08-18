import { createServerFn } from "@tanstack/react-start";

/**
 * Reviews come straight from Google via the Places API (New), fetched on the
 * server. That matters for three reasons: the API key never reaches the
 * browser, there is no CORS or ad-blocker to survive, and the reviews are in
 * the server-rendered HTML where search engines can read them.
 *
 * Google caps this endpoint at five reviews per place. That is a hard limit
 * with no pagination, and it is plenty for a testimonial panel.
 *
 * Setup:
 *   1. console.cloud.google.com — create a project, enable "Places API (New)"
 *   2. Create an API key, restrict it to that one API
 *   3. Set a daily quota cap so a runaway loop cannot spend money
 *   4. Put the key in .env as GOOGLE_MAPS_API_KEY
 */
const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";

/** Only what the panel draws — every extra field raises the billing tier. */
const FIELD_MASK = "id,rating,userRatingCount,googleMapsUri,reviews";

/** Google refreshes slowly and bills per call, so ask at most once a day. */
const CACHE_MS = 1000 * 60 * 60 * 24;

export type GoogleReview = {
  reviewId: string | null;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
    /** Google's required link to the reviewer's profile. */
    profileUrl: string;
  };
  starRating: number;
  comment: string;
  createTime: string | null;
  /** Google's own wording, e.g. "3 months ago". */
  relativeTime: string;
  /** Deep link to this review on Google Maps. */
  reviewUrl: string;
};

export type ReviewsResult = {
  reviews: GoogleReview[];
  totalReviewCount?: number;
  averageRating?: number;
  mapsUrl?: string;
};

type PlacesReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
  error?: { message?: string; status?: string };
};

const EMPTY: ReviewsResult = { reviews: [] };

let cache: { at: number; value: ReviewsResult } | null = null;

function toReview(review: PlacesReview): GoogleReview {
  const author = review.authorAttribution;

  return {
    reviewId: review.name ?? null,
    reviewer: {
      profilePhotoUrl: author?.photoUri ?? "",
      displayName: author?.displayName?.trim() || "Google user",
      profileUrl: author?.uri ?? "",
    },
    starRating: review.rating ?? 0,
    // Prefer the original language over Google's translation.
    comment: (review.originalText?.text ?? review.text?.text ?? "").trim(),
    createTime: review.publishTime ?? null,
    relativeTime: review.relativePublishTimeDescription ?? "",
    reviewUrl: review.googleMapsUri ?? "",
  };
}

async function loadFromGoogle(): Promise<ReviewsResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY and GOOGLE_PLACE_ID must both be set — see .env.example",
    );
  }

  const response = await fetch(`${PLACES_ENDPOINT}/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  const data = (await response.json()) as PlacesResponse;

  if (!response.ok) {
    throw new Error(
      `Places API ${response.status}: ${data.error?.message ?? "no message"}`,
    );
  }

  return {
    // A rating with no text says nothing on a testimonial card.
    reviews: (data.reviews ?? []).map(toReview).filter((review) => review.comment),
    totalReviewCount: data.userRatingCount,
    averageRating: data.rating,
    mapsUrl: data.googleMapsUri,
  };
}

export const fetchGoogleReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<ReviewsResult> => {
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return cache.value;
    }

    try {
      const value = await loadFromGoogle();
      cache = { at: Date.now(), value };
      return value;
    } catch (error) {
      console.error("[reviews]", (error as Error).message);

      // Serve stale rather than nothing — a page that quietly keeps working
      // beats one that shows an error because Google had a bad minute.
      if (cache) return cache.value;
      return EMPTY;
    }
  },
);