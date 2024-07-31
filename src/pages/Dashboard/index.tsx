import { Container } from "../../components/container";
import { DashboardHeader } from '../../components/PanelHeader';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from 'react-hot-toast';

import {
    collection,
    getDocs,
    where,
    query,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db, storage } from '../../services/firebaseConnection';
import { ref, deleteObject } from 'firebase/storage';

import { FiTrash2 } from 'react-icons/fi';

interface CarProps{
    id: string;
    uid: string;
    name: string;
    year: string;
    price: string | number;
    city: string;
    km: string;
    images: ImageCarProps[]
}

interface ImageCarProps {
    name: string;
    uid: string;
    url: string;
}

export function Dashboard() {
    const [cars, setCars] = useState<CarProps[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCars() {
            if(!user?.uid) {
                return;
            }

            const carsRef = collection(db, 'cars')
            const queyrRef = query( carsRef, where('uid', '==', user.uid) );

            getDocs(queyrRef)
            .then((snapshot) => {
                const listCars = [] as CarProps[];

                snapshot.forEach( doc => {
                    listCars.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        city: doc.data().city,
                        price: doc.data().price,
                        images: doc.data().images,
                        uid: doc.data().uid
                    })
                })

                setCars(listCars);
            })

        }
        loadCars();

    }, [user])

    async function handleDeleteCar(item: CarProps) {
        const docRef = doc(db, 'cars', item.id);

        await deleteDoc(docRef)
        .then(() => {
            toast.success('Deletado com sucesso');
        })
        .catch((err) => {
            toast.error(`Ops algo deu errado`);
            toast.error(`${err}`);
        })


        item.images.map( async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`;
            const imageRef = ref(storage, imagePath);

            try {
                await deleteObject(imageRef);
                setCars(cars.filter( car => car.id !== item.id));
            } catch (error) {
                toast.error('Algo deu errado');
            }
        })


        
    }


    return(
        <Container>
            <DashboardHeader />

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cars.map( item => (
                    <section className="w-full bg-white rounded-lg relative" key={item.id}>
                        <button>
                            <FiTrash2 size={20} color="#000" 
                                className="absolute bg-white w-14 h-14 rounded-full p-2 flex items-center justify-center right-2 top-8 drop-shadow"
                                onClick={ () => handleDeleteCar(item)}
                            />
                        </button>
                        <img 
                            src={item.images[0].url}
                            alt={item.name}
                            className="w-full rounded-lg mb-2 max-h-70"
                            />
                            <p className="font-bold mt-1 px-2 mb-2">{item.name}</p>

                            <div className="flex flex-col px-2">
                                <span className="text-zinc-700">
                                    {item.year} | {item.km} km
                                </span>

                                <strong className="text-black font-bold mt-4">R$ {item.price}</strong>
                            </div>

                            <div className="w-full h-px bg-slate-200 my-2"></div>

                            <div className="px-2 pb-2">
                                <span className="text-black">{item.city}</span>
                            </div>
                    </section>
                ))}

            </main>
        </Container>
    );
}