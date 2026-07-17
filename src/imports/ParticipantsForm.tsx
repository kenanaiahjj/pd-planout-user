import svgPaths from "./svg-0n59cia8wx";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgAvatar from "figma:asset/ce45a896d958cf406bb83c3c0a93e2f03fcb0bef.png";
import imgImage from "figma:asset/3ed8d5de26d5c2f012f8455cddf6ec2129e79ccf.png";

function Logo() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[36px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Group">
      <Logo />
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[42px] mt-[3px] not-italic relative row-1 text-[#1e9680] text-[20px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px]">Home</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#414651] text-[16px] tracking-[-0.48px]">Events</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame6 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Frame">
      <Frame3 />
      <Frame5 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Group />
      <Frame2 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 size-[26px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="Frame">
          <path d={svgPaths.p2fe25040} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#def2ee] content-stretch flex gap-[6px] items-center p-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame9 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px] whitespace-nowrap">
        <p className="leading-[1.4]">My Tickets</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Frame">
          <path d={svgPaths.p13e38a00} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Bell() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="bell">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="bell">
          <path d={svgPaths.p27e72a00} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-start overflow-clip p-[10px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Bell />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-name="Frame">
      <Frame11 />
      <Frame12 />
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative rounded-[200px] shrink-0 size-[40px]" data-name="Avatar">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[200px] size-full" src={imgAvatar} />
    </div>
  );
}

function Dropdown() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Dropdown">
      <Avatar />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Frame8 />
      <Frame10 />
      <Dropdown />
    </div>
  );
}

function Frame() {
  return (
    <div className="backdrop-blur-[20px] content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-[1280px]" data-name="Frame">
      <Frame1 />
      <Frame7 />
    </div>
  );
}

function UserHeaderNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex flex-col items-center left-0 overflow-clip top-px w-[1280px]" data-name="User Header Nav">
      <Frame />
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

function Group1() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Group">
          <circle cx="16" cy="16" fill="var(--fill-0, #DEF2EE)" id="Ellipse" r="16" />
          <g id="Frame">
            <path d="M22.2228 15.9995H9.77832" id="Line" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p360fff00} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Frame">
      <Group1 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none not-italic relative shrink-0 text-[36px] text-black tracking-[-0.72px]">Participant’s Form</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <div className="h-[236px] relative shrink-0 w-[140px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
    </div>
  );
}

function BadgeBase() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Adventure</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase />
    </div>
  );
}

function BadgeBase1() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Indoor</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase1 />
    </div>
  );
}

