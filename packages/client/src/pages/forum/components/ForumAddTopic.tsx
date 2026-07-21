import { Button, Form, Input, Space } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { useForum } from '@/pages/forum/useForum';

type TopicType = {
  title: string;
  content: string;
};

const { TextArea } = Input;

export const ForumAddTopic = () => {
  const { addTopic, forumLoading, goToList } = useForum();

  return (
    <div className="forum_list">
      <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
        <pre>{forumLoading}</pre>
        <Form
          name="add-topic"
          layout={'vertical'}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={addTopic}
          disabled={forumLoading}
        >
          <Form.Item>
            <Button onClick={goToList} type="primary" icon={<RollbackOutlined />}>
              Назад к списку
            </Button>
          </Form.Item>
          <Form.Item<TopicType>
            label="Тема"
            name="title"
            rules={[{ required: true, message: 'Обязательно для запонения' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<TopicType>
            label="Контент"
            name="content"
            rules={[{ required: true, message: 'Обязательно для запонения' }]}
          >
            <TextArea rows={4} maxLength={2000} autoSize={{ minRows: 10, maxRows: 20 }} />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Отправить
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default ForumAddTopic;
