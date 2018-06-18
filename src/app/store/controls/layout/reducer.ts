import { LayoutActions } from './actions';
import { ILayout } from './model';

const layout = (state: ILayout = { subNav: [], sideNav: [], alerts: [] }, action) =>
  LayoutActions.match({

    SET_SUBNAV: subNav => ({ ...state, subNav }),
    SET_SIDENAV: sideNav => ({ ...state, sideNav }),
    SET_NAV: ({ sideNav, subNav }) => ({ ...state, sideNav, subNav }),

    ADD_ALERT: alert => ({ ...state, alerts: [...state.alerts, alert] }),
    REMOVE_ALERT: id => ({ ...state, alerts: state.alerts.filter(alert => alert.id !== id) })

  }, _ => state)(action);

export default layout;
