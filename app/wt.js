import angular from 'angular';
import highlightjs from 'angular-highlightjs';
import './node_modules/highlight.js/styles/github.css';
import ngSanitize from 'angular-sanitize';
import nguiBootstrap from 'angular-ui-bootstrap';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import './node_modules/ui-select/dist/select.js';
import './node_modules/ui-select/dist/select.css';
import WTComponent from './wt.component.js';

import './node_modules/lodash/lodash.js';

angular.module('WikiTranslate', [
  nguiBootstrap,
  'ui.select',
  ngSanitize,
  highlightjs
])
.component('wt', WTComponent);
