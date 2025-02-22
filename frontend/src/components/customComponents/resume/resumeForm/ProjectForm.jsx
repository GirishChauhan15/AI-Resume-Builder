import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Brain, Minus, Plus } from "lucide-react";
import { useResumeInfo } from "@/context/Resume.context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import aiService from "@/services/AiModel";
import useThrottle from "@/hooks/useThrottle";
import {Spinner, RTK} from "../../index";

function ProjectForm({enableSave}) {
  const [loading, setLoading] = useState(false);
  const [selectedInput, setSelectedInput] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [disableBtn, setDisableBtn] = useState(false)
  const [addLoader, setAddLoader] = useState(false);
  const [removeLoader, setRemoveLoader] = useState(false);
  const { setResumeInfo, resumeInfo } = useResumeInfo();
  const axiosPrivate = useAxiosPrivate();
  const { resumeId } = useParams();
  const location = useLocation()
  const [aiLoading, setAiLoading] = useState(false);
  const [aiButtonActive, setAiButtonActive] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState(null);
  const textareaRef = useRef(null);
  const [aiGenerateButton, setAiGenerateButton] = useState(null);

    useEffect(()=>{
    if(selectedInput?.length === 0){
      enableSave(true);
    }
  },[selectedInput])

  let addSelectedInput = [];

  const handleSubmit = async (e, projectId) => {
    e.preventDefault();
    let project = resumeInfo?.projects?.find(project => project?._id === projectId)
    setLoading(true)
    setSelectedId(projectId)
    try {
      setSelectedInput([...selectedInput]?.filter(item=> item !== projectId))
      if(project !== undefined || project !== null && project?._id === projectId) {

        const res = await axiosPrivate.patch(
          `/resume/update/${resumeId}`,
          { project },{params: {projectId}}
        );
        if (res?.data?.success) {
          toast({
          variant: "success",
          title: res?.data?.message || 'Success.',
        });
        document.querySelector("#focus_Btn")?.focus();
        }
      } else {return}
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
      setLoading(false);
    }

  };
  const removeProject = async(projectId) =>{
    setRemoveLoader(true)
    setDisableBtn(true)
    try {
      const res = await axiosPrivate.delete(`/resume/delete-project/${resumeId}/${projectId}`);
      if (res?.data?.success) {
        toast({
        variant: "success",
        title: res?.data?.message || 'Success.',
      });
      document.querySelector("#focus_Btn")?.focus();
       const projectList = resumeInfo?.projects?.filter(project=> project?._id !== projectId)
      setResumeInfo({...resumeInfo, projects : projectList})
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

  const addProject = async () => {
    setAddLoader(true)
    setDisableBtn(true)
    try {
      const response = await axiosPrivate.post(`/resume/create-project/${resumeId}`)
      if(response?.data?.success) {
        toast({
          variant: "success",
          title: response?.data?.message || 'Success.',
        });
        const projectList = [...resumeInfo?.projects, response?.data?.data]
        setResumeInfo({...resumeInfo, projects : projectList})
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

  const handleInputChange = (e, projectId) => {
    if(enableSave) {
      enableSave(false)
    }
    const resumeProjectList = resumeInfo?.projects;
    const { name, value } = e.target;
        addSelectedInput?.push(projectId)
        addSelectedInput?.forEach(inputVal =>{
          if(!selectedInput?.includes(inputVal)){
            setSelectedInput([...selectedInput, inputVal])
          }
        })

        let updatedResumeList = resumeProjectList.map((project) =>
          project?._id === projectId ? { ...project, [name]: value } : project
        );
        setResumeInfo({ ...resumeInfo, projects: updatedResumeList });
  };

  const handleRTKInputs = (e, projectId, name) => {
    if(enableSave) {
      enableSave(false)
    }
      addSelectedInput?.push(projectId)
  
      addSelectedInput?.forEach(inputVal =>{
        if(!selectedInput?.includes(inputVal)){
          setSelectedInput([...selectedInput, inputVal])
        }
      })
    const resumeProjectList = resumeInfo?.projects;
    const { value } = e.target;
    let updatedResumeList = resumeProjectList.map((project) =>
      project?._id === projectId ? { ...project, [name]: value?.slice(0, 400) } : project
    );
    setResumeInfo({ ...resumeInfo, projects: updatedResumeList }); 
  };

  const generateSummary = async ({_id, projectName}) => {
    if(projectName === "Project Name") {
          toast({
            variant: "destructive",
            description:
              "Error! Project name is not valid.",
          });
          return
        }
    setAiGenerateButton(_id)
    setAiLoading(true)
    setAiButtonActive(true)
    let prompt = 'Generate a 3-line summary for the project titled' + projectName + '. Focus on the project’s core objective, a key achievement, and its overall impact or outcome. Highlight specific skills, technologies, and methods used during the project that align with industry standards and increase ATS compatibility. Keep the summary concise, clear, and impactful, using action-oriented language and measurable results when possible. Format the output as {projectSummary: data}, ensuring it captures the essence of the project and highlights its value. The output should only be 3 lines max 390 characters. Ensure the content is optimized for ATS, using relevant keywords and phrases that align with job descriptions in the field to increase interview opportunities.'
      try {
      if (
        projectName !== undefined ||
        projectName !== null ||
        !prompt?.includes("undefine")
      ) {
        let res = await aiService.getResult(prompt);
        if (res?.projectSummary) {
          setAiGeneratedData(res);
        } else {
          setAiGeneratedData(null);
          toast({
            variant: "destructive",
            description:
              "Error! Project info is not generated or is not available at this time, Please try again later.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          description:
            "Error! Project info is not generated or is not available at this time, Please try again later.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error: Unable to Process Request",
        description:
          "It seems the AI is temporarily unavailable. Please try again later.",
      });
    }finally{
      setAiLoading(false)
      setAiButtonActive(false)
    }
  };

  const throttledGenerateSummary = useThrottle(generateSummary, 1000);


  const handleAiProjectInfo = (project) =>{
    if (aiGeneratedData?.projectSummary?.length <= 400) {
      handleRTKInputs(
        {
          target: {
            value: aiGeneratedData?.projectSummary,
          },
        },
        project?._id,
        "projectDesc"
      );
    } 
    else if (
      aiGeneratedData?.projectSummary?.length >= 400
    ) {
      handleRTKInputs(
        {
          target: {
            value: aiGeneratedData?.projectSummary?.slice(
              0,
              400
            ),
          },
        },
        project?._id,
        "projectDesc"
      );
      toast({
        variant: "destructive",
        description: "max length 400 characters only!",
      });
    }
    addSelectedInput?.push(project?._id);

    addSelectedInput?.forEach((inputVal) => {
      if (!selectedInput?.includes(inputVal)) {
        setSelectedInput([...selectedInput, inputVal]);
      }
    });
    textareaRef?.current?.focus();
  }

  return (
       <article className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 select-none">
      <h2 className="font-bold text-lg">Projects</h2>
      <p>Share details of your key projects, including any personal, academic, or professional work you've done. Highlight your contributions, challenges faced, and the outcomes achieved.</p>
      <ul className="mt-2 flex flex-col gap-4">
        {resumeInfo?.projects?.length > 0 ?
          resumeInfo?.projects?.map((project) => (
            <li className="border-2 rounded-lg p-4" key={project?._id}>
              <div>
                <form
                  onSubmit={(e) => {
                    handleSubmit(e, project?._id);
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="text-sm block pb-2"
                        htmlFor="project-name"
                      >
                        Project Name
                      </label>
                      <Input
                      maxLength="100"
                        name="projectName"
                        id="project-name"
                        required
                        onChange={(e) => handleInputChange(e, project?._id)}
                        defaultValue={project?.projectName}
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm block pb-2"
                        htmlFor="gitHub-link"
                      >
                        GitHub Link
                      </label>
                      <Input
                      maxLength="150"
                        name="gitHubLink"
                        id="gitHub-link"
                        required
                        onChange={(e) => handleInputChange(e, project?._id)}
                        defaultValue={project?.gitHubLink}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="my-2 flex justify-between items-end gap-2 flex-wrap text-sm">
                        <p>Add Summary</p>
                        <Button
                          variant="outline"
                          className="border-2 text-primary font-bold text-xs"
                          size="sm"
                          type='button'
                          disabled={aiButtonActive}
                          onClick={()=> throttledGenerateSummary({...project})}
                        >
                          Create using AI <Brain />
                        </Button>
                      </div>
                      <RTK
                      ref={textareaRef}
                      id="project-desc"
                        handleRTK={(e) =>
                          handleRTKInputs(e, project?._id, "projectDesc")
                        }
                        info={project?.projectDesc}
                      />
                    </div>
                    <div className="flex col-span-2 justify-between items-center">
                    <div className="flex gap-2 items-center flex-wrap">
                     {resumeInfo?.projects?.length < 2 && (
                        <Button
                          className="border-2"
                          onClick={addProject}
                          type='button'
                          disabled={disableBtn}
                        >
                          {addLoader ? <Spinner width="w-[1.6rem]" /> :<>
                          <Plus />
                          Add More project
                          </>}
                        </Button>
                      )}
                      {resumeInfo?.projects?.length > 1 && resumeInfo?.projects[0]._id !== project?._id && (
                        <Button
                          className="border-2"
                          onClick={()=> removeProject(project?._id)}
                          type='button'
                          disabled={disableBtn}
                          variant="outline"
                        >
                          {removeLoader ? <Spinner width="w-[1.6rem]" /> :
                          <>
                          <Minus />
                          Remove project
                          </>}
                        </Button>
                      )}
                    </div>
                      <Button type="submit" disabled={selectedInput?.includes(project?._id) ? false : true}>
                        {loading && selectedId === project?._id ? <Spinner width="w-[1.6rem]" /> : "Save"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              <section className="mt-5">
                <ul className="flex flex-col gap-2">
                  {aiLoading && aiGenerateButton === project?._id ? (
                    <article className="grid w-full place-items-center">
                      <Spinner width="w-[2rem]" />
                    </article>
                  ) : (
                    aiGeneratedData?.projectSummary && aiGenerateButton === project?._id && (
                      <li
                      tabIndex={0}
                      onKeyDown={(e)=> {
                        if(e.key === 'Enter' || e.key === " ") {
                          e.preventDefault()
                          handleAiProjectInfo(project)
                        }
                      }}
                        onClick={() => {
                          handleAiProjectInfo(project)
                        }}
                        className="rounded-lg bg-zinc-100 p-4 cursor-pointer"
                      >
                        <h3 className="text-sm font-bold mb-2">
                          Project Info
                        </h3>
                        <p className="text-xs mt-2">
                          {aiGeneratedData?.projectSummary}
                        </p>
                      </li>
                    )
                  )}
                </ul>
              </section>



            </li>
          )): <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Project Available! Check internet.</p>}
      </ul>
    </article>
  )
}

export default ProjectForm

