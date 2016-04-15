
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observable, autorun, toJSON} from 'mobx';

declare var require: any;
var Lockr = require('lockr');

import {Gatherer, gatherings} from './root';
import {Tools} from './toolbar';

ReactDOM.render(Gatherer, document.getElementById('app'));

ReactDOM.render(Tools, document.getElementById('toolbar'));

var logger = autorun(() => console.log("I'm changing...", JSON.stringify(toJSON(gatherings.chosen)), JSON.stringify(toJSON(gatherings.choices))));
