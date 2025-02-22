function ResumeFormSkeleton({animate=true}) {
  return (
    <article className='grid col-span-full w-full h-fit min-h-[500px]'>
          <div className={`bg-zinc-300 opacity-5 h-12 w-full mb-8 ${animate && 'animate-pulse'} rounded-lg`}></div>
          <div className="h-screen min-h-fit">
          <div className={`bg-zinc-300 opacity-5 min-h-[500px] w-full ${animate && 'animate-pulse'} rounded-lg`}></div>
          </div>
        </article>
  )
}

export default ResumeFormSkeleton