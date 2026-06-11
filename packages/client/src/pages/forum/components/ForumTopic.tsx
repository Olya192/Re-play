import { Avatar, Button, Card, Flex, Space, Typography } from 'antd';
import ForumComments from './ForumComments';
import {
  CommentOutlined,
  FieldTimeOutlined,
  RollbackOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

export const ForumTopic = () => {
  const navigate = useNavigate();
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

  const goToList = () => {
    navigate('/forum');
  };

  return (
    <div className="forum_list">
      <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
        <Button onClick={goToList} type="primary" icon={<RollbackOutlined />}>
          Назад к списку
        </Button>
        <Card actions={actions}>
          <Card.Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
            title={<Title level={1}>Татйтл топика</Title>}
            description={
              <>
                <Text>
                  <p>
                    Полное описание топика Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ab ad asperiores assumenda autem exercitationem fugiat harum hic ipsa itaque
                    necessitatibus, nihil pariatur qui ratione rem sunt temporibus tenetur, vel
                    veritatis!
                  </p>
                  <p>
                    Полное описание топика Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ab ad asperiores assumenda autem exercitationem fugiat harum hic ipsa itaque
                    necessitatibus, nihil pariatur qui ratione rem sunt temporibus tenetur, vel
                    veritatis!
                  </p>
                  <p>
                    Полное описание топика Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ab ad asperiores assumenda autem exercitationem fugiat harum hic ipsa itaque
                    necessitatibus, nihil pariatur qui ratione rem sunt temporibus tenetur, vel
                    veritatis!
                  </p>
                </Text>
              </>
            }
          />
        </Card>
        <ForumComments />
      </Space>
    </div>
  );
};

export default ForumTopic;
