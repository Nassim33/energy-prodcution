import { Link } from "@tanstack/react-router";
import { Alert, Button, Card, Form, Input, List, Skeleton, Space } from "antd";
import { usePostsQuery, useCreatePostMutation } from "@/api/posts";
import { postInputSchema, type PostInput } from "@/schemas/post";
import { useAppStore } from "@/store/useAppStore";

export function PostList() {
  const { data: posts, isPending, isError, error } = usePostsQuery();
  const createPost = useCreatePostMutation();
  const draftTitle = useAppStore((s) => s.draftTitle);
  const setDraftTitle = useAppStore((s) => s.setDraftTitle);
  const [form] = Form.useForm<PostInput>();

  async function handleFinish(values: PostInput) {
    const parsed = postInputSchema.safeParse(values);
    if (!parsed.success) return;
    await createPost.mutateAsync(parsed.data);
    form.resetFields();
    setDraftTitle("");
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="New post">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ title: draftTitle }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true, min: 1 }]}>
            <Input onChange={(e) => setDraftTitle(e.target.value)} placeholder="A great title" />
          </Form.Item>
          <Form.Item name="body" label="Body" rules={[{ required: true, min: 1 }]}>
            <Input.TextArea rows={3} placeholder="Write something..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={createPost.isPending}>
            Publish
          </Button>
        </Form>
      </Card>

      {isPending && <Skeleton active />}
      {isError && <Alert type="error" message={error.message} />}
      {posts && (
        <List
          bordered
          dataSource={posts}
          renderItem={(post) => (
            <List.Item>
              <Link to="/posts/$postId" params={{ postId: post.id }}>
                {post.title}
              </Link>
            </List.Item>
          )}
        />
      )}
    </Space>
  );
}
