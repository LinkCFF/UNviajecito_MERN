import { useState, useContext, createContext, } from "react";
import { createUsersRequest, loginUserRequest, getUserRequest, getUsersRequest } from "../api/users";


const userContext = createContext()

export const useUsers = () => {
  const context = useContext(userContext)
  return context
}


export const UserProvider = ({ children }) => {

  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const isLogged = () => !!currentUser
  const logout = () => setCurrentUser(null)

  const getUsers = async () => {
    const res = await getUsersRequest()
    console.log(res);
    setUsers(res.data)
  }

  const getUser = async (id) => {
    const res = await getUserRequest(id)
    setCurrentUser(res.data)
    return res.data
  }

  const loginUser = async (user) => {
    try {
      const res = await loginUserRequest(user)
      setCurrentUser(res.data)
      return res.data
      // if (res) {
      //   setCurrentUser(res.data)
      //   return res.data
      // } else {
      //   return '404'
      // }
    } catch (error) {
      console.error(error.message);
      if (error.message === 'Request failed with status code 409' || error.message === 'Request failed with status code 404' ) {
        return '401'
      }
      // if (error.message === 'Request failed with status code 404') {
      //   return '404'
      // }
      // return error.response.data.code
      return console.error(error);
    }
  }

  const createUser = async (newUser) => {
    try {
      const res = await createUsersRequest(newUser)
      setCurrentUser(res.data)
    } catch (error) {
      console.error(error);
      return error.response.data.code
    }
  }

  return (
    <userContext.Provider value={{
      users,
      isLogged,
      logout,
      getUsers,
      getUser,
      loginUser,
      createUser,
      currentUser,
      setCurrentUser
    }}>
      {children}
    </userContext.Provider>
  )
}
