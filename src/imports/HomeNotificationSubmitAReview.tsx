import svgPaths from "./svg-ggijtcih2a";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgEllipse from "figma:asset/df692514c51e252497f9b8d5272152b9f7c80c14.png";

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#b5bcc9] text-[16px]">Location</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevron-down">
          <path d="M5 7.5L10 12.5L15 7.5" id="Vector" stroke="var(--stroke-0, #717680)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] items-center left-[calc(41.67%+43px)] px-[14px] py-[10px] rounded-[8px] top-[338px] w-[268px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#def2ee] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <Frame1 />
      <ChevronDown />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[calc(16.67%+30px)] top-[338px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[44px] left-[calc(16.67%+30px)] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] top-[338px] w-[297px]" data-name="Rectangle" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[calc(16.67%+43px)] not-italic text-[#b5bcc9] text-[16px] top-[360px] tracking-[-0.48px] whitespace-nowrap">
        <p className="leading-[1.4]">Explore events, courses, or organizer</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#3cd4b9] h-[44px] items-center justify-center left-[calc(66.67%+27px)] overflow-clip px-[20px] py-[16px] rounded-[8px] to-[#177564] top-[338px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-white tracking-[-0.48px]">Search Events</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[calc(8.33%+106px)] top-[314px]" data-name="Group">
      <div className="-translate-x-1/2 absolute bg-white border border-[#def2ee] border-solid h-[92px] left-[calc(50%+1px)] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[314px] w-[790px]" data-name="Rectangle" />
      <Frame />
      <Group1 />
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex items-center justify-center left-[calc(25%+61px)] px-[16px] py-[4px] rounded-[999px] top-[462px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.24px]">Hiking</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex items-center justify-center left-[calc(16.67%+46px)] px-[16px] py-[4px] rounded-[999px] top-[462px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.24px]">Group Events</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex items-center justify-center left-[calc(33.33%+36px)] px-[16px] py-[4px] rounded-[999px] top-[462px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.24px]">Marathon</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex items-center justify-center left-[calc(41.67%+30px)] px-[16px] py-[4px] rounded-[999px] top-[462px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.24px]">Fun Run</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex items-center justify-center left-[calc(50%+15px)] px-[16px] py-[4px] rounded-[999px] top-[462px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.24px]">Dumaguete Marathon</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex items-center justify-center left-[calc(66.67%-24px)] px-[16px] py-[4px] rounded-[999px] top-[462px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.24px]">Pickleball</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex items-center justify-center left-[calc(75%-31px)] px-[16px] py-[4px] rounded-[999px] top-[462px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.24px]">Pickleball</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute left-[calc(41.67%+2px)] size-[20px] top-[153px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.pd7af300} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[calc(33.33%+94px)] top-[151px]" data-name="Group">
      <div className="absolute bg-[#c9f9e2] border border-[#9ed1c8] border-solid h-[24px] left-[calc(33.33%+94px)] rounded-[999px] top-[151px] w-[214px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(41.67%+28px)] not-italic text-[#177564] text-[12px] top-[156px] tracking-[-0.24px]">Discover Amazing Adventures</p>
      <Frame10 />
    </div>
  );
}

function Logo() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-558px)] size-[36px] top-[26px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute left-[1080px] size-[20px] top-[31px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <g id="Group">
            <g id="Vector" />
            <path clipRule="evenodd" d={svgPaths.p1e888380} fill="var(--fill-0, #177564)" fillRule="evenodd" id="Vector_2" />
          </g>
          <circle cx="15" cy="4" fill="var(--fill-0, #FF0000)" id="Ellipse" r="4" />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute left-[1116px] size-[20px] top-[31px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p7633d00} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute left-[958px] size-[20px] top-[30px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p1a637000} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[958px] top-[30px]" data-name="Group">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[984px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">My Tickets</p>
      <Frame14 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[24px] top-[26px]" data-name="Group">
      <Logo />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[66px] not-italic text-[#1e9680] text-[20px] top-[29px] tracking-[-0.4px]">PlanOut</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[338px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">Events</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[410px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">Support</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[205px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">Home</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[272px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">About</p>
      <div className="absolute left-[1152px] size-[24px] top-[29px]" data-name="Ellipse">
        <img alt="" className="block max-w-none size-full" height="24" src={imgEllipse} width="24" />
      </div>
      <Frame12 />
      <Frame13 />
      <Group4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(255,255,255,0.6)] h-[81px] left-0 overflow-clip rounded-[12px] top-px w-[1200px]" data-name="Frame">
      <Group3 />
    </div>
  );
}

