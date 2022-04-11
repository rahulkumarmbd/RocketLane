import { useState, useEffect } from "react";
import "./Activity.component.css";
import axios from "axios";
import { v4 as uuid } from "uuid";
// const Pusher = require("pusher");
import Pusher from "pusher-js";

const initState = {
  taskName: "",
  projectName: "",
  isBillable: false,
  userId: 1001,
};

export const ActivityComponent = () => {
  const [activity, setActivity] = useState([]);
  const [newItem, setNewItem] = useState(initState);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === "isBillable" ? checked : value;
    setNewItem((prev) => {
      return { ...prev, [name]: newValue };
    });
  };

  const handleSubmit = () => {
    // axios
    //   .post(
    //     "https://my-json-server.typicode.com/karthick03/json-db-data/tasks",
    //     newItem
    //   )
    //   .then(({ data }) => {
    //     console.log(data);
    //     setNewItem(initState);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    setActivity((prev) => {
      return [...prev, newItem];
    });
  };

  useEffect(() => {
    axios
      .get("https://my-json-server.typicode.com/karthick03/json-db-data/tasks")
      .then(({ data }) => {
        setActivity(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    Pusher.logToConsole = true;

    var pusher = new Pusher("7f23f5e83ed98dd456fe", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function (data) {
      setActivity((prev) => {
        return [...prev, data];
      });
    });
  }, []);

  return (
    <div>
      <div className="Box">
        <h3>Activities</h3>
        <div className="input-field">
          <label>
            <span>*</span>Project Name
          </label>
          <input
            type="text"
            placeholder="Eg. Nike Implementation"
            name="projectName"
            onChange={handleChange}
            value={newItem.projectName}
          />
        </div>
        <div className="_2nd-input-box">
          <div className="input-field">
            <label>
              <span>*</span>Task Name
            </label>
            <input
              type="text"
              placeholder="Eg. Kick-off call"
              id="taskName"
              name="taskName"
              onChange={handleChange}
              value={newItem.taskName}
            />
          </div>
          <div className="input-field">
            <label>Billable</label>
            <div className="checkbox">
              <input
                type="checkbox"
                name="isBillable"
                onChange={handleChange}
                checked={newItem.isBillable}
              />
            </div>
          </div>
        </div>
        <h5 className="teamTask">Team Tasks</h5>
        <ActivityList activity={activity} />
        <div className="task-btns">
          <button>Cancel</button>
          <button
            disabled={newItem.projectName === "" || newItem.taskName === ""}
            onClick={handleSubmit}
          >
            Add activity
          </button>
        </div>
      </div>
    </div>
  );
};

const handleDelete = (e) => {
  // console.log(e.target.id);
  if (e.target.id === "") {
    return;
  }
  axios
    .delete(
      `https://my-json-server.typicode.com/karthick03/json-db-data/tasks/${e.target.id}`
    )
    .then(({ data }) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

function ActivityList({ activity }) {
  return (
    <div onClick={handleDelete}>
      {activity.map((item) => {
        return (
          <div className="task" key={uuid()}>
            <div>
              <h5>{item.taskName}</h5>
              <p>
                {item.isBillable ? <span>$</span> : ""}
                {item.projectName}
              </p>
            </div>
            <div>
              <img src="trash.icon.svg" id={item.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
