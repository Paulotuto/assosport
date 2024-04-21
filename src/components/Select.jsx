import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';


const Select = (props) => {
    const [assos, setAssos] = useState([]);
    const [itemList, setItemList] = useState(null);
    const [val, setVal] = useState('');
    const [codeVal, setCodeVal] = useState('');
    const [popUp, setPopUp] = useState(false);
    const [assoChoisie, setAssoChoisie] = useState(null)
    const [foundUser, setFoundUser] = useState(null);
    const navigate = useNavigate()

    const handleUserInApiByUsername = (username) => {
        const jwtToken = localStorage.getItem('jwtToken');

        fetch('https://assosportapi.situto.net/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                data['hydra:member'].forEach(element => {
                    if (element.numero_licence === username) {
                        setFoundUser(element);
                    }
                });
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    };



    useEffect(() => {
        handleUserInApiByUsername(jwtDecode(localStorage.getItem('jwtToken')).username)
        const delaySearch = setTimeout(() => {
            searchAssos();
        }, 500); // 500 ms de délai

        return () => clearTimeout(delaySearch); // Effacer le délai précédent à chaque changement de val
    }, [val]);

    const searchAssos = () => {
        const jwtToken = localStorage.getItem('jwtToken');

        fetch('https://assosportapi.situto.net/api/associations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                const filteredAssos = data['hydra:member'].filter(item =>
                    item.nom.toLowerCase().includes(val.toLowerCase())
                );
                // Mettre à jour itemList avec les résultats de la recherche filtrés
                setItemList(filteredAssos.slice(0, 4).map((item, index) => (
                    <p
                        className='py-[1vh] border-b w-[100%]'
                        onClick={() => {
                            setPopUp(true);
                            setAssoChoisie(item);
                        }}
                        key={index}
                    >
                        {item.nom}
                    </p>
                )));

            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    };

    const fetchAssos = () => {
        const jwtToken = localStorage.getItem('jwtToken');

        fetch('https://assosportapi.situto.net/api/associations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                setAssos(data);
                setItemList(data['hydra:member'].map((item, index) => (
                    <p className='border-b-3' onClick={() => { setPopUp(true); setAssoChoisie(item) }} key={index}>{item.nom}</p>
                )));
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    };

    const joinAsso = () => {
        setPopUp(!popUp)
        setCodeVal('')
        console.log('association rejointe : ' + assoChoisie.nom)
        const jwtToken = localStorage.getItem('jwtToken');

        const updatedUserData = {
            association: 
              [...foundUser.association,`https://assosportapi.situto.net/api/associations/${assoChoisie.id}`]
            
          };

        fetch(`https://assosportapi.situto.net/api/users/${foundUser.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/merge-patch+json'
            },
            body: JSON.stringify((updatedUserData))
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                console.log('User resource updated:', data);
                // Faire quelque chose avec la réponse mise à jour
                navigate('/')
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    }

    useEffect(() => {

    }, []);

    return (
        <div className='flex flex-col mx-[5vh] font-nunito h-[100vh]'>
            <div className='bg-orange-600 h-[15vh] flex flex-col justify-center items-center rounded-lg my-[5vh]'>
                <h1 className='font-sansation uppercase text-white '>Selection</h1>
            </div>
            <div className='relative mb-[5vh]'>
                <label htmlFor="asso">Choisir une association</label>
                <input
                    onChange={(e) => setVal(e.target.value)}
                    className='py-1 pl-2 border-solid border rounded border-gray-300'
                    value={val}
                    type="text"
                    id="asso"
                    name="asso"
                    required
                />
                <div className='relative z-10 min-h-[3vh] border-t mt-[1vh]'>
                    {itemList}
                    <p
                        className='py-[1vh] border-b w-[100%]'
                        key='autre'
                    >
                        ...
                    </p>
                </div>
            </div>
            <button className='rounded bg-orange-600 text-white py-[1vh] px-[3vw]'>Continuer</button>


            {popUp && <div className='absolute z-20 mx-[-5vh] w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-gray-600/75 '>
                <div className='bg-orange-600 py-[2vh] px-[2vh] flex flex-col rounded'>
                    <h2 className='mb-2 text-white'>Code de l'association</h2>
                    <input className='py-1 pl-2 border-solid border rounded border-gray-300' type="text" onChange={(e) => setCodeVal(e.target.value)} value={codeVal} />
                    <button onClick={() => joinAsso()} className='rounded bg-white w-[fit-content] text-orange-600 py-[1vh] px-[3vw] mt-[2vh]'>Envoyer</button>
                </div>
            </div>}
        </div>
    );
};

export default Select;
