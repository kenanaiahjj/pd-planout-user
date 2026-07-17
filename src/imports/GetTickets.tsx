import svgPaths from "./svg-l5aczhw826";

function Heading() {
  return (
    <div className="h-[28px] relative shrink-0 w-[98.695px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#177564] text-[18px] top-0">Get Tickets</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white flex-[1_0_0] h-[23px] min-h-px min-w-px relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[28px] not-italic text-[#177564] text-[10px] text-center top-[4.5px]">Guided</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[23px] relative rounded-[8px] shrink-0 w-[37.633px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[19px] not-italic text-[10px] text-[rgba(23,117,100,0.6)] text-center top-[4.5px]">List</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] flex-[1_0_0] h-[27px] min-h-px min-w-px relative rounded-[10px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pt-[2px] px-[2px] relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[27px] relative shrink-0 w-[100px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#e9f6f4] h-[60px] relative shrink-0 w-[460px]" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
        <Heading />
        <Container />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[22.398px] left-0 top-0 w-[412px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[#181d27] text-[16px] top-[-1px] tracking-[-0.48px]">{`Let's find the perfect tickets for you:`}</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[76.484px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-[38px] not-italic text-[13px] text-center text-white top-px tracking-[0.325px] uppercase">Get Started</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-center left-0 px-[19px] py-[11px] rounded-[8px] top-[38px] w-[412px]" data-name="Button" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 412 48\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(6.065e-7 -2.4 20.6 7.066e-8 206 24)\\'><stop stop-color=\\'rgba(255,255,255,0)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(255,255,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <Text />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[86.398px] relative shrink-0 w-full" data-name="Container">
      <Paragraph />
      <Button2 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[460px]" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pt-[24px] px-[24px] relative rounded-[inherit] size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[15px] relative shrink-0 w-[87.133px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.5px] tracking-[0.5px] uppercase">Total Amount</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[27.789px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[0.5px] not-italic text-[#177564] text-[20px] top-[-0.2px] w-[32px] whitespace-pre-wrap">₱0</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[43px] relative shrink-0 w-[87.133px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text1 />
        <Text2 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_34_2489)" id="Icon">
          <path d={svgPaths.p3dc49580} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 9H12" id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 6V12" id="Vector_3" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_34_2489">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[92.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-[46.5px] not-italic text-[#d1d5dc] text-[13px] text-center top-px tracking-[0.325px] uppercase">Add to Cart</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f9fafb] col-1 content-stretch flex gap-[8px] items-center justify-center justify-self-stretch p-px relative rounded-[12px] row-1 self-stretch shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[76.484px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-[38.5px] not-italic text-[#99a1af] text-[13px] text-center top-px tracking-[0.325px] uppercase">Checkout</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M6.75 13.5L11.25 9L6.75 4.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f3f4f6] col-2 content-stretch flex gap-[8px] items-center justify-center justify-self-stretch relative rounded-[12px] row-1 self-stretch shrink-0" data-name="Button">
      <Text4 />
      <Icon1 />
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[412px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] relative size-full">
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[107px] items-start relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-white h-[140px] relative shrink-0 w-[460px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.05)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[17px] px-[24px] relative size-full">
        <Container4 />
      </div>
    </div>
  );
}

export default function GetTickets() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] size-full" data-name="GetTickets">
      <Header />
      <MainContent />
      <Container3 />
    </div>
  );
}