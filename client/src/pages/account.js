import '../resources/css/account.css'
import Header from '../Components/header'
import Photo from '../resources/img/photo_user.svg'
import { useUsers } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Vehicle from '../Components/vehicle'


export default function AccountPage() {

  const { currentUser, isLogged, setCurrentUser, updateUser, getCredentials } = useUsers()
  const [userCredentials, setUserCredentials] = useState('')

  const [kind, setKind] = useState(0)
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [seats, setSeats] = useState(0)
  const [vehicleUser, setVehicleUser] = useState([])
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const delay = 25000;

  let navigate = useNavigate()

  useEffect(() => {

    if (!isLogged()) {
      navigate('/')
    } else {
      setUserCredentials(getCredentials())
    }

    setVehicleUser(currentUser?.vehicle)

  }, [currentUser?.vehicle, getCredentials, isLogged, navigate])

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === vehicleUser.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  const updateData = async (id, filter) => {
    try {
      const res = await updateUser(id, filter)
      return res
    } catch (error) {
      console.error({ message: error });
    }
  }

  const linkVehicle = async (e) => {
    e.preventDefault();

    let vehicle = {
      kind,
      plate,
      model,
      color,
      seats
    }

    vehicleUser.push(vehicle)
    setCurrentUser({ ...currentUser, vehicle: vehicleUser })
    await updateData(userCredentials.UID, { vehicle: vehicleUser })
    e.target.reset()
  }
  console.log(vehicleUser);


  return (
    <div className='accountPage'>
      <Header />

      <div className='bodyAccount'>
        <div className='dataUser'>
          <div id='photoUser'>
            <img src={currentUser ? currentUser?.photoUser?.url : Photo} alt="Foto Usuario" id='photoUser' />
          </div>
          <div className='infoUser'>
            <p className='titleInfoUser'>{currentUser ? currentUser?.userName : 'Cargando'}</p>
            <p className='titleInfoUser'>{currentUser ? currentUser?.email : 'Cargando'}</p>
            <p className='titleInfoUser'>{currentUser ? currentUser?.celPhone : 'Cargando'}</p>
          </div>
        </div>

        <div className='linkToUser'>
          <div className="slideshow">
            <div className="slideshowSlider" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
              {
                vehicleUser.map((v, i) => (
                  <div className="slide">
                    <Vehicle
                      key={i}
                      plate={v.plate}
                      color={v.color}
                      model={v.model}
                      seats={v.seats}
                      kind={v.kind}
                    />
                  </div>
                ))
              }
            </div>

            <div className="slideshowDots">
              {vehicleUser.map((_, idx) => (
                <div
                  key={idx}
                  className={`slideshowDot${index === idx ? " active" : ""}`}
                  onClick={() => {
                    setIndex(idx);
                  }}
                ></div>
              ))}
            </div>

          </div>

          <div className='newLink'>
            <form onSubmit={linkVehicle}>
              <p className='titleLinkUser'>Vincular Vehiculo a la cuenta</p>
              <div id='kind'>
                <label htmlFor="kindCar" className='lblLinkUser'>
                  <p className='titleFormLink'>Carro</p>
                  <input type='radio' id='kindCar' name='kind' value={'Carro'} onChange={(e) => setKind(e.target.value)} />
                  {/* <p className='titleFormLink'>Moto</p>
                <input type='radio' id='kind' name='kind' value={'Moto'} onChange={(e) => setKind(e.target.value)} /> */}
                </label>
                <label htmlFor="kindBike" className='lblLinkUser'>
                  <p className='titleFormLink'>Moto</p>
                  <input type='radio' id='kindBike' name='kind' value={'Moto'} onChange={(e) => setKind(e.target.value)} />
                </label>
              </div>
              <label htmlFor="plate" className='lblLinkUser'>
                <p className='titleFormLink'>Placa</p>
                <input type="text" id='plate' onChange={(e) => setPlate(e.target.value)} />
              </label>
              <label htmlFor="model" className='lblLinkUser'>
                <p className='titleFormLink'>Modelo</p>
                <input type="text" id='model' onChange={(e) => setModel(e.target.value)} />
              </label>
              <label htmlFor="color" className='lblLinkUser'>
                <p className='titleFormLink'>Color</p>
                <input type="text" id='color' onChange={(e) => setColor(e.target.value)} />
              </label>
              <label htmlFor="seats" className='lblLinkUser'>
                <p className='titleFormLink'>Puestos</p>
                <input type="number" id='seats' min={1} max={5} onChange={(e) => setSeats(e.target.value)} />
              </label>
              <div id='btnFormLink'>
                <button type="submit" id='btnAdd'>Agregar</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div >
  )
}
