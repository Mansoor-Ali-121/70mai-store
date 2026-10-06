import Accordion from '@/components/product/Accordion';
import BundleSelections from '@/components/product/BundleSelections';
import Breadcrumbs from '@/components/product/Breadcrumbs';
import ContentBlocks from '@/components/product/ContentBlocks';
import ImageGallery from '@/components/product/ImageGallery';
import InTheBox from '@/components/product/InTheBox';
import PricingBox from '@/components/product/PricingBox';
import ProductDetails from '@/components/product/ProductDetails';
import ProductFaqs from '@/components/product/ProductFaqs';
import ProductHighlights from '@/components/product/ProductHighlights';
import ProductReviews from '@/components/product/ProductReviews';
import ProductSpecs from '@/components/product/ProductSpecs';
import ProductTabs from '@/components/product/ProductTabs';
import QuantitySelector from '@/components/product/QuantitySelector';
import StickyAddToCart from '@/components/product/StickyAddToCart';
import VariantSelector from '@/components/product/VariantSelector';
import Container from '@/components/store/Container';
import { useVariantSelection } from '@/hooks/useVariantSelection';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import demoProduct from '../../data/products/dash-cam-4k-omni.json';

function PageSection({ id, title, children }) {
    return (
        <section id={id} className="scroll-mt-32 py-14 lg:scroll-mt-44 lg:py-20">
            <Container>
                {title && <h2 className="mb-10 text-center text-3xl font-semibold lg:mb-14 lg:text-[44px]">{title}</h2>}
                {children}
            </Container>
        </section>
    );
}

