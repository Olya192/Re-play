import { useState } from 'react';
import { Avatar, Button, Flex, Input, Space, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { User } from '@/types/user';

const { Text, Title } = Typography;
const { TextArea } = Input;

const MAX_COMMENT_LENGTH = 500;
const SEND_BUTTON_LABEL = 'Отправить';
const TEXTAREA_PLACEHOLDER = 'Напишите сообщение...';
const TEXTAREA_ROWS = 3;

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  user: User;
}

const formatDate = (date: string) => {
  const newDate = new Date(date);

  return `${String(newDate.getDay()).padStart(2, '0')}.${String(newDate.getMonth() + 1).padStart(
    2,
    '0'
  )}.${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`;
};

export const ForumComments = (props) => {
  const [newComment, setNewComment] = useState('');

  const handleSend = () => {
    const trimmed = newComment.trim();

    if (trimmed.length === 0) {
      return;
    }

    setNewComment('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Title level={2}>Комментарии</Title>
      <Flex vertical gap="large">
        <Space orientation="vertical" size="middle" style={{ display: 'flex' }}>
          {props.comments.map((comment: Comment) => (
            <Flex key={comment.id} gap="middle" align="flex-start">
              <Avatar src={comment.avatar} />
              <Flex vertical flex={1}>
                <Flex gap="small" align="baseline">
                  <Text strong>{comment.user?.displayName}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {<>{formatDate(comment.createdAt)}</>}
                  </Text>
                </Flex>
                <Text>{comment.content}</Text>
              </Flex>
            </Flex>
          ))}
        </Space>

        <Flex gap="small" align="flex-start">
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=you" />
          <Flex vertical flex={1} gap="small">
            <TextArea
              rows={TEXTAREA_ROWS}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={TEXTAREA_PLACEHOLDER}
              maxLength={MAX_COMMENT_LENGTH}
            />
            <Flex justify="space-between" align="center">
              <Text type="secondary" style={{ fontSize: 12 }}>
                {newComment.length}/{MAX_COMMENT_LENGTH}
              </Text>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={newComment.trim().length === 0}
              >
                {SEND_BUTTON_LABEL}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ForumComments;
