import { useEffect } from 'react'
import useRefresh from './useRefresh'
import { axiosPrivate } from '@/api/axios'
import { useSelector } from 'react-redux'

function useAxiosPrivate() {
    let refresh = useRefresh()
    const {user} = useSelector(state=> state.auth)

  useEffect(()=>{

    let requestIntercept = axiosPrivate.interceptors.request.use(
        config =>{
            if(user?.accessToken) {
                config.headers.Authorization = `Bearer ${user?.accessToken}`
            }
            return config
        }, (err) => { throw new Error(err?.response?.data?.message || err?.message)}
    )

    let responseIntercept = axiosPrivate.interceptors.response.use(
        response=>response,
        async (error)=>{
            let previousRequest = error?.config
            if(error?.response?.status === 401 && !previousRequest?.sent){
                previousRequest.sent = true
                let isRefresh = await refresh()
                if(isRefresh) {
                    return axiosPrivate(previousRequest)
                }
            } 
            else if(error?.message === "canceled"){
                return null
            } 
            else {
                throw new Error(error?.response?.data?.message || error?.message)
            }
        }
    )

    return ()=>{
        axiosPrivate.interceptors.request.eject(requestIntercept)
        axiosPrivate.interceptors.response.eject(responseIntercept)

    }
  },[refresh]) 
  return axiosPrivate
}

export default useAxiosPrivate