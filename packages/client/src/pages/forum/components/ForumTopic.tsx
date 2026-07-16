import { Avatar, Button, Card, Flex, Space, Typography } from 'antd';
import ForumComments from './ForumComments';
import { FieldTimeOutlined, RollbackOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useForum } from '@/pages/forum/useForum';
import { useMemo, useState } from 'react';

const { Text, Title } = Typography;

export const ForumTopic = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [topic, setTopic] = useState([]);
  const [comments, setComments] = useState([]);
  const { getTopic } = useForum();

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
    getTopic(Number(params?.topicId))
      .then((response) => {
        setTopic(response?.topic);
        setComments(response?.comments);
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  }, []);

  if (topic.length) {
    return;
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
              avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
              title={<Title level={1}>{topic.title}</Title>}
              description={<Text>{topic.content}</Text>}
            />
          </Card>
          <ForumComments comments={comments} />
        </Space>
      </div>
    );
  }
};

export default ForumTopic;