function BadgeBase2() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Team-based</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase2 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
      <Frame20 />
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p1cd63f00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="border border-[#def2ee] border-solid col-1 ml-0 mt-0 overflow-clip relative rounded-[8px] row-1 size-[40px]" data-name="Frame">
      <Frame24 />
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Group">
      <Frame23 />
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[44px] mt-[19px] not-italic relative row-1 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">4:00 AM GMT+8:00</p>
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[44px] mt-[2px] not-italic relative row-1 text-[#252b37] text-[14px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Friday, June 28, 2025</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p38f94c70} fill="var(--fill-0, #177564)" id="Vector" />
          <path d={svgPaths.pd25100} fill="var(--fill-0, #177564)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="border border-[#def2ee] border-solid col-1 ml-0 mt-0 overflow-clip relative rounded-[8px] row-1 size-[40px]" data-name="Frame">
      <Frame26 />
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Group">
      <Frame25 />
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[44px] mt-[18px] not-italic relative row-1 text-[#b5bcc9] text-[14px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Canlaon City</p>
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[44px] mt-px not-italic relative row-1 text-[#252b37] text-[14px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Capitol Building</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0" data-name="Frame">
      <Frame19 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[20px] text-black tracking-[-0.4px] w-[291px] whitespace-pre-wrap">Dumaguete Basketball League</p>
      <Group2 />
      <Group3 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[20px] items-start relative shrink-0" data-name="Frame">
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Frame">
          <path d="M4.66602 1.16602V3.49935" id="Line" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33398 1.16602V3.49935" id="Line_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pd9d1200} id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83398H12.25" id="Line_3" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#e7000b] text-[12px] top-px">Deadline: June 25, 2025</p>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-[#fef2f2] h-[32px] relative rounded-[16777200px] shrink-0 w-[188.711px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#ffe2e2] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-px relative size-full">
        <Frame32 />
        <Frame33 />
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-[138.383px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#414651] text-[14px] text-center tracking-[-0.1504px]">Add Participant</p>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="h-[36px] relative shrink-0 w-[818px]" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Frame31 />
        <Frame34 />
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="absolute h-[18px] left-[223.7px] top-[16px] w-[370.594px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#181d27] text-[12px] top-px tracking-[-0.24px] w-[371px] whitespace-pre-wrap">Progress: 0 completed, 0 sent to others, 0 to fill later, 5 incomplete</p>
    </div>
  );
}

function Frame38() {
  return <div className="bg-[#21a58d] h-[8px] rounded-[16777200px] shrink-0 w-full" data-name="Frame" />;
}

function Frame37() {
  return (
    <div className="absolute bg-[#e9eaeb] content-stretch flex flex-col h-[8px] items-start left-[16px] overflow-clip pr-[786px] rounded-[16777200px] top-[42px] w-[786px]" data-name="Frame">
      <Frame38 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[#f9fafb] h-[66px] relative rounded-[8px] shrink-0 w-[818px]" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Frame36 />
        <Frame37 />
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[37px] not-italic text-[12px] text-center text-white top-px w-[74px] whitespace-pre-wrap">Participant 1</p>
      </div>
    </div>
  );
}

function Frame43() {
  return <div className="bg-[#fec84b] rounded-[16777200px] shrink-0 size-[8px]" data-name="Frame" />;
}

function Frame41() {
  return (
    <div className="absolute bg-[#1e9680] content-stretch flex gap-[8px] h-[28px] items-center left-0 px-[10px] rounded-[8px] top-0 w-[109.813px]" data-name="Frame">
      <Frame42 />
      <Frame43 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[38px] not-italic text-[#181d27] text-[12px] text-center top-px w-[76px] whitespace-pre-wrap">Participant 2</p>
      </div>
    </div>
  );
}

function Frame46() {
  return <div className="bg-[#fec84b] rounded-[16777200px] shrink-0 size-[8px]" data-name="Frame" />;
}

function Frame44() {
  return (
    <div className="absolute bg-[#def2ee] content-stretch flex gap-[8px] h-[28px] items-center left-[117.81px] px-[10px] rounded-[8px] top-0 w-[111.422px]" data-name="Frame">
      <Frame45 />
      <Frame46 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[38px] not-italic text-[#181d27] text-[12px] text-center top-px w-[76px] whitespace-pre-wrap">Participant 3</p>
      </div>
    </div>
  );
}

function Frame49() {
  return <div className="bg-[#fec84b] rounded-[16777200px] shrink-0 size-[8px]" data-name="Frame" />;
}

function Frame47() {
  return (
    <div className="absolute bg-[#def2ee] content-stretch flex gap-[8px] h-[28px] items-center left-[237.23px] px-[10px] rounded-[8px] top-0 w-[111.719px]" data-name="Frame">
      <Frame48 />
      <Frame49 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[38px] not-italic text-[#181d27] text-[12px] text-center top-px w-[76px] whitespace-pre-wrap">Participant 4</p>
      </div>
    </div>
  );
}

function Frame52() {
  return <div className="bg-[#fec84b] rounded-[16777200px] shrink-0 size-[8px]" data-name="Frame" />;
}

function Frame50() {
  return (
    <div className="absolute bg-[#def2ee] content-stretch flex gap-[8px] h-[28px] items-center left-[356.95px] px-[10px] rounded-[8px] top-0 w-[111.93px]" data-name="Frame">
      <Frame51 />
      <Frame52 />
    </div>
  );
}

function Frame54() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[38px] not-italic text-[#181d27] text-[12px] text-center top-px w-[76px] whitespace-pre-wrap">Participant 5</p>
      </div>
    </div>
  );
}

function Frame55() {
  return <div className="bg-[#fec84b] rounded-[16777200px] shrink-0 size-[8px]" data-name="Frame" />;
}

function Frame53() {
  return (
    <div className="absolute bg-[#def2ee] content-stretch flex gap-[8px] h-[28px] items-center left-[476.88px] px-[10px] rounded-[8px] top-0 w-[111.641px]" data-name="Frame">
      <Frame54 />
      <Frame55 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Frame">
      <Frame41 />
      <Frame44 />
      <Frame47 />
      <Frame50 />
      <Frame53 />
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

function Frame58() {
  return (
    <div className="relative shrink-0" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative">
        <CheckboxBase />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[14px] tracking-[-0.28px]">Send Form to Email</p>
      </div>
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

function Frame59() {
  return (
    <div className="relative shrink-0" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative">
        <CheckboxBase1 />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[14px] tracking-[-0.28px]">Send All Form to Others</p>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[24px] h-[21px] items-center relative shrink-0 w-full" data-name="Frame">
      <Frame58 />
      <Frame59 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="absolute content-stretch flex h-[19px] items-start left-[84.19px] top-[2.5px] w-[7.305px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#fec84b] text-[16px] tracking-[-0.3125px]">*</p>
    </div>
  );
}

function Frame63() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#414651] text-[16px] top-[-0.5px] tracking-[-0.3125px]">First Name</p>
      <Frame64 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="h-[46px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[14px] py-[10px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)] tracking-[-0.3125px]">John</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame62() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[6px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Frame">
      <Frame63 />
      <Frame65 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="absolute content-stretch flex h-[19px] items-start left-[83.09px] top-[2.5px] w-[7.305px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#fec84b] text-[16px] tracking-[-0.3125px]">*</p>
    </div>
  );
}

function Frame67() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#414651] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Last Name</p>
      <Frame68 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="h-[46px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[14px] py-[10px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)] tracking-[-0.3125px]">Doe</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame66() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[6px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Frame">
      <Frame67 />
      <Frame69 />
    </div>
  );
}

function Frame61() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[76px] relative shrink-0 w-full" data-name="Frame">
      <Frame62 />
      <Frame66 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="absolute content-stretch flex h-[19px] items-start left-[54.48px] top-[2.5px] w-[7.305px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#fec84b] text-[16px] tracking-[-0.3125px]">*</p>
    </div>
  );
}

function Frame71() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#414651] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Waiver</p>
      <Frame72 />
    </div>
  );
}

function Frame75() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d="M10 10.834V17.5007" id="Line" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3fa3af40} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1fc17a00} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Frame74() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex items-center justify-center left-[389px] rounded-[16777200px] size-[40px] top-[17px]" data-name="Frame">
      <Frame75 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="absolute content-stretch flex h-[16.5px] items-start left-[104px] top-[2px] w-[108.234px]" data-name="Frame">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#535862] text-[14px] tracking-[-0.1504px]">or drag and drop</p>
    </div>
  );
}