function Group5() {
  return (
    <div className="relative shrink-0 size-[64px]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g id="Group">
          <circle cx="32" cy="32" fill="var(--fill-0, #DEF2EE)" id="Ellipse" r="32" />
          <g id="Group_2">
            <path d={svgPaths.p3ea50380} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p24b0ab40} id="Vector_2" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[1.4] not-italic relative shrink-0 text-black tracking-[-0.48px] w-full" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[24px]">You’ve finished!</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[16px] w-[331px] whitespace-pre-wrap">Leave a quick review before downloading your certificate.</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Frame">
          <path d={svgPaths.p3dc90e00} fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector" />
          <path d={svgPaths.p30698c00} id="Vector_2" stroke="var(--stroke-0, #D5D7DA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Frame">
          <path d={svgPaths.p3dc90e00} fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector" />
          <path d={svgPaths.p30698c00} id="Vector_2" stroke="var(--stroke-0, #D5D7DA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame22() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Frame">
          <path d={svgPaths.p3dc90e00} fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector" />
          <path d={svgPaths.p30698c00} id="Vector_2" stroke="var(--stroke-0, #D5D7DA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Frame">
          <path d={svgPaths.p3dc90e00} fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector" />
          <path d={svgPaths.p30698c00} id="Vector_2" stroke="var(--stroke-0, #D5D7DA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame24() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Frame">
          <path d={svgPaths.p3dc90e00} fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector" />
          <path d={svgPaths.p30698c00} id="Vector_2" stroke="var(--stroke-0, #D5D7DA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-center flex flex-wrap gap-[11px_3px] items-center relative shrink-0 w-[228px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[12px] text-black tracking-[-0.24px] w-[228px] whitespace-pre-wrap">How was your experience?</p>
      <Frame20 />
      <Frame21 />
      <Frame22 />
      <Frame23 />
      <Frame24 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame19 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-full" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[14px] py-[10px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal h-full leading-[24px] min-h-px min-w-px not-italic relative text-[#7d8490] text-[16px] whitespace-pre-wrap">Enter a description...</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative w-full" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#414651] text-[14px]">Description</p>
      <Frame26 />
    </div>
  );
}

function TextareaInputFieldBase() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative w-full" data-name="_Textarea input field base">
      <Frame25 />
    </div>
  );
}

function TextareaInputField() {
  return (
    <div className="content-stretch flex flex-col h-[154px] items-start relative shrink-0 w-full" data-name="Textarea input field">
      <TextareaInputFieldBase />
    </div>
  );
}

function UploadCloud() {
  return (
    <div className="absolute left-[10px] size-[20px] top-[10px]" data-name="upload-cloud">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_34_6190)" id="upload-cloud">
          <path d={svgPaths.p13a84280} id="Vector" stroke="var(--stroke-0, #535862)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_34_6190">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function FeaturedIcon() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[28px] shrink-0 size-[40px]" data-name="Featured icon">
      <div aria-hidden="true" className="absolute border-6 border-[#fafafa] border-solid inset-[-3px] pointer-events-none rounded-[31px]" />
      <UploadCloud />
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="_Button base">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#177564] text-[14px]">Click to upload</p>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Button">
      <ButtonBase />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[4px] items-start justify-center relative shrink-0 w-full" data-name="Frame">
      <Button />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#535862] text-[14px]">or drag and drop</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full" data-name="Frame">
      <Frame30 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#535862] text-[12px] text-center w-full whitespace-pre-wrap">SVG, PNG, JPG or GIF (max. 800x400px)</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full" data-name="Frame">
      <FeaturedIcon />
      <Frame29 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="bg-white col-1 content-stretch flex flex-col items-center ml-0 mt-[28px] px-[24px] py-[16px] relative rounded-[8px] row-1 w-[360px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame28 />
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full" data-name="Group">
      <p className="col-1 font-['Inter:Medium',sans-serif] font-medium ml-0 mt-0 not-italic relative row-1 text-[#414651] text-[16px] tracking-[-0.48px] w-[52.15px] whitespace-pre-wrap">
        <span className="leading-[1.4]">{`Waiver `}</span>
        <span className="leading-[1.4] text-[#fec84b]">*</span>
      </p>
      <Frame27 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[9px] items-start leading-[1.2] not-italic relative shrink-0 text-[12px] tracking-[-0.24px] w-[229px] whitespace-pre-wrap" data-name="Frame">
      <p className="relative shrink-0 text-black w-full">Make my review public</p>
      <p className="relative shrink-0 text-[#b5bcc9] w-full">Help others discover this event</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="h-[18px] relative shrink-0 w-[32.195px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.1945 18">
        <g id="Frame">
          <rect fill="var(--fill-0, #D9D9D9)" height="18" rx="9" width="32.1945" />
          <ellipse cx="9.04255" cy="9" fill="var(--fill-0, #F7F9FF)" id="Ellipse" rx="7.04255" ry="7" />
        </g>
      </svg>
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-[#f8f9fb] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative w-full">
          <Frame32 />
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col h-[680px] items-start justify-between relative shrink-0 w-full" data-name="Frame">
      <Group5 />
      <Frame17 />
      <Frame18 />
      <TextareaInputField />
      <Group6 />
      <Frame31 />
    </div>
  );
}

