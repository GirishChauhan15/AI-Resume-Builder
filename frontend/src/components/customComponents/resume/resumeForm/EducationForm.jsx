import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { useResumeInfo } from '@/context/Resume.context';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {Spinner} from '../../index';

function EducationForm({enableSave}) {
    const [loading, setLoading] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false) 
    const [selectedId, setSelectedId] = useState(null) 
    const [selectedInput, setSelectedInput] = useState([]) 
    const [addLoader, setAddLoader] = useState(false);
    const [removeLoader, setRemoveLoader] = useState(false);
    const { setResumeInfo, resumeInfo } = useResumeInfo();
    const axiosPrivate = useAxiosPrivate();
    const { resumeId } = useParams();
    const location = useLocation()


      useEffect(()=>{
        if(selectedInput?.length === 0){
          enableSave(true);
        }
      },[selectedInput])
    
      let addSelectedInput = [];

    const handleSubmit = async(e, educationId) => {
      setSelectedId(educationId)
      setSelectedInput([...selectedInput]?.filter(item=> item !== educationId))
        e.preventDefault()
        setLoading(true)
        try {
          let education = resumeInfo?.education?.find(education => education?._id === educationId)
          if(education !== undefined || education !== null && education?._id === educationId) {
            const res = await axiosPrivate.patch(
              `/resume/update/${resumeId}`,
              { education },{params: {educationId}}
            );
            if (res?.data?.success) {
              toast({
              variant: "success",
              title: res?.data?.message || 'Success.',
            });
            document.querySelector("#focus_Btn")?.focus();
            }
          } else {return}
        }catch (error) {
          if (
            error?.message === "Access token is missing." ||
            error?.message === "Forbidden access."
          ) {
            navigate("/auth", { state: { from: location }, replace: true });
          }
          toast({
            variant: "destructive",
            title: error?.response?.data?.message || error?.message,
          });
        } finally {
          setLoading(false);
        }
    
      };

    const removeEducation = async(educationId) =>{
      setRemoveLoader(true)
      setDisableBtn(true)
      try {
        const res = await axiosPrivate.delete(`/resume/delete-education/${resumeId}/${educationId}`);
        if (res?.data?.success) {
          toast({
          variant: "success",
          title: res?.data?.message || 'Success.',
        });
         const educationList = resumeInfo?.education?.filter(education=> education?._id !== educationId)
        setResumeInfo({...resumeInfo, education : educationList})
        }
      } catch (error) {
        if (
          error?.message === "Access token is missing." ||
          error?.message === "Forbidden access."
        ) {
          navigate("/auth", { state: { from: location }, replace: true });
        }
        toast({
          variant: "destructive",
          title: error?.response?.data?.message || error?.message,
        });
      } finally {
        setRemoveLoader(false);
        setDisableBtn(false)
      }
    }
  
    const addEducation = async () => {
      setAddLoader(true)
      setDisableBtn(true)
      try {
        const response = await axiosPrivate.post(`/resume/create-education/${resumeId}`)
        if(response?.data?.success) {
          toast({
            variant: "success",
            title: response?.data?.message || 'Success.',
          });
          const educationList = [...resumeInfo?.education, response?.data?.data]
          setResumeInfo({...resumeInfo, education : educationList})
        }
      } catch (error) {
        if (
          error?.message === "Access token is missing." ||
          error?.message === "Forbidden access."
        ) {
          navigate("/auth", { state: { from: location }, replace: true });
        }
        toast({
          variant: "destructive",
          title: error?.response?.data?.message || error?.message,
        });
      } finally {
        setAddLoader(false)
        setDisableBtn(false)
      }
    }

    const handleInputChange = (e, educationId) => {
        if(enableSave) {
          enableSave(false)
        }
        addSelectedInput?.push(educationId)

        addSelectedInput?.forEach(inputVal =>{
          if(!selectedInput?.includes(inputVal)){
            setSelectedInput([...selectedInput, inputVal])
          }
        })
        const resumeEducationList = resumeInfo?.education;
        const { name, value } = e.target;
        let updatedResumeList = resumeEducationList.map((education) =>
          education?._id === educationId ? { ...education, [name]: value } : education
        );
        setResumeInfo({ ...resumeInfo, education: updatedResumeList });
      };

  return (
    <article className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 select-none">
    <h2 className="font-bold text-lg">Education</h2>
    <p>Showcase your academic background.</p>
    <ul className="mt-2 flex flex-col gap-4">
      {resumeInfo?.education?.length > 0 ?
        resumeInfo?.education?.map((education) => (
          <li className="border-2 rounded-lg p-4" key={education?._id}>
            <div>
              <form
                onSubmit={(e) => {
                  handleSubmit(e, education?._id);
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                <div className='col-span-2'>
                    <label
                      className="text-sm block pb-2"
                      htmlFor="university-name"
                    >
                      University Name
                    </label>
                    <Input
                    maxLength="150"
                      name="universityName"
                      id="university-name"
                      required
                      onChange={(e) => handleInputChange(e, education?._id)}
                      defaultValue={education?.universityName}
                    />
                  </div>

                <div>
                    <label
                      className="text-sm block pb-2"
                      htmlFor="degree"
                    >
                      Degree
                    </label>
                    <Input
                    maxLength="100"
                      name="degree"
                      id="degree"
                      required
                      onChange={(e) => handleInputChange(e, education?._id)}
                      defaultValue={education?.degree}
                    />
                  </div>
                <div>
                    <label
                      className="text-sm block pb-2"
                      htmlFor="major"
                    >
                      Major
                    </label>
                    <Input
                    maxLength="80"
                      name="major"
                      id="major"
                      required
                      onChange={(e) => handleInputChange(e, education?._id)}
                      defaultValue={education?.major}
                    />
                  </div>
                <div>
                    <label
                      className="text-sm block pb-2"
                      htmlFor="start-date"
                    >
                      Start Date
                    </label>
                    <Input
                    maxLength="10"
                      name="startDate"
                      id="start-date"
                      required
                      type='date'
                      onChange={(e) => handleInputChange(e, education?._id)}
                      defaultValue={education?.startDate}
                    />
                  </div>
                <div>
                    <label
                      className="text-sm block pb-2"
                      htmlFor="end-date"
                    >
                     End Date
                    </label>
                    <Input
                    maxLength="10"
                      name="endDate"
                      id="end-date"
                      required
                      type='date'
                      onChange={(e) => handleInputChange(e, education?._id)}
                      defaultValue={education?.endDate}
                    />
                  </div>
                  <div className='col-span-2'>
                    <label
                      className="text-sm block pb-2"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <textarea id='description' name='description' 
                    value={education?.description} 
                    maxLength={200}
                    required 
                    onChange={(e)=>handleInputChange(e, education?._id)} 
                    className='border-[1px] rounded-sm resize-none min-h-16 focus:outline-offset-4 px-2 py-1 text-sm w-full focus:outline-black' />
                  </div>
                  </div>
                  <div className="flex mt-2 col-span-2 justify-between items-center">
                  <div className="flex gap-2 items-center flex-wrap">
                    {resumeInfo?.education?.length < 2 && (
                      <Button
                        className="border-2"
                        onClick={addEducation}
                        type='button'
                        disabled={disableBtn}
                      >
                        {addLoader ? <Spinner width="w-[1.6rem]" /> :<>
                        <Plus />
                        Add Education
                        </>}
                      </Button>
                    )}
                    {resumeInfo?.education?.length > 1 && resumeInfo?.education[0]._id !== education?._id && (
                      <Button
                        className="border-2"
                        onClick={()=> removeEducation(education?._id)}
                        type='button'
                        disabled={disableBtn}
                        variant="outline"
                      >
                        {removeLoader ? <Spinner width="w-[1.6rem]" /> :
                        <>
                        <Minus />
                        Remove Education
                        </>}
                      </Button>
                    )}
                  </div>
                    <Button type="submit" disabled={selectedInput?.includes(education?._id) ? false : true}>
                      {loading && selectedId === education?._id ? <Spinner width="w-[1.6rem]" /> : "Save"}
                    </Button>
                  </div> 
              </form>
            </div>
          </li>
        )):<p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Education Available! Check internet.</p>}
    </ul>
  </article>
  )
}

export default EducationForm