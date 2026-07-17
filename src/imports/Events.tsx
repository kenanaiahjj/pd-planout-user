import svgPaths from "./svg-qzrpbmqzs3";
import imgFrame from "figma:asset/a3c9070e03bcfba7e7998f75168d159af8192865.png";
import imgImage from "figma:asset/9dd246725291ca31eadbba57f65fc35c16ef8f44.png";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Frame">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[1.4] min-h-px min-w-px not-italic relative text-[#b5bcc9] text-[16px] tracking-[-0.48px] whitespace-pre-wrap">Explore events, courses, or organizer</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Frame2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame1 />
    </div>
  );
}

function InputFieldBase() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="_Input field base">
      <Frame />
    </div>
  );
}

function InputField() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[calc(25%+105px)] top-[125px] w-[484px]" data-name="Input field">
      <InputFieldBase />
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="_Button base" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 141 42\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.20000000298023224\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(2.0756e-7 -2.1 7.05 6.1828e-8 70.5 21)\'><stop stop-color=\'rgba(255,255,255,0)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,1)\' offset=\'1\'/></radialGradient></defs></svg>'), linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)" }}>
      <div className="content-stretch flex items-center justify-center overflow-clip px-[18px] py-[10px] relative rounded-[inherit]">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-white tracking-[-0.48px]">Search Events</p>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute backdrop-blur-[10px] content-stretch flex items-start left-[calc(83.33%-133.67px)] rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] top-[124px]" data-name="Button">
      <ButtonBase />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame} />
      <div className="h-[192.62px] relative rounded-[8px] shrink-0 w-[136.76px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#f9fafb] col-1 content-stretch flex items-end ml-[0.24px] mt-[147.76px] p-[8px] relative rounded-[8px] row-1 w-[380.067px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#b5bcc9] text-[12px] tracking-[-0.24px] w-[364.067px] whitespace-pre-wrap">{`Organized by: International Atheletics Organization of the World (Rated 4.5/5 ⭐)  `}</p>
    </div>
  );
}

function BadgeBase() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase />
    </div>
  );
}

function BadgeBase1() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge1() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase1 />
    </div>
  );
}

function BadgeBase2() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge2() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase2 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[237.303px]" data-name="Frame">
      <Badge />
      <Badge1 />
      <Badge2 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#121212] text-[20px] tracking-[-0.4px]">{`Canlaon Marathon `}</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 size-[24.169px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.1687 24.1689">
        <g id="Frame">
          <rect height="23.1689" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23.1687" x="0.5" y="0.5" />
          <path d={svgPaths.pf409e80} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Frame9 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17.12px] leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[231.055px] whitespace-pre-wrap">June 27, 2025 at 4:00 AM</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative shrink-0 size-[24.169px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.1687 24.1689">
        <g id="Frame">
          <rect height="23.1689" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23.1687" x="0.5" y="0.5" />
          <path d={svgPaths.p25b73a00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Frame11 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17.12px] leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[231.055px] whitespace-pre-wrap">Canlaon City, Philippines</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] h-[118.087px] items-start ml-0 mt-0 relative row-1 w-[269.481px]" data-name="Frame">
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame10 />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function EventCard() {
  return (
    <div className="absolute backdrop-blur-[10px] bg-white content-stretch flex gap-[24px] items-end left-[calc(25%+105px)] px-[20px] py-[24px] rounded-[8px] top-[262px] w-[655px]" data-name="Event Card">
      <div aria-hidden="true" className="absolute border border-[#def2ee] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)]" />
      <Frame3 />
      <Group />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame} />
      <div className="h-[192.62px] relative rounded-[8px] shrink-0 w-[136.76px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#f9fafb] col-1 content-stretch flex items-end ml-[0.24px] mt-[147.76px] p-[8px] relative rounded-[8px] row-1 w-[380.067px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#b5bcc9] text-[12px] tracking-[-0.24px] w-[364.067px] whitespace-pre-wrap">{`Organized by: International Atheletics Organization of the World (Rated 4.5/5 ⭐)  `}</p>
    </div>
  );
}

