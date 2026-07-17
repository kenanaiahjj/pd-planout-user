import svgPaths from "./svg-1usd5vy3x3";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgPrimitiveImg from "figma:asset/53bd80f55573a725b754655d1ae653b287fc85d2.png";
import imgImagePromotion from "figma:asset/97763e1cb3d438f57d6493b8befc561d6633c7c6.png";

function MdiCartOutline() {
  return (
    <div className="absolute left-[350px] size-[24px] top-[39px]" data-name="mdi:cart-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi:cart-outline">
          <path d={svgPaths.p17ad9c00} fill="var(--fill-0, #B5BCC9)" id="Vector" />
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

function Group2() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%-120.5px)] top-[33px]">
      <Logo />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[58px] not-italic text-[#1e9680] text-[20px] top-[36px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function TopNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] h-[75px] left-0 overflow-clip rounded-[12px] top-0 w-[390px]" data-name="Top Nav">
      <MdiCartOutline />
      <MingcuteNotificationLine />
      <Group2 />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38727400} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2064800} id="Vector_2" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[#177564] h-[22px] left-[308.59px] rounded-[8px] top-[7px] w-[25.406px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white">2</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <Icon />
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[63.5px] not-italic text-[#177564] text-[14px] text-center top-[8.5px] tracking-[-0.1504px]">Inbox</p>
      <Badge />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23b556f0} id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22f9b280} id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66797 8H9.33464" id="Vector_3" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <Icon1 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[73.5px] not-italic text-[#45556c] text-[14px] text-center top-[8.5px] tracking-[-0.1504px]">Archived</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[80px] relative shrink-0 w-[346px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute capitalize font-['Inter:Bold',sans-serif] font-bold leading-[32px] left-0 not-italic text-[#0f172b] text-[24px] top-0 tracking-[0.0703px]">inbox</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#62748e] text-[14px] top-px tracking-[-0.1504px] w-[279px] whitespace-pre-wrap">Manage your inbox messages.</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[52px] items-start left-0 top-0 w-[195.18px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-white h-[36px] left-0 rounded-[8px] top-0 w-[346px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip pl-[36px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[16px] tracking-[-0.3125px]">Search messages...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2c1d9240} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[36px] left-0 top-[68px] w-[346px]" data-name="Container">
      <Input />
      <Icon2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[104px] left-0 top-0 w-[346px]" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[#f1f5f9] h-[25px] relative rounded-[14px] shrink-0 w-[65px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9px] py-[5px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#177564] text-[14px] text-center tracking-[-0.1504px]">All</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[9px] size-[16px] top-[4.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p81b480} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19a41e00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="h-[25px] relative rounded-[14px] shrink-0 w-[92px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[61px] not-italic text-[#0a0a0a] text-[14px] text-center top-[3px] tracking-[-0.1504px]">Invites</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[9px] size-[16px] top-[4.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_33_6061)" id="Icon">
          <path d={svgPaths.p2ef35c00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pffde80} fill="var(--fill-0, #0A0A0A)" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_33_6061">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="flex-[1_0_0] h-[25px] min-h-px min-w-px relative rounded-[14px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon4 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[65.86px] not-italic text-[#0a0a0a] text-[14px] text-center top-[2.5px] tracking-[-0.1504px]">Promotions</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[9px] size-[16px] top-[4.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cf27a00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p6414df0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="flex-[1_0_0] h-[25px] min-h-px min-w-px relative rounded-[14px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon5 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[56px] not-italic text-[#0a0a0a] text-[14px] text-center top-[3px] tracking-[-0.1504px]">Updates</p>
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="absolute bg-white content-stretch flex h-[36px] items-center justify-center left-0 p-px rounded-[14px] top-[128px] w-[363.289px]" data-name="Primitive.div">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PrimitiveButton />
      <PrimitiveButton1 />
      <PrimitiveButton2 />
      <PrimitiveButton3 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[23px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#0f172b] text-[14px] top-px tracking-[-0.1504px] w-[249px] whitespace-pre-wrap">International Athletics Organization</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] top-px">Today at 9:41 AM</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[43px] items-start left-0 top-0 w-[185px]" data-name="Container">
      <Heading2 />
      <Paragraph1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#1d293d] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Invitation to Co-Organize</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.83203 7H8.16536" id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.83203 4.66699H8.16536" id="Vector_2" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p5803000} id="Vector_3" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2c8ad200} id="Vector_4" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p115b9600} id="Vector_5" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[56.5px] leading-[20px] left-0 not-italic text-[14px] top-[1.5px] tracking-[-0.1504px] w-[188.305px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium left-0 text-[#0f172b] top-[17.5px] w-[189px] whitespace-pre-wrap">International Athletics Organization of the World</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-0 text-[#45556c] top-[-3.5px]">Organization:</p>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[60px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text1 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[8px] h-[60px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Text />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p191442a3} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p9aced80} id="Vector_2" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute content-stretch flex h-[16.5px] items-start left-[35.95px] top-[1.5px] w-[130.203px]" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#0f172b] text-[14px] tracking-[-0.1504px]">Co-Event Organizer</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[166.148px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#45556c] text-[14px] top-[0.5px] tracking-[-0.1504px]">Role:</p>
        <Text3 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon7 />
      <Text2 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[113.75px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[22.75px] left-0 text-[#45556c] text-[14px] top-px tracking-[-0.1504px] w-[217px] whitespace-pre-wrap">{`"Hi there! We'd love to have you on board to help us organize the upcoming Canlaon Marathon. Your experience would be a great addition to our team."`}</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#f8fafc] h-[251.75px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container11 />
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2c5f2a40} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[32px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] shrink-0 w-[96px]" data-name="Button" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 96 32\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(1.4132e-7 -1.6 4.8 4.7107e-8 48 16)\\'><stop stop-color=\\'rgba(255,255,255,0)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(255,255,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center px-[14px] py-[8px] relative size-full">
        <Icon8 />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[-0.1504px]">Accept</p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M12 4L4 12" id="Vector" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4L12 12" id="Vector_2" stroke="var(--stroke-0, #45556C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[101.211px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon9 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[66.5px] not-italic text-[#45556c] text-[14px] text-center top-[6.5px] tracking-[-0.1504px]">Decline</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[12px] h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[299.75px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container14 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[331.75px] items-start left-0 top-[60px] w-[253px]" data-name="Container">
      <Heading1 />
      <Container9 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[391.75px] left-[56px] top-0 w-[253px]" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function PrimitiveImg() {
  return (
    <div className="flex-[1_0_0] h-[38px] min-h-px min-w-px relative" data-name="Primitive.img">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPrimitiveImg} />
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute bg-white left-0 rounded-[16777200px] size-[40px] top-0" data-name="Primitive.span">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <PrimitiveImg />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function InboxContent1() {
  return (
    <div className="h-[391.75px] relative shrink-0 w-[309px]" data-name="InboxContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container6 />
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[433.75px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#177564] border-b border-l-4 border-r border-solid border-t inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col items-start pb-px pl-[20px] pr-px pt-[17px] relative size-full">
        <InboxContent1 />
      </div>
    </div>
  );
}

function Text4() {
  return <div className="absolute bg-[#177564] left-[144.49px] rounded-[16777200px] size-[8px] top-[6px]" data-name="Text" />;
}

function Heading3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#0f172b] text-[14px] top-[0.5px] tracking-[-0.1504px]">EventTech Solutions</p>
      <Text4 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] top-px">Yesterday</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-0 top-0 w-[152.492px]" data-name="Container">
      <Heading3 />
      <Paragraph2 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#1d293d] text-[16px] top-[-0.5px] tracking-[-0.3125px]">50% Off Premium Features</p>
    </div>
  );
}

function ImagePromotion() {
  return (
    <div className="h-[128px] relative shrink-0 w-full" data-name="Image (Promotion)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImagePromotion} />
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-[#f1f5f9] h-[128px] relative rounded-[10px] shrink-0 w-[253px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImagePromotion />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#45556c] text-[14px] top-[0.5px] tracking-[-0.1504px] w-[242px] whitespace-pre-wrap">Special offer for early adopters of the PlanOut platform.</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="bg-[#f1f5f9] flex-[1_0_0] h-[42px] min-h-px min-w-px relative rounded-[4px]" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[9px] not-italic text-[#0a0a0a] text-[12px] top-[5.5px] w-[82px] whitespace-pre-wrap">CODE: EARLYBIRD50</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[94.96px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33203 8H12.6654" id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p15a8fe00} id="Vector_2" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[20px] relative rounded-[8px] shrink-0 w-[120.961px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[47.5px] not-italic text-[#177564] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Claim Offer</p>
        <Icon10 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[8px] h-[42px] items-center relative shrink-0 w-full" data-name="Container">
      <Text5 />
      <Button4 />
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[253px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Paragraph3 />
        <Container21 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[238px] items-start relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container20 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[270px] items-start left-0 top-[40px] w-[253px]" data-name="Container">
      <Heading4 />
      <Container18 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[310px] left-[56px] top-0 w-[253px]" data-name="Container">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Text6() {
  return (
    <div className="bg-[#ecfdf5] flex-[1_0_0] h-[38px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.3125px]">ES</p>
      </div>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute bg-white left-0 rounded-[16777200px] size-[40px] top-0" data-name="Primitive.span">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Text6 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function InboxContent2() {
  return (
    <div className="h-[310px] relative shrink-0 w-[309px]" data-name="InboxContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container15 />
        <PrimitiveSpan1 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white h-[352px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#177564] border-b border-l-4 border-r border-solid border-t inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col items-start pb-px pl-[20px] pr-px pt-[17px] relative size-full">
        <InboxContent2 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="Heading 4">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#0f172b] text-[14px] tracking-[-0.1504px]">System</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] top-px">2 days ago</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-0 top-0 w-[61.398px]" data-name="Container">
      <Heading5 />
      <Paragraph4 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#1d293d] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Event Schedule Changed</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_33_6035)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #7B3306)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p86a8400} id="Vector_2" stroke="var(--stroke-0, #7B3306)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_33_6035">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#7b3306] text-[14px] top-[0.5px] tracking-[-0.1504px]">City Marathon</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#7b3306] text-[14px] top-[0.5px] tracking-[-0.1504px] w-[179px] whitespace-pre-wrap">Start time moved from 6:00 AM to 5:30 AM</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col h-[60px] items-start left-[41px] top-[13px] w-[199px]" data-name="Container">
      <Paragraph5 />
      <Paragraph6 />
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[#fffbeb] h-[86px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#fef3c6] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon11 />
      <Container26 />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[118px] items-start left-0 top-[40px] w-[253px]" data-name="Container">
      <Heading6 />
      <Container25 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[158px] left-[56px] top-0 w-[253px]" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Text7() {
  return (
    <div className="bg-[#ecfdf5] flex-[1_0_0] h-[38px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.3125px]">SY</p>
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="absolute bg-white left-0 rounded-[16777200px] size-[40px] top-0" data-name="Primitive.span">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Text7 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function InboxContent3() {
  return (
    <div className="h-[158px] relative shrink-0 w-[309px]" data-name="InboxContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container22 />
        <PrimitiveSpan2 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-[rgba(248,250,252,0.5)] h-[200px] opacity-90 relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-r border-solid border-t inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col items-start pb-px pl-[20px] pr-px pt-[17px] relative size-full">
        <InboxContent3 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[1017.75px] items-start left-0 top-[188px] w-[346px]" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[346px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container2 />
        <PrimitiveDiv />
        <Container5 />
      </div>
    </div>
  );
}

function InboxContent() {
  return (
    <div className="absolute bg-[rgba(249,250,251,0.5)] content-stretch flex flex-col gap-[32px] h-[1317.75px] items-start left-[17px] top-[134px] w-[346px]" data-name="InboxContent">
      <Container />
      <Container1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute left-[16.5px] size-[32px] top-[84px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Group 2067">
          <circle cx="16" cy="16" fill="var(--fill-0, #DEF2EE)" id="Ellipse 1504" r="16" />
          <g id="arrow-left">
            <path d="M22.2218 16H9.77734" id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p288a0b80} id="Vector_2" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Inbox() {
  return (
    <div className="bg-white relative size-full" data-name="Inbox">
      <TopNav />
      <InboxContent />
      <Group1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[61.5px] not-italic text-[24px] text-black top-[82px] tracking-[-0.48px] w-[313px] whitespace-pre-wrap">Inbox</p>
    </div>
  );
}