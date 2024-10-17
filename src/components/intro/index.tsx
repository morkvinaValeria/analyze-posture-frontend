import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import shrimpImage from '../../assets/img/shrimp.png';
import { AppRoute } from '../../common/enums';
import Menu from '../common/menu';

import styles from './styles.module.scss';

const Intro: React.FC = () => {
  return (
    <>
      <div className={styles.mainContainer}>
        <Menu />
        <div className={styles.introBody}>
          <h4>
            <strong>
              Welcome to the Posture Analyzer – your smart solution for
              identifying and improving your posture!
            </strong>
          </h4>

          <p>
            Our advanced Posture Analyzer will help you detect any issues,
            including scoliosis, hunching, or misalignment. By analyzing your
            posture, we can pinpoint potential problems that may lead to
            discomfort, pain, or long-term health concerns. Whether you’re
            looking to prevent future issues or correct existing ones, our tool
            provides personalized recommendations to improve your posture.{' '}
          </p>
          <div className={styles.shrimpContainer}>
            <img
              width="80"
              src={shrimpImage}
              alt="shrimp"
              className={styles['shrimp-image']}
            />
            <div className={styles.containerDescription}>
              <p className={styles.caution}>DON'T BE SHRIMP!</p>
              <p>
                Don't let bad posture impact your well-being. Start your journey
                to better health and confidence today!
              </p>
            </div>
          </div>
          <div className={styles.tryItOutButtonDescription}>
            <Link to={AppRoute.ANALYZE}>
              <Button className={styles.tryItOutButton} variant="success">
                Try it out
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Intro;
