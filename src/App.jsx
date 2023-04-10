import { useState } from 'react'
import { Routes, Route, Link,useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import './App.css'
import * as yup from 'yup';

function App() {


  return (
    <div className="App">
     
      <Routes>
        <Route path="/" element={<Loginpage/>} />
        <Route path="/signup" element={<Signpage/>} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </div>
  )
}
function Home() {
  const navigate = useNavigate()
  return <div>
     <nav>
        <h4>homifiy</h4>
        <div>
        <input></input>
        <button>Search</button>
          </div>
          <h4 onClick={()=>{
            navigate("/")
            localStorage.clear()
            }}>Logout</h4>
      </nav>
      <div className='home-container'>
      <h2>Welcome to Home </h2>
      </div>
   
  </div>
}
function Loginpage() {  
  const navigate = useNavigate()
  const[invalid,setinvaild] = useState("")
  const formValidationSchema = yup.object({
    username : yup.string().required(),
    password : yup.string().required()

  })
  const {handleSubmit,handleChange ,values ,errors,handleBlur} = useFormik({
    initialValues : { username : '', password : ''},
    validationSchema : formValidationSchema,
    onSubmit : async (values)=>{
      // console.log(values)
    const login =  await fetch("https://forgetpassword.onrender.com/Login",{
        method : "POST",
        body : JSON.stringify(values),
        headers : {"content-type": "application/json"}
      })
      if(login.status === 400){
        setinvaild("invalid credentials")
      }else{
         const check = login.json()
         localStorage.setItem("usertoken",check. user_id)
         navigate('/Home')
      }
    }
  })
  return <div className='loginpage-container'>
      <form action=""  onSubmit={handleSubmit}>
        <h3>Login</h3>
        <span className='error' >{invalid === "invalid credentials" ? "invalid credentials" : null}</span>
        <input type="text" placeholder='Username' onBlur={handleBlur} onChange={handleChange} defaultValue={values.username} name='username'/>
        <span >{handleBlur.username &&  errors.username ? errors.username :null}</span>
        <input type="text" placeholder='Password' onChange={handleChange} defaultValue={values.password} name='password'/>
        <span >{handleBlur.password &&  errors.password ? errors.password :null}</span>
        <button type='submit'>Login</button>
        <div className='bottom-text'>
        <h4 onClick={()=> navigate("/signup")}>Signup</h4>
        <h4 onClick={()=> navigate("/forgetpassword")}>forget password</h4>
        </div>
      </form>
  </div>
}
function Signpage() { 
  const navigate = useNavigate();
  const[invalid,setinvaild] = useState("")
  const formValidationSchema = yup.object({
    username : yup.string().max(25).min(5).required(),
    password : yup.string().min(6).max(15).required(),
    email : yup.string().email().required(),
     
  })
  const {handleSubmit,handleChange ,values ,errors,handleBlur} = useFormik({
    initialValues : { username : '', password : '', email : ""},
    validationSchema : formValidationSchema,
    onSubmit : async (values)=>{
      // console.log(values)
    const data =   await fetch("https://forgetpassword.onrender.com/Signup",{
        method : "POST",
        body : JSON.stringify(values),
        headers : {"content-type": "application/json"}
      })
      if(data.status === 400){
        setinvaild("username already exists")
      }else{
        const response = await data.json()
        localStorage.setItem("usertoken", response.user_id)
        navigate("/Home")
      }
    }
  })
  return <div className='Signuppage-container' >
      <form action="" onSubmit={handleSubmit}>
        <h3>Singup</h3>
        <span className='error'>{invalid === "username already exists" ? "username already exists" : null}</span>
        <input type="text" placeholder='Username' onChange={handleChange} name='username' defaultValue={values.username}/>
       <span>{errors.username}</span>
        <input type="text" placeholder='Password' onChange={handleChange} name='password' defaultValue={values.password}/>
        <input type="text" placeholder='Email'    onChange={handleChange}  name='email'   defaultValue={values.email}/>
        <button type='submit' >Signup</button>
        <div className='bottom-text'>
        <h4 onClick={()=> navigate("/")}>Login</h4>
        </div>
      </form>
  </div>
}
function Forgetpassword(){
  const navigate = useNavigate()
  const [otp,setotp] = useState(false)
  const[forgetpassword,setforgetpassword] = useState([])
  const formValidationSchema = yup.object({
    username : yup.string().min(5).required(),
    Newpassword : yup.string().min(6).max(15).required(),
    email : yup.string().email().required(),
     
  })
  const {handleSubmit,handleChange ,values ,errors,handleBlur} = useFormik({
    initialValues : { username : '', email : "",Newpassword : ''},
    validationSchema : formValidationSchema,
    onSubmit :async (values)=>{
      // console.log(values)
     
      const login =  await fetch("http://localhost:4777/Forgetpassword",{
        method : "PUT",
        body : JSON.stringify(values),
        headers : {"content-type": "application/json"}
      })
      if(login.status === 400){
        alert("Username and valid")
      }else{

        const data = await login.json()
        // console.log(data) 
        localStorage.setItem("usertoken", data.user_id)
        alert("Check your email")
        setforgetpassword(values)
        setotp(true)
      }
      
    }
   
  })

  return <div className='forgetpassword-container'>
     
      {otp? <OTPverification /> : <form action="" onSubmit={handleSubmit} >
        <h3>Forget password</h3>
        <input type="text" placeholder='username'  onChange={handleChange} name='username'/>
        <input type="text" placeholder='email'   onChange={handleChange} name='email'/>
        <input type="text" placeholder='New password'   onChange={handleChange} name='Newpassword'/>
        <button type='submit' >Submit</button>
        <div className='bottom-text'>
        <h4 onClick={()=> navigate("/")}>Login</h4>
        </div>
        </form>} 
       
      
  </div>
}
function OTPverification(){
  const [otpcheck ,setotpcheck] = useState([])
  console.log("otp",otpcheck)
  const navigate = useNavigate()
  const formValidationSchema2 = yup.object({
    OTP : yup.string().required(),
  })
  const Formik = useFormik({
    initialValues : { OTP : ''},
    validationSchema : formValidationSchema2,
    onSubmit : async (values)=>{
      console.log('OTP',values)
      navigate("/Home")
     
       await fetch(`https://forgetpassword.onrender.com/Profile/${localStorage.getItem("usertoken")}`)
       .then(response => response.json())
       .then(data => setotpcheck(data.OTP))
         
       if(values.OTP === data.OTP){
        navigate("/Home")
       }

    }
  })
  return <form action="" onSubmit={Formik.handleSubmit}>
  <h3>Forget password</h3>
  <input type="text" placeholder='OTP' onChange={Formik.handleChange}  name='OTP'/>
  <button type='submit' >Submit</button>
  <div className='bottom-text'>
  <h4 onClick={()=> navigate("/")}>Login</h4>
  </div>
  </form>
}
export default App
