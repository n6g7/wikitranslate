import controller from './wt.controller.js';
import template from './wt.jade';
import './wt.styl';

let appComponent = {
  controller,
  controllerAs: 'vm',
  restrict: 'E',
  template
};

export default appComponent;
