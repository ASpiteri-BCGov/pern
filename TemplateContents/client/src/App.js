import React, { Fragment } from "react";
import "./App.css";

//components

import InputExample from "./components/InputExample";
import ListExample from "./components/ListExample";

function App() {
  return (
    <Fragment>
      <div className="container">
        <InputExample />
        <ListExample />
      </div>
    </Fragment>
  );
}

export default App;
