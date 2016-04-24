
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {autorun, toJSON} from 'mobx';

import {Gather, Gatherings} from './root';
import {ToolBar, StateStore} from './toolbar';


const state_store = new StateStore('toolbar_state');
let stored_state = state_store.get_stored_state();
let gatherings;

if (stored_state) {
    gatherings = new Gatherings(stored_state.gatherings);
} else {
    gatherings =  new Gatherings(null);
}

const dehydrate = () => {
    console.log("I'm changing...");
    const dry = {
        chosen: JSON.stringify(toJSON(gatherings.chosen)),
        choices: JSON.stringify(toJSON(gatherings.choices)),
        apis: JSON.stringify(toJSON(gatherings.apis))
    };

    // TODO: State stores need an API
    state_store.add_state(dry);
};


var logger = autorun(() => dehydrate());


ReactDOM.render(<div><Gather gatherings={gatherings} /></div>, document.getElementById('app'));

ReactDOM.render(<div><ToolBar store={state_store}/></div>, document.getElementById('toolbar'));
