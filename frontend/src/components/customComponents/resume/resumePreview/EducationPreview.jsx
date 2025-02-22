function EducationPreview({resumeInfo}) {
  return (
    <article className="w-full overflow-hidden">
    <hr className={`border-2 my-2 ${resumeInfo?.themeBorder || 'border-black'}`} />
    <h2 className={`text-center font-bold text-sm my-2 ${resumeInfo?.themeColor || 'text-black'}`}>Education</h2>
    <ul>

    {resumeInfo?.education?.length > 0  ? resumeInfo?.education?.map(education=>(
        <li key={education?._id} className='my-2'>
            <h3 className={`text-sm font-bold ${resumeInfo?.themeColor || 'text-black'}`}>{education?.universityName}</h3>
            <div className="flex gap-2 items-center justify-between flex-wrap text-xs">
                <p>{education?.degree} in {education?.major}</p>
                <p>{education?.startDate} to {education?.endDate}</p>
            </div>
            <p className='text-xs py-2 mb-2'>{education?.description}</p>
        </li>
    )):  <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Education Available!</p>}
    </ul>
    </article>
  )
}

export default EducationPreview