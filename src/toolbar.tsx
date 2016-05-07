
import * as React from 'react';
import {observable, transaction, asFlat} from 'mobx';
import {observer} from 'mobx-react';

declare var require: any;
var Lockr = require('lockr');

export class StateStore {

    state_store = null;
    @observable states = asFlat([]);
    @observable active_state = 0;
    model = null;
    sentinel = null;
    
    add_state (new_state) {
        if (this.model && !this.sentinel) {
            let state = new_state? new_state : this.model.dehydrate();
            this.sentinel = false;
            this.states = this.states.slice(0, this.active_state);
            this.states.push(state);
            this.active_state = this.states.length;
        }
    }
    
    activate_state () {
        this.active_state += 1;
    }

    persist_state () {
        if (this.active_state) {
            Lockr.set(this.state_store, this.states[this.active_state]);
        } else {
            Lockr.set(this.state_store, this.states[this.states.length - 1]);
        }
    }

    clear_state () {
        Lockr.rm(this.state_store);
    }

    prev_state () {

        if (this.active_state === 0) {
            console.log("no more states in history");
            return;
        }

        this.sentinel = true;
        transaction(() => {
            this.active_state -= 1;
            this.model.hydrate(this.states[this.active_state - 1]);
        });
    }

    next_state () {

        if (this.active_state === this.states.length) {
            console.log("no more states in future");
            return;
        }

        this.sentinel = true;
        transaction(() => {
            this.active_state += 1;
            this.model.hydrate(this.states[this.active_state - 1]);
        });
    }

    is_prev_state () {
        return this.states.length > 1 && this.active_state > 1;
    }

    is_next_state () {
        return this.states.length > 1 && this.active_state < this.states.length;
    }

    constructor (model, store_key) {
        this.model = model;
        this.state_store = store_key;
        let stored_state = Lockr.get(this.state_store);
        if (stored_state) {
            this.model.hydrate(stored_state);
            this.add_state(stored_state); // Locally stored state to time machine
        }
    }

}


@observer
export class ToolBar extends React.Component<{store: StateStore}, {}> {

    render () {
        var {store} = this.props;
        return (
            <div><h1>State Toolbar</h1>
                <button disabled={!store.is_prev_state() ? "disabled" : ""} onClick={() => store.prev_state()}>Previous state</button>
                <button disabled={!store.is_next_state() ? "disabled" : ""} onClick={() => store.next_state()}>Next state</button>
                <span> States: {store.active_state}/{store.states.length}</span>
                <button onClick={() => store.persist_state()}>Persist to local storage</button>
                <button onClick={() => store.clear_state()}>Clear local storage</button>
            </div>);
    }

}
