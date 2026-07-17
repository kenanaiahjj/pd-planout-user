import svgPaths from "./svg-sxqx566fdh";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgAvatar from "figma:asset/ce45a896d958cf406bb83c3c0a93e2f03fcb0bef.png";

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
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px]">Events</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
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
          <path d={svgPaths.p2fe25040} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[8px] py-[7px] relative shrink-0" data-name="Frame">
      <Frame9 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px] whitespace-nowrap">
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

export default function UserHeaderNav() {
  return (
    <div className="backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex flex-col items-center relative size-full" data-name="User Header Nav">
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