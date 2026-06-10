import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { Col, Result, Row } from 'antd';
import { Link } from 'react-router-dom';

export const Error404 = () => {
  usePage({ initPage: initError404 });

  return (
    <>
      <Helmet>
        <title>Ошибка 404</title>
      </Helmet>
      <Header />
      <Row justify={'center'}>
        <Col span={8}>
          <Result
            status="404"
            title="404"
            subTitle="Тут ничего нет, даже ошибки. Строго говоря, сейчас должен быть текст про 404, но мы решили, что лучше признаться честно: мы её потеряли."
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

export const initError404 = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
