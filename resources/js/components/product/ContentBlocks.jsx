/**
 * Renders simple structured copy from product data:
 * { type: 'text' | 'strong' | 'heading', text } and { type: 'list', items }.
 */
export default function ContentBlocks({ blocks = [], className = 'space-y-4 text-[17px] leading-relaxed' }) {
    return (
        <div className={className}>
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'heading':
                        return (
                            <p key={index} className="font-medium underline underline-offset-4">
                                {block.text}:
                            </p>
                        );
                    case 'strong':
                        return (
                            <p key={index} className="font-semibold">
                                {block.text}
                            </p>
                        );
                    case 'list':
                        return (
                            <ul key={index} className="list-disc space-y-1 pl-6">
                                {block.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        );
                    default:
                        return <p key={index}>{block.text}</p>;
                }
            })}
        </div>
    );
}
