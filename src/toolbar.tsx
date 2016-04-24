
import * as React from 'react';
import {observable, autorun, toJSON} from 'mobx';
import {observer} from 'mobx-react';

declare var require: any;
var Lockr = require('lockr');


export class StateStore {

    state_store = null;
    @observable states = null;
    @observable active_state = null;
    
    get_stored_state () {
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
                <button>Previous state</button>
                <button>Next state</button>
                <span> States: {store.states.length}</span>
                <button onClick={store.persist_state}>Persist</button>
            </div>);
    }

}
