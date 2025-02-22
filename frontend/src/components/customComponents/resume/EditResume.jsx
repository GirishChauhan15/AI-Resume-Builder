import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ResumeProvider } from '@/context/Resume.context'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from '@/hooks/use-toast'
import {Spinner, FormSection, ResumePreview} from '../index'

function EditResume() {
    const {resumeId} = useParams()
    const [resumeInfo, setResumeInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()

    const fetchUserResumeInfo = async (signal) => {
      setLoading(true)
      try {
        
        let response = await axiosPrivate.get(`/resume/my-resume/${resumeId}`,{signal})
        if(response?.data?.success) {
          if(response?.data?.data) {
            setResumeInfo(response?.data?.data)
          } 
        }
      } catch (err) {
        if(err?.message === 'Network Error') {
            navigate("/");
        }
        if(err?.message === 'Invalid resume id.') {
          navigate("/");
        }
        if (
          err?.message === "Access token is missing." ||
          err?.message === "Forbidden access."
        ) {
          navigate("/auth", { state: { from : location }, replace: true });
        }
        toast({
          variant: "destructive",
          title: err?.response?.data?.message || err?.message,
        });
      } finally {
          setLoading(false)
      }
    }

    useEffect(()=>{
      let controller = new AbortController()
      fetchUserResumeInfo(controller?.signal)
        return()=>{
          controller.abort()
            setResumeInfo(null)
        }
    },[])

  return (
    <ResumeProvider value={{resumeInfo, setResumeInfo}}>
     {loading ? <div className="flex justify-center items-center w-full h-screen min-h-[200px]">
        <Spinner width='w-[3rem]' />
      </div> 
      : 
      <main className='grid grid-cols-1 md:grid-cols-2 gap-10 px-10  pt-16 min-[380px]:pt-20 min-w-[280px]'>
        <FormSection resumeInfo={resumeInfo} resumeId={resumeId} />
        <ResumePreview  resumeInfo={resumeInfo} />
    </main>}
    </ResumeProvider>
  )
}

export default EditResume