import svgPaths from "./svg-9vq42dget7";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgImageCover from "figma:asset/42dc5919595bba34125ab191d040552aeef17365.png";
import imgEllipse from "figma:asset/abde7b942aa982263d4cf69ea8ef217b427c3047.png";
import imgImageEvent from "figma:asset/9dd246725291ca31eadbba57f65fc35c16ef8f44.png";

function MdiCartOutline() {
  return (
    <div className="absolute left-[350px] size-[24px] top-[39px]" data-name="mdi:cart-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi:cart-outline">
          <path d={svgPaths.p17ad9c00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.34%_12.75%_0.77%_12.76%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.8763 21.8125">
        <g id="Group">
          <g id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p3dc12500} fill="var(--fill-0, #B5BCC9)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function MingcuteNotificationLine() {
  return (
    <div className="absolute left-[310px] overflow-clip size-[24px] top-[39px]" data-name="mingcute:notification-line">
      <Group />
    </div>
  );
}

function Logo() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-161px)] size-[36px] top-[33px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Group1() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%-120.5px)] top-[33px]">
      <Logo />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[58px] not-italic text-[#1e9680] text-[20px] top-[36px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function TopNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] h-[75px] left-0 overflow-clip top-0 w-[390px]" data-name="Top Nav">
      <MdiCartOutline />
      <MingcuteNotificationLine />
      <Group1 />
    </div>
  );
}

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
          <path d={svgPaths.p1f1ac800} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p7abe300} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] bottom-[30px] content-stretch flex items-end justify-center left-0 pt-[8px] px-[12px] w-[393px]" data-name="Menu List">
      <Menu />
      <Menu1 />
      <Menu2 />
      <Menu3 />
    </div>
  );
}

function BottomNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] h-[84px] left-0 overflow-clip rounded-[24px] top-[763px] w-[390px]" data-name="Bottom Nav">
      <IphoneIndicator />
      <MenuList />
    </div>
  );
}

