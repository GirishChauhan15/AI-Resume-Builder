import SignIn from '@/components/customComponents/SignIn'
import SignUp from '@/components/customComponents/SignUp'
import { useState } from 'react'

function Auth() {
  const [login, setLogin] = useState(true)
  return (
    <main className='w-full min-h-[650px] flex justify-center items-center pt-10 min-[380px]:pt-20 min-w-[200px]'>
      {
        login ? <SignIn setLogin={setLogin} /> : <SignUp setLogin={setLogin} />
      }
    </main>
  )
}

export default Auth