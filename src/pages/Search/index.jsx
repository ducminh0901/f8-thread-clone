import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import {
    fetchFollowSuggestions,
    fetchNextSuggestions,
    fetchInitialSearch,
    setKeyword,
} from "@/features/search/searchSlice";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";
import { UserSkeleton } from "@/components/posts/Skeleton/PostSkeleton";
import { UserSkeletonList } from "@/components/posts/Skeleton/PostSkeletonList";
import UserCard from "@/components/search/UserCard";

const SearchPage = () => {
    const dispatch = useDispatch();
    const {
        keyword,
        userResults,
        topicResults,
        suggestions,
        status,
        hasMore,
        isInitialLoading,
        isFetchingMore,
    } = useSelector((state) => state.search);

    const debouncedKeyword = useDebounce(keyword, 500);

    useEffect(() => {
        if (debouncedKeyword.length === 0) {
            dispatch(fetchFollowSuggestions(1));
        } else if (debouncedKeyword.length >= 2) {
            dispatch(fetchInitialSearch({ q: debouncedKeyword }));
        }
    }, [debouncedKeyword, dispatch]);

    const handleLoadMore = useCallback(() => {
        if (debouncedKeyword.length === 0 && hasMore && !isFetchingMore) {
            dispatch(fetchNextSuggestions());
        }
    }, [debouncedKeyword, hasMore, isFetchingMore, dispatch]);

    const loadMoreRef = useInfiniteScroll({
        onLoadMore: handleLoadMore,
        isLoading: status === "loading" || isFetchingMore,
        hasMore: hasMore,
    });

    return (
        <div className="search-container p-4 max-w-2xl mx-auto min-h-screen flex flex-col">
            {/* 1. Header & Search Bar */}
            <div className="mb-4">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 size-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        className="w-full p-3 pl-12 rounded-xl border text-sm transition-all"
                        placeholder="Tìm kiếm"
                        value={keyword}
                        onChange={(e) => dispatch(setKeyword(e.target.value))}
                    />
                </div>
            </div>

            {/* 2. Nội dung hiển thị chính */}
            <div className="grow">
                {debouncedKeyword.length >= 2 ? (
                    <div className="search-results animate-fadeIn">
                        {topicResults.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-bold mb-3 text-lg">
                                    Chủ đề
                                </h3>
                                <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
                                    {topicResults.map((t) => (
                                        <span
                                            key={t.id}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full whitespace-nowrap text-sm"
                                        >
                                            # {t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <h3 className="font-bold mb-3 text-lg">Mọi người</h3>
                        {status === "loading" ? (
                            /* 1. Đang tìm kiếm: Hiện Skeleton */
                            <Spinner className="mx-auto size-6" />
                        ) : userResults.length > 0 ? (
                            /* 2. Có kết quả: Hiện danh sách */
                            userResults.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))
                        ) : (
                            /* 3. Không có kết quả: Chỉ hiện khi status đã xong và mảng rỗng */
                            status === "succeeded" && (
                                <p className="text-center text-gray-500 py-10">
                                    Không tìm thấy ai phù hợp với "{keyword}"
                                </p>
                            )
                        )}
                    </div>
                ) : (
                    <div className="suggestions-section animate-fadeIn">
                        <h3 className="font-semibold mb-2 ">Gợi ý theo dõi</h3>
                        {isInitialLoading ? (
                            // Load Skeleton lần đầu tiên
                            <div className="space-y-1">
                                {[...Array(15)].map((_, i) => (
                                    <UserSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            suggestions.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* 3. Điểm trigger Load More */}
            <div ref={loadMoreRef} className="py-6 flex flex-col items-stretch">
                {isFetchingMore && <UserSkeletonList />}

                {!hasMore && suggestions.length > 0 && !keyword && (
                    <p className="text-center text-xs italic py-4">
                        Bạn đã xem hết danh sách gợi ý
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
