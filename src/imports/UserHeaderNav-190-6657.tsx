import svgPaths from "./svg-hzwvbmfohs";
import imgUserHeaderNav from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";

export default function UserHeaderNav() {
  return (
    <div className="backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex flex-col items-center relative size-full" data-name="User Header Nav">
      <div className="backdrop-blur-[20px] content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-[1280px]" data-name="Frame">
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Group">
            <div className="col-1 ml-0 mt-0 relative row-1 size-[36px]" data-name="Logo">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserHeaderNav} />
            </div>
            <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[42px] mt-[3px] not-italic relative row-1 text-[#1e9680] text-[20px] tracking-[-0.4px]">PlanOut</p>
          </div>
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Frame">
            <div className="content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
              <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px]">Home</p>
              </div>
            </div>
            <div className="bg-[#def2ee] content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
              <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px]">Events</p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
          <div className="content-stretch flex gap-[6px] items-center px-[8px] py-[7px] relative shrink-0" data-name="Frame">
            <div className="relative shrink-0 size-[26px]" data-name="Frame">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
                <g id="Frame">
                  <path d={svgPaths.p1f1ac800} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d={svgPaths.p7abe300} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </g>
              </svg>
            </div>
            <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px] whitespace-nowrap">
              <p className="leading-[1.4]">Login or Register</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-px relative shrink-0 w-full" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1">
          <path clipRule="evenodd" d="M1280 1H0V0H1280V1Z" fill="var(--fill-0, #E9EAEB)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="h-px relative shrink-0 w-full" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1">
          <path clipRule="evenodd" d="M1280 1H0V0H1280V1Z" fill="var(--fill-0, #E9EAEB)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}