import ProductCard from '@/components/store/ProductCard';
import Container from '@/components/store/Container';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, Link } from '@inertiajs/react';

/** Collection pages and search results. */
export default function ProductListing({ heading, products = [], query = null }) {
    const isSearch = query !== null;

    return (
        <StoreLayout>
            <Head title={heading} />

            <Container className="py-10 lg:py-14">
                <nav aria-label="Breadcrumb" className="mb-6 text-[15px]">
                    <Link href="/" className="underline underline-offset-4 hover:text-mai">
                        Home
                    </Link>
                    <span className="mx-3 text-[#C4C4C4]">/</span>
                    <span aria-current="page">{isSearch ? 'Search' : heading}</span>
                </nav>

                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <h1 className="text-3xl lg:text-[40px]">{heading}</h1>
                    <p className="text-muted">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </p>
                </div>

                {isSearch && (
                    <form action="/search" method="get" className="mb-10 flex max-w-xl gap-3">
                        <input
                            type="search"
                            name="q"
                            defaultValue={query}
                            placeholder="Search products"
                            aria-label="Search products"
                            className="flex-1 rounded-md border border-[#D9D9D9] px-4 py-3 focus:border-primary focus:outline-none"
                        />
                        <button type="submit" className="bg-mai px-6 font-medium text-white hover:bg-[#e8560f]">
                            Search
                        </button>
                    </form>
                )}

                {products.length === 0 ? (
                    <p className="py-20 text-center text-lg text-muted">
                        {isSearch && query ? 'No products match your search.' : 'No products here yet.'}
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </Container>
        </StoreLayout>
    );
}
