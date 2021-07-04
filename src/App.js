import './App.css';
import { useEffect, useState } from 'react';
const fetch = require('node-fetch');

function App() {

  // STATES

  const [city, setCity] = useState("")
  const [dataWathercity, setDataWathercity] = useState({})
  const [temp, setTepm] = useState({
    temp: "",
    status: false
  })


  //FUNTIONS ONCLICK

  const onChangeToFarenheit = () => {

    temp.status === false ?
      setTepm({ temp: `${dataWathercity.temp}°C`, status: true })
      : setTepm({ temp: `${((dataWathercity.temp * 9 / 5) + 32).toFixed(2)} °F`, status: false })

  }


  //useEffect

  useEffect(() => {

    const appcities = async () => {


      try { // cubrimos las llamas de api con un Try/ catch para dar un error si hay algun problema

        // Llamada de api ipgeolocation que me da la ubicación segun la ip del usuario (ciudad / pais)
        const urlA = `https://ipgeolocation.abstractapi.com/v1/?api_key=cd2508d863b34e61967d9ef17e3dd1c9`;
        const responseURlA = await fetch(urlA);
        const jsonA = await responseURlA.json();
        let ciudad = jsonA["city"]
        const country = jsonA["country"]
        setCity({ ciudad, country }) // coloca la ciudad y el pais en un stado disponible


        // creamos una condicional que me de un error en caso de que no se genera un llamada exitosa a la API geolocalizacion que es capturada por el catch
        if (responseURlA.status !== 200) {
          throw Error("UPS ubicación no encontrada")
        }






        // Llamada de api wather que me da los datos del clima segun la geolocalización de la llamada anterior
        let apiKey = '1ee34e413a434ee5448b1366b0a3d1f7';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`; // usamos un variable ciudad creada dentro del mismo usseEffet, no se usa estado global
        const responseURl = await fetch(url);


        // creamos una condicional que me de un error en caso de que no se genera un llamada exitosa a la API geolocalizacion que es capturada por el cath
        if (responseURl.status !== 200) {
          throw Error("UPS ciudad no encontrada")
        }



        const json = await responseURl.json();
        if (json.main !== undefined) {
          const objCity = {    //Obtenemos los datos que queremos en una variable

            img: json.weather[0].icon,
            wind: json.wind.speed,
            temp: json.main.temp,
            name: json.name,
            weather: json.weather[0].main,
            clouds: json.clouds.all,

          };

          setDataWathercity(objCity) //agregamos los datos a un estado
          setTepm({ temp: `${objCity.temp}°C`, status: true }) //agregamos los datos iniciales para despues ser modificados con la cción del botton de cambio de grados a fareheigth



        }


      } catch (error) {
        alert(error)  // si algo falla, nos arroja un error, pero continua con la ejecución de la web
      }


    }


    appcities()




  }, []) // No usamos dependencias porque solo queremos que se ejecute una sola vez puesto que el usuario solo puede estar en un solo lugar y solo necesitamos determinar su posición una sola ves porque no esta en movimiento al ser una pag web



  return (
    <div className="card btn-grad" style={{ backgroundColor: "writhe" }}>


      <h1>Weather App <img src="https://static.abstractapi.com/country-flags/CO_flag.png" alt="" width="50vh" height="50vh" style={{ borderRadius: "50px" }}></img></h1>
      <h2>{`${city.country}/${city.ciudad}`}</h2>

      <div className="">

        <h3>{` "${dataWathercity.weather}"`}</h3>
        <img src={"http://openweathermap.org/img/wn/" + dataWathercity.img + "@2x.png"} alt="" />
        <h3>{temp.temp}</h3>
        <h5>{`Wind Speed:${dataWathercity.wind}m/s`}</h5>
        <button className="btn-grad" onClick={onChangeToFarenheit} >DEGREES °F/°C</button>

      </div>



    </div>
  );
}

export default App;
