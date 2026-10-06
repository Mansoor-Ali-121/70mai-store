export default function SectionTitle({ children }) {
    return (
        <>
            <h2 className="text-3xl font-bold">{children}</h2>
            <div className="relative mx-auto my-3 h-px w-12 bg-[#ff4b00] md:h-0 md:p-px" />
        </>
    );
}
