// import React from "@deskulpt-test/react";
// import apis from "@deskulpt-test/apis";

// const SysInfo = () => {
// 	const [cpuUsage, setCpuUsage] = React.useState(0);
// 	const [memUsage, setMemUsage] = React.useState(0);

// 	React.useEffect(() => {
// 		const interval = setInterval(async () => {
// 			const result = await apis.sys.getSystemInfo();
// 			// take average of all cpu usage
// 			const cpuUsage = result.cpuInfo.reduce((acc, cpu) => acc + cpu.totalCpuUsage, 0) / result.cpuInfo.length;
// 			const memUsage = result.usedMemory / result.totalMemory * 100;
// 			setCpuUsage(cpuUsage);
// 			setMemUsage(memUsage);
// 		}, 1000);

// 		return () => clearInterval(interval);
// 	}, []);

// 	return (
// 		<div>
// 			<p>CPU Usage: {cpuUsage}</p>
// 			<p>Memory Usage: {memUsage}</p>
// 		</div>
// 	);
// };

// export default {
// 	render: () => <SysInfo />,
// 	width: "300px",
// 	height: "100px",
// }

import React from "@deskulpt-test/react";
import apis from "@deskulpt-test/apis";

const SysInfo = () => {
  const [cpuUsage, setCpuUsage] = React.useState(0);
  const [ramUsage, setRamUsage] = React.useState(0);
  const [swapUsage, setSwapUsage] = React.useState(0);

  const setUsage = async () => {
	const result = await apis.sys.getSystemInfo();
	// Take average of all CPU usage
	const totalCpuUsage = result.cpuInfo.reduce((acc, cpu) => acc + cpu.totalCpuUsage, 0);
	const cpuUsage = totalCpuUsage / result.cpuInfo.length;
	const ramUsage = (result.usedMemory / result.totalMemory) * 100;
	const swapUsage = (result.usedSwap / result.totalSwap) * 100;
	setCpuUsage(cpuUsage);
	setRamUsage(ramUsage);
	setSwapUsage(swapUsage);
  };

  React.useEffect(() => {
	setUsage();
    const interval = setInterval(async () => {
		await setUsage();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progressStyle = {
		width: "100%",
		height: "0.3rem",
  };
  
  const progressContainerStyle = {
		lineHeight: "0.5rem",
		paddingTop: "0.5rem",
	};

	const widgetStyle = {
		fontSize: "0.65rem",
		padding: 0,
	};

	const cpuProgress = <progress 
		value={Math.floor(cpuUsage)}
		max={100} 
    style={progressStyle}
	/>;

  const ramProgress = <progress 
  	value={Math.floor(ramUsage)}
		max={100}
		style={progressStyle}
	/>;

  const swapProgress = <progress
		value={Math.floor(swapUsage)}
		max={100}
		style={progressStyle}
	/>;

	return (
	<div style={widgetStyle}>
		<div style={progressContainerStyle}>
			CPU Usage: {cpuUsage.toFixed(0)}%
			{cpuProgress}
		</div>
		<div style={progressContainerStyle}>
			Ram Usage: {ramUsage.toFixed(0)}%
			{ramProgress}
		</div>
		<div style={progressContainerStyle}>
			Swap Usage: {swapUsage.toFixed(0)}%
			{swapProgress}
		</div>
	</div>
	);
};

export default {
  render: () => <SysInfo />,
  width: "200px",
  height: "auto", // Increased height for progress bars
};
