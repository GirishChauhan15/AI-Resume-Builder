import { createContext, useContext } from "react";

const ResumeContext = createContext()

export const ResumeProvider = ResumeContext.Provider

export const useResumeInfo = () =>{
    return useContext(ResumeContext)
}