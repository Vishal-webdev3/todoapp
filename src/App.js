import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isInitialized, setIsInitialized] = useState(false); // 🌟 Prevents overwrite

  // Load from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setIsInitialized(true); // ✅ Safe to start saving after this
  }, []);

  // Save to localStorage only after initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);

  const handleAdd = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const handleDelete = (indexToDelete) => {
    const newTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(newTasks);
  };

  const handleToggleComplete = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div style={styles.container}>
      <h1>📝 My To-Do List</h1>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAdd} style={styles.button}>Add</button>
      </div>

      <div style={styles.filterContainer}>
        <button onClick={() => setFilter('all')} style={filter === 'all' ? styles.activeFilter : styles.filter}>All</button>
        <button onClick={() => setFilter('active')} style={filter === 'active' ? styles.activeFilter : styles.filter}>Active</button>
        <button onClick={() => setFilter('completed')} style={filter === 'completed' ? styles.activeFilter : styles.filter}>Completed</button>
      </div>

      <ul style={styles.list}>
        {filteredTasks.map((item, index) => (
          <li key={index} style={styles.item}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggleComplete(index)}
              style={styles.checkbox}
            />
            <span style={{ ...styles.taskText, textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'gray' : 'black' }}>
              {item.text}
            </span>
            <button
              onClick={() => handleDelete(index)}
              style={styles.deleteButton}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', padding: 30 },
  inputContainer: { marginBottom: 20 },
  input: { padding: 8, width: '60%', marginRight: 10 },
  button: { padding: 8, backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 4 },
  list: { listStyle: 'none', paddingLeft: 0 },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    margin: '5px auto',
    padding: 10,
    width: '60%',
    borderRadius: 6
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'red',
    fontSize: 16,
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: 10
  },
  taskText: {
    flexGrow: 1,
    textAlign: 'left'
  },
  filterContainer: {
    marginBottom: 20
  },
  filter: {
    margin: '0 5px',
    padding: '6px 12px',
    backgroundColor: '#eee',
    border: '1px solid #ccc',
    cursor: 'pointer',
    borderRadius: 4
  },
  activeFilter: {
    margin: '0 5px',
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: '1px solid #007bff',
    cursor: 'pointer',
    borderRadius: 4
  }
};

export default App;
