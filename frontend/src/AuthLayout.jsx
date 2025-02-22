import { useEffect, useState } from 'react'
import { Outlet, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './store/AuthSlice'
import authService from './services/AuthService'
import { Spinner } from './components/customComponents/index'

function AuthLayout() {
    const [loading, setLoading] = useState(true)
    const {user, status} = useSelector(state=> state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(()=>{
        const controller = new AbortController()
        const getCurrentUser = async (signal) => {
          setLoading(true);
          try {
            const response = await authService.getCurrentUser(signal);
            if (response?.success) {
              dispatch(login({...response?.data}));
            }
          } catch (err) {
            if(err?.response?.data?.message || err?.message !== 'canceled') {
              navigate('/')
              dispatch(logout());
            } 
          } finally {
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        };
    
        !user || status === false ? getCurrentUser(controller?.signal) : setLoading(false)
    
        return () => {
          controller?.abort()
        }
    
      },[])
    
  return (
    <>
        {loading ? 
        <div className="flex justify-center items-center w-full h-screen min-h-[200px]">
            <Spinner className={'grid m-auto'} width='w-[3rem]' />
        </div> : 
        <Outlet />}
    </>
  )
}

export default AuthLayout