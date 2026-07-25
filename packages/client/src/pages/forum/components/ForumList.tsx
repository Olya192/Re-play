import { Avatar, Card, Flex, Space, Typography } from 'antd';
import { FieldTimeOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import s from '../../forum/Forum.module.css';
import { ForumReactions } from './ForumReactions';
import { topic, useForum } from '@/pages/forum/useForum';
import { useMemo, useState } from 'react';

const { Title } = Typography;

const formatDate = (date: string) => {
  const newDate = new Date(date);

  return `${String(newDate.getDay()).padStart(2, '0')}.${String(newDate.getMonth() + 1).padStart(
    2,
    '0'
  )}.${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`;
};

export const ForumList = () => {
  const { getTopics } = useForum();

  const [topics, setTopics] = useState([]);

  useMemo(() => {
    getTopics()
      .then((response) => {
        setTopics(response);
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={s.forum}>
      <div className="forum-list">
        <div className={s.forumHeader}>
          <Title level={1}>Форум</Title>
        </div>
        <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
          {topics.length ? (
            <>
              {topics.map((el: topic) => (
                <Card
                  hoverable
                  actions={[
                    <Flex gap="medium" justify="center">
                      <UserOutlined key="user" /> {el.user.displayName}
                    </Flex>,
                    <Flex gap="medium" justify="center">
                      <FieldTimeOutlined key="createdAt" /> {<>{formatDate(el.createdAt)}</>}
                    </Flex>,
                  ]}
                  key={el.id}
                >
                  <Card.Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                    title={<Link to={`/forum/${el.id}`}>{el.title}</Link>}
                    description={
                      <>
                        {el.content}
                        <ForumReactions topicId={el.id} />
                      </>
                    }
                  />
                </Card>
              ))}
            </>
          ) : (
            <Card>
              <Card.Meta title={'Пусто'} description={'Нет топиков, нет проблем'} />
            </Card>
          )}
        </Space>
      </div>
    </div>
  );
};

export default ForumList;
