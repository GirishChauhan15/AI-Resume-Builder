function ResumePreviewSkeleton({animate=true}) {
  return (
    <article className='grid col-span-full w-full h-fit min-h-[500px]'>
    <div className={`bg-zinc-300 opacity-5 min-h-[600px] w-full ${animate && 'animate-pulse'} rounded-lg p-2`}>
      <div className={`bg-zinc-400 h-16 w-full ${animate && 'animate-pulse'} rounded-lg`}></div>
      <div className={`bg-zinc-400 h-40 my-4 w-full ${animate && 'animate-pulse'} rounded-lg`}></div>
      <div className={`bg-zinc-400 h-40 my-4 w-full ${animate && 'animate-pulse'} rounded-lg`}></div>
      <div className={`bg-zinc-400 h-40 my-4 w-full ${animate && 'animate-pulse'} rounded-lg`}></div>
    </div>
  </article>
  )
}

export default ResumePreviewSkeleton