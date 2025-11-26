import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { addUser, deleteUser, fetchUsers, updateUser } from '../../redux/slices/adminSlice'

const UserManagment = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector((state) => state.auth)
    const { users, loading, error } = useSelector((state) => state.admin)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    })

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/')
        }
    }, [user, navigate])

    useEffect(() => {
        if (user && user.role == 'admin')
            dispatch(fetchUsers())

    }, [dispatch, user])


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(addUser(formData))

        setFormData(
            {
                name: '',
                email: '',
                password: '',
                role: 'customer'
            }
        )
    }

    const handleRoleChange = (Id, newRole) => {
        dispatch(updateUser({ id: Id, role: newRole }))
    }


    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId))
        }
    }


    return (
        <>
            <div className='max-w-7xl mx-auto px-12 py-8 font-sans '>
                <div>
                    <h2 className='text-2xl font-extrabold mb-6'>User Managment</h2>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    {/* {Add New User Form}  */}
                    <div className='w-[90%] mx-auto'>
                        <h3 className='text-lg font-bold mb-4'>Add New User</h3>

                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className='font-semibold'>Name</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full border rounded my-2 p-1'
                                ></input>
                            </div>
                            <div>
                                <label className='font-semibold'>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='w-full border rounded my-2 p-1'
                                ></input>
                            </div>
                            <div>
                                <label className='font-semibold'>Password</label>
                                <input
                                    type='text'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    className='w-full border rounded my-2 p-1'
                                ></input>
                            </div>
                            <div>
                                <label className='font-semibold'>Role</label>
                                <select
                                    name='role'
                                    value={formData.role}
                                    onChange={handleChange}
                                    className='w-[100%] border rounded p-1'
                                >
                                    <option value='customer'>Customer</option>
                                    <option value='admin'>Admin</option>
                                </select>
                            </div>
                            <div>
                                <button
                                    type='submit'
                                    className='bg-green-600 text-white rounded mt-6 px-4 py-2 font-semibold hover:-translate-y-1 duration-300 transition-transform'
                                >
                                    Add User
                                </button>
                            </div>

                        </form>

                        <div>
                            <table className='w-full mt-8'>
                                <thead className=''>
                                    <tr className='uppercase bg-gray-100 font-semibold text-sm'>
                                        <td className='px-3 py-2'>name</td>
                                        <td className='px-3 py-2'>email</td>
                                        <td className='px-3 py-2'>role</td>
                                        <td className='px-3 py-2'>action</td>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user._id} className='text-sm'>
                                                <td className='px-3 py-2'>{user.name}</td>
                                                <td className='px-3 py-2'>{user.email}</td>
                                                <td className='px-3 py-2'>
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                        className='px-2 py-1 border rounded'
                                                    >
                                                        <option value={'admin'}>Admin</option>
                                                        <option value={'customer'}>Customer</option>
                                                    </select>
                                                </td>
                                                <td className='px-3 py-2'>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className='bg-red-700 text-white font-semibold px-2 py-1 rounded hover:bg-red-600 duration-300'>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className='text-gray-700 text-center py-4'>No Users Currently</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>

                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default UserManagment