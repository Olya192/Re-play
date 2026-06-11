import { Avatar, Card, Flex, Pagination, Space, Typography } from 'antd';
import { CommentOutlined, FieldTimeOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import s from '../../forum/Forum.module.css';

const { Title } = Typography;

export const ForumList = () => {
  const actions: React.ReactNode[] = [
    <Flex gap="medium" justify="center">
      <UserOutlined key="user" /> Иван Иванов
    </Flex>,
    <Flex gap="medium" justify="center">
      <FieldTimeOutlined key="createdAt" /> 10 минут назад
    </Flex>,
    <Flex gap="medium" justify="center">
      <CommentOutlined key="messagesCount" /> 0
    </Flex>,
  ];

  return (
    <div className="forum-list">
      <div className={s.forumHeader}>
        <Title level={1}>Форум</Title>
      </div>
      <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
        {
          /*mock data*/
          Array.from({ length: 10 }, (_, i) => i).map((el) => (
            <Card hoverable actions={actions} key={el}>
              <Card.Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                title={<Link to="/forum/1">топик</Link>}
                description={
                  <>
                    <p>Сокращенное описание топика...</p>
                  </>
                }
              />
            </Card>
          ))
        }
        <Pagination align="center" defaultCurrent={6} total={500} />
      </Space>
    </div>
  );
};

export default ForumList;
