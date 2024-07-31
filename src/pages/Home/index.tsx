import { Container } from "../../components/container";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import {
    collection,
    query,
    getDocs,
    orderBy,
    where
} from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';

interface CarsProps {
    id: string;
    name: string;
    year: string;
    uid: string;
    price: string | number;
    city: string;
    km: string;
    image: CarImageProps[];
}

interface CarImageProps {
    name: string;
    uid: string;
    url: string
}


export function Home() {
    const [cars, setCars] = useState<CarsProps[]>([]);
    const [loadImages, setLoadImages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        loadCars();
    }, [])

    async function loadCars() {
        const carsRef = collection(db, 'cars')
        const queyrRef = query(carsRef, orderBy('created', 'desc') )

        getDocs(queyrRef)
        .then((snapshot) => {
            const listCars = [] as CarsProps[];

            snapshot.forEach( doc => {
                listCars.push({
                    id: doc.id,
                    name: doc.data().name,
                    year: doc.data().year,
                    km: doc.data().km,
                    city: doc.data().city,
                    price: doc.data().price,
                    image: doc.data().images,
                    uid: doc.data().uid
                })
            })

            setCars(listCars);
        })

    }

    function handleImageLoad(id: string) {
        setLoadImages( (prevImageLoaded) => [...prevImageLoaded, id])
    }

    async function handleSearchCar() {
        if(input === '') {
            loadCars();
            return;
        }

        setCars([]);
        setLoadImages([]);

        const q = query(collection(db, 'cars'), 
        where('name', '>=', input.toUpperCase()),
        where('name', '<=', input.toUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)

    const listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
        listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            image: doc.data().images,
            uid: doc.data().uid
        })
    })

    setCars(listCars);


    }


    return(
        <Container>
            <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
                <input 
                    type="text"
                    placeholder="Digite o nome do carro..."
                    className="w-full border-2 rounded-lg h-9 px-3 outline-none"
                    value={input}
                    onChange={ (e) => setInput(e.target.value)}
                />
                <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                    onClick={handleSearchCar}
                >
                    Buscar
                </button>
            </section>

            <h1 className="font-bold text-center mt-6 text-2xl mb-4">
                Carros novos e usados em todo o Brasil
            </h1>

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                
                    {cars.map( item => (
                        <Link key={item.id} to={`/car/${item.id}`}>

                            <section className="w-full bg-white rounded-lg">
                                 <div className="w-full h-72 rounded-lg bg-slate-200"
                                    style={ { display: loadImages.includes(item.id) ? 'none' : 'block' }}
                                 >
                                 </div>

                                <img
                                    src={item.image[0].url}
                                    alt={item.name}
                                    className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                                    onLoad={ () => handleImageLoad(item.id)}
                                    style={ { display: loadImages.includes(item.id) ? 'block' : 'none' }}
                                />
                                <p className="font-bold mt-1 mb-2 px-2">{item.name}</p>

                                <div className="flex flex-col px-2">
                                    <span className="text-zinc-700 mb-6">{item.year} | {item.km} km</span>
                                    <strong className="text-black font-medium text-xl">R$ { item.price.toLocaleString('pt-BR,', {style: 'currency', currency: 'BRL'}) }</strong>
                                </div>

                                <div className="w-full h-px bg-slate-200 my-2"></div>

                                <div className="px-2 pb-2">
                                    <span className="text-zinc-700">
                                        {item.city}
                                    </span>
                                </div>
                            </section>
                        </Link>
                    ))}
                

            </main>
            
        </Container>
    );
}