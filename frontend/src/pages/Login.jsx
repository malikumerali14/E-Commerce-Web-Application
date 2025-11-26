import React, { useEffect, useState } from 'react'
import login from '../assets/login.webp'
import { toast } from 'sonner'
import { Link, useLocation, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/slices/authSlice'


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { user, guestId, loading, error } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart)

    // Get redirect parameters and check if its checkout or something
    const redirect = new URLSearchParams(location.search).get('redirect') || '/';
    const isCheckoutRedirect = redirect.includes('checkout');

    useEffect(() => {
        if (user) {
            // if (cart?.products.length > 0) {
            //     toast("Login Successful")
            //     navigate('/checkout')
            // } else {
            //     navigate('/profile')
            // }
            navigate('/profile')
        }

    }, [user])



    const handleTransition = (e) => {
        e.preventDefault()
        const body = document.querySelector('body')
        body?.classList.add("page-transition")


        setTimeout(() => {
            navigate('/register')
            body?.classList.remove("page-transition")

        }, 250);


    }

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'email') {
            setEmail(value)
        }
        else if (name === 'password') {
            setPassword(value)
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(loginUser({
            email, password

        }))
    }





    return (
        <>
            <section className='font-sans flex md:h-[80vh] w-full'>
                <div className='w-full md:w-1/2 border flex items-center justify-center min-h-[70vh] leading-10'>
                    <form
                        onSubmit={handleSubmit}
                        className='border w-full lg:w-2/3 border-gray-300 flex flex-col justify-center items-center'>
                        <div className='text-center'>
                            <h2 className='font-bold mt-3'>Urban Attire</h2>
                            <div>
                                <h2 className='font-extrabold text-2xl'>Hey there! 👋🏻</h2>
                                {/* Display Error Message */}
                                {error && (
                                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-1 my-2 rounded mb-4 w-full text-sm'>
                                        {error}
                                    </div>
                                )}

                            </div>
                            <p className='font-semibold tracking-tight'>Enter username and password to login</p>
                        </div>

                        <div className='w-[75%] md:w-2/3'>
                            <div className='flex flex-col'>
                                <label className='font-bold text-sm'>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    value={email}
                                    placeholder='Enter your email'
                                    onChange={handleChange}
                                    className='border px-4 text-sm py-2 mb-6'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold text-sm'>Password</label>
                                <input
                                    type='password'
                                    name='password'
                                    value={password}
                                    placeholder='Enter your password'
                                    onChange={handleChange}
                                    className='border px-4 text-sm py-2 mb-6'
                                />
                            </div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='bg-black w-full text-white rounded-md text-sm py-2 mb-6 hover:-translate-y-2 transition-all duration-300'>
                                {loading ? "Signing In..." : "Sign In"}
                            </button>

                            <div className='flex gap-1'>
                                <p className='text-sm font-semibold'>Don't have an account? </p>
                                <Link
                                    onClick={handleTransition}
                                    className='text-sm text-blue-600 font-semibold mb-8 hover:text-black hover:-translate-y-1 transtion-all duration-300'>
                                    Register
                                </Link>
                            </div>

                        </div>


                    </form>
                </div>

                <div className='hidden md:block w-1/2'>
                    <div className='h-full flex justify-center items-center'>
                        <img src={login} className='h-[80vh] w-full object-cover' />
                    </div>
                </div>

            </section>
        </>
    )
}

export default Login