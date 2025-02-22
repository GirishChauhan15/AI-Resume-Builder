import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResumeInfo } from "@/context/Resume.context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {Spinner} from "../../index";
import { Minus, Plus, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function SkillForm({ enableSave }) {
  const [loading, setLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false); 
  const [selectedId, setSelectedId] = useState(null); 
  const [selectedInput, setSelectedInput] = useState([]); 
  const [addLoader, setAddLoader] = useState(false);
  const [removeLoader, setRemoveLoader] = useState(false);
  const { setResumeInfo, resumeInfo } = useResumeInfo();
  const axiosPrivate = useAxiosPrivate();
  const { resumeId } = useParams();
  const location = useLocation();
  const [starArray, setStarArray] = useState([]);
  const [isActive, setIsActive] = useState(false);

  let allIds = [];

  useEffect(() => {
    if (selectedInput?.length === 0) {
      enableSave(true);
    }
  }, [selectedInput]);

  let addSelectedInput = [];

  const handleSubmit = async (e, skillId) => {
    setSelectedId(skillId);
    setIsActive(false)
    setSelectedInput([...selectedInput]?.filter((item) => item !== skillId));
    e.preventDefault();
    setLoading(true);
    try {
      let skill = resumeInfo?.skills?.find((skill) => skill?._id === skillId);
      if (skill !== undefined || (skill !== null && skill?._id === skillId)) {
        const res = await axiosPrivate.patch(
          `/resume/update/${resumeId}`,
          { skill },
          { params: { skillId } }
        );
        if (res?.data?.success) {
          toast({
            variant: "success",
            title: res?.data?.message || "Success.",
          });
          document.querySelector("#focus_Btn")?.focus();
        }
      } else {
        return;
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
      setLoading(false);
    }
  };

  const removeSkill = async (skillId) => {
    setRemoveLoader(true);
    setSelectedId(skillId);
    setDisableBtn(true);
    try {
      const res = await axiosPrivate.delete(
        `/resume/delete-skill/${resumeId}/${skillId}`
      );
      if (res?.data?.success) {
        toast({
          variant: "success",
          title: res?.data?.message || "Success.",
        });
        document.querySelector("#focus_Btn")?.focus();
        const skillList = resumeInfo?.skills?.filter(
          (skill) => skill?._id !== skillId
        );
        setResumeInfo({ ...resumeInfo, skills: skillList });
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
      setDisableBtn(false);
    }
  };

  const addSkill = async (skillId) => {
    setSelectedId(skillId);
    setAddLoader(true);
    setDisableBtn(true);
    try {
      const response = await axiosPrivate.post(
        `/resume/create-skill/${resumeId}`
      );
      if (response?.data?.success) {
        toast({
          variant: "success",
          title: response?.data?.message || "Success.",
        });
        const skillList = [...resumeInfo?.skills, response?.data?.data];
        setResumeInfo({ ...resumeInfo, skills: skillList });
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
      setAddLoader(false);
      setDisableBtn(false);
    }
  };

  const handleInputChange = (e, skillId) => {
    if (enableSave) {
      enableSave(false);
    }
    addSelectedInput?.push(skillId);

    addSelectedInput?.forEach((inputVal) => {
      if (!selectedInput?.includes(inputVal)) {
        setSelectedInput([...selectedInput, inputVal]);
      }
    });
    const resumeSkillList = resumeInfo?.skills;
    const { name, value } = e.target;
    let updatedResumeList = resumeSkillList.map((skill) =>
      skill?._id === skillId ? { ...skill, [name]: value } : skill
    );
    setResumeInfo({ ...resumeInfo, skills: updatedResumeList });
  };

  const handleMouseOver = (starId, skillId) => {
    if (isActive) {
      if (enableSave) {
        enableSave(false);
      }
      const skillList = resumeInfo?.skills;

      addSelectedInput?.push(skillId);

      addSelectedInput?.forEach((inputVal) => {
        if (!selectedInput?.includes(inputVal)) {
          setSelectedInput([...selectedInput, inputVal]);
        }
      });
      let updatedSkillList = skillList?.map((skill) =>
        skill?._id === skillId
          ? { ...skill, rating: String(starId * 20) }
          : skill
      );

      setResumeInfo({ ...resumeInfo, skills: updatedSkillList });

      allIds?.push(skillId);
      allIds?.forEach((item) => {
        if (!starArray?.includes(item)) {
          setStarArray([...starArray, item]);
        }
      });
    } else return;
  };

  return (
    <article className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 select-none">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>
        Highlight your key skills and expertise that demonstrate your
        proficiency in specific areas.
      </p>

      <ul className="mt-2 flex flex-col gap-4">
        {resumeInfo?.skills?.length > 0 ?
          resumeInfo?.skills?.map((skill) => (
            <li className="border-2 rounded-lg p-4" key={skill?._id}>
              <div>
                <form
                  onSubmit={(e) => {
                    handleSubmit(e, skill?._id);
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-full">
                      <label className="text-sm block pb-2" htmlFor="name">
                        Name
                      </label>
                      <div className="flex justify-between items-center gap-2 flex-wrap">
                        <Input
                        maxLength="50"
                          className={"w-1/2"}
                          name="name"
                          id="name"
                          required
                          onChange={(e) => handleInputChange(e, skill?._id)}
                          defaultValue={skill?.name}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex justify-end gap-1">
                                {[1, 2, 3, 4, 5]?.map((star) => (
                                  <p
                                  role="button"
                                  aria-label={`star-${star}`}
                                  aria-checked={`${skill?.rating / 20 >= star ? true : false}`}
                                    tabIndex={0}
                                    onKeyDown={(e)=> {
                                      if(e.key === "Enter" || e.key === ' ') {
                                        e.preventDefault();
                                        if(!isActive) {
                                          setIsActive(true)
                                        }
                                        handleMouseOver(star, skill?._id)
                                      }
                                    }}
                                    key={star}
                                    onDoubleClick={() => setIsActive(prev=> !prev)}
                                    onMouseOver={() =>
                                      handleMouseOver(star, skill?._id)
                                    }
                                  >
                                    <Star
                                      className={`text-3xl cursor-pointer ${
                                        skill?.rating / 20 >= star
                                          ? "fill-yellow-500 text-yellow-950"
                                          : "fill-zinc-800"
                                      }`}
                                    />
                                  </p>
                                ))}
                              </div>
                            </TooltipTrigger>
                            {!isActive && (
                              <TooltipContent>
                                <p>Double-click to begin setting the skill level.</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-2 col-span-2 justify-between items-center">
                    <div className="flex gap-2 items-center flex-wrap">
                      {resumeInfo?.skills[resumeInfo?.skills?.length - 1]
                        ._id === skill?._id &&
                        resumeInfo?.skills?.length < 4 && (
                          <Button
                            className="border-2"
                            onClick={() => addSkill(skill?._id)}
                            type="button"
                            disabled={disableBtn}
                          >
                            {addLoader && selectedId === skill?._id ? (
                              <Spinner width="w-[1.6rem]" />
                            ) : (
                              <>
                                <Plus />
                                Add Skill
                              </>
                            )}
                          </Button>
                        )}
                      {resumeInfo?.skills?.length > 1 &&
                        resumeInfo?.skills[0]._id !== skill?._id && (
                          <Button
                            className="border-2"
                            onClick={() => removeSkill(skill?._id)}
                            type="button"
                            disabled={disableBtn}
                            variant="outline"
                          >
                            {removeLoader && selectedId === skill?._id ? (
                              <Spinner width="w-[1.6rem]" />
                            ) : (
                              <>
                                <Minus />
                                Remove Skill
                              </>
                            )}
                          </Button>
                        )}
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        selectedInput?.includes(skill?._id) ? false : true
                      }
                    >
                      {loading && selectedId === skill?._id ? (
                        <Spinner width="w-[1.6rem]" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </li>
          )) : <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Skill Available! Check internet.</p>
           }
      </ul>
    </article>
  );
}

export default SkillForm;
