import { Avatar, Button, Card, Empty, Flex, Space, Typography } from 'antd';
import ForumComments from './ForumComments';
import { ForumReactions } from './ForumReactions';
import { FieldTimeOutlined, RollbackOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useForum } from '@/pages/forum/useForum';
import { useMemo, useState } from 'react';
import { withForumNotifications } from '@/hocs/withForumNotifications';
import userAvatarIcon from '@/assets/icons/user-avatar-icon.svg';

const { Text, Title } = Typography;

const ForumTopicBase = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { getTopic, topic } = useForum();
  const [hasError, setHasError] = useState(false);

  const goToList = () => {
    navigate('/forum');
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);

    return `${String(newDate.getDay()).padStart(2, '0')}.${String(newDate.getMonth() + 1).padStart(
      2,
      '0'
    )}.${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`;
  };

  useMemo(() => {
    setHasError(false);
    getTopic(Number(params?.topicId)).catch((error: unknown) => {
      setHasError(true);
      console.log('', error);
    });
  }, []);

  if (!topic) {
    return (
      <Empty
        description={
          <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
            <div>Ничегошеньки тут нет</div>
            <Button onClick={goToList} type="primary" icon={<RollbackOutlined />}>
              Назад к списку
            </Button>{' '}
          </Space>
        }
      />
    );
  } else if (hasError) {
    return (
      <Empty
        description={
          <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
            <div>Какая-то ошибочка</div>
            <Button onClick={goToList} type="primary" icon={<RollbackOutlined />}>
              Назад к списку
            </Button>{' '}
          </Space>
        }
      />
    );
  } else {
    return (
      <div className="forum_list">
        <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
          <Button onClick={goToList} type="primary" icon={<RollbackOutlined />}>
            Назад к списку
          </Button>
          <Card
            actions={[
              <Flex gap="medium" justify="center">
                <UserOutlined key="user" /> {topic.user?.displayName}
              </Flex>,
              <Flex gap="medium" justify="center">
                <FieldTimeOutlined key="createdAt" /> {<>{formatDate(topic.createdAt)}</>}
              </Flex>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar src={userAvatarIcon} />}
              title={<Title level={1}>{topic.title}</Title>}
              description={<Text>{topic.content}</Text>}
            />
          </Card>
          <ForumReactions topicId={topic.id} withUsersTooltip />
          <ForumComments topicId={topic.id} />
        </Space>
      </div>
    );
  }
};

export const ForumTopic = withForumNotifications(ForumTopicBase);

export default ForumTopic;
