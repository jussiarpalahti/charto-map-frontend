
import * as React from 'react';
import {observable, autorun, toJSON} from 'mobx';
import {observer} from 'mobx-react';


class StateStore {

    @observable states = null;

    constructor () {
        this.states = [];
    }

}

@observer
class Tool extends React.Component<{store: StateStore}, {}> {

    render () {
        var {store} = this.props;
        return (
            <div><h1>Toolbar</h1>
                <button>Previous state</button>
                <button>Next state</button>
                <span> States: {store.states.length}</span>
            </div>);
    }

}

export const state_store = new StateStore();

export const Tools = <div><Tool store={state_store}/></div>;
