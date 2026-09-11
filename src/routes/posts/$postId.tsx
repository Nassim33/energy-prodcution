import { createFileRoute } from "@tanstack/react-router";
import { Alert, Skeleton, Typography } from "antd";
import { usePostQuery } from "@/api/posts";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetailPage,
});

function PostDetailPage() {
  const { postId } = Route.useParams();
  const { data: post, isPending, isError, error } = usePostQuery(postId);

  if (isPending) return <Skeleton active />;
  if (isError) return <Alert type="error" message={error.message} />;

  return (
    <article>
      <Typography.Title level={3}>{post.title}</Typography.Title>
      <Typography.Paragraph>{post.body}</Typography.Paragraph>
      <Typography.Text type="secondary">
        {new Date(post.createdAt).toLocaleString()}
      </Typography.Text>
    </article>
  );
}
