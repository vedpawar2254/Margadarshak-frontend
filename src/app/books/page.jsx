'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Books are displayed on /events page only
export default function BooksRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/events');
    }, [router]);

    return null;
}
