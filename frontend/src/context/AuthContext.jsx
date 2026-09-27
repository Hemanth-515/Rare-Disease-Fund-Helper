import {createContext,useContext,useState} from 'react';
import api from '../services/api';
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('user'));}catch{return null;}});const [role,setRole]=useState(()=>localStorage.getItem('role'));
const login=async(endpoint,data)=>{const {data:result}=await api.post(`/auth/${endpoint}`,data);localStorage.setItem('token',result.token);localStorage.setItem('user',JSON.stringify(result.user));localStorage.setItem('role',result.role);setUser(result.user);setRole(result.role);return result;};
const logout=()=>{localStorage.clear();setUser(null);setRole(null);};return <AuthContext.Provider value={{user,role,login,logout}}>{children}</AuthContext.Provider>;}
export const useAuth=()=>useContext(AuthContext);
