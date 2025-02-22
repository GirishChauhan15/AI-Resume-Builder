import authService from '@/services/AuthService'
import { login } from '@/store/AuthSlice'
import { useDispatch } from 'react-redux'

function useRefresh() {
    const dispatch = useDispatch()
    const refresh = async () => {
        try {
            const res = await authService.refreshTokens()
            if(res?.success) {
                dispatch(login(res?.data))
                return true
            }
        } catch (error) {
            return false
        }
    }

    return refresh
  
}

export default useRefresh
