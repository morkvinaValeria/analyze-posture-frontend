import 'bootstrap/dist/css/bootstrap.min.css';
import shrimpImage from '../../../assets/img/shrimp.png';
import styles from './styles.module.scss';
import Link from '../link';
import { AppRoute } from '../../../common/enums';

function Menu() {
  return (
    <div className={styles.menu}>
      <img src={shrimpImage} width="40" height="40" alt="" />
      <Link to={AppRoute.ROOT}>
        <h1>Posture Analyzer</h1>
      </Link>
    </div>
  );
}

export default Menu;
