import { useEffect, useState } from 'react'
import {PersonalDetails, ExperiencePreview, SummaryPreview, EducationPreview, SkillsPreview, ProjectPreview, ResumePreviewSkeleton} from '../index'

function ResumePreview({resumeInfo, shadow=true}) {

  const [loading, setLoading] = useState(true)

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
      {loading && <ResumePreviewSkeleton />}
        {
          !loading ? resumeInfo?._id ? 
            <article className={`${shadow ? 'shadow-lg' : 'shadow-none'} h-full px-10 py-7 border-t-[1.25rem] ${resumeInfo?.themeBorder || 'border-black'}`}>
                <PersonalDetails resumeInfo={resumeInfo} />
                <SummaryPreview resumeInfo={resumeInfo} />
                <ExperiencePreview resumeInfo={resumeInfo} />
                <EducationPreview resumeInfo={resumeInfo} />
                <SkillsPreview resumeInfo={resumeInfo} />
                <ProjectPreview resumeInfo={resumeInfo} />
            </article>
            : <ResumePreviewSkeleton />
        : null}
    </section>
  )
}

export default ResumePreview