import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { Col, Result, Row } from 'antd';
import { Link } from 'react-router-dom';

export const Error500 = () => {
  usePage({ initPage: initError500 });

  return (
    <div>
      <Helmet>
        <title>Ошибка 500</title>
      </Helmet>
      <Header />
      <Row justify={'center'}>
        <Col span={8}>
          <Result
            status="500"
            title="500"
            subTitle="Это не вы, это мы. Честно. Что-то пошло не так на кухне сервера. Уже навели шорох, скоро всё заработает."
            extra={
              <Link to="/" type="default">
                На главную
              </Link>
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export const initError500 = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
