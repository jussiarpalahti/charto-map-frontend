
import * as React from 'react';

class StateStore {

    states = [];

}

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

const state_store = new StateStore();

export const Tools = <div><Tool store={state_store}/></div>;
