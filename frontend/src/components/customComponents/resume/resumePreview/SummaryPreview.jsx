function SummaryPreview({ resumeInfo }) {
  return (
    <article className="w-full overflow-hidden">
      <h2
        className={`text-center font-bold text-sm my-2 ${
          resumeInfo?.themeColor || "text-black"
        }`}
      >
        Summary
      </h2>
      {resumeInfo?.summary ? <p className="text-xs my-2">{resumeInfo?.summary}</p> : <p className="grid text-center tracking-widest font-mono font-semibold text-xs">No Summary Available!</p> }
    </article>
  );
}

export default SummaryPreview;
