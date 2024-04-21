import { jwtDecode } from 'jwt-decode';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Groupe = (props) => {
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const [msg, setMsg] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [groupe, setGroupe] = useState(null);
    const [messages, setMessages] = useState(null);
    const [usernames, setUsernames] = useState({});

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

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
                const user = data['hydra:member'].find(element => element.numero_licence === username);
                setFoundUser(user);
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    };

    const getUsername = (url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                setUsernames(prevState => ({
                    ...prevState,
                    [url]: data.nom
                }));
            })
            .catch(error => {}/*console.error('Erreur lors du fetch des groupes:', error)*/);
    };

    const fetchGroupAndMessages = () => {
        fetch(`https://assosportapi.situto.net/api/groupes/${location.state.idGroupe}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                setGroupe(data);
                setMessages(data.message);
            })
            .catch(error => console.error('Erreur lors du fetch des groupes:', error));
    };

    const sendMessage = () => {
        fetch(`https://assosportapi.situto.net/api/groupes/${location.state.idGroupe}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/merge-patch+json'
            },
            body: JSON.stringify({
                message: [...groupe.message, {
                    "user": `https://assosportapi.situto.net/api/users/${foundUser.id}`,
                    'texte': msg
                }]
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                //console.log('User resource updated:', data);
                fetchGroupAndMessages();
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    };

    useEffect(() => {
        scrollToBottom();
        handleUserInApiByUsername(jwtDecode(localStorage.getItem('jwtToken')).username);
        fetchGroupAndMessages();
    }, []);

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        if (messages) {
            messages.forEach(message => {
                if (!usernames[message.user]) {
                    getUsername(message.user);
                }
            });
        }
    }, [messages, usernames]);

    return (
        <div className='flex relative flex-col mx-[5vh] font-nunito min-h-[100vh]'>
            <div className=' relative bg-orange-600 h-[15vh] flex flex-col justify-center items-center rounded-lg my-[5vh]'>
                <h1 className='font-sansation uppercase text-white '>Messagerie</h1>
                <Link to={{
                    pathname: "/",
                }}>
                    <svg className='absolute z-100 top-[-10px] left-[-10px]' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                        <path d="M39.5,43h-9c-1.381,0-2.5-1.119-2.5-2.5v-9c0-1.105-0.895-2-2-2h-4c-1.105,0-2,0.895-2,2v9c0,1.381-1.119,2.5-2.5,2.5h-9	C7.119,43,6,41.881,6,40.5V21.413c0-2.299,1.054-4.471,2.859-5.893L23.071,4.321c0.545-0.428,1.313-0.428,1.857,0L39.142,15.52	C40.947,16.942,42,19.113,42,21.411V40.5C42,41.881,40.881,43,39.5,43z"></path>
                    </svg>
                </Link>
            </div>
            <div ref={messagesEndRef} className="conversation h-[65vh] gap-[4vh] flex flex-col overflow-y-scroll">
                {messages && messages.map((message, index) => (
                    <div key={index} className="message flex gap-[4vw]">
                        <h2>{usernames[message.user]}</h2>
                        <p className='mw-[100%]'>{message.texte}</p>
                    </div>
                ))}
            </div>
            <div className='z-10 flex fixed w-[80vw] justify-between bottom-[20px]'>
                <input className='w-[80%] py-1 pl-2 border-solid border rounded border-gray-300' onChange={(e) => { setMsg(e.target.value) }} value={msg} type="text" />
                <svg onClick={sendMessage} width="32" height="33" viewBox="0 0 42 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.76531 8.82049C8.46321 8.82222 8.16493 8.88812 7.89021 9.01379C7.61549 9.13947 7.3706 9.32207 7.17175 9.54951C6.9729 9.77694 6.82464 10.044 6.73676 10.3331C6.64889 10.6221 6.62341 10.9265 6.66203 11.2261C7.97453 21.398 7.97453 20.852 6.66203 31.0239C6.61421 31.395 6.66486 31.7722 6.8089 32.1175C6.95294 32.4629 7.1853 32.7643 7.48265 32.9915C7.78 33.2186 8.13188 33.3636 8.50296 33.4118C8.87405 33.4599 9.25127 33.4097 9.59678 33.266L34.0421 23.0941C34.4309 22.9321 34.763 22.6587 34.9967 22.3083C35.2303 21.9579 35.355 21.5462 35.355 21.125C35.355 20.7038 35.2303 20.2921 34.9967 19.9417C34.763 19.5913 34.4309 19.3179 34.0421 19.1559L9.59678 8.98406C9.33335 8.87447 9.05061 8.81885 8.76531 8.82049Z" fill="black" />
                </svg>
            </div>
        </div>
    );
};

export default Groupe;
