import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import { ForumList } from './components/ForumList';
import { Col, FloatButton, Layout, Row } from 'antd';
import s from '../forum/Forum.module.css';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import { NotificationBanner } from './components/NotificationBanner';
import { PlusOutlined } from '@ant-design/icons';

const { Content } = Layout;

export const ForumPage = () => {
  usePage({ initPage: initForumPage });

  const { topicId } = useParams();
  const navigate = useNavigate();
  const isAddTopic = useMatch('/forum/add');

  const toggleAddTopic = () => {
    navigate('/forum/add');
  };

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Форум" />
      </Helmet>
      <Header />

      <Layout className={s.forum}>
        <Content>
          <Row justify="center">
            <Col sm={22} md={18} lg={14}>
              {topicId === undefined && !isAddTopic && (
                <>
                  <NotificationBanner />
                  <ForumList />
                  <FloatButton
                    type="primary"
                    icon={<PlusOutlined />}
                    tooltip={<div>Добававить топик</div>}
                    onClick={toggleAddTopic}
                  />
                </>
              )}
              <Outlet />
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export const initForumPage = () => Promise.resolve();
