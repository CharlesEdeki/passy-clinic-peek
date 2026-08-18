import { getRouteApi } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { Eyebrow, Reveal } from "@/components/site/primitives";
import type { GoogleReview } from "@/lib/api/reviews.functions";
import { MAPS_URL, WRITE_REVIEW_URL } from "@/lib/clinic";
import { cn } from "@/lib/utils";

const route = getRouteApi("/");

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="mb-2.5 flex gap-0.5 text-gold"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn("size-4", index < rating ? "fill-current" : "text-border")}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const { reviewer, starRating, comment, relativeTime, reviewUrl } = review;

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
      <Stars rating={starRating} />
      <blockquote className="text-[0.94rem]">&ldquo;{comment}&rdquo;</blockquote>

      {/* Google requires the author to be credited and linked. */}
      <figcaption className="mt-auto flex items-center gap-[11px] pt-4">
        {reviewer.profilePhotoUrl ? (
          <img
            src={reviewer.profilePhotoUrl}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="size-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-[0.82rem] font-bold text-theatre">
            {reviewer.displayName.charAt(0)}
          </span>
        )}
        <span>
          <span className="block text-[0.88rem] font-bold">
            {reviewer.profileUrl ? (
              <a
                href={reviewer.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {reviewer.displayName}
              </a>
            ) : (
              reviewer.displayName
            )}
          </span>
          <span className="block text-[0.76rem] text-muted-foreground">
            {reviewUrl ? (
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {relativeTime} on Google
              </a>
            ) : (
              relativeTime
            )}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function GoogleReviews() {
  const data = route.useLoaderData();

  const reviews = data.reviews;
  const mapsUrl = data.mapsUrl ?? MAPS_URL;

  return (
    <section id="reviews" className="border-y border-border bg-background py-19 md:py-26">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Patient reviews</Eyebrow>
            <h2 className="text-[clamp(2rem,4vw,3.1rem)]">What our patients say on Google.</h2>
            <p className="mt-5 max-w-[56ch] text-[1.05rem] text-muted-foreground">
              Real, verified reviews from people we&rsquo;ve cared for at Jakande Gate, Isolo.
              {data.averageRating && data.totalReviewCount ? (
                <>
                  {" "}
                  We&rsquo;re rated{" "}
                  <strong className="font-semibold text-foreground">
                    {data.averageRating.toFixed(1)} out of 5
                  </strong>{" "}
                  across {data.totalReviewCount} reviews.
                </>
              ) : null}
            </p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="relative mt-11 overflow-hidden rounded-[28px] border border-border bg-card p-4 sm:p-6 md:rounded-[36px] md:p-8">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-theatre via-theatre to-coral"
            />

            {reviews.length === 0 ? (
              /* Google was unreachable, or no one has written anything yet.
                 Either way, send people to the listing rather than show a
                 broken-looking box. */
              <p className="px-2 py-8 text-center text-[0.95rem] text-muted-foreground">
                Our reviews live on Google.{" "}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-theatre underline underline-offset-4"
                >
                  Read them there
                </a>
                .
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review, index) => (
                  <ReviewCard key={review.reviewId ?? index} review={review} />
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Google requires a route back to the source. */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
            Reviews sourced live from Google
          </p>
          <div className="flex flex-wrap gap-3.5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border-[1.5px] border-border bg-card px-[26px] py-3 text-[0.95rem] font-semibold transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-theatre"
            >
              Read all reviews
            </a>
            <a
              href={WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-theatre px-[26px] py-3 text-[0.95rem] font-semibold text-white shadow-[var(--shadow-cta)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-theatre-deep"
            >
              Write a review
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}