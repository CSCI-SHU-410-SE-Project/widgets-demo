import React from "@deskulpt-test/react";
import apis from "@deskulpt-test/apis";

const SysInfo = () => {
    const [systemInfo, setSystemInfo] = React.useState(null);
    const [brand, setBrand] = React.useState(null);
    const [opacity, setOpacity] = React.useState(0.7);

    const increaseOpacity = () => {
        if (opacity < 1) {
            setOpacity(opacity + 0.1);
        }
    };

    const decreaseOpacity = () => {
        if (opacity > 0) {
            setOpacity(opacity - 0.1);
        }
    };

    React.useEffect(() => {
        const intervalId = setInterval(fetchSystemInfo, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchSystemInfo = async () => {
        try {
            let data = await apis.sys.getSystemInfo();
            setBrand(data.cpu_info[0].brand);
            let tempUseAverage = 0;
            data.cpu_info.forEach((cpu) => {
                tempUseAverage += cpu.total_cpu_usage;
            });

            let obj = {
                cpu_info: [{
                    total_cpu_usage: tempUseAverage / data.cpu_info.length
                }]
            };

            setSystemInfo(obj);
        } catch (error) {
            console.error('Error fetching system info:', error);
        }
    };

    if (!systemInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="task-manager" style={{
            background: `rgba(128, 128, 128, ${opacity})`,
            fontFamily: 'Segoe UI',
            fontSize: '16px',
            padding: '20px',
            color: 'white',
            borderRadius: '10px'
        }}>
            {/*<div style={{marginBottom: '10px'}}>*/}
            {/*    <button onClick={increaseOpacity}>Increase Opacity</button>*/}
            {/*    <button onClick={decreaseOpacity}>Decrease Opacity</button>*/}
            {/*</div>*/}
            {systemInfo && (
                <div>
                    <ul>
                        {systemInfo.cpu_info.map((cpu, index) => (
                            <li key={index} style={{marginBottom: '5px'}}>
                                <strong style={{color: 'white'}}>CPU:</strong>
                                <progress
                                    style={{background: `linear-gradient(to right, 
                                        green ${cpu.total_cpu_usage - 20}%, 
                                        red ${cpu.total_cpu_usage}%)`}}
                                    value={cpu.total_cpu_usage} max="100"></progress>
                                {cpu.total_cpu_usage.toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default {
    render: () => <SysInfo/>,
};
