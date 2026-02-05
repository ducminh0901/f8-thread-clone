import { Spinner } from "../ui/spinner";
import PostCard from "./PostCard";

function PostList({ posts, onLike, onRepost, onQuote }) {
    if (!posts?.length) {
        return <Spinner className="size-8 mx-auto my-16" />;
    }

    return (
        <>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => onLike(post.id)}
                    onRepost={() => onRepost(post.id)}
                    onQuote={() => onQuote(post.id)}
                />
            ))}
        </>
    );
}

export default PostList;
