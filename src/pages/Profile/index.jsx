import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchFollowers,
    fetchFollowing,
    fetchProfileData,
} from "@/features/profile/profileSlice";
import PostCard from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import EditProfileModal from "@/components/profile/EditProfileModal";
import FollowListModal from "@/components/profile/FollowList";

export default function Profile() {
    const dispatch = useDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [openFollowers, setOpenFollowers] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("Thread");
    const {
        currentUser,
        reposts,
        isLoading,
        followers,
        followings,
        followingsCount,
        followersCount,
    } = useSelector((state) => state.profile);

    const { username } = useParams();

    // 1. Chỉ gọi Profile Data (User info + Posts) một lần duy nhất khi vào trang
    useEffect(() => {
        dispatch(fetchProfileData());
    }, [dispatch]);

    // 2. Tự động cập nhật số lượng Follow ngay khi có thông tin User
    useEffect(() => {
        if (currentUser?.id) {
            dispatch(fetchFollowers(currentUser.id));
            dispatch(fetchFollowing(currentUser.id));
        }
    }, [currentUser?.id, dispatch]);

    // 3. Cập nhật tiêu đề trang (Document Title)
    // useEffect(() => {
    //     if (currentUser) {
    //         const displayName = currentUser.name || currentUser.username;
    //         document.title = `${displayName} (@${currentUser.username}) • Threads`;
    //     }
    //     return () => {
    //         document.title = "Threads";
    //     };
    // }, [currentUser]);

    useEffect(() => {
        if (username) {
            document.title = `${username} (@${username}) • Threads`;
        }

        // Cleanup function: Khi rời khỏi trang Profile thì trả lại title mặc định
        return () => {
            document.title = "Threads";
        };
    }, [username]);

    const mapPostData = (threads) => {
        if (!threads) return [];
        return threads.map((thread) => {
            const original = thread.original_post;
            return {
                id: thread.id,
                user_id: thread.user_id,
                author:
                    thread.user?.name || original?.user?.name || "Người dùng",
                content: thread.content || "",
                originalPost: original
                    ? {
                          id: original.id,
                          author:
                              original.user?.name || original.user?.username,
                          content: original.content,
                          avatar: original.user?.avatar_url,
                          image: original.media_urls?.[0] || null,
                          name: original.user?.name,
                          username: original.user?.username,
                      }
                    : null,
                image:
                    thread.media_urls?.[0] || original?.media_urls?.[0] || null,
                user: {
                    id: thread.user?.id,
                    avatar_url:
                        thread.user?.avatar_url || "/avatar-placeholder.png",
                    username: thread.user?.username,
                    bio: thread.user?.bio || "",
                },
                likeCount: thread.likes_count ?? 0,
                reposts: thread.reposts_and_quotes_count ?? 0,
                comments: thread.replies_count ?? 0,
                reposts: thread.reposts_and_quotes_count ?? 0,
                shares: 0,
                isLiked: !!thread.is_liked_by_auth,
                isReposted: !!thread.is_reposted_by_auth,
            };
        });
    };

    // --- LỌC DỮ LIỆU ---
    const currentList = useMemo(() => {
        if (!currentUser || !reposts || !Array.isArray(reposts)) return [];

        const myId = currentUser.id;
        const allPostsMapped = mapPostData(reposts);

        return allPostsMapped.filter((post) => {
            const isMyAction = post.user?.id == myId || post.user_id == myId;
            if (!isMyAction) return false;

            if (activeTab === "Thread") {
                const isOriginal = !post.originalPost;
                const isQuote =
                    post.originalPost && post.content?.trim() !== "";
                return isOriginal || isQuote;
            }

            if (activeTab === "Đăng lại") {
                const hasOriginal = !!post.originalPost;
                const isEmptyContent =
                    !post.content || post.content.trim() === "";
                return hasOriginal && isEmptyContent;
            }

            if (
                activeTab === "Thread trả lời" ||
                activeTab === "File phương tiện"
            ) {
                return false;
            }

            return true;
        });
    }, [activeTab, currentUser, reposts]);
    if (isLoading)
        return <div className="text-center mt-10 font-medium">Đang tải...</div>;
    if (!currentUser) return null;

    return (
        <div className="flex flex-col mx-auto min-h-screen">
            {/* Header */}
            <div className="m-4">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-1 flex-col">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {username ||
                                currentUser.name ||
                                currentUser.username}
                        </h1>
                        <p className="text-gray-500 text-[15px]">
                            @{username || currentUser.username}
                        </p>

                        {currentUser?.bio && (
                            <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap">
                                {currentUser.bio}
                            </p>
                        )}

                        <div className="flex gap-4 items-center text-[15px] text-neutral-500 mt-4">
                            <button
                                onClick={() => setOpenFollowers(true)}
                                className="hover:underline transition-all"
                            >
                                <span className="font-bold text-black dark:text-white">
                                    {followersCount ||
                                        followers.length ||
                                        currentUser.followers_count ||
                                        0}
                                </span>{" "}
                                người theo dõi
                            </button>
                            <button
                                onClick={() => setOpenFollowing(true)}
                                className="hover:underline transition-all"
                            >
                                <span className="font-bold text-black dark:text-white">
                                    {followingsCount ||
                                        followings.length ||
                                        currentUser.followings_count ||
                                        0}
                                </span>{" "}
                                đang theo dõi
                            </button>
                        </div>
                    </div>

                    <Avatar className="size-20 border">
                        <AvatarImage
                            src={
                                currentUser.avatarUrl ||
                                "/avatar-placeholder.png"
                            }
                        />
                        <AvatarFallback className="text-xl font-semibold">
                            {username?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className="flex justify-center m-4">
                <Button
                    size="sm"
                    variant="outline"
                    className="px-2 grow font-semibold"
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Chỉnh sửa trang cá nhân
                </Button>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-4 border-b text-[15px]">
                {[
                    "Thread",
                    "Thread trả lời",
                    "File phương tiện",
                    "Đăng lại",
                ].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 text-center transition-all outline-none ${
                            activeTab === tab
                                ? "font-bold text-black dark:text-white"
                                : "font-medium text-neutral-500"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Posts List */}
            <div className="flex flex-col divide-y">
                {currentList.length > 0 ? (
                    currentList.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="p-12 text-center ">
                        <p>Chưa có nội dung nào trong mục {activeTab}.</p>
                    </div>
                )}
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                user={currentUser}
            />

            <FollowListModal
                isOpen={openFollowers}
                onClose={() => setOpenFollowers(false)}
                title="Người theo dõi"
                users={followers}
            />

            {/* Modal danh sách Đang theo dõi */}
            <FollowListModal
                isOpen={openFollowing}
                onClose={() => setOpenFollowing(false)}
                title="Đang theo dõi"
                users={followings}
            />
        </div>
    );
}
