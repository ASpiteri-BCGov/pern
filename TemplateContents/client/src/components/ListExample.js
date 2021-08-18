import React, { Fragment, useEffect, useState } from "react";

import EditExample from "./EditExample";

const ListExample = () => {
  const [items, setItems] = useState([]);

  //delete example function

  const deleteitem = async (id) => {
    try {
      const deleteExample = await fetch(`http://localhost:5000/items/${id}`, {
        method: "DELETE",
      });

      setItems(items.filter((item) => item.dbtitemid !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getExamples = async () => {
    try {
      const response = await fetch("http://localhost:5000/items");
      const jsonData = await response.json();

      setItems(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getExamples();
  }, []);

  console.log(items);

  return (
    <Fragment>
      {" "}
      <table class="table mt-5 text-center">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {/*<tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr> */}
          {items.map((item) => (
            <tr key={item.dbtitemid}>
              <td>{item.description}</td>
              <td>
                <EditExample item={item} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteitem(item.dbtitemid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListExample;
