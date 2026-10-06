export default function InTheBox({ image, mobileImage, alt }) {
    return (
        <picture>
            {mobileImage && <source media="(max-width: 767px)" srcSet={mobileImage} />}
            <img src={image} alt={alt} loading="lazy" className="mx-auto w-full max-w-[1400px]" />
        </picture>
    );
}