function ImageCover() {
  return (
    <div className="absolute h-[200px] left-0 opacity-80 top-0 w-[390px]" data-name="Image (Cover)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageCover} />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p27b72080} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3a5e5a00} id="Vector_2" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] h-[32px] left-[236.57px] opacity-0 rounded-[8px] top-[152px] w-[125.43px]" data-name="Button">
      <Icon />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[75px] not-italic text-[#030213] text-[12px] text-center top-[9px]">Change Cover</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#0f172b] h-[200px] left-[-6px] overflow-clip top-0 w-[393px]" data-name="Container">
      <ImageCover />
      <Button />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-[156.59px] not-italic text-[#0f172b] text-[24px] text-center top-0 tracking-[0.0703px]">Jessica Sanchez</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[40px] relative shrink-0 w-[181px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[90.55px] not-italic text-[#096] text-[14px] text-center top-[0.5px] tracking-[-0.1504px] w-[93px] whitespace-pre-wrap">{`Trail Runner & Photographer`}</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[40px] relative shrink-0 w-[124px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[20px] left-[0.31px] not-italic text-[#6a7282] text-[14px] top-[3px] tracking-[-0.1504px] w-[103px] whitespace-pre-wrap">San Francisco, CA</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center justify-center relative shrink-0 w-full" data-name="Paragraph">
      <Text />
      <Text1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[314px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col h-[128px] items-start relative shrink-0 w-full" data-name="Container">
      <Container4 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[74px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-[156.5px] not-italic text-[#4a5565] text-[14px] text-center top-[-39px] tracking-[-0.1504px] w-[301px] whitespace-pre-wrap">{`Hey there! I'm Jessica, a trail runner and adventure photographer who believes the best stories are written with muddy boots and a racing heart. I've completed over 30 trail races including three ultra-marathons.`}</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[21.77px] not-italic text-[#0f172b] text-[18px] text-center top-0 tracking-[-0.4395px]">32</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex h-[16.5px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px] text-center tracking-[-0.1504px]">Events</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[48px] relative shrink-0 w-[43.203px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.5px] items-start relative size-full">
        <Text2 />
        <Text3 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[30.91px] not-italic text-[#0f172b] text-[18px] text-center top-0 tracking-[-0.4395px]">1.2k</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="content-stretch flex h-[16.5px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px] text-center tracking-[-0.1504px]">Followers</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[48px] relative shrink-0 w-[61.102px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.5px] items-start relative size-full">
        <Text4 />
        <Text5 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[30.84px] not-italic text-[#0f172b] text-[18px] text-center top-0 tracking-[-0.4395px]">850</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="content-stretch flex h-[16.5px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6a7282] text-[14px] text-center tracking-[-0.1504px]">Following</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[48px] relative shrink-0 w-[61.016px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.5px] items-start relative size-full">
        <Text6 />
        <Text7 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[48px] relative shrink-0 w-[314px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-start justify-center pr-[0.008px] relative size-full">
        <Container7 />
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pfec7400} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[16777200px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_33_793)" id="Icon">
          <path d={svgPaths.p1481ed80} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p38912740} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.668 4.33301H11.6746" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_33_793">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[16777200px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13492700} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[16777200px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3237880} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3839d600} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[36px] relative shrink-0 w-[168px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button1 />
        <Button2 />
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col h-[133px] items-center justify-between pt-[25px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <Container6 />
      <Container10 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[422.75px] items-start left-0 pt-[8px] top-[76px] w-[314px]" data-name="Container">
      <Container3 />
      <Paragraph1 />
      <Container5 />
    </div>
  );
}

function UserProfile1() {
  return (
    <div className="h-[498.75px] relative shrink-0 w-[314px]" data-name="UserProfile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container2 />
        <div className="-translate-x-1/2 absolute left-1/2 size-[140px] top-[-80px]" data-name="Ellipse">
          <img alt="" className="block max-w-none size-full" height="140" src={imgEllipse} width="140" />
        </div>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[490px] relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Card">
      <div className="content-stretch flex flex-col items-start pl-[16px] pt-[16px] relative size-full">
        <UserProfile1 />
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[#ecfdf5] col-1 h-[37px] justify-self-stretch relative rounded-[8px] row-1 shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#007a55] text-[14px] text-center tracking-[-0.1504px]">Events Attended</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="col-2 h-[37px] justify-self-stretch relative rounded-[8px] row-1 shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center tracking-[-0.1504px]">Certificates</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv1() {
  return (
    <div className="bg-white h-[48px] relative rounded-[10px] shrink-0 w-[346px]" data-name="Primitive.div">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] px-[5px] py-[5.5px] relative size-full">
        <PrimitiveButton />
        <PrimitiveButton1 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p22c5080} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[306px] p-px rounded-[8px] size-[40px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon5 />
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-white h-[40px] left-0 rounded-[8px] top-0 w-[298px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip pl-[36px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[16px] tracking-[-0.3125px]">Search...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2c1d9240} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[298px]" data-name="Container">
      <Input />
      <Icon6 />
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[40px] relative shrink-0 w-[346px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button5 />
        <Container12 />
      </div>
    </div>
  );
}

function UserProfile2() {
  return (
    <div className="h-[104px] relative shrink-0 w-[346px]" data-name="UserProfile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-between relative size-full">
        <PrimitiveDiv1 />
        <Container11 />
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[#ecfdf5] content-stretch flex h-[19px] items-center justify-center left-0 overflow-clip px-[8px] py-[2px] rounded-[8px] top-0 w-[62.852px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] tracking-[0.1172px]">Marathon</p>
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[#ecfdf5] content-stretch flex h-[19px] items-center justify-center left-[70.85px] overflow-clip px-[8px] py-[2px] rounded-[8px] top-0 w-[56.57px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] tracking-[0.1172px]">Outdoor</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Container">
      <Badge />
      <Badge1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#0f172b] text-[18px] top-0 tracking-[-0.4395px]">Canlaon Marathon 2025</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[55px] relative shrink-0 w-[206.703px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container17 />
        <Heading1 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p24f3a900} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3da01e00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3d251380} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container16 />
        <Button6 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66797 1.16699V3.50033" id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33203 1.16699V3.50033" id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1e824300} id="Vector_3" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83301H12.25" id="Vector_4" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[184.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Sunday, 4:00 AM - 12:00 PM</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Text8 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd8d4400} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pbd96b00} id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[266.43px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Canlaon City Sports Complex, Philippines</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Text9 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[48px] relative shrink-0 w-[304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container19 />
        <Container20 />
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[16px] left-[28px] overflow-clip top-[2px] w-[100.984px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">Intl. Athletics Org</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="bg-[#d0fae5] flex-[1_0_0] h-[18px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] not-italic relative shrink-0 text-[#007a55] text-[9px] tracking-[0.167px]">IA</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute left-0 rounded-[16777200px] size-[20px] top-0" data-name="Primitive.span">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Text11 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[20px] relative shrink-0 w-[128.984px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text10 />
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white h-[28px] relative rounded-[8px] shrink-0 w-[97.086px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#a4f4cf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#007a55] text-[12px] text-center">View Details</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[41px] relative shrink-0 w-[304px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-px relative size-full">
        <Container22 />
        <Button7 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[208px] items-start left-0 pl-[20px] py-[20px] top-[192px] w-[344px]" data-name="Container">
      <Container15 />
      <Container18 />
      <Container21 />
    </div>
  );
}

function ImageEvent() {
  return (
    <div className="absolute h-[192px] left-0 top-0 w-[344px]" data-name="Image (Event)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageEvent} />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] h-[24px] left-[8px] rounded-[4px] top-[8px] w-[59.617px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[8px] not-italic text-[#1d293d] text-[12px] top-[5px]">27 JUN</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[192px] left-0 overflow-clip top-0 w-[344px]" data-name="Container">
      <ImageEvent />
      <Container24 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[400px] relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container23 />
    </div>
  );
}

function EventCard() {
  return (
    <div className="bg-white h-[402px] relative rounded-[14px] shrink-0 w-full" data-name="EventCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container13 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[#ecfdf5] content-stretch flex h-[19px] items-center justify-center left-0 overflow-clip px-[8px] py-[2px] rounded-[8px] top-0 w-[62.852px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] tracking-[0.1172px]">Marathon</p>
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[#ecfdf5] content-stretch flex h-[19px] items-center justify-center left-[70.85px] overflow-clip px-[8px] py-[2px] rounded-[8px] top-0 w-[56.57px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] tracking-[0.1172px]">Outdoor</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Container">
      <Badge2 />
      <Badge3 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#0f172b] text-[18px] top-0 tracking-[-0.4395px]">Canlaon Marathon 2025</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[55px] relative shrink-0 w-[206.703px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container29 />
        <Heading2 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p24f3a900} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3da01e00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3d251380} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container28 />
        <Button8 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66797 1.16699V3.50033" id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33203 1.16699V3.50033" id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1e824300} id="Vector_3" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83301H12.25" id="Vector_4" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[184.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Sunday, 4:00 AM - 12:00 PM</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon11 />
      <Text12 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd8d4400} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pbd96b00} id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[266.43px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Canlaon City Sports Complex, Philippines</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon12 />
      <Text13 />
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[48px] relative shrink-0 w-[304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container31 />
        <Container32 />
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute h-[16px] left-[28px] overflow-clip top-[2px] w-[100.984px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">Intl. Athletics Org</p>
    </div>
  );
}

function Text15() {
  return (
    <div className="bg-[#d0fae5] flex-[1_0_0] h-[18px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] not-italic relative shrink-0 text-[#007a55] text-[9px] tracking-[0.167px]">IA</p>
      </div>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute left-0 rounded-[16777200px] size-[20px] top-0" data-name="Primitive.span">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Text15 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[20px] relative shrink-0 w-[128.984px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text14 />
        <PrimitiveSpan1 />
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-white h-[28px] relative rounded-[8px] shrink-0 w-[97.086px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#a4f4cf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#007a55] text-[12px] text-center">View Details</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[41px] relative shrink-0 w-[304px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-px relative size-full">
        <Container34 />
        <Button9 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[208px] items-start left-0 pl-[20px] py-[20px] top-[192px] w-[344px]" data-name="Container">
      <Container27 />
      <Container30 />
      <Container33 />
    </div>
  );
}

function ImageEvent1() {
  return (
    <div className="absolute h-[192px] left-0 top-0 w-[344px]" data-name="Image (Event)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageEvent} />
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] h-[24px] left-[8px] rounded-[4px] top-[8px] w-[59.617px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[8px] not-italic text-[#1d293d] text-[12px] top-[5px]">27 JUN</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[192px] left-0 overflow-clip top-0 w-[344px]" data-name="Container">
      <ImageEvent1 />
      <Container36 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[400px] relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container35 />
    </div>
  );
}

function EventCard1() {
  return (
    <div className="bg-white h-[402px] relative rounded-[14px] shrink-0 w-full" data-name="EventCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container25 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[#ecfdf5] content-stretch flex h-[19px] items-center justify-center left-0 overflow-clip px-[8px] py-[2px] rounded-[8px] top-0 w-[62.852px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] tracking-[0.1172px]">Marathon</p>
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[#ecfdf5] content-stretch flex h-[19px] items-center justify-center left-[70.85px] overflow-clip px-[8px] py-[2px] rounded-[8px] top-0 w-[56.57px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] tracking-[0.1172px]">Outdoor</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Container">
      <Badge4 />
      <Badge5 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#0f172b] text-[18px] top-0 tracking-[-0.4395px]">Canlaon Marathon 2025</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[55px] relative shrink-0 w-[206.703px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container41 />
        <Heading3 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p24f3a900} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3da01e00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3d251380} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container40 />
        <Button10 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66797 1.16699V3.50033" id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33203 1.16699V3.50033" id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1e824300} id="Vector_3" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83301H12.25" id="Vector_4" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[184.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Sunday, 4:00 AM - 12:00 PM</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon14 />
      <Text16 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd8d4400} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pbd96b00} id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[20px] relative shrink-0 w-[266.43px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Canlaon City Sports Complex, Philippines</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon15 />
      <Text17 />
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[48px] relative shrink-0 w-[304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container43 />
        <Container44 />
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute h-[16px] left-[28px] overflow-clip top-[2px] w-[100.984px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">Intl. Athletics Org</p>
    </div>
  );
}

function Text19() {
  return (
    <div className="bg-[#d0fae5] flex-[1_0_0] h-[18px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] not-italic relative shrink-0 text-[#007a55] text-[9px] tracking-[0.167px]">IA</p>
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="absolute left-0 rounded-[16777200px] size-[20px] top-0" data-name="Primitive.span">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Text19 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[20px] relative shrink-0 w-[128.984px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text18 />
        <PrimitiveSpan2 />
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-white h-[28px] relative rounded-[8px] shrink-0 w-[97.086px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#a4f4cf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#007a55] text-[12px] text-center">View Details</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[41px] relative shrink-0 w-[304px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-px relative size-full">
        <Container46 />
        <Button11 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[208px] items-start left-0 pl-[20px] py-[20px] top-[192px] w-[344px]" data-name="Container">
      <Container39 />
      <Container42 />
      <Container45 />
    </div>
  );
}

function ImageEvent2() {
  return (
    <div className="absolute h-[192px] left-0 top-0 w-[344px]" data-name="Image (Event)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageEvent} />
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] h-[24px] left-[8px] rounded-[4px] top-[8px] w-[59.617px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[8px] not-italic text-[#1d293d] text-[12px] top-[5px]">27 JUN</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute h-[192px] left-0 overflow-clip top-0 w-[344px]" data-name="Container">
      <ImageEvent2 />
      <Container48 />
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[400px] relative shrink-0 w-full" data-name="Container">
      <Container38 />
      <Container47 />
    </div>
  );
}

function EventCard2() {
  return (
    <div className="bg-white h-[402px] relative rounded-[14px] shrink-0 w-full" data-name="EventCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container37 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Badge6() {
  return (
    <div className="absolute bg-[#ecfdf5] content-stretch flex h-[19px] items-center justify-center left-0 overflow-clip px-[8px] py-[2px] rounded-[8px] top-0 w-[62.852px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] tracking-[0.1172px]">Marathon</p>
    </div>
  );
}

function Badge7() {
  return (
    <div className="absolute bg-[#ecfdf5] content-stretch flex h-[19px] items-center justify-center left-[70.85px] overflow-clip px-[8px] py-[2px] rounded-[8px] top-0 w-[56.57px]" data-name="Badge">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#007a55] text-[10px] tracking-[0.1172px]">Outdoor</p>
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[19px] relative shrink-0 w-full" data-name="Container">
      <Badge6 />
      <Badge7 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#0f172b] text-[18px] top-0 tracking-[-0.4395px]">Canlaon Marathon 2025</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[55px] relative shrink-0 w-[206.703px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container53 />
        <Heading4 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3e8a1080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a14b300} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa434100} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Container52 />
        <Button12 />
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66797 1.1665V3.49984" id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33203 1.1665V3.49984" id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[20px] relative shrink-0 w-[184.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Sunday, 4:00 AM - 12:00 PM</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon17 />
      <Text20 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p1a4be640} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p37b99980} id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[20px] relative shrink-0 w-[266.43px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px]">Canlaon City Sports Complex, Philippines</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon18 />
      <Text21 />
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[48px] relative shrink-0 w-[304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container55 />
        <Container56 />
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute h-[16px] left-[28px] overflow-clip top-[2px] w-[100.984px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">Intl. Athletics Org</p>
    </div>
  );
}

function Text23() {
  return (
    <div className="bg-[#d0fae5] flex-[1_0_0] h-[18px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[13.5px] not-italic relative shrink-0 text-[#007a55] text-[9px] tracking-[0.167px]">IA</p>
      </div>
    </div>
  );
}

function PrimitiveSpan3() {
  return (
    <div className="absolute left-0 rounded-[16777200px] size-[20px] top-0" data-name="Primitive.span">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Text23 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[20px] relative shrink-0 w-[128.984px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text22 />
        <PrimitiveSpan3 />
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-white h-[28px] relative rounded-[8px] shrink-0 w-[97.086px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#a4f4cf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#007a55] text-[12px] text-center">View Details</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[41px] relative shrink-0 w-[304px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-px relative size-full">
        <Container58 />
        <Button13 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[208px] items-start left-0 pl-[20px] py-[20px] top-[192px] w-[344px]" data-name="Container">
      <Container51 />
      <Container54 />
      <Container57 />
    </div>
  );
}

function ImageEvent3() {
  return (
    <div className="absolute h-[192px] left-0 top-0 w-[344px]" data-name="Image (Event)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageEvent} />
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] h-[24px] left-[8px] rounded-[4px] top-[8px] w-[59.617px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[8px] not-italic text-[#1d293d] text-[12px] top-[5px]">27 JUN</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute h-[192px] left-0 overflow-clip top-0 w-[344px]" data-name="Container">
      <ImageEvent3 />
      <Container60 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[400px] relative shrink-0 w-full" data-name="Container">
      <Container50 />
      <Container59 />
    </div>
  );
}

function EventCard3() {
  return (
    <div className="bg-white h-[402px] relative rounded-[14px] shrink-0 w-full" data-name="EventCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Container49 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f4f6] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function TabPanel() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[346px]" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <EventCard />
        <EventCard1 />
        <EventCard2 />
        <EventCard3 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] h-[1792px] items-start relative shrink-0 w-full" data-name="Primitive.div">
      <UserProfile2 />
      <TabPanel />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[2354.75px] items-start left-0 px-[16px] top-[136px] w-[378px]" data-name="Container">
      <Card />
      <PrimitiveDiv />
    </div>
  );
}

function UserProfile() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(249,250,251,0.3)] h-[2490.75px] left-1/2 top-[69px] w-[378px]" data-name="UserProfile">
      <Container />
      <Container1 />
    </div>
  );
}

export default function MobileProfileEventsAttended() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Mobile - Profile - Events Attended">
      <TopNav />
      <BottomNav />
      <UserProfile />
    </div>
  );
}