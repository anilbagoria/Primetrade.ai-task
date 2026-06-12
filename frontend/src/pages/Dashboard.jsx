import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create task form state
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "pending" });
  const [creating, setCreating] = useState(false);

  // Edit modal state
  const [editTask, setEditTask] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data.data);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await createTask(newTask);
      setNewTask({ title: "", description: "", status: "pending" });
      showSuccess("Task created successfully!");
      loadTasks();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "Failed to create task.";
      setError(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setUpdating(true);
    try {
      await updateTask(editTask._id, {
        title: editTask.title,
        description: editTask.description,
        status: editTask.status,
      });
      setEditTask(null);
      showSuccess("Task updated successfully!");
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      showSuccess("Task deleted.");
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Task Manager</h1>
          <div className="user-info">
            Logged in as <span>{user.name}</span>{" "}
            <span className="badge badge-pending">{user.role}</span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Create Task Form */}
      <div className="task-form-box">
        <h3>Create New Task</h3>
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Optional description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="tasks-section">
        <h3>
          {user.role === "admin" ? "All Tasks" : "My Tasks"} ({tasks.length})
        </h3>

        {loading ? (
          <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks found. Create your first task above.</div>
        ) : (
          tasks.map((task) => (
            <div className="task-card" key={task._id}>
              <div className="task-card-left">
                <h4>{task.title}</h4>
                {task.description && <p>{task.description}</p>}
                <div>
                  <span
                    className={`badge ${
                      task.status === "completed" ? "badge-completed" : "badge-pending"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span className="task-meta">
                    {user.role === "admin" && task.createdBy
                      ? `by ${task.createdBy.name} · `
                      : ""}
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="task-card-actions">
                <button
                  className="btn btn-success"
                  onClick={() => setEditTask({ ...task })}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editTask && (
        <div className="modal-overlay" onClick={() => setEditTask(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Task</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="task-form-row">
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditTask(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
