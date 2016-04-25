
import * as React from 'react';
import {observable, transaction} from 'mobx';
import {observer} from 'mobx-react';

declare var require: any;
var Lockr = require('lockr');

export class StateStore {

    state_store = null;
    currentFrame = -1;
    @observable states = null;
    @observable active_state = null;
    model = null;
    instance = null;
    sentinel = null;

    get_state () {

        if (!this.instance) {
            let stored_state = Lockr.get(this.state_store);
            if (stored_state) {
                console.log("getting state store", this.state_store);
                this.instance = new this.model();
                this.instance.hydrate(stored_state);
            } else {
                this.instance = new this.model(null);
            }
        }

        return this.instance;
    }
    
    add_state () {
        if (!this.sentinel) {
            this.states.push(this.instance.dehydrate());
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
            this.instance.hydrate(this.states[this.currentFrame]);
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
            this.instance.hydrate(this.states[this.currentFrame]);
        });
    }

    constructor (model, store_key) {
        this.model = model;
        this.state_store = store_key;
    }

}

@observer
export class ToolBar extends React.Component<{store: StateStore}, {}> {

    render () {
        var {store} = this.props;
        return (
            <div><h1>Toolbar</h1>
                <button onClick={() => store.prev_state()}>Previous state</button>
                <button onClick={() => store.next_state()}>Next state</button>
                <span> States: {store.states.length}</span>
                <button onClick={() => store.persist_state()}>Persist</button>
            </div>);
    }

}
