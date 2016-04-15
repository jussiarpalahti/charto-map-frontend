import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';

const API_BASE = "http://localhost:8000";
const API_LIST_URL = API_BASE + "/apis";


class ApiView {

    api = null;
    @observable items = [];

    constructor(api) {
        this.api = api;
        this.items = ["hih", "hoh"]
    }

}


class Gatherings {

    @observable choices = "";
    @observable apis = [];
    @observable chosen = [];

    makeChange(val) {
        this.choices = val;
    }

    choose(choice) {
        console.log("choicing", choice);
        this.chosen.push(new ApiView(choice));
    }

    constructor(init) {
        if (init) {

            // Initializing gatherings according to init object

            this.apis = init.apis;
            this.choices = init.choices;
            this.chosen = init.choices.map((choice) => new ApiView(choice));

        } else {
            this.apis = [
                {id: 1, type: "type1", title: "hih"},
                {id: 2, type: "type2", title: "hoh"}];
        }
    }
}


const Type1 = ({api}) => <div>Type1: {api.id}</div>;


const Type2 = ({api}) => <div>Type2: {api.id}</div>;


function get_api_view(api_type) {
    switch (api_type) {
        case "type1":
            return Type1;
        case "type2":
            return Type2;
        default:
            return null;
    }
}


const YourData = ({choices}) => <div>Embarrassingly precious data, such wonder: {choices}</div>;


const Apis = ({apis, choose}) => <div>
    <ul>
        {apis.map(item => <li key={item.id} onClick={() => choose(item)}>{item.title}</li>)}
    </ul>
</div>;


const Items = ({choice}) => <div>{get_api_view(choice.api.type)(choice)}</div>;


@observer
class Gather extends React.Component<{gatherings: Gatherings}, {}> {

    change(e) {
        gatherings.makeChange(e.target.value);
    }

    makeChoice(choice) {
        gatherings.choose(choice);
    }

    render() {
        var {choices, apis, chosen} = gatherings;
        return (
            <div>
                <h1>API Data Gathering App</h1>
                <h2>Waiting for APIs</h2>
                <input value={choices} placeholder="choice is yours, make it count" onChange={this.change} size="100" />
                <YourData choices={choices} />
                {apis? <Apis apis={apis} choose={this.makeChoice} /> : null}
                {chosen.map((choice, i) => <div key={"items_" + i}><Items choice={choice} /></div>)}
                <DevTools />
            </div>
        );
     }
}


export const gatherings =  new Gatherings(null);

export const Gatherer = <div><Gather gatherings={gatherings} /></div>;