function BadgeBase3() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge3() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase3 />
    </div>
  );
}

function BadgeBase4() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge4() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase4 />
    </div>
  );
}

function BadgeBase5() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge5() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase5 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[237.303px]" data-name="Frame">
      <Badge3 />
      <Badge4 />
      <Badge5 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#121212] text-[20px] tracking-[-0.4px]">{`Canlaon Marathon `}</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="relative shrink-0 size-[24.169px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.1687 24.1689">
        <g id="Frame">
          <rect height="23.1689" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23.1687" x="0.5" y="0.5" />
          <path d={svgPaths.pf409e80} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Frame18 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17.12px] leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[231.055px] whitespace-pre-wrap">June 27, 2025 at 4:00 AM</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="relative shrink-0 size-[24.169px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.1687 24.1689">
        <g id="Frame">
          <rect height="23.1689" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23.1687" x="0.5" y="0.5" />
          <path d={svgPaths.p25b73a00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Frame20 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17.12px] leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[231.055px] whitespace-pre-wrap">Canlaon City, Philippines</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] h-[118.087px] items-start ml-0 mt-0 relative row-1 w-[269.481px]" data-name="Frame">
      <Frame15 />
      <Frame16 />
      <Frame17 />
      <Frame19 />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Frame13 />
      <Frame14 />
    </div>
  );
}

function EventCard1() {
  return (
    <div className="absolute backdrop-blur-[10px] bg-white content-stretch flex gap-[24px] items-end left-[calc(25%+106px)] px-[20px] py-[24px] rounded-[8px] top-[526.62px] w-[655px]" data-name="Event Card">
      <div aria-hidden="true" className="absolute border border-[#def2ee] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)]" />
      <Frame12 />
      <Group1 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame} />
      <div className="h-[192.62px] relative rounded-[8px] shrink-0 w-[136.76px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#f9fafb] col-1 content-stretch flex items-end ml-[0.24px] mt-[147.76px] p-[8px] relative rounded-[8px] row-1 w-[380.067px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#b5bcc9] text-[12px] tracking-[-0.24px] w-[364.067px] whitespace-pre-wrap">{`Organized by: International Atheletics Organization of the World (Rated 4.5/5 ⭐)  `}</p>
    </div>
  );
}

function BadgeBase6() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge6() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase6 />
    </div>
  );
}

function BadgeBase7() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge7() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase7 />
    </div>
  );
}

function BadgeBase8() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge8() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase8 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[237.303px]" data-name="Frame">
      <Badge6 />
      <Badge7 />
      <Badge8 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#121212] text-[20px] tracking-[-0.4px]">{`Canlaon Marathon `}</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="relative shrink-0 size-[24.169px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.1687 24.1689">
        <g id="Frame">
          <rect height="23.1689" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23.1687" x="0.5" y="0.5" />
          <path d={svgPaths.pf409e80} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Frame27 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17.12px] leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[231.055px] whitespace-pre-wrap">June 27, 2025 at 4:00 AM</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="relative shrink-0 size-[24.169px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.1687 24.1689">
        <g id="Frame">
          <rect height="23.1689" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23.1687" x="0.5" y="0.5" />
          <path d={svgPaths.p25b73a00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Frame29 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17.12px] leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[231.055px] whitespace-pre-wrap">Canlaon City, Philippines</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] h-[118.087px] items-start ml-0 mt-0 relative row-1 w-[269.481px]" data-name="Frame">
      <Frame24 />
      <Frame25 />
      <Frame26 />
      <Frame28 />
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Frame22 />
      <Frame23 />
    </div>
  );
}

function EventCard2() {
  return (
    <div className="absolute backdrop-blur-[10px] bg-white content-stretch flex gap-[24px] items-end left-[calc(25%+107px)] px-[20px] py-[24px] rounded-[8px] top-[791.24px] w-[655px]" data-name="Event Card">
      <div aria-hidden="true" className="absolute border border-[#def2ee] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)]" />
      <Frame21 />
      <Group2 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame} />
      <div className="h-[192.62px] relative rounded-[8px] shrink-0 w-[136.76px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-[#f9fafb] col-1 content-stretch flex items-end ml-[0.24px] mt-[147.76px] p-[8px] relative rounded-[8px] row-1 w-[380.067px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#b5bcc9] text-[12px] tracking-[-0.24px] w-[364.067px] whitespace-pre-wrap">{`Organized by: International Atheletics Organization of the World (Rated 4.5/5 ⭐)  `}</p>
    </div>
  );
}

