
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
    @observable model = null;
    hydrate = null;
    dehydrate = null;

    register_model (model, hydrate, dehydrate) {
        this.model = model;
        this.hydrate = hydrate;
        this.dehydrate = dehydrate;
    }

    get_stored_state () {
        console.log("getting state store", this.state_store);
        return Lockr.get(this.state_store)
    }
    
    add_state (state) {
        this.states.push(state);
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

        transaction(() => {
            let new_state = this.hydrate(this.states[this.currentFrame]);
            this.model.choices = new_state.choices;
            this.model.chosen = new_state.chosen;
            this.model.apis = new_state.apis;
        });
    }

    next_state () {

        if (this.currentFrame === this.states.length -1) {
            console.log("no more states in future");
            return;
        }

        this.currentFrame++;
        
        transaction(() => {
            let new_state = this.hydrate(this.states[this.currentFrame]);
            this.model.choices = new_state.choices;
            this.model.chosen = new_state.chosen;
            this.model.apis = new_state.apis;
        });
    }

    constructor (store_key) {
        
        this.state_store = store_key;
        this.states = [];
        this.active_state = null;
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
