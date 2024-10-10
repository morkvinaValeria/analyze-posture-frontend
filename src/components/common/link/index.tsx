import { NavLink as AppLink } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { AppRoute } from '../../../common/enums';

import styles from './styles.module.scss';

type Props = {
  to: AppRoute;
};

const Link: React.FC<PropsWithChildren<Props>> = ({ children, to }) => (
  <AppLink to={to} className={styles.link}>
    {children}
  </AppLink>
);

export default Link;
