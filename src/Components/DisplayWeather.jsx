import DisplayingCity from "./DisplayingCity";

export default function DisplayWeather({ data  , changeParameter , isFr}) {
  console.log("current data" , data);
  return (
    <div className='container'>
     {data && <img src={`https://openweathermap.org/img/wn/${data?.list[0]?.weather[0]?.icon || ''}@2x.png`} />}
      <div className='temp-desplay'>
        {data && <DisplayingCity data={data} />}
        <button onClick={() => changeParameter(!isFr)}>FR</button>
      </div>
    </div>
  );
}