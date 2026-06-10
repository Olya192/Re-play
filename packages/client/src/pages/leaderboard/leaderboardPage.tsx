import { LeaderboardItem } from '../../types/leaderboard';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import { useEffect, useMemo, useState } from 'react';
import { useLeaderboard } from './useLeaderboard';
import { Col, Layout, Row, Table, Typography } from 'antd';
import { leaderboardColumns } from '../../constants/leaderboard/constants';
import s from './Leaderboard.module.css';
import { PageInitArgs } from '../../routes';
import { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title } = Typography;

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage });

  const { leaderboardItems } = useLeaderboard();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [columns, setLeaderboardColumns] = useState<ColumnsType<LeaderboardItem>>([]);

  const generateColumns = useMemo(() => {
    return (Object.entries(leaderboardColumns) as [keyof typeof leaderboardColumns, string][]).map(
      ([key, item]) => {
        return {
          title: item,
          dataIndex: key,
          key: key,
          width: ['name', 'team'].includes(key) ? 'responsive' : 100,
        };
      }
    );
  }, [leaderboardColumns]);

  const generateFields = useMemo((): LeaderboardItem[] => {
    return Array.from({ length: 100 }, (item: number, index: number) => {
      return {
        key: index,
        id: index,
        order: index + 1,
        name: 'Какоетоимя',
        score: Math.floor(Math.random() * 100000) + 1,
        team: 'Какаятокоманда',
      };
    });
  }, [leaderboardItems]);

  useEffect(() => {
    const fields = generateFields;
    const columns = generateColumns;
    setLeaderboard([...fields]);
    setLeaderboardColumns(columns);
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
              <Table<LeaderboardItem> dataSource={leaderboard} columns={columns} />
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export const initLeaderboardPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
