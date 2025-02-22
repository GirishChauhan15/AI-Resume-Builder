import { useRef } from 'react';
import { toast } from './use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/AuthSlice';

const useThrottle = (func, delay) => {
  const {user} = useSelector(state=> state.auth)
  const dispatch = useDispatch()
  const lastCall = useRef(0);

  if(user?.lastCall) {
    lastCall.current = user?.lastCall
  }
  const throttledFunc = (...args) => {
    const now = Date.now();

    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      dispatch(login({...user, lastCall: lastCall.current}))
      func(...args);
    } else {
        toast({
            variant: 'destructive',
            description: `Please wait a moment before trying again. Time remaining ${(new Date(delay - (now - lastCall.current )).getTime()/1000)?.toFixed()} sec.` 
        })
    }
  };

  return throttledFunc;
};

export default useThrottle;
