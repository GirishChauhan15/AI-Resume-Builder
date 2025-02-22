function SkillsPreview({resumeInfo}) {
  return (
    <article className='w-full overflow-hidden'>
        <hr className={`border-2 my-2 ${resumeInfo?.themeBorder || 'border-black'}`} />
        <h2 className={`text-center font-bold text-sm my-2 ${resumeInfo?.themeColor || 'text-black'} `}>Skills</h2>

        <ul className='grid grid-cols-2 gap-4 place-items-start place-content-start pb-2'>
            {resumeInfo?.skills?.length > 0 ? resumeInfo?.skills?.map(skill=>(
                <li key={skill?._id} className='flex items-center justify-between gap-2 flex-wrap w-[90%]'>
                    <h3 className='text-xs'>{skill?.name}</h3>
                    <div className='h-2 bg-gray-300 w-[120px]'>
                       <span style={{width: skill?.rating+ '%'}} className={`h-2 block ${resumeInfo?.themeBg}`}>
                        </span>
                    </div>
                </li>
            )) : <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Skill Available!</p> }
        </ul>
    </article>
  )
}

export default SkillsPreview