import {CommonActions, useNavigationState} from '@react-navigation/native';
import Logger from './Logger';

let _container;

function setContainer(container) {
  _container = container;
}

function reset(routeName, params = {}) {
  _container.dispatch(
    CommonActions.reset({
      index: 0,
      actions: [
        CommonActions.navigate({
          type: 'Navigation/NAVIGATE',
          routeName,
          params,
        }),
      ],
    }),
  );
}

function goBack(routeName) {
  _container.dispatch(
    CommonActions.back({
      key: routeName,
    }),
  );
}

function navigate(routeName, params = {}) {
  _container.navigate(routeName, params);
}

function navigate_normal(routeName, params = {}) {
  _container.navigate(routeName, params);
}

function getCurrentRoute() {
  const {index, routes} = _container.dangerouslyGetState();
  const screenName = routes[index].name;
  Logger.log('screenName=> ', screenName);
  return screenName;
}

function resetFrom(routeName) {
  _container.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{name: routeName}],
    }),
  );
}
export default {
  setContainer,
  navigate,
  reset,
  goBack,
  getCurrentRoute,
  navigate_normal,
  resetFrom,
};
