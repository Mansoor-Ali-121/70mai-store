export default function ProductSpecs({ specs = [] }) {
    return (
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-[#EBEBEB]">
            <table className="w-full text-left text-[17px]">
                <tbody>
                    {specs.map((spec) => (
                        <tr key={spec.label} className="border-b border-[#EBEBEB] last:border-0 even:bg-[#FAFAFA]">
                            <th scope="row" className="w-2/5 px-5 py-4 align-top font-semibold lg:px-8">
                                {spec.label}
                            </th>
                            <td className="px-5 py-4 text-muted lg:px-8">
                                {spec.values.map((value) => (
                                    <p key={value}>{value}</p>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
