import { useEffect, useRef } from "react";

export default function useInfiniteScroll({ hasMore, isLoading, onLoadMore }) {
    const observerRef = useRef(null);
    const callbackRef = useRef(onLoadMore);

    useEffect(() => {
        callbackRef.current = onLoadMore;
    }, [onLoadMore]);

    const loadMoreRef = (node) => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore && !isLoading) {
                callbackRef.current();
            }
        });

        if (node) observerRef.current.observe(node);
    };

    return loadMoreRef;
}
