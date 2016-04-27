
import * as React from 'react';
import {observable, transaction} from 'mobx';
import {observer} from 'mobx-react';

declare var require: any;
var Lockr = require('lockr');

export class StateStore {

    state_store = null;
    @observable states = [];
    @observable active_state = 0;
    model = null;
    sentinel = null;
    
    add_state (state) {
        if (this.model && !this.sentinel) {
            this.sentinel = true;
            transaction(() => {
                this.states.push(state);
                this.active_state += 1;
                this.sentinel = false;
            });
        }
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

        this.active_state--;
        this.sentinel = true; // TODO: Check Mobx autorun suppression
        transaction(() => {
            this.model.hydrate(this.states[this.active_state]);
        });
    }

    next_state () {

        if (this.active_state === this.states.length) {
            console.log("no more states in future");
            return;
        }

        this.active_state++;
        this.sentinel = true; // TODO: Check Mobx autorun suppression
        transaction(() => {
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
                <button onClick={() => store.persist_state()}>Persist</button>
                <button onClick={() => store.clear_state()}>Clear local storage</button>
            </div>);
    }

}
