
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {autorun} from 'mobx';

import {Gather, Gatherings} from './root';
import {ToolBar, StateStore} from './toolbar';


//
// Time travelling state tools
//

let gatherings = new Gatherings(null);

const state_store = new StateStore(gatherings, 'toolbar_state');

// Listen to Mobx state changes
var logger = autorun(() => {
    let arg = state_store.model.dehydrate();
    // TODO: Fix this hack because autorun is changing models as a side effect
    requestAnimationFrame(() => {
        state_store.add_state(arg);
    });
});

//
// Initialize app data
//

// The app
ReactDOM.render(<div><Gather gatherings={gatherings} /></div>, document.getElementById('app'));

// Time travelling toolbar
ReactDOM.render(<div><ToolBar store={state_store}/></div>, document.getElementById('toolbar'));

/*

For future reference async/await is working with Chrome at least

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function printDelayed(elements: string[]) {
    for (const element of elements) {
        await delay(1000);
        console.log(element);
    }
}

printDelayed(["hih", "hoh", "heh"]);
*/
