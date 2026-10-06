import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: send `email` to your newsletter endpoint, e.g. router.post('/newsletter', { email }).
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-end">
            <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                autoComplete="email"
                className="h-10 w-[200px] rounded border border-[#979797] px-[15px] text-sm text-black outline-none md:w-[170px] md:rounded-none md:border-x-0 md:border-t-0 md:text-xs"
            />
            <button
                type="submit"
                className="h-10 bg-[#9e9e9e] px-[5px] text-sm text-white md:ml-5 md:h-auto md:w-[100px] md:rounded md:border md:border-muted md:bg-white md:p-0 md:text-xs md:leading-[25px] md:text-muted"
            >
                Sign Up
            </button>
        </form>
    );
}
