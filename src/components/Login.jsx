import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'



const Login = (props) => {
    const navigate = useNavigate();
    const [buttonConnexion,setButtonConnexion] = useState(true)
    const [numero,setNumero] = useState('')
    const [password,setPassword] = useState('')

    const handleLogin = (e, numero_licence, password) => {
      e.preventDefault(); // Empêcher le comportement par défaut de soumission du formulaire
      
      // Votre logique de connexion ici
      fetch('https://assosportapi.situto.net/api/login_check', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: numero_licence,
              password: password
          })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Erreur réseau');
          }
          return response.json();
      })
      .then(data => {
          // Faire quelque chose avec les données de réponse
          //console.log(data.token);
          localStorage.setItem('jwtToken', data.token);
          props.isConnected(true);
          props.setToken(data.token)
          navigate('/');
      })
      .catch(error => {
          // Gérer les erreurs
          console.error('Erreur lors de la requête:', error);
      });
  }
  

  useEffect(()=>{
   
  });
  return (<div className='flex flex-col mx-[5vh] font-nunito'>
    <div className='bg-orange-600 h-[15vh] flex flex-col justify-center items-center rounded-lg my-[5vh]'>
      <h1 className='font-sansation uppercase text-white '>Sportasso</h1>
    </div>
    <div className='h-[6vh] flex w-[100%] justify-between'>
      <p className='w-[100%] flex justify-center items-center' onClick={()=> setButtonConnexion(true)}>Connexion</p>
      <p className='w-[100%] flex justify-center items-center' onClick={()=> setButtonConnexion(false)}>S'inscrire</p>
    </div>
    {buttonConnexion ? 
    <form id="loginForm" className='h-[60vh] flex flex-col justify-evenly'>
        <div className="form-group flex flex-col gap-[3vh]">
            <label for="numero_licence">Numéro de Licence :</label>
            <input className='py-1 pl-2 border-solid border rounded border-gray-300' onChange={(e)=>{setNumero(e.target.value)}} value={numero} type="text" id="numero_licence" name="numero_licence" required/>
        </div>
        <div className="form-group flex flex-col gap-[3vh]">
            <label for="password">Mot de Passe :</label>
            <input className='py-1 pl-2 border-solid border rounded border-gray-300' onChange={(e)=>{setPassword(e.target.value)}} value={password} type="password" id="password" name="password" required/>
        </div>
        <div className="form-group">
            <button className='rounded bg-orange-600 text-white py-[1vh] px-[3vw]' onClick={(e)=>{handleLogin(e,numero,password)}} type="submit">Se Connecter</button>
        </div>
    </form>
:
    <form id="loginForm" className='h-[70vh] flex flex-col justify-evenly'>
        <div className="form-group flex flex-col gap-[3vh]">
            <label for="numero_licence">Numéro de Licence :</label>
            <input className='border-solid border rounded border-gray-300' type="text" id="numero_licence" name="numero_licence" required/>
        </div>
        <div className="form-group flex flex-col gap-[3vh]">
            <label for="password">Mot de Passe :</label>
            <input className='border-solid border rounded border-gray-300' type="password" id="password" name="password" required/>
        </div>
        <div className="form-group flex flex-col gap-[3vh]">
            <label for="confirmpassword">Confirmer Mot de Passe :</label>
            <input className='border-solid border rounded border-gray-300' type="password" id="confirmpassword" name="confirmpassword" required/>
        </div>
        <div className="form-group">
            <button className='rounded bg-orange-600 text-white py-[1vh] px-[3vw]' onClick={handleLogin(numero,password)} type="submit">Se Connecter</button>
        </div>
    </form>}
  </div>
  );
}

export default Login;