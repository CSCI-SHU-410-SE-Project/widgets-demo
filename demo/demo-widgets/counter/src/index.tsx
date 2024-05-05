import React from "@deskulpt-test/react"

function getCurrentDate(): string {
	return new Date().toLocaleTimeString()
}

function Counter() {
	const [count, setCount] = React.useState(0)
	const [curTime, setCurTime] = React.useState(new Date().toLocaleTimeString())

	React.useEffect(() => {
		const interval = setInterval(() => {
			setCurTime(getCurrentDate())
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	return (
		<div>
			<h2>Counter</h2>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>
			<p>Current Time: {curTime}</p>
		</div>
	)
}

export default {
	render: () => <Counter />,
	width: "300px",
	height: "200px",
}