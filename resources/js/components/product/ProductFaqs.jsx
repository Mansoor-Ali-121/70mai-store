import Accordion from './Accordion';
import ContentBlocks from './ContentBlocks';

export default function ProductFaqs({ faqs = [] }) {
    return (
        <div className="mx-auto max-w-4xl">
            <p className="mb-6 text-center text-lg text-muted">Find the answers of most asked questions here.</p>
            <div className="border-t border-[#E5E5E5]">
                {faqs.map((faq) => (
                    <Accordion key={faq.question} title={faq.question} titleClassName="text-lg font-medium">
                        <ContentBlocks blocks={faq.answer} className="space-y-3 leading-relaxed text-muted" />
                    </Accordion>
                ))}
            </div>
        </div>
    );
}
