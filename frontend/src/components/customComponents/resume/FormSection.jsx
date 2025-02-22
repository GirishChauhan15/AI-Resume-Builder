import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigLeftDash, ArrowBigRightDash, Flower, HomeIcon } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import {Themes, SkillForm, PersonalDetailForm, ExperienceForm, EducationForm, SummaryForm, ResumeFormSkeleton, ProjectForm} from "../index";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function FormSection({resumeId, resumeInfo}) {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableSave, setEnableSave] = useState(true);
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate()

  useEffect(()=>{
    if(resumeInfo?._id) {
      setTimeout(() => {
        setLoading(false)
      }, 400);
    } else {
      setLoading(false)
    }
  },[resumeInfo])

  return (
    <section>
      {loading && <ResumeFormSkeleton />}
        {
          !loading ? resumeInfo?._id ? 
    <section>
      <article className="flex justify-between items-center select-none">
        <aside className="flex flex-wrap gap-2 items-center">
        <Button
            aria-label="Home"
            disabled={!enableSave}
            onClick={() => navigate('/')}
            size="sm"
          >
            <HomeIcon />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 items-center border-2"
                size="sm"
              >
                <Flower /> Themes
              </Button>
            </PopoverTrigger>
            <PopoverContent side={"bottom"} className={"min-[280px]:ml-10 w-fit"}>
              <Themes />
            </PopoverContent>
          </Popover>
        </aside>

        <div className="flex flex-wrap gap-2 items-center">
          {activeFormIndex > 1 && activeFormIndex < 7 && (
            <Button
              aria-label="previous"
              onClick={() => {if(enableSave){setActiveFormIndex((prev) => prev - 1)}}}
              size="sm"
              className={`${!enableSave && 'bg-zinc-500'}`}
            >
              <ArrowBigLeftDash />
            </Button>
          )}
          {
            activeFormIndex < 7 &&
          <Button
            onClick={() => {if(enableSave){setActiveFormIndex((prev) => prev + 1)}}}
            className={`flex gap-2 items-center ${!enableSave && 'bg-zinc-500'}`}
            size="sm"
            id="focus_Btn"
          >
            {activeFormIndex === 6 ? "View" :"Next"} <ArrowBigRightDash />
          </Button>
          }
        </div>
      </article>
      {activeFormIndex === 1 ? (
        <PersonalDetailForm
          enableSave={(booleanValue) => setEnableSave(Boolean(booleanValue))}
        />
      ) : activeFormIndex === 2 ? (
        <SummaryForm
          enableSave={(booleanValue) => setEnableSave(Boolean(booleanValue))}
        />
      ) : activeFormIndex === 3 ? (
        <ExperienceForm
          enableSave={(booleanValue) => setEnableSave(Boolean(booleanValue))}
        />
      ) : activeFormIndex === 4 ? (
        <EducationForm
          enableSave={(booleanValue) => setEnableSave(Boolean(booleanValue))}
        />
      ) : activeFormIndex === 5 ? (
        <SkillForm
          enableSave={(booleanValue) => setEnableSave(Boolean(booleanValue))}
        />
      ) : activeFormIndex === 6 ? (
        <ProjectForm
          enableSave={(booleanValue) => setEnableSave(Boolean(booleanValue))}
        />
      ) : activeFormIndex === 7 &&
        <Navigate to={ `/my-resume/${resumeId}/view`} />
      }
    </section>:  <ResumeFormSkeleton />
        : null}
    </section>
  );
}

export default FormSection;
