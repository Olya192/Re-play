import { LeaderboardItem } from '../../types/leaderboard';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import { useEffect, useState } from 'react';
import { useLeaderboard } from './useLeaderboard';
import { Col, Layout, Row, Table, Typography } from 'antd';
import { LEADERBOARD_FIELDS } from '../../constants/leaderboard/constants';
import s from './Leaderboard.module.css';

const { Content } = Layout;
const { Title } = Typography;

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage });

  const { leaderboardItems } = useLeaderboard();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[] | []>([]);
  const [columns, setLeaderboardColumns] = useState<[]>([]);

  const generateColumns = () => {
    return (Object.entries(LEADERBOARD_FIELDS) as [keyof typeof LEADERBOARD_FIELDS, string][]).map(
      ([key, item]) => {
        return {
          title: item,
          dataIndex: key,
          key: key,
          width: ['name', 'team'].includes(key) ? 999 : 100,
        };
      }
    );
  };

  const generateFields = (): LeaderboardItem[] => {
    return Array.from({ length: 100 }, (_, i) => i).map((item, index) => {
      return {
        key: index,
        id: index,
        order: index + 1,
        name: 'Какоетоимя',
        score: Math.floor(Math.random() * 100000) + 1,
        team: 'Какаятокоманда',
      };
    });
  };

  useEffect(() => {
    if (leaderboardItems) {
      const fields = generateFields();
      const columns = generateColumns();
      setLeaderboard([...fields]);
      setLeaderboardColumns(columns);
    }
  }, [leaderboardItems]);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Таблица лидеров</title>
        <meta name="description" content="Таблица лидеров" />
      </Helmet>
      <Header />

      <Layout className={s.leaderboard}>
        <Content>
          <Row justify="center">
            <Col span={12}>
              <Title level={1}>Таблица лидеров</Title>
              <Table dataSource={leaderboard} columns={columns} />
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export const initLeaderboardPage = () => Promise.resolve();