function BadgeBase9() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge9() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase9 />
    </div>
  );
}

function BadgeBase10() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge10() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase10 />
    </div>
  );
}

function BadgeBase11() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Label</p>
    </div>
  );
}

function Badge11() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase11 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[237.303px]" data-name="Frame">
      <Badge9 />
      <Badge10 />
      <Badge11 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#121212] text-[20px] tracking-[-0.4px]">{`Canlaon Marathon `}</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="relative shrink-0 size-[24.169px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.1687 24.1689">
        <g id="Frame">
          <rect height="23.1689" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23.1687" x="0.5" y="0.5" />
          <path d={svgPaths.pf409e80} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Frame36 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17.12px] leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[231.055px] whitespace-pre-wrap">June 27, 2025 at 4:00 AM</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="relative shrink-0 size-[24.169px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.1687 24.1689">
        <g id="Frame">
          <rect height="23.1689" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23.1687" x="0.5" y="0.5" />
          <path d={svgPaths.p25b73a00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <Frame38 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17.12px] leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[231.055px] whitespace-pre-wrap">Canlaon City, Philippines</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] h-[118.087px] items-start ml-0 mt-0 relative row-1 w-[269.481px]" data-name="Frame">
      <Frame33 />
      <Frame34 />
      <Frame35 />
      <Frame37 />
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Frame31 />
      <Frame32 />
    </div>
  );
}

function EventCard3() {
  return (
    <div className="absolute backdrop-blur-[10px] bg-white content-stretch flex gap-[24px] items-end left-[calc(25%+108px)] px-[20px] py-[24px] rounded-[8px] top-[1055.86px] w-[655px]" data-name="Event Card">
      <div aria-hidden="true" className="absolute border border-[#def2ee] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)]" />
      <Frame30 />
      <Group3 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px]">Upcoming Events</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevron-down">
          <path d="M5 7.5L10 12.5L15 7.5" id="Vector" stroke="var(--stroke-0, #7D8490)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Frame41 />
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Frame">
      <Frame40 />
    </div>
  );
}

function SelectInputBase() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[calc(58.33%+24.33px)] top-[203px] w-[309px]" data-name="_Select input base">
      <Frame39 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px]">Location</p>
    </div>
  );
}

function ChevronDown1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevron-down">
          <path d="M5 7.5L10 12.5L15 7.5" id="Vector" stroke="var(--stroke-0, #7D8490)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Frame43() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Frame44 />
          <ChevronDown1 />
        </div>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Frame">
      <Frame43 />
    </div>
  );
}

function SelectInputBase1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[calc(25%+105px)] top-[203px] w-[322px]" data-name="_Select input base">
      <Frame42 />
    </div>
  );
}

function CheckboxBase() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="_Checkbox base">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <CheckboxBase />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px]">Sports</p>
    </div>
  );
}

function CheckboxBase1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="_Checkbox base">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <CheckboxBase1 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px]">Fitness</p>
    </div>
  );
}

function CheckboxBase2() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="_Checkbox base">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Frame">
      <CheckboxBase2 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px]">Adventure</p>
    </div>
  );
}

function CheckboxBase3() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="_Checkbox base">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Frame">
      <CheckboxBase3 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px]">Recreation</p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[122px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] min-w-full not-italic relative shrink-0 text-[#181d27] text-[16px] tracking-[-0.48px] w-[min-content] whitespace-pre-wrap">Category</p>
      <Frame47 />
      <Frame48 />
      <Frame49 />
      <Frame50 />
    </div>
  );
}

function CheckboxBase4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="_Checkbox base">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <CheckboxBase4 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px]">Indoor</p>
    </div>
  );
}

