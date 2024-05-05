import React from "@deskulpt-test/react";
import apis from "@deskulpt-test/apis";

const jsonFile = 'output.json';
const weatherAPIKey = 'e30fb117e9fc4a9b88b135353242204';
const weatherAPIURL = `https://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=`;

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const TrashIcon = () => {
    return (
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1.3rem" height="1.3rem" color="white" fill="white">
    <path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z"></path>
    </svg>
    
        </div>
    )
}

function TodoList() {
    const [tasks, setTasks] = React.useState([]);
    const [taskValue, setTaskValue] = React.useState('');
    const [taskStartDate, setTaskStartDate] = React.useState('2024-01-01T00:00');
    const [taskEndDate, setTaskEndDate] = React.useState('2024-12-31T23:59');
    const [selectAll, setSelectAll] = React.useState(false);
    const [weather, setWeather] = React.useState(null);
    const [msg, setMsg] = React.useState('');
    const [city, setCity] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apis.fs.readFile(jsonFile, 'utf8');
                if (data) {
                    setTasks(JSON.parse(data));
                }
            } catch (error) {
                console.error('Error reading file:', error);
            }
        };
        fetchData();

    }, []);

    const saveTasksToFile = async (data) => {
        try {
            await apis.fs.writeFile(jsonFile, JSON.stringify(data));
            console.log('Tasks saved successfully');
        } catch (error) {
            console.error('Error writing file:', error);
        }
    };

    const addTask = () => {
        if (taskValue.trim() === '') {
            // ignore empty task
            return;
        } else if (taskStartDate >= taskEndDate) {
            console.error('Invalid task: Start time must be before end time');
            setMsg('Start time must be before end time');
            let time = setTimeout(function () {
                setMsg('')
                clearTimeout(time)
            }, 1000);
        } else {
            const newTask = {
                text: taskValue.trim(),
                completed: false,
                startDate: taskStartDate,
                endDate: taskEndDate
            };
            setTasks([...tasks, newTask]);
            saveTasksToFile([...tasks, newTask]);
            setTaskValue('');
            setTaskStartDate('2024-01-01T00:00');
            setTaskEndDate('2024-12-31T23:59');
        }
    };

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        saveTasksToFile(updatedTasks);
    };

    const toggleComplete = (index) => {
        const updatedTasks = tasks.map((task, i) => {
            if (i === index) {
                return {...task, completed: !task.completed};
            }
            return task;
        });
        setTasks(updatedTasks);
        saveTasksToFile(updatedTasks);
    };

    const toggleSelectAll = () => {
        const updatedTasks = tasks.map(task => ({...task, completed: !selectAll}));
        setTasks(updatedTasks);
        setSelectAll(!selectAll);
        saveTasksToFile(updatedTasks);
    };

    const markAllComplete = () => {
        const updatedTasks = tasks.map(task => ({...task, completed: true}));
        setTasks(updatedTasks);
        saveTasksToFile(updatedTasks);
    };

    const widgetStyle = {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '10px 0 0 0',
        color: 'white',
    };
        

    return (
        <div style={widgetStyle}>

            <div style={{marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
                <input
                    style={{
                        flex: '1',
                        padding: '10px',
                        fontSize: '0.8rem',
                        marginRight: '10px',
                        width: '300px',
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        border: 'none',
                    }}
                    placeholder="Enter Task..."
                    value={taskValue}
                    onChange={(e) => setTaskValue(e.target.value)}
                    maxLength={20}
                />
                <button
                    style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        fontSize: '1.1rem',
                    }}
                    onClick={addTask}
                >
                    <div style={{
                        backgroundColor: '#ffffff',
                        color: 'black',
                        fontSize: '1.7rem',
                        border: '1px solid white',
                        borderRadius: '50%',
                        width: '1.5rem',
                        height: '1.5rem',
                        lineHeight: '1.5rem',
                    }}>
                        +
                    </div>
                </button>

            </div>

            <ul style={{
                listStyleType: 'none', 
                padding: 0,
                margin: "20px 0 0 0",
            }}>
                {tasks.map((task, index) => (
                    <li key={index} style={{
                        marginBottom: '10px',
                        color: "white",
                        // padding: '10px',
                        borderRadius: '5px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                    }}>
                        <input
                            type="checkbox"
                            style={{
                                width: "1.2rem",
                                height: "1.2rem",
                                margin: "0 10px 0 0",
                                background: "transparent",
                                border: "0.1rem solid white",
                                borderRadius: "0.1rem"
                            }}
                            checked={task.completed}
                            onChange={() => toggleComplete(index)}
                        />
                        <span style={{
                            flex: '1',
                            textDecoration: task.completed ? 'line-through' : 'none',
                        }}>
                            {task.text}</span>
                        <button
                            style={{
                                // backgroundColor: '#f44336',
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: 'none',
                                // padding: '5px 10px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                fontSize: "0.9rem",
                            }}
                            onClick={() => deleteTask(index)}
                        >
                            <TrashIcon/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default {
    render: () => <TodoList/>,
    width: "auto",
    height: "auto",
};
