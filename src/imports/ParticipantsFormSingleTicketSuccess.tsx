import svgPaths from "./svg-qgxqel1uq1";
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
            <path d={svgPaths.p13e19a80} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

function Group2() {
  return (
    <div className="relative shrink-0 size-[320px]" data-name="Group">
      <div className="absolute inset-[-40.55%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 579.549 579.549">
          <g id="Group">
            <g filter="url(#filter0_f_39_6507)" id="Ellipse">
              <circle cx="289.774" cy="289.774" fill="var(--fill-0, #C1FFF1)" r="139.774" />
            </g>
            <circle cx="289.773" cy="289.774" fill="var(--fill-0, #EFFFF5)" id="Ellipse_2" r="154" stroke="var(--stroke-0, white)" strokeWidth="12" />
            <g id="Mask Group">
              <mask height="302" id="mask0_39_6507" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="302" x="139" y="139">
                <circle cx="289.772" cy="289.774" fill="var(--fill-0, white)" id="Ellipse_3" r="150.609" />
              </mask>
              <g mask="url(#mask0_39_6507)">
                <g id="Group_2">
                  <path d={svgPaths.p28eba700} fill="var(--fill-0, #4DB7A4)" id="Union" />
                  <g id="Mask Group_2">
                    <mask height="236" id="mask1_39_6507" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="243" x="165" y="219">
                      <path d={svgPaths.p28e3fd00} fill="var(--fill-0, #4D64DE)" id="Union_2" />
                    </mask>
                    <g mask="url(#mask1_39_6507)">
                      <rect fill="var(--fill-0, white)" height="78.0135" id="Rectangle" width="176.253" x="199.206" y="320.187" />
                      <path d={svgPaths.p3c339d00} fill="url(#paint0_linear_39_6507)" id="Vector" />
                      <path d={svgPaths.p32a6c5d0} fill="url(#paint1_linear_39_6507)" id="Vector_2" />
                      <path d={svgPaths.p2c927930} fill="var(--fill-0, #C8FFED)" id="Polygon" />
                    </g>
                  </g>
                  <g id="Rectangle_2">
                    <path d={svgPaths.p29231280} fill="var(--fill-0, white)" />
                    <path d={svgPaths.p29231280} fill="var(--fill-1, white)" />
                  </g>
                  <path d={svgPaths.p1da1fc00} fill="url(#paint2_linear_39_6507)" id="Subtract" />
                  <path d={svgPaths.pd167100} fill="url(#paint3_linear_39_6507)" id="Union_3" />
                </g>
              </g>
            </g>
            <g id="Group_3">
              <g filter="url(#filter1_f_39_6507)" id="Ellipse_4">
                <circle cx="382.233" cy="263.047" fill="var(--fill-0, #9ED1C8)" fillOpacity="0.5" r="35.0339" />
              </g>
              <circle cx="374.287" cy="255.102" fill="url(#paint4_linear_39_6507)" id="Ellipse_5" r="35.0339" />
              <g id="Bold Duotone / Map & Location / Map Arrow Up">
                <path clipRule="evenodd" d={svgPaths.p10ed600} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_3" />
                <path d={svgPaths.p1acb65b0} fill="var(--fill-0, #FFE8E8)" id="Vector_4" opacity="0.5" />
              </g>
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="579.549" id="filter0_f_39_6507" width="579.549" x="-5.72205e-06" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_39_6507" stdDeviation="75" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="150.068" id="filter1_f_39_6507" width="150.068" x="307.199" y="188.014">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_39_6507" stdDeviation="20" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_39_6507" x1="165.255" x2="263.494" y1="380.288" y2="380.288">
              <stop stopColor="#A2FFD2" />
              <stop offset="1" stopColor="#00B673" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_39_6507" x1="408.686" x2="305.39" y1="380.288" y2="380.288">
              <stop stopColor="#DAFFFE" />
              <stop offset="1" stopColor="#00B673" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_39_6507" x1="254.873" x2="254.873" y1="256.545" y2="288.328">
              <stop stopColor="#D1FFE6" />
              <stop offset="1" stopColor="#EEFFFC" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_39_6507" x1="241.097" x2="331.391" y1="338.892" y2="338.892">
              <stop stopColor="#B5FFC1" />
              <stop offset="1" stopColor="#66FFBF" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_39_6507" x1="374.287" x2="374.287" y1="220.068" y2="290.135">
              <stop stopColor="#98FFEC" />
              <stop offset="1" stopColor="#1E9680" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[229px]" data-name="_Button base" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 229 42\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(3.3711e-7 -2.1 11.45 6.1828e-8 114.5 21)\\'><stop stop-color=\\'rgba(255,255,255,0)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(255,255,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)" }}>
      <div className="content-stretch flex items-center justify-center overflow-clip px-[18px] py-[10px] relative rounded-[inherit] w-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-white tracking-[-0.48px]">Continue</p>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Frame">
      <ButtonBase />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[17px] items-center justify-center px-[24px] py-[32px] relative w-full">
          <Group2 />
          <div className="font-['Inter:Semi_Bold',sans-serif] font-semibold h-[27px] leading-[1.4] not-italic relative shrink-0 text-[20px] text-black text-center tracking-[-0.4px] w-[335px] whitespace-pre-wrap">
            <p className="mb-0">Invitation to complete forms sent!</p>
            <p>&nbsp;</p>
          </div>
          <div className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center tracking-[-0.48px] w-[393px] whitespace-pre-wrap">
            <p className="mb-0">Team members will be able to edit their info and complete the registration process.</p>
            <p>&nbsp;</p>
          </div>
          <Frame16 />
        </div>
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

export default function ParticipantsFormSingleTicketSuccess() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Participants Form - Single Ticket - Success">
      <UserHeaderNav />
      <Frame13 />
    </div>
  );
}