
import { useEffect, useState } from 'react'
import './App.css'
import DayWiseWheather from './Components/DayWiseWheather'
import DisplayWeather from './Components/DisplayWeather'
import Loading from './Components/Loading'
import { fetchData } from './http.js';

function App() {
  const [responsedata, setResponsedata] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [inputData, setInputData] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [changeIntoFr , setChangeIntoFr] = useState(false);
  const changeToFr = (data) => {
    return data*(9/5) + 32;
  }

  useEffect(() => {
    if(changeIntoFr){
      const changedForeCastData = forecastData?.list?.map((currentdaydata , i) => ({
        ...currentdaydata , 
        main :  {
          temp : changeToFr(currentdaydata?.main?.temp),
          feels_like: changeToFr(currentdaydata.main.feels_like),
          temp_min: changeToFr(currentdaydata.main.temp_min),
          temp_max: changeToFr(currentdaydata.main.temp_max),
        }}))
      const changedResponseData = responsedata?.list?.map((currentdata , i) => {
        return{
        ...currentdata , 
        main :  {
          temp : changeToFr(currentdata?.main?.temp),
          feels_like: changeToFr(currentdata.main.feels_like),
          temp_min: changeToFr(currentdata.main.temp_min),
          temp_max: changeToFr(currentdata.main.temp_max),
        }}})
        const updatedChangedResponseData = {...responsedata , list : changedResponseData}
        console.log("forecast data" , changedForeCastData);
        console.log("responsed data" , updatedChangedResponseData)
        setForecastData(changedForeCastData);
        setResponsedata(updatedChangedResponseData);
    }
  },[changeIntoFr])

  useEffect(() => {
    async function fetchWeatherData() {
      const resData = await fetchData();
      setResponsedata(resData);
      const dailyForecast = resData?.list?.filter((reading) =>
        reading.dt_txt?.includes('12:00:00')
      );
      setForecastData(dailyForecast || []);
      setIsFetching(false);
    }
    fetchWeatherData();
  }, []);


  function handleKeyPress(event) {
    if (event.key === 'Enter') {

      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${inputData || 'Delhi'}&APPID=407141f6d99e830681e770ad7e16c024&units=metric`)
        .then(res => res.json())
        .then((res) => {
          if (res?.cod != "200") {
            alert('Please Enter Valid city')
            setInputData('')
            return {}
          }
          return setResponsedata(res)
        })
        .catch(e => {
          console.log("errrrrr", e)
        })
      const dailyForecast = responsedata?.list?.filter((reading) =>
        reading?.dt_txt?.includes('12:00:00')
      );
      setIsFetching(false);
      console.log("day wise data" , dailyForecast);
      setForecastData(dailyForecast || []);
    }
  }
  if (isFetching) {
    return (
      <Loading LoadingText='Loading...' />
    );
  }
  return (
    <div className='body'>
      <input type='text' placeholder='Enter the city' value={inputData} onChange={(event) => { setInputData(event.target.value) }} onKeyUp={handleKeyPress} />
      {isFetching && <Loading LoadingText='Fetching the Weather Status' />}
      {!isFetching && <DisplayWeather data={responsedata} changeParameter = {setChangeIntoFr}  isFr={changeIntoFr} />}
      <DayWiseWheather DayList={forecastData} />
    </div>
  )
}

export default App
