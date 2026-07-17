import svgPaths from "./svg-0se1hrtrmd";

function IphoneIndicator() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] bottom-0 h-[30px] left-0 w-[393px]" data-name="Iphone Indicator">
      <div className="-translate-x-1/2 absolute bg-[#b9c0c9] bottom-[8px] h-[5px] left-1/2 rounded-[100px] w-[135px]" data-name="Line" />
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-center min-h-px min-w-px relative" data-name="Menu 1">
      <div className="h-[24px] relative shrink-0 w-[22px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 24">
          <path d={svgPaths.p33b68ff0} fill="var(--fill-0, #177564)" id="Vector" />
        </svg>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] not-italic relative shrink-0 text-[#177564] text-[12px] tracking-[-0.24px]">Home</p>
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-center min-h-px min-w-px relative" data-name="Menu 2">
      <div className="h-[24px] relative shrink-0 w-[22px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 24">
          <path d={svgPaths.p23d8aa80} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </svg>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] not-italic relative shrink-0 text-[#b5bcc9] text-[12px] tracking-[-0.24px]">Events</p>
    </div>
  );
}

function Menu2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] h-[48px] items-center justify-end min-h-px min-w-px relative" data-name="Menu 4">
      <div className="h-[18.667px] relative shrink-0 w-[24px]" data-name="Vector">
        <div className="absolute inset-[-5.36%_-4.17%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 20.6667">
            <path d={svgPaths.p375dd8f2} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] not-italic relative shrink-0 text-[#b5bcc9] text-[12px] tracking-[-0.24px]">Tickets</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[26px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="Frame">
          <path d={svgPaths.p2829cff0} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p38e3f300} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Menu3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-center min-h-px min-w-px relative" data-name="Menu 5">
      <Frame />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] not-italic relative shrink-0 text-[#b5bcc9] text-[12px] tracking-[-0.24px]">Profile</p>
    </div>
  );
}

function MenuList() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] bottom-[30px] content-stretch flex items-end justify-center left-0 pt-[8px] px-[12px] w-[381px]" data-name="Menu List">
      <Menu />
      <Menu1 />
      <Menu2 />
      <Menu3 />
    </div>
  );
}

export default function BottomNav() {
  return (
    <div className="backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] overflow-clip relative rounded-tl-[24px] rounded-tr-[24px] size-full" data-name="Bottom Nav">
      <IphoneIndicator />
      <MenuList />
    </div>
  );
}