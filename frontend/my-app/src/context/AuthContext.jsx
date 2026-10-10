import React,{createContext,useMemo,useState} from "react";

const getStoredUser = () => {
    try {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        console.error("Failed to parse saved user", error);
        return null;
    }
};

export const AuthContext=createContext();

export const AuthProvider=({children}) =>{
    const [user,setUser]=useState(() => getStoredUser());

    const login=(userData)=>{
        setUser(userData);
        localStorage.setItem("userInfo",JSON.stringify(userData));
    }

    const logout=()=>{
        setUser(null);
        localStorage.removeItem("userInfo");
    }

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return(
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )

}

