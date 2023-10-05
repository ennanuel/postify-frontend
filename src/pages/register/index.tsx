import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { APIURL } from '../../assets/data';

const Register = () => {
  const navigate = useNavigate()
  const [{username, email, name, password, confirm}, setCredentials] = useState({ username: '', email: '', name: '', password: '', confirm: '' })

  const handleSubmit : React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

  }

  const register = async () => {
    const requestBody = { username, email, name, password };

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    const response = await fetch(`${APIURL}/auth/register`, fetchOptions);
    const res = await response.json();

    alert(res.message);
  }

  const handleClick = () => {
    if( username && email && name && password && confirm && ( password === confirm )) {
      register();
    } else {
      alert('not complete');
    }
  }

  const handleChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setCredentials(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  return (
    <div className="register bg-[rgb(193,190,255)] flex items-center justify-center min-h-[100vh]">
      <div className="card w-[60%] flex flex-row-reverse rounded-[10px] bg-white overflow-hidden">
        <div className="left flex-1 p-[30px] gap-[30px] flex flex-col text-white">
          <h1 className="text-[100px]">Register Social.</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo mollitia esse commodi nisi libero exercitationem nostrum enim? Eveniet error, in, eum cupiditate quisquam aliquam praesentium non id corrupti, eaque doloribus!</p>
        <span className="text-[14px]">Already have an account?</span>
        <Link className="btn w-[50%] p-[10px] border-none bg-white text-[rebeccapurple] font-bold flex items-center justify-center" to="/login">Login</Link>
        </div>
        <div className="right flex-1 p-[30px] flex flex-col justify-center gap-[50px]">
          <h1 className="text-[#555] font-bold text-3xl">Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-[30px]">
            <input name="name" value={name} onChange={handleChange} type="name" placeholder="name" />
            <input name="username" value={username} onChange={handleChange} type="text" placeholder="username" />
            <input name="email" value={email} onChange={handleChange} type="email" placeholder="email" />
            <input name="password" value={password} onChange={handleChange} type="password" placeholder="password" />
            <input name="confirm" value={confirm} onChange={handleChange} type="password" placeholder="confirm password" />

            <button onClick={handleClick} className="w-[50%] p-[10px] border-none bg-[#938eef] text-white font-bold flex items-center justify-center">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
