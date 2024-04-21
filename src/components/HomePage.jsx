import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const HomePage = (props) => {
    const navigate = useNavigate();
    const [foundUser, setFoundUser] = useState(null);

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('/login');
        }
    }, [navigate]);

    // Fonction pour récupérer les données de l'utilisateur par username
    const handleUserInApiByUsername = (username) => {
        const jwtToken = localStorage.getItem('jwtToken');

        fetch('http://assosportapi.localhost:8000/api/users', {
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

    // Appel des fonctions au chargement du composant
    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        const username = jwtDecode(jwtToken).username;
        handleUserInApiByUsername(username);
    }, []);
    

  // Fonction pour déclencher la navigation vers une autre URL
  const handleClickGroupes = () => {
    navigate('/groupes'); // Navigue vers l'URL '/autre-page'
  };

    return (
        <div className='flex flex-col mx-[5vh] font-nunito'>
            <div className='bg-orange-600 h-[15vh] flex flex-col justify-center items-center rounded-lg my-[5vh]'>
                {foundUser && <h1 className='font-sansation uppercase text-white '>Bienvenue {foundUser.nom}</h1>}
            </div>
            <div className='flex flex-col justify-evenly h-[70vh]'>
                <div onClick={()=> handleClickGroupes()} className='flex items-center justify-between rounded py-[4vh] px-[3vw] shadow-xl'>
                    <h2>Vous avez 1 nouveau message</h2><svg width="32" height="33" viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.76531 8.82049C8.46321 8.82222 8.16493 8.88812 7.89021 9.01379C7.61549 9.13947 7.3706 9.32207 7.17175 9.54951C6.9729 9.77694 6.82464 10.044 6.73676 10.3331C6.64889 10.6221 6.62341 10.9265 6.66203 11.2261C7.97453 21.398 7.97453 20.852 6.66203 31.0239C6.61421 31.395 6.66486 31.7722 6.8089 32.1175C6.95294 32.4629 7.1853 32.7643 7.48265 32.9915C7.78 33.2186 8.13188 33.3636 8.50296 33.4118C8.87405 33.4599 9.25127 33.4097 9.59678 33.266L34.0421 23.0941C34.4309 22.9321 34.763 22.6587 34.9967 22.3083C35.2303 21.9579 35.355 21.5462 35.355 21.125C35.355 20.7038 35.2303 20.2921 34.9967 19.9417C34.763 19.5913 34.4309 19.3179 34.0421 19.1559L9.59678 8.98406C9.33335 8.87447 9.05061 8.81885 8.76531 8.82049Z" fill="black" />
                    </svg>
                </div>
                <div className='flex items-center justify-between rounded py-[4vh] px-[3vw] shadow-xl'>
                    <h2>Reunions à venir</h2><svg width="32" height="33" viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.76531 8.82049C8.46321 8.82222 8.16493 8.88812 7.89021 9.01379C7.61549 9.13947 7.3706 9.32207 7.17175 9.54951C6.9729 9.77694 6.82464 10.044 6.73676 10.3331C6.64889 10.6221 6.62341 10.9265 6.66203 11.2261C7.97453 21.398 7.97453 20.852 6.66203 31.0239C6.61421 31.395 6.66486 31.7722 6.8089 32.1175C6.95294 32.4629 7.1853 32.7643 7.48265 32.9915C7.78 33.2186 8.13188 33.3636 8.50296 33.4118C8.87405 33.4599 9.25127 33.4097 9.59678 33.266L34.0421 23.0941C34.4309 22.9321 34.763 22.6587 34.9967 22.3083C35.2303 21.9579 35.355 21.5462 35.355 21.125C35.355 20.7038 35.2303 20.2921 34.9967 19.9417C34.763 19.5913 34.4309 19.3179 34.0421 19.1559L9.59678 8.98406C9.33335 8.87447 9.05061 8.81885 8.76531 8.82049Z" fill="black" />
                    </svg>
                </div>
                <div className='flex items-center justify-between rounded py-[4vh] px-[3vw] shadow-xl'>
                    <h2>Document partagés</h2><svg width="32" height="33" viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.76531 8.82049C8.46321 8.82222 8.16493 8.88812 7.89021 9.01379C7.61549 9.13947 7.3706 9.32207 7.17175 9.54951C6.9729 9.77694 6.82464 10.044 6.73676 10.3331C6.64889 10.6221 6.62341 10.9265 6.66203 11.2261C7.97453 21.398 7.97453 20.852 6.66203 31.0239C6.61421 31.395 6.66486 31.7722 6.8089 32.1175C6.95294 32.4629 7.1853 32.7643 7.48265 32.9915C7.78 33.2186 8.13188 33.3636 8.50296 33.4118C8.87405 33.4599 9.25127 33.4097 9.59678 33.266L34.0421 23.0941C34.4309 22.9321 34.763 22.6587 34.9967 22.3083C35.2303 21.9579 35.355 21.5462 35.355 21.125C35.355 20.7038 35.2303 20.2921 34.9967 19.9417C34.763 19.5913 34.4309 19.3179 34.0421 19.1559L9.59678 8.98406C9.33335 8.87447 9.05061 8.81885 8.76531 8.82049Z" fill="black" />
                    </svg>
                </div>
                <div className='flex items-center justify-between rounded py-[4vh] px-[3vw] shadow-xl'>
                    <h2>Membres</h2><svg width="32" height="33" viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.76531 8.82049C8.46321 8.82222 8.16493 8.88812 7.89021 9.01379C7.61549 9.13947 7.3706 9.32207 7.17175 9.54951C6.9729 9.77694 6.82464 10.044 6.73676 10.3331C6.64889 10.6221 6.62341 10.9265 6.66203 11.2261C7.97453 21.398 7.97453 20.852 6.66203 31.0239C6.61421 31.395 6.66486 31.7722 6.8089 32.1175C6.95294 32.4629 7.1853 32.7643 7.48265 32.9915C7.78 33.2186 8.13188 33.3636 8.50296 33.4118C8.87405 33.4599 9.25127 33.4097 9.59678 33.266L34.0421 23.0941C34.4309 22.9321 34.763 22.6587 34.9967 22.3083C35.2303 21.9579 35.355 21.5462 35.355 21.125C35.355 20.7038 35.2303 20.2921 34.9967 19.9417C34.763 19.5913 34.4309 19.3179 34.0421 19.1559L9.59678 8.98406C9.33335 8.87447 9.05061 8.81885 8.76531 8.82049Z" fill="black" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
