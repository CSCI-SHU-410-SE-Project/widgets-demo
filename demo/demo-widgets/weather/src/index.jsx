import React from "@deskulpt-test/react";

const weatherAPIKey = 'e30fb117e9fc4a9b88b135353242204';
const weatherAPIURL = `https://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=`;
const location = 'Shanghai';

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function TodoList() {
    const [weather, setWeather] = React.useState(null);

    React.useEffect(() => {
        // Initial fetch
        fetchWeatherInfo();
        // Fetch every 0.5 hour
        const interval = setInterval(() => {
            fetchWeatherInfo();
        }, 1000 * 60 * 30);

        return () => clearInterval(interval);
    }, []);

    // Fetch weather information for default city when component mounts
    const fetchWeatherInfo = async () => {
        try {
            const response = await fetch(`${weatherAPIURL}${location}`); // Default city is New York
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0',
            textAlign: 'left',
            fontSize: '0.8rem'
        }}>
            {weather && (
                <div style={{ margin: '15px 0 5px 0' }}>
                    <div style={{ marginBottom: '10px', fontSize: '1rem' }}>
                        Weather in {weather.location.name}:
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <img src={weather.current.condition.icon} alt="Weather Icon" style={{ width: '50px', marginRight: '10px' }} />
                        <div>
                            <div style={{ fontSize: '1.2rem' }}>{weather.current.temp_c}°C</div>
                            <div>{weather.current.condition.text}</div>
                        </div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        Feels like: {weather.current.feelslike_c}°C
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        Humidity: {weather.current.humidity}%
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        Wind: {weather.current.wind_kph} km/h
                    </div>
                    <div style={{ fontSize: '0.8rem', textAlign: 'left' }}>
                        Last updated: {formatDateTime(weather.current.last_updated)}
                    </div>
                    <hr style={{ border: "none" }} />
                    <div style={{ fontSize: '0.6rem', textAlign: 'right' }}>
                        Powered by WeatherAPI.com
                    </div>
                </div>
            )}

        </div>
    );
}

export default {
    render: () => <TodoList/>,
	width: "200px",
	height: "auto"
};
