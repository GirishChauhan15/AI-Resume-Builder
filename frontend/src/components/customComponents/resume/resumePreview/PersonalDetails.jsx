function PersonalDetails({resumeInfo}) {
  return (
    <>
   {resumeInfo?._id ? 
    <article className='w-full overflow-hidden'>
        <h2 className={`font-bold text-xl text-center ${resumeInfo?.themeColor || 'text-black'}`}>{resumeInfo?.firstName} {resumeInfo?.lastName}</h2>
        <p className='text-center text-sm font-medium'>{resumeInfo?.jobTitle}</p>
        <p className={`text-center text-xs font-normal ${resumeInfo?.themeColor || 'text-black'}`}>{resumeInfo?.address}</p>
        <div className="flex justify-between font-normal text-sm items-center gap-4 flex-wrap my-2">
            <p>{resumeInfo?.phone}</p>
            <p>{resumeInfo?.email}</p>
        </div>
    </article> : <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Personal Details Available!</p>}
        <hr className={`border-2 mt-2 ${resumeInfo?.themeBorder || 'border-black'}`} />
    </>
  )
}

export default PersonalDetails