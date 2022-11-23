import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../Storage/appContext";

export default function LoginPage () {
    const [inputs, setInputs] = useState({});
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.login(inputs).then(() => {
            navigate('/profile'); 
            console.log(sessionStorage);
            console.log('handleSubmit triggered'); 
        })
        actions.login(inputs);
    }

    return ( 
        <div className='LoginPage'>
            <h2>Login</h2>
            {(store.token && store.token !=="" && store.token !==undefined) ? ("You are logged in with this token" + store.token):
            (<form className='LoginForm'>
                <label>Email:</label>
                <input 
                    type='text' 
                    required 
                    name='email' 
                    value={inputs.email || ''}
                    onChange={handleChange}
                />
                <label>Password:</label>
                <input 
                    type='text' 
                    required 
                    name='password' 
                    value={inputs.password || ''}
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}>Sign In</button>
                <br></br>
                <small>Don't have an account? <Link to='/create-account'>Create an Account</Link></small>
            </form>
            )}
        </div>
     );
}
 



// original before involving storage:
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage () {
//     const [inputs, setInputs] = useState({});
//     const token = sessionStorage.getItem("token");
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const name = e.target.name;
//         const value = e.target.value;
//         setInputs(values => ({...values, [name]: value}))
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const body = {
//             email: inputs.email,
//             password: inputs.password,
//         }    

//         const requestOptions = {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json'
//             },
//             body: JSON.stringify(body)
//         } 

//         fetch('/login', requestOptions)
//             .then(response => {
//                 if (response.status === 200) return response.json();
//                 else alert("There has been an error");
//             })
//             .then(data =>{
//                 console.log("this came from the backend", data);
//                 sessionStorage.setItem("token", data.access_token);
//                 console.log(sessionStorage);
//                 console.log('handleSubmit triggered');
//                 navigate('/profile');
//             })
//             .catch(error => {
//                 console.error("There was an error!!!", error);
//             });
//     }

// alt fetch:
// fetch('/login', requestOptions)
//     .then(response => response.json())
//     .then(data =>{console.log(data)})
//     .catch(error => console.log(error))




