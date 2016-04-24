
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {autorun, toJSON} from 'mobx';

import {Gather, Gatherings} from './root';
import {ToolBar, StateStore} from './toolbar';


//
// Time travelling state tools
//

const hydrate = (dry_state) => {
    console.log("I'm returning...");
    const alive = {
        chosen: JSON.parse(dry_state.chosen),
        choices: JSON.parse(dry_state.choices),
        apis: JSON.parse(dry_state.apis)
    };
    return alive;
};

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

const state_store = new StateStore('toolbar_state');
let stored_state = state_store.get_stored_state();
let gatherings;

//
// Initialize app data
//

if (stored_state) {
    gatherings = new Gatherings(hydrate(stored_state));
} else {
    gatherings =  new Gatherings(null);
}

// Listen to Mobx state changes
var logger = autorun(() => dehydrate());


// The app
ReactDOM.render(<div><Gather gatherings={gatherings} /></div>, document.getElementById('app'));

// Time travelling toolbar
ReactDOM.render(<div><ToolBar store={state_store}/></div>, document.getElementById('toolbar'));