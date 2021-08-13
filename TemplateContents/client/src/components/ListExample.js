import React, { Fragment, useEffect, useState } from "react";

import EditExample from "./EditExample";

const ListExample = () => {
  const [items, setExamples] = useState([]);

  //delete example function

  const deleteitem = async (id) => {
    try {
      const deleteExample = await fetch(`http://localhost:5000/items/${id}`, {
        method: "DELETE",
      });

      setExamples(items.filter((example) => example.example_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getExamples = async () => {
    try {
      const response = await fetch("http://localhost:5000/items");
      const jsonData = await response.json();

      setExamples(jsonData);
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
            <tr key={item["${dbtname}"]}>
              <td>{item.description}</td>
              <td>
                <Edititem item={item} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteitem(item["${dbtname}"])}
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
