import { LeaderboardItem, LeaderboardResult } from '../../types/leaderboard';
import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import { useEffect, useMemo, useState } from 'react';
import { useLeaderboard } from './useLeaderboard';
import { Button, Col, Flex, Layout, notification, Row, Space, Table, Typography } from 'antd';
import { leaderboardColumns } from '../../constants/leaderboard/constants';
import s from './Leaderboard.module.css';
import { PageInitArgs } from '../../routes';
import { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title } = Typography;

const openNotification = (api) => {
  api.open({
    title: 'Вы достигли дна.. ⚓',
    description: 'или конца списка',
    placement: 'bottomRight',
    type: 'info',
    duration: 3,
  });
};

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage });

  const { getLeaderboard, loading } = useLeaderboard();
  const [api, contextHolder] = notification.useNotification();

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [columns, setLeaderboardColumns] = useState<ColumnsType<LeaderboardItem>>([]);
  const [cursor, setCursor] = useState<number>(0);
  const [perPage] = useState<number>(20);
  const [isButtonLoadmoreVisible, setIsButtonLoadmoreVisible] = useState<boolean>(true);

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

  const loadPage = (page: number, perPage: number): void => {
    getLeaderboard(page, perPage).then((response) => {
      if (response.length < perPage) {
        setIsButtonLoadmoreVisible(false);
        openNotification(api);
      }

      if (response.length) {
        const merged: LeaderboardItem[] = [
          ...leaderboard,
          ...response.map((item: LeaderboardResult) => {
            return {
              ...item.data,
            };
          }),
        ];
        setLeaderboard([
          ...merged.map((item: LeaderboardItem, index: number) => {
            return {
              ...item,
              order: index + 1,
            };
          }),
        ]);
      }
    });
    setCursor(cursor + perPage);
  };

  useEffect(() => {
    setLeaderboardColumns(generateColumns);
    loadPage(cursor, perPage);
  }, []);

  return (
    <>
      {contextHolder}
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
                <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
                  <Table<LeaderboardItem>
                    dataSource={leaderboard}
                    columns={columns}
                    pagination={{ placement: ['none', 'none'] }}
                    loading={loading}
                    rowKey={new Date().getTime * (Math.floor(Math.random() * 100) + 1)}
                  />
                  <Flex justify={'center'}>
                    {isButtonLoadmoreVisible ? (
                      ''
                    ) : (
                      <Button
                        className={isButtonLoadmoreVisible ? '' : 'hidden'}
                        loading={loading}
                        onClick={() => {
                          loadPage(cursor, perPage);
                        }}
                      >
                        Загрузить еще
                      </Button>
                    )}
                  </Flex>
                </Space>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    </>
  );
};

export const initLeaderboardPage = async ({ _dispatch, _state }: PageInitArgs) => {
  // заглушка
};
