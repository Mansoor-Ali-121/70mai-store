import StarRating from './StarRating';

export default function ProductReviews({ rating }) {
    if (!rating?.count) {
        return <p className="text-center text-lg text-muted">No reviews yet.</p>;
    }

    return (
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-20">
            <div className="text-center">
                <p className="text-6xl font-semibold">{rating.average.toFixed(1)}</p>
                <StarRating value={rating.average} className="mt-3 text-3xl" />
                <p className="mt-2 text-muted">Based on {rating.count} reviews</p>
            </div>

            <ul className="w-full max-w-md space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                    const count = rating.breakdown?.[stars] ?? 0;
                    const percent = Math.round((count / rating.count) * 100);

                    return (
                        <li key={stars} className="flex items-center gap-3 text-sm">
                            <StarRating value={stars} className="text-base" />
                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#EDEDED]">
                                <div className="h-full rounded-full bg-[#F7A21B]" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="w-16 text-right text-muted">
                                {percent}% ({count})
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
