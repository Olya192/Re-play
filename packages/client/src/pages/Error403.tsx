import { Helmet } from 'react-helmet';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { Col, Result, Row } from 'antd';
import { Link } from 'react-router-dom';

export const Error403 = () => {
  usePage({ initPage: initError403 });

  return (
    <>
      <Helmet>
        <title>Ошибка 403</title>
      </Helmet>
      <Header />
      <Row justify={'center'}>
        <Col span={8}>
          <Result
            status="403"
            title="403"
            subTitle="Сюда нельзя. Совсем."
            extra={
              <Link to="/" type="default">
                На главную
              </Link>
            }
          />
        </Col>
      </Row>
    </>
  );
};

export const initError403 = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
