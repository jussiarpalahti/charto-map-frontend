
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Gatherer} from './root';
import {Tools} from './toolbar';

ReactDOM.render(Gatherer, document.getElementById('app'));

ReactDOM.render(Tools, document.getElementById('toolbar'));