function CheckboxBase5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="_Checkbox base">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <CheckboxBase5 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px]">Outdoor</p>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[136px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] min-w-full not-italic relative shrink-0 text-[#181d27] text-[16px] tracking-[-0.48px] w-[min-content] whitespace-pre-wrap">Environment Type</p>
      <Frame52 />
      <Frame53 />
    </div>
  );
}

function CheckboxBase6() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="_Checkbox base">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Frame">
      <CheckboxBase6 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px]">Team-based</p>
    </div>
  );
}

function CheckboxBase7() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="_Checkbox base">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Frame">
      <CheckboxBase7 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px]">Individual/Solo</p>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] min-w-full not-italic relative shrink-0 text-[#181d27] text-[16px] tracking-[-0.48px] w-[min-content] whitespace-pre-wrap">Participation Type</p>
      <Frame55 />
      <Frame56 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[199px] top-[203px] w-[158px]" data-name="Frame">
      <Frame46 />
      <Frame51 />
      <Frame54 />
    </div>
  );
}

function Logo() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[36px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Logo />
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[42px] mt-[3px] not-italic relative row-1 text-[#1e9680] text-[20px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px]">Home</p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame61 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px]">Events</p>
    </div>
  );
}

function Frame62() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame63 />
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Frame">
      <Frame60 />
      <Frame62 />
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Group4 />
      <Frame59 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="relative shrink-0 size-[26px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="Frame">
          <path d={svgPaths.p1f1ac800} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p7abe300} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[8px] py-[7px] relative shrink-0" data-name="Frame">
      <Frame66 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px] whitespace-nowrap">
        <p className="leading-[1.4]">Login or Register</p>
      </div>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <Frame65 />
    </div>
  );
}

function Frame57() {
  return (
    <div className="backdrop-blur-[20px] content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-[1280px]" data-name="Frame">
      <Frame58 />
      <Frame64 />
    </div>
  );
}

function UserHeaderNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex flex-col items-center left-0 overflow-clip top-px w-[1280px]" data-name="User Header Nav">
      <Frame57 />
      <div className="h-px relative shrink-0 w-full" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1">
          <path clipRule="evenodd" d="M1280 1H0V0H1280V1Z" fill="var(--fill-0, #E9EAEB)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="h-px relative shrink-0 w-full" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1">
          <path clipRule="evenodd" d="M1280 1H0V0H1280V1Z" fill="var(--fill-0, #E9EAEB)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-center leading-[1.2] relative shrink-0 text-[#177564] text-[12px] tracking-[-0.24px] w-full" data-name="Frame">
      <p className="relative shrink-0">Privacy Policy</p>
      <p className="relative shrink-0">Terms of Service</p>
      <p className="relative shrink-0">Contact Us</p>
    </div>
  );
}

function Frame67() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[32px] content-stretch flex flex-col font-['Inter:Medium',sans-serif] font-medium gap-[16px] items-center left-[calc(50%-0.5px)] not-italic w-[353px]" data-name="Frame">
      <p className="leading-[1.4] relative shrink-0 text-[#b5bcc9] text-[14px] text-center tracking-[-0.28px] w-full whitespace-pre-wrap">© 2025 PlanOut. All right reserved</p>
      <Frame68 />
    </div>
  );
}

export default function Events() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Events">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none left-[199px] not-italic text-[36px] text-black top-[125px] tracking-[-0.72px]">Events</p>
      <InputField />
      <Button />
      <EventCard />
      <EventCard1 />
      <EventCard2 />
      <EventCard3 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(4.17%+146.67px)] not-italic text-[#b5bcc9] text-[16px] top-[608px] tracking-[-0.48px]">Clear All</p>
      <SelectInputBase />
      <SelectInputBase1 />
      <Frame45 />
      <UserHeaderNav />
      <Frame67 />
      <div className="-translate-x-1/2 absolute h-0 left-1/2 top-[1375px] w-[1170px]" data-name="Line">
        <div className="absolute inset-[-0.5px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1170 0.5">
            <line id="Line" stroke="var(--stroke-0, #E9E9E9)" strokeWidth="0.5" x2="1170" y1="0.25" y2="0.25" />
          </svg>
        </div>
      </div>
    </div>
  );
}