function Frame76() {
  return (
    <div className="absolute h-[21px] left-[302.88px] top-[69px] w-[212.234px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#177564] text-[14px] top-0 tracking-[-0.1504px]">Click to upload</p>
      <Frame77 />
    </div>
  );
}

function Frame78() {
  return (
    <div className="absolute h-[18px] left-[293.07px] top-[94px] w-[231.852px]" data-name="Frame">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#535862] text-[12px] top-px">SVG, PNG, JPG or GIF (max. 800x400px)</p>
    </div>
  );
}

function Frame79() {
  return <div className="absolute h-[127px] left-px opacity-0 top-px w-[816px]" data-name="Frame" />;
}

function Frame73() {
  return (
    <div className="bg-white h-[129px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#e9eaeb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame74 />
      <Frame76 />
      <Frame78 />
      <Frame79 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[159px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame71 />
      <Frame73 />
    </div>
  );
}

function Frame80() {
  return (
    <div className="bg-gradient-to-b from-[#e7e7e7] h-[42px] relative rounded-[8px] shrink-0 to-[#cbcfd6] w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[409.85px] not-italic text-[#414651] text-[14px] text-center top-[11.5px] tracking-[-0.1504px]">Save Participant Info</p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[333px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame61 />
      <Frame70 />
      <Frame80 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[378px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame57 />
      <Frame60 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[818px]" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <Frame40 />
        <Frame56 />
      </div>
    </div>
  );
}

function Frame82() {
  return (
    <div className="absolute h-[18px] left-[388.76px] top-[107px] w-[40.477px]" data-name="Frame">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[20.5px] not-italic text-[#b5bcc9] text-[12px] text-center top-px">Cancel</p>
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="_Button base" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 818 42\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0.0000012042 -2.1 40.9 6.1828e-8 409 21)\\'><stop stop-color=\\'rgba(255,255,255,0)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(255,255,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(231, 231, 231) 0%, rgb(203, 207, 214) 100%)" }}>
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[10px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-white tracking-[-0.48px]">Submit Form</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex h-[42.05px] items-start relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <ButtonBase />
    </div>
  );
}

function Frame84() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Frame">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[409.63px] not-italic text-[#fb2c36] text-[12px] text-center top-px">* All participant forms must be completed or sent before submitting.</p>
    </div>
  );
}

function Frame83() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[66px] items-start left-0 top-[25px] w-[818px]" data-name="Frame">
      <Button />
      <Frame84 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="h-[125px] relative shrink-0 w-[818px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Frame82 />
        <Frame83 />
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[785px] items-center py-[24px] relative shrink-0 w-full" data-name="Frame">
      <Frame30 />
      <Frame35 />
      <Frame39 />
      <Frame81 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-white h-[787px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Frame29 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col h-[847px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame28 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div className="content-stretch flex flex-col gap-[17px] items-start p-[24px] relative w-full">
        <Frame16 />
        <Frame27 />
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[20px] items-start left-[calc(50%+0.5px)] top-[146px] w-[881px]" data-name="Frame">
      <Frame14 />
      <Frame15 />
    </div>
  );
}

export default function ParticipantsForm() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Participants Form">
      <UserHeaderNav />
      <Frame13 />
    </div>
  );
}