export default function ProductDetail({ product: productProp }) {
    // Fall back to the bundled demo product when the page is rendered without data.
    const product = productProp && Object.keys(productProp).length > 0 ? productProp : demoProduct;
    const variants = product.variants ?? [];
    const images = product.images ?? [];

    const { selected, variant, selectOption, selectVariant, isValueAvailable } = useVariantSelection(variants);
    const [activeImage, setActiveImage] = useState(variant?.image ?? 0);
    const [quantity, setQuantity] = useState(1);
    const [bundle, setBundle] = useState(() =>
        Object.fromEntries(
            (product.bundle ?? []).map((addOn) => [
                addOn.id,
                { selected: false, quantity: 1, variantId: (addOn.variants.find((v) => v.available) ?? addOn.variants[0]).id },
            ]),
        ),
    );
    const [adding, setAdding] = useState(false);
    const [toast, setToast] = useState(null);
    const buyButtonsRef = useRef(null);

    // Show the selected variant's image.
    useEffect(() => {
        if (variant?.image != null) {
            setActiveImage(variant.image);
        }
    }, [variant?.id]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    const canPurchase = Boolean(variant?.available);

    const addToCart = ({ buyNow = false } = {}) => {
        if (!canPurchase || adding) return;

        const items = [
            { variant_id: variant.id, quantity },
            ...Object.values(bundle)
                .filter((item) => item.selected)
                .map((item) => ({ variant_id: item.variantId, quantity: item.quantity })),
        ];

        // "Buy it now" adds the items and goes straight to checkout.
        router.post(
            '/cart/items',
            { items, buy_now: buyNow },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => setAdding(true),
                onFinish: () => setAdding(false),
                onSuccess: () => {
                    if (!buyNow) {
                        setToast(`Added ${items.length > 1 ? `${items.length} items` : product.short_name ?? product.name} to cart`);
                    }
                },
                onError: (errors) => setToast(errors.items ?? 'Sorry, we could not add that to your cart.'),
            },
        );
    };

    const tabs = useMemo(
        () =>
            [
                { id: 'details', label: 'Details', show: product.banner || product.feature_tiles?.length },
                { id: 'specifications', label: 'Specifications', show: product.specs?.length },
                { id: 'in-the-box', label: 'In the Box', show: product.in_the_box },
                { id: 'faqs', label: 'FAQS', show: product.faqs?.length },
                { id: 'reviews', label: 'Reviews', show: true },
            ].filter((tab) => tab.show),
        [product],
    );

    const price = variant?.price ?? variants[0]?.price ?? 0;
    const compareAtPrice = variant?.compare_at_price ?? variants[0]?.compare_at_price;

    return (
        <StoreLayout>
            <Head title={product.name}>
                <meta head-key="description" name="description" content={product.tagline} />
            </Head>

            <Container className="pb-14 pt-6 lg:pt-7">
                <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: product.name }]} />

                {/* grid-cols-1 (minmax(0, 1fr)) keeps the gallery's Swiper from stretching the column on mobile. */}
                <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12 2xl:gap-16">
                    <div className="min-w-0 lg:sticky lg:top-[124px] lg:self-start">
                        <ImageGallery images={images} activeIndex={activeImage} onChange={setActiveImage} />
                    </div>

                    <div className="min-w-0 space-y-7">
                        <header className="space-y-4">
                            {product.tagline && <p className="text-xl italic lg:text-[22px]">{product.tagline}</p>}
                            <h1 className="text-[28px] leading-tight sm:text-4xl xl:text-[44px] xl:leading-[1.2]">{product.name}</h1>
                        </header>

                        <PricingBox
                            price={price}
                            compareAtPrice={compareAtPrice}
                            currency={product.currency}
                            installments={product.installments}
                            rating={product.rating}
                        />

                        {product.notice && (
                            <p className="border-t border-[#E5E5E5] pt-7 text-[15px] uppercase italic tracking-[0.12em]">{product.notice}</p>
                        )}

                        <VariantSelector
                            options={product.options}
                            selected={selected}
                            onSelect={selectOption}
                            isValueAvailable={isValueAvailable}
                        />

                        {product.promo && <p className="text-xl italic leading-relaxed">{product.promo}</p>}

                        <div>
                            <p className="mb-3 text-[17px]">Quantity</p>
                            <QuantitySelector value={quantity} onChange={setQuantity} />
                        </div>

                        <div ref={buyButtonsRef} className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                            <button
                                type="button"
                                onClick={() => addToCart()}
                                disabled={!canPurchase || adding}
                                className="h-[62px] bg-mai text-lg font-medium text-white transition-colors hover:bg-[#e8560f] disabled:cursor-not-allowed disabled:bg-[#BDBDBD]"
                            >
                                {variant ? (canPurchase ? 'Add to cart' : 'Sold out') : 'Unavailable'}
                            </button>
                            <button
                                type="button"
                                onClick={() => addToCart({ buyNow: true })}
                                disabled={!canPurchase || adding}
                                className="h-[62px] bg-primary text-lg font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-[#BDBDBD]"
                            >
                                Buy it now
                            </button>
                        </div>

                        {product.bundle?.length > 0 && (
                            <BundleSelections
                                product={product}
                                variant={variant}
                                onVariantChange={selectVariant}
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                selections={bundle}
                                onSelectionChange={(id, value) => setBundle((current) => ({ ...current, [id]: value }))}
                            />
                        )}

                        <ProductHighlights highlights={product.highlights} note={product.highlights_note} />

                        {product.shipping?.length > 0 && (
                            <div className="border-t border-[#E5E5E5]">
                                <Accordion title="Shipping & Returns">
                                    <div className="space-y-8">
                                        {product.shipping.map((section) => (
                                            <div key={section.title} className="space-y-4">
                                                <h4 className="text-lg font-semibold">{section.title}</h4>
                                                <ContentBlocks blocks={section.blocks} />
                                            </div>
                                        ))}
                                    </div>
                                </Accordion>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            <ProductTabs tabs={tabs} />

            {tabs.some((tab) => tab.id === 'details') && (
                <PageSection id="details">
                    <ProductDetails
                        banner={product.banner}
                        tiles={product.feature_tiles}
                        spotlight={product.spotlight}
                        sections={product.feature_sections}
                    />
                </PageSection>
            )}

            {product.specs?.length > 0 && (
                <PageSection id="specifications" title="Specifications">
                    <ProductSpecs specs={product.specs} />
                </PageSection>
            )}

            {product.in_the_box && (
                <PageSection id="in-the-box" title="In the Box">
                    <InTheBox
                        image={product.in_the_box.image}
                        mobileImage={product.in_the_box.mobile_image}
                        alt={product.in_the_box.alt}
                    />
                </PageSection>
            )}

            {product.faqs?.length > 0 && (
                <PageSection id="faqs" title="FAQs">
                    <ProductFaqs faqs={product.faqs} />
                </PageSection>
            )}

            <PageSection id="reviews" title="Customer Reviews">
                <ProductReviews rating={product.rating} />
            </PageSection>

            <StickyAddToCart
                targetRef={buyButtonsRef}
                name={product.name}
                image={images[variant?.image ?? 0]?.thumb}
                price={price}
                compareAtPrice={compareAtPrice}
                currency={product.currency}
                disabled={!canPurchase || adding}
                onAddToCart={() => addToCart()}
            />

            {toast && (
                <div
                    role="status"
                    className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-md bg-primary px-5 py-3 text-white shadow-lg lg:top-[170px]"
                >
                    {toast}
                </div>
            )}
        </StoreLayout>
    );
}
