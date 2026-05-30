import { LeaderboardItem } from '../../types/leaderboard';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import { useEffect, useState } from 'react';
import { useForum } from './useForum';
import { Col, Layout, Row, Typography } from 'antd';
import s from './Leaderboard.module.css';
import { PageInitArgs } from '../../routes';
import { ForumTopicItem } from '../../types/forum';

const { Content } = Layout;
const { Title } = Typography;

export const ForumPage = () => {
  usePage({ initPage: initForumPage });

  const { forumItems } = useForum();
  const [forum, setForum] = useState<ForumTopicItem[] | []>([]);

  // const generateFields = (): LeaderboardItem[] => {
  //   return Array.from({ length: 100 }, (_, i) => i).map((item, index) => {
  //     return {
  //       key: index,
  //       id: index,
  //       order: index + 1,
  //       name: 'Какоетоимя',
  //       score: Math.floor(Math.random() * 100000) + 1,
  //       team: 'Какаятокоманда',
  //     };
  //   });
  // };

  useEffect(() => {
    if (forumItems) {
      // const fields = generateFields();
      setForum([]);
    }
  }, [forumItems]);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Таблица лидеров" />
      </Helmet>
      <Header />

      <Layout className={s.forum}>
        <Content>
          <Row justify="center">
            <Col span={12}>
              <Title level={1}>Форум</Title>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export const initForumPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