function ButtonBase1() {
  return (
    <div className="bg-[#1e9680] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="_Button base">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[10px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-white">Confirm</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#1e9680] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-start relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <ButtonBase1 />
    </div>
  );
}

function ButtonBase2() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="_Button base">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[10px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#414651] text-[16px]">Cancel</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex items-start relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <ButtonBase2 />
    </div>
  );
}

function ModalActions() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="_Modal actions">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="relative shrink-0 size-[19.2px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <g id="material-symbols:close-rounded">
          <path d={svgPaths.p19013a00} fill="var(--fill-0, #125B4E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center p-[2px] relative rounded-[12px] shrink-0 size-[24px]" data-name="Frame">
      <Frame36 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="absolute bg-[#e9f6f4] content-stretch flex items-center justify-between left-0 overflow-clip px-[16px] py-[12px] top-0 w-[408px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px]">Submit a Review</p>
      <Frame35 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white content-stretch flex flex-col gap-[32px] items-center left-1/2 overflow-clip pb-[24px] pt-[56px] px-[24px] rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] top-[calc(50%-0.5px)] w-[408px]" data-name="Frame">
      <Frame16 />
      <ModalActions />
      <Frame34 />
    </div>
  );
}

export default function HomeNotificationSubmitAReview() {
  return (
    <div className="bg-white relative size-full" data-name="Home // Notification // Submit A Review">
      <div className="absolute left-[-198px] size-[846px] top-[-266px]" data-name="Ellipse">
        <div className="absolute inset-[-14.18%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1086 1086">
            <g filter="url(#filter0_f_34_6221)" id="Ellipse">
              <circle cx="543" cy="543" fill="var(--fill-0, #F3FDFB)" r="423" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1086" id="filter0_f_34_6221" width="1086" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_34_6221" stdDeviation="60" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[calc(41.67%+15px)] size-[846px] top-[418px]" data-name="Ellipse">
        <div className="absolute inset-[-14.18%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1086 1086">
            <g filter="url(#filter0_f_34_6213)" id="Ellipse">
              <circle cx="543" cy="543" fill="var(--fill-0, #F3FDFB)" r="423" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1086" id="filter0_f_34_6213" width="1086" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_34_6213" stdDeviation="60" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute h-[200px] left-[calc(83.33%+21px)] top-[-37px] w-[230px]" data-name="Ellipse">
        <div className="absolute inset-[-75%_-65.22%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 530 500">
            <g filter="url(#filter0_f_34_6211)" id="Ellipse">
              <ellipse cx="265" cy="250" fill="var(--fill-0, #F4FDFB)" rx="115" ry="100" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="500" id="filter0_f_34_6211" width="530" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_34_6211" stdDeviation="75" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] left-[calc(50%-317px)] not-italic text-[#121212] text-[47px] top-[179px] tracking-[-0.94px]">What’s your next adventure?</p>
      <Group />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(50%-51px)] not-italic text-[#121212] text-[12px] top-[432px] tracking-[-0.24px]">Popular searches:</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(50%-164px)] not-italic text-[#b5bcc9] text-[12px] top-[508px] tracking-[-0.24px]">Join thousands of people discovering amazing experiences.</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(50%-252px)] not-italic text-[#121212] text-[20px] top-[266px] tracking-[-0.4px]">Discover and experience your next unforgettable event</p>
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Group2 />
      <Frame11 />
      <Frame15 />
    </div>
  );
}