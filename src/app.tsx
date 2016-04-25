
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {autorun, toJSON} from 'mobx';

import {Gather, Gatherings} from './root';
import {ToolBar, StateStore} from './toolbar';


//
// Time travelling state tools
//

const state_store = new StateStore(Gatherings, 'toolbar_state');

// Listen to Mobx state changes
var logger = autorun(() => state_store.add_state());

//
// Initialize app data
//

// The app
ReactDOM.render(<div><Gather gatherings={state_store.get_state()} /></div>, document.getElementById('app'));

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
