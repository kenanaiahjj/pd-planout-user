function Span() {
  return (
    <div className="absolute content-stretch flex h-[23.998px] items-center justify-center left-[112.83px] top-[9.46px] w-[122.801px]" data-name="span">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.2344px]">
        <span className="leading-[24px]">{`Purchase Tickets `}</span>
        <span className="leading-[24px]">₱</span>
        <span className="leading-[24px]">{`560.00 `}</span>
      </p>
    </div>
  );
}

export default function PrimaryButton() {
  return (
    <div className="bg-gradient-to-r border-[0.539px] border-solid border-white from-[#3cd4b9] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] size-full to-[#177564]" data-name="PrimaryButton">
      <Span />
    </div>
  );
}