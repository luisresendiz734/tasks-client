import { SyntheticEvent, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

interface ITask {
  id: string;
  text: string;
  userId: string;
  completed: boolean;
}

interface IResponse {
  status: boolean;
  result: Array<ITask>;
}

const TasksScreen = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Array<ITask>>([]);
  const [edit, setEdit] = useState<{ id: string; text: string } | null>(null);
  const [task, setTask] = useState("");
  const [addTask, setAddTask] = useState(false);
  useEffect(() => {
    if (!user) return;

    const getTasks = async () => {
      const res = await fetch("http://localhost:4001/tasks/" + user.id);
      const data: IResponse = await res.json();
      if (data.status) {
        setTasks(data.result);
      }
    };
    getTasks();
  }, [user, edit, task]);
  const handleCheck = async (id: string, completed: boolean) => {
    const res = await fetch("http://localhost:4001/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        completed: !completed,
      }),
    });
    const data = await res.json();
    if (data.status) {
      const res = await fetch("http://localhost:4001/tasks/" + user?.id);
      const data: IResponse = await res.json();
      if (data.status) {
        setTasks(data.result);
      }
    }
  };
  const handleEdit = async (id: string, text: string) => {
    setEdit({
      id,
      text,
    });
  };
  const handleUpdateTask = async () => {
    if (edit && edit.text.length) {
      const res = await fetch("http://localhost:4001/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: edit.id,
          text: edit.text,
        }),
      });
      await res.json();
      setEdit(null);
    }
  };
  const handleCreateTask = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!task.length) return;
    const res = await fetch("http://localhost:4001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
        text: task,
      }),
    });
    await res.json();
    setTask("");
    setAddTask(false);
  };
  return (
    <div>
      {addTask ? (
        <>
          <h3>Add Task</h3>
          <form onSubmit={handleCreateTask}>
            <div>
              <label htmlFor="text">Task</label>
              <input
                type="text"
                name="text"
                id="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>
            <button onClick={() => setAddTask(false)}>cancel</button>
            <button>add</button>
          </form>
        </>
      ) : (
        <button onClick={() => setAddTask(true)}>add new task</button>
      )}
      <h2>My tasks</h2>
      <ul>
        {tasks.map(({ id, text, completed }) => (
          <li key={id}>
            <input
              type="checkbox"
              checked={completed}
              onClick={() => handleCheck(id, completed)}
            />
            <span
              style={{ textDecoration: completed ? "line-through" : "none" }}
            >
              {text}
            </span>
            <button onClick={() => handleEdit(id, text)}>edit</button>
          </li>
        ))}
      </ul>
      {edit && (
        <div>
          <h4>Edit task</h4>
          <input
            type="text"
            name="text"
            value={edit ? edit.text : ""}
            onChange={(e) =>
              setEdit({ ...edit, [e.target.name]: e.target.value })
            }
          />
          <button onClick={() => setEdit(null)}>cancel</button>
          <button onClick={handleUpdateTask}>update</button>
        </div>
      )}
    </div>
  );
};

export default TasksScreen;
