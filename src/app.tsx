
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observe} from "mobx";

import {Gather, Gatherings} from './root';
import {ToolBar, StateStore} from './toolbar';


//
// Time travelling state tools
//

let gatherings = new Gatherings(null);

const state_store = new StateStore(gatherings, 'toolbar_state');

// Listen to Mobx state changes
var logger = observe(gatherings, (change) => {
    state_store.add_state(null);
});

//
// Initialize app data
//

// The app
ReactDOM.render(<div><Gather gatherings={gatherings} /></div>, document.getElementById('app'));

// Time travelling toolbar
ReactDOM.render(<div><ToolBar store={state_store}/></div>, document.getElementById('toolbar'));

// class DataModel {
//     @observable one_state = null;
// }
//
// class Store {
//     @observable states = asFlat([]);
// }
//
// let data = new DataModel();
// let store = new Store();
//
// autorun(() => {
//     store.states.push(data.one_state);
//     // console.log("new data", toJSON(store.states));
// });
//
// data.one_state = "change 1";
// data.one_state = "change 2";
//

// autorun(() => console.log("separate autorun", toJSON(state_store.states)));

//
// var name = observable("John");
// var age = observable(42);
// var showAge = observable(false);
//
// var jee = observable("hih");
//
// var labelText = computed(() =>
//     showAge.get() ? `${name.get()} (age: ${age.get()})` : name.get()
// );
//
// var disposer = labelText.observe(newLabel => {
//     console.log("que?", newLabel);
//     jee = newLabel;
//     console.log("jee", jee);
// });
//
// console.log("jee", jee.get());
//
// name.set("Dave");
// // prints: 'Dave'
//
// age.set(21);
// // doesn't print
//
// showAge.set(true);
// // prints: 'Dave (age: 21)'
//
// age.set(42);
// // prints: 'Dave (age: 42)'
//
// // cancel the observer
// disposer();
//
// name.set("Matthew");
// // doesn't print anymore...
//
// // ... but the value can still be inspected if needed.
// console.log(labelText.get());
//
// console.log("jee", jee);


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
