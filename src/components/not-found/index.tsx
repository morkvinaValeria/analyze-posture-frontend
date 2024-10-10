import { Button, Container, Row, Col } from 'react-bootstrap';

import Link from '../common/link';
import { AppRoute } from '../../common/enums';

import styles from './styles.module.scss';

const NotFound: React.FC = () => {
  return (
    <Container className={`${styles.notFoundWrapper} d-flex flex-column`}>
      <Row className="vh-100">
        <Col sm={10} md={8} lg={6} className="mx-auto d-table vh-100">
          <div className="d-table-cell align-middle">
            <div className="text-center">
              <h1 className={styles.notFoundCode}>404</h1>
              <p className={styles.notFoundTitle}>Page not found.</p>
              <p className={styles.notFoundText}>
                The page you are looking for might have been removed.
              </p>
              <Link to={AppRoute.ROOT}>
                <Button className={styles.notFoundButton} variant="success">
                  Return to website
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
