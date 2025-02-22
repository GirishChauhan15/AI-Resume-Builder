import { useResumeInfo } from '@/context/Resume.context';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {Spinner} from './index';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

const themeColors = [
  { themeColor: "text-[#ff6666]", themeBg: "bg-[#ff6666]", themeBorder: "border-[#ff6666]" },
  { themeColor: "text-[#ee6c4d]", themeBg: "bg-[#ee6c4d]", themeBorder: "border-[#ee6c4d]" },
  { themeColor: "text-[#db8c53]", themeBg: "bg-[#db8c53]", themeBorder: "border-[#db8c53]" },
  { themeColor: "text-[#FF6A13]", themeBg: "bg-[#FF6A13]", themeBorder: "border-[#FF6A13]" },
  { themeColor: "text-[#e56b6f]", themeBg: "bg-[#e56b6f]", themeBorder: "border-[#e56b6f]" },
  { themeColor: "text-[#b76935]", themeBg: "bg-[#b76935]", themeBorder: "border-[#b76935]" },
  { themeColor: "text-[#A2007E]", themeBg: "bg-[#A2007E]", themeBorder: "border-[#A2007E]" },
  { themeColor: "text-[#8B0C2E]", themeBg: "bg-[#8B0C2E]", themeBorder: "border-[#8B0C2E]" },
  { themeColor: "text-[#585123]", themeBg: "bg-[#585123]", themeBorder: "border-[#585123]" },
  { themeColor: "text-[#1e2f23]", themeBg: "bg-[#1e2f23]", themeBorder: "border-[#1e2f23]" },
  { themeColor: "text-[#335c67]", themeBg: "bg-[#335c67]", themeBorder: "border-[#335c67]" },
  { themeColor: "text-[#000000]", themeBg: "bg-[#000000]", themeBorder: "border-[#000000]" },
  { themeColor: "text-[#7D7D7D]", themeBg: "bg-[#7D7D7D]", themeBorder: "border-[#7D7D7D]" },
  { themeColor: "text-[#102A73]", themeBg: "bg-[#102A73]", themeBorder: "border-[#102A73]" },
  { themeColor: "text-[#394D6B]", themeBg: "bg-[#394D6B]", themeBorder: "border-[#394D6B]" },
  { themeColor: "text-[#26A7FF]", themeBg: "bg-[#26A7FF]", themeBorder: "border-[#26A7FF]" },
  { themeColor: "text-[#7D47B2]", themeBg: "bg-[#7D47B2]", themeBorder: "border-[#7D47B2]" },
  { themeColor: "text-[#9987FF]", themeBg: "bg-[#9987FF]", themeBorder: "border-[#9987FF]" },
  { themeColor: "text-[#E360CA]", themeBg: "bg-[#E360CA]", themeBorder: "border-[#E360CA]" },
  { themeColor: "text-[#016B5D]", themeBg: "bg-[#016B5D]", themeBorder: "border-[#016B5D]" }
];

function Themes() {
  const { setResumeInfo, resumeInfo } = useResumeInfo();
  const [loading, setLoading] = useState(false);
  const {resumeId} = useParams()
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation()

    const handleThemeChange = async(theme) => {
      setLoading(true);
        try {
          let res = await axiosPrivate.patch(`/resume/update/${resumeId}`, {
            theme
          });
          if(res?.data?.success) {
            setResumeInfo({...resumeInfo, themeBg: theme?.themeBg,  themeColor: theme?.themeColor, themeBorder: theme?.themeBorder})
            toast({
            variant: "success",
            title: res?.data?.message || 'Success.',
          });
          }
        } catch (error) {
          if (
            error?.message === "Access token is missing." ||
            error?.message === "Forbidden access."
          ) {
            navigate("/auth", { state: { from : location }, replace: true });
          }
          toast({
            variant: "destructive",
            title: error?.response?.data?.message || error?.message,
          });
        } finally {
          setLoading(false);
        }
    }
    return (
        <ul className='grid gap-2 max-[280px]:grid-cols-2 max-[280px]:w-fit grid-cols-4 place-items-center w-[150px]'>
            {loading && <Spinner width='w-[2.5rem]' className={'col-span-full'}/>}
             {!loading ? themeColors?.length > 0 ? themeColors?.map((theme)=>(
              <li tabIndex={0} onKeyDown={(e)=>{
                if(e.key === "Enter" || e.key === ' ') {
                  e.preventDefault()
                  handleThemeChange(theme)
                }
              }} onClick={()=> handleThemeChange(theme)} key={theme?.themeBg} className={`${theme?.themeBg} w-5 h-5 rounded-full ${resumeInfo?.themeColor === theme?.themeColor ? 'border-[1px] border-white shadow-black shadow-sm' : 'hover:scale-[1.1]' }  transition-transform ease-in-out delay-75 focus-visible:outline-offset-2 focus-visible:outline-blue-700 `}></li>
             )):<p className="grid col-span-full text-center tracking-widest font-mono font-semibold text-xs">No data!</p>: null}
        </ul>
  )
}

export default Themes