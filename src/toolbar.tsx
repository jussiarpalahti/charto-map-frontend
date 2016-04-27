
import * as React from 'react';
import {observable, transaction, autorun} from 'mobx';
import {observer} from 'mobx-react';

declare var require: any;
var Lockr = require('lockr');

export class StateStore {

    state_store = null;
    currentFrame = -1;
    @observable states = [];
    @observable active_state = null;
    model = null;
    sentinel = null;
    
    add_state () {
        if (this.model && !this.sentinel) {
            this.states.push(this.model.dehydrate());
            this.sentinel = false;
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

        if (this.currentFrame === 0) {
            console.log("no more states in history");
            return;
        }

        if (this.currentFrame === -1)
            this.currentFrame = this.states.length;
        this.currentFrame--;
        this.sentinel = true; // TODO: Check Mobx autorun suppression
        transaction(() => {
            this.model.hydrate(this.states[this.currentFrame]);
        });
    }

    next_state () {

        if (this.currentFrame === this.states.length -1) {
            console.log("no more states in future");
            return;
        }

        this.currentFrame++;
        this.sentinel = true; // TODO: Check Mobx autorun suppression
        transaction(() => {
            this.model.hydrate(this.states[this.currentFrame]);
        });
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
                <button onClick={() => store.prev_state()}>Previous state</button>
                <button onClick={() => store.next_state()}>Next state</button>
                <span> States: {store.states.length}</span>
                <button onClick={() => store.persist_state()}>Persist</button>
                <button onClick={() => store.clear_state()}>Clear local storage</button>
            </div>);
    }

}
