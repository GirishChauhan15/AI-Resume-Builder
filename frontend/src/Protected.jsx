import React,{useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {Spinner} from './components/customComponents/index'


export default function Protected({children, authentication = true}) {
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()
    const {status} = useSelector(state => state.auth)

    useEffect(()=>{
        if(authentication && status !== authentication){    
            navigate('/auth')
        } else if(!authentication && status !== authentication) {
            navigate('/')
        }
        setLoader(false)
    },[status,navigate,authentication])
  return (
    loader ? <Spinner className={'grid pt-10'} width='w-[2rem]' /> : <>{children}</>
  )
}