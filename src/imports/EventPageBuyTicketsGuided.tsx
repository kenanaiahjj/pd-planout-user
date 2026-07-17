import svgPaths from "./svg-nych56pmap";
import imgImage from "figma:asset/3ed8d5de26d5c2f012f8455cddf6ec2129e79ccf.png";
import imgOrganizationLogoOrStartupLogo from "figma:asset/02012253d5c314fe91ce5f1ba3d49752206fb92a.png";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";

function Text() {
  return <div className="bg-[#177564] opacity-92 rounded-[36164600px] shrink-0 size-[7.999px]" data-name="Text" />;
}

function Text1() {
  return (
    <div className="h-[16.487px] relative shrink-0 w-[103.838px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16.5px] left-0 not-italic text-[#177564] text-[11px] top-[0.08px] tracking-[0.3395px] uppercase">Featured Event</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.9)] content-stretch flex gap-[5.995px] h-[26.625px] items-center left-[16px] pl-[13.068px] pr-[1.078px] py-[1.078px] rounded-[36164600px] top-[16px] w-[143.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.078px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[36164600px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Text />
      <Text1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[#f3f4f6] h-[493.46px] left-0 overflow-clip rounded-[16px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.05),0px_8px_24px_0px_rgba(0,0,0,0.04)] top-0 w-[349.541px]" data-name="Container">
      <div className="-translate-x-1/2 absolute h-[494px] left-[calc(50%+0.5px)] rounded-[4px] top-[-0.29px] w-[505px]" data-name="image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
          <img alt="" className="absolute h-[148%] left-0 max-w-none top-[-43.56%] w-full" src={imgImage} />
        </div>
      </div>
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[494px] left-[-0.23px] top-[-0.29px] w-[350px]" data-name="Container">
      <Container2 />
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

function Badge() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Badge">
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

function Badge1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Badge">
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

function Badge2() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Badge">
      <BadgeBase2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 top-0">
      <Badge />
      <Badge1 />
      <Badge2 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[13.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9944 13.9944">
        <g clipPath="url(#clip0_34_1843)" id="Icon">
          <path d={svgPaths.p2ef54f00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1662" />
          <path d={svgPaths.pd5ff500} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1662" />
          <path d={svgPaths.pa78980} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1662" />
          <path d={svgPaths.p3b237580} id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1662" />
        </g>
        <defs>
          <clipPath id="clip0_34_1843">
            <rect fill="white" height="13.9944" width="13.9944" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[15.998px] relative shrink-0 w-[79.437px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#64748b] text-[12px]">124 attending</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[5.995px] h-[15.998px] items-center left-[3.99px] top-[38.62px] w-[99.426px]" data-name="Container">
      <Icon />
      <Text2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[54.614px] relative shrink-0 w-[349.541px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Frame />
        <Container7 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[70.393px] relative shrink-0 w-[349.541px]" data-name="Heading 1">
      <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[35.2px] left-0 not-italic text-[#181d27] text-[32px] top-[-0.16px] tracking-[-0.3938px] w-[272px] whitespace-pre-wrap">City Half Marathon 2025</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="organization logo or startup logo">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[4px]">
          <div className="absolute bg-[#f7f9f5] inset-0 rounded-[4px]" />
          <img alt="" className="absolute max-w-none object-cover rounded-[4px] size-full" src={imgOrganizationLogoOrStartupLogo} />
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#252b37] text-[10px] tracking-[-0.2px] w-[149px] whitespace-pre-wrap">{`International Athletics Organization of the World `}</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative">
        <Heading />
        <Frame5 />
      </div>
    </div>
  );
}

function MdiCalendar() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="mdi:calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi:calendar">
          <path d={svgPaths.p1cd63f00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute border border-[#def2ee] border-solid left-0 overflow-clip rounded-[8px] size-[40px] top-0">
      <MdiCalendar />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-0">
      <Frame2 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[44px] not-italic text-[#b5bcc9] text-[14px] top-[19px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">4:00 AM GMT+8:00</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[44px] not-italic text-[#252b37] text-[14px] top-[2px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Friday, June 27, 2025</p>
    </div>
  );
}

function EvaPinOutline() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="eva:pin-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="eva:pin-outline">
          <path d={svgPaths.p38f94c70} fill="var(--fill-0, #177564)" id="Vector" />
          <path d={svgPaths.pd25100} fill="var(--fill-0, #177564)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute border border-[#def2ee] border-solid left-0 overflow-clip rounded-[8px] size-[40px] top-[56px]">
      <EvaPinOutline />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-[56px]">
      <Frame1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[44px] not-italic text-[#b5bcc9] text-[14px] top-[74px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Canlaon City</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[44px] not-italic text-[#252b37] text-[14px] top-[57px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Capitol Building</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[96px] relative shrink-0 w-[350px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Group2 />
        <Group1 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-[350px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative w-full">
        <Container6 />
        <Frame6 />
        <Container8 />
      </div>
    </div>
  );
}

function Container9() {
  return <div className="bg-[#f3f4f6] h-[0.994px] shrink-0 w-[349.541px]" data-name="Container" />;
}

function Heading2() {
  return (
    <div className="absolute h-[26.995px] left-0 top-0 w-[349.541px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#181d27] text-[18px] top-[0.16px] tracking-[-0.4395px]">About Event</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative size-[15.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9985 15.9985">
        <g id="Icon">
          <path d={svgPaths.p3f7de00} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33321" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[19.99px] left-0 top-[218.98px] w-[91.915px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[36px] not-italic text-[#177564] text-[14px] text-center top-[0.08px] tracking-[-0.1504px]">Read More</p>
      <div className="absolute flex items-center justify-center left-[75.92px] size-[15.998px] top-[1.99px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "153.5" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <Icon1 />
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[152.979px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[25.5px] left-0 not-italic text-[#475569] text-[15px] top-[-0.77px] tracking-[-0.2344px] w-[348px] whitespace-pre-wrap">Experience the thrill of the City Half Marathon 2025, a premier event designed for enthusiasts and professionals alike. Organized by City Striders, this gathering promises an unforgettable atmosphere filled with energy, community, and excitement.</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[152.979px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[25.5px] left-0 not-italic text-[#475569] text-[15px] top-[-0.77px] tracking-[-0.2344px] w-[346px] whitespace-pre-wrap">Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[152.979px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[25.5px] left-0 not-italic text-[#475569] text-[15px] top-[-0.77px] tracking-[-0.2344px] w-[350px] whitespace-pre-wrap">Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Whether you are looking to challenge yourself or just have fun, this is the place to be.</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15.998px] h-[490.933px] items-start left-0 top-0 w-[349.541px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[159.984px] left-0 overflow-clip top-[42.99px] w-[349.541px]" data-name="Container">
      <Container12 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[238.966px] relative shrink-0 w-[349.541px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading2 />
        <Button />
        <Container11 />
      </div>
    </div>
  );
}

function Container14() {
  return <div className="absolute bg-[#f3f4f6] h-[0.994px] left-[196.73px] top-[13px] w-[152.81px]" data-name="Container" />;
}

function Heading3() {
  return (
    <div className="h-[26.995px] relative shrink-0 w-[349.541px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#181d27] text-[18px] top-[0.16px] tracking-[-0.4395px]">Event Requirements</p>
        <Container14 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9984 15.9984">
        <g id="Icon">
          <path d={svgPaths.p3e2f4700} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d="M10 3.84229V13.8413" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d="M6 2.15723V12.1563" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[36164600px] shrink-0 size-[31.997px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[19.99px] relative shrink-0 w-[106.331px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#475569] text-[14px] top-[0.08px] tracking-[-0.1504px]">View Route Map</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[11.99px] h-[58.133px] items-center left-0 pl-[13.068px] pr-[1.078px] py-[1.078px] rounded-[10px] top-0 w-[349.541px]" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#def2ee] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container16 />
      <Text3 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9984 15.9984">
        <g clipPath="url(#clip0_34_1830)" id="Icon">
          <path d={svgPaths.p3ce4da40} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d={svgPaths.p390d3a00} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d="M6.66524 5.99951H5.33203" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d="M10.6648 8.66602H5.33203" id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d="M10.6648 11.332H5.33203" id="Vector_5" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
        </g>
        <defs>
          <clipPath id="clip0_34_1830">
            <rect fill="white" height="15.9984" width="15.9984" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[36164600px] shrink-0 size-[31.997px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[19.99px] relative shrink-0 w-[114.027px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#475569] text-[14px] top-[0.08px] tracking-[-0.1504px]">Download Waiver</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[11.99px] h-[58.133px] items-center left-0 pl-[13.068px] pr-[1.078px] py-[1.078px] rounded-[10px] top-[70.12px] w-[349.541px]" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#def2ee] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container17 />
      <Text4 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9984 15.9984">
        <g clipPath="url(#clip0_34_1803)" id="Icon">
          <path d={svgPaths.p295b0280} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d={svgPaths.p3c5bfb00} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
        </g>
        <defs>
          <clipPath id="clip0_34_1803">
            <rect fill="white" height="15.9984" width="15.9984" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[36164600px] shrink-0 size-[31.997px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[19.99px] relative shrink-0 w-[116.166px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#475569] text-[14px] top-[0.08px] tracking-[-0.1504px]">Health Guidelines</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[11.99px] h-[58.133px] items-center left-0 pl-[13.068px] pr-[1.078px] py-[1.078px] rounded-[10px] top-[140.25px] w-[349.541px]" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#def2ee] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container18 />
      <Text5 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[198.381px] relative shrink-0 w-[349.541px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[241.374px] relative shrink-0 w-[349.541px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[15.998px] items-start relative size-full">
        <Heading3 />
        <Container15 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[26.995px] relative shrink-0 w-[61.047px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#181d27] text-[18px] top-[0.16px] tracking-[-0.4395px]">Gallery</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[15.998px] relative shrink-0 w-[60.592px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[#177564] text-[12px] tracking-[0.3px] uppercase">View All</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[26.995px] relative shrink-0 w-[349.541px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Heading4 />
        <Link3 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9969 31.9969">
        <g id="Icon">
          <path d={svgPaths.p39a9ee00} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
          <path d={svgPaths.p13ceb180} id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
          <path d={svgPaths.p217a5840} id="Vector_3" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[108.52px] top-0" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Container24() {
  return <div className="absolute bg-[rgba(0,0,0,0)] left-0 size-[108.52px] top-0" data-name="Container" />;
}

function Container22() {
  return (
    <div className="absolute bg-[#f3f4f6] left-0 overflow-clip rounded-[12px] size-[108.52px] top-0" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9969 31.9969">
        <g id="Icon">
          <path d={svgPaths.p39a9ee00} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
          <path d={svgPaths.p13ceb180} id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
          <path d={svgPaths.p217a5840} id="Vector_3" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
        </g>
      </svg>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[108.52px] top-0" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Container27() {
  return <div className="absolute bg-[rgba(0,0,0,0)] left-0 size-[108.52px] top-0" data-name="Container" />;
}

function Container25() {
  return (
    <div className="absolute bg-[#f3f4f6] left-[120.51px] overflow-clip rounded-[12px] size-[108.52px] top-0" data-name="Container">
      <Container26 />
      <Container27 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[31.997px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9969 31.9969">
        <g id="Icon">
          <path d={svgPaths.p39a9ee00} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
          <path d={svgPaths.p13ceb180} id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
          <path d={svgPaths.p217a5840} id="Vector_3" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66641" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 size-[108.52px] top-0" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Container30() {
  return <div className="absolute bg-[rgba(0,0,0,0)] left-0 size-[108.52px] top-0" data-name="Container" />;
}

function Container28() {
  return (
    <div className="absolute bg-[#f3f4f6] left-[241.02px] overflow-clip rounded-[12px] size-[108.52px] top-0" data-name="Container">
      <Container29 />
      <Container30 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[108.52px] relative shrink-0 w-[349.541px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container22 />
        <Container25 />
        <Container28 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[19.99px] relative shrink-0 w-[349.541px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[20px] left-0 text-[#94a3b8] text-[14px] top-[0.08px] tracking-[-0.1504px]">Past event photos provided by the organizer.</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[203.5px] relative shrink-0 w-[349.541px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[23.998px] items-start relative size-full">
        <Container20 />
        <Container21 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-[#f0fdf9] relative rounded-[12px] shrink-0 size-[47.995px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#def2ee] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.078px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[#177564] text-[20px] tracking-[-0.4492px]">C</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[15.005px] relative shrink-0 w-[65.863px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-0 not-italic text-[#64748b] text-[10px] top-[0.08px] tracking-[0.6172px] uppercase">Organizer</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[11.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9904 11.9904">
        <g clipPath="url(#clip0_34_1826)" id="Icon">
          <path d={svgPaths.p2af76580} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999201" />
          <path d={svgPaths.p215dc800} id="Vector_2" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999201" />
        </g>
        <defs>
          <clipPath id="clip0_34_1826">
            <rect fill="white" height="11.9904" width="11.9904" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[5.995px] h-[15.005px] items-center relative shrink-0 w-full" data-name="Container">
      <Text6 />
      <Icon8 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex h-[18.743px] items-start overflow-clip relative shrink-0 w-full" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[18.75px] min-h-px min-w-px not-italic relative text-[#181d27] text-[15px] tracking-[-0.2344px] whitespace-pre-wrap">City Striders</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[18.002px] relative shrink-0 w-[20.04px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-0 not-italic text-[#177564] text-[12px] top-[0.08px]">4.8</p>
      </div>
    </div>
  );
}

function Container39() {
  return <div className="bg-[#177564] rounded-[36164600px] shrink-0 size-[5.995px]" data-name="Container" />;
}

function Container40() {
  return <div className="bg-[#177564] rounded-[36164600px] shrink-0 size-[5.995px]" data-name="Container" />;
}

function Container41() {
  return <div className="bg-[#177564] rounded-[36164600px] shrink-0 size-[5.995px]" data-name="Container" />;
}

function Container42() {
  return <div className="bg-[#177564] rounded-[36164600px] shrink-0 size-[5.995px]" data-name="Container" />;
}

function Container43() {
  return <div className="bg-[#e2e8f0] rounded-[36164600px] shrink-0 size-[5.995px]" data-name="Container" />;
}

function Container38() {
  return (
    <div className="flex-[1_0_0] h-[5.995px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[1.987px] items-start relative size-full">
        <Container39 />
        <Container40 />
        <Container41 />
        <Container42 />
        <Container43 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[18.002px] relative shrink-0 w-[61.956px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3.991px] items-center relative size-full">
        <Text7 />
        <Container38 />
      </div>
    </div>
  );
}

function Text8() {
  return <div className="bg-[#cbd5e1] rounded-[36164600px] shrink-0 size-[3.991px]" data-name="Text" />;
}

function Text9() {
  return (
    <div className="h-[16.487px] relative shrink-0 w-[68.069px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[#64748b] text-[11px] top-[0.08px] tracking-[0.0645px]">Verified Host</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex gap-[7.999px] h-[18.002px] items-center relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Text8 />
      <Text9 />
    </div>
  );
}

function Container34() {
  return (
    <div className="flex-[1_0_0] h-[61.737px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.987px] items-start relative size-full">
        <Container35 />
        <Heading5 />
        <Container36 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[61.737px] relative shrink-0 w-[307.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[15.998px] items-start relative size-full">
        <Container33 />
        <Container34 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[42.118px] relative rounded-[10px] shrink-0 w-[307.406px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[153.95px] not-italic text-[#475569] text-[14px] text-center top-[11.14px] tracking-[-0.1504px]">Contact Organizer</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="bg-white h-[161.989px] relative rounded-[16px] shrink-0 w-[349.541px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#def2ee] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[15.998px] items-start pb-[1.078px] pl-[21.068px] pr-[1.078px] pt-[21.068px] relative size-full">
        <Container32 />
        <Button1 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[1393.128px] items-start left-0 pt-[7.999px] top-[509.71px] w-[349.541px]" data-name="Container">
      <Container5 />
      <Container9 />
      <Container10 />
      <Container13 />
      <Container19 />
      <Container31 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[2104.571px] left-[0.23px] top-[70.79px] w-[349.541px]" data-name="Container">
      <Container1 />
      <Container4 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9984 15.9984">
        <g id="Icon">
          <path d={svgPaths.p36f2a000} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d="M12.6664 7.99902H3.33398" id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="bg-white relative rounded-[36164600px] shrink-0 size-[31.997px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#def2ee] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[36164600px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.078px] relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[19.99px] relative shrink-0 w-[97.439px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[49px] not-italic text-[#b5bcc9] text-[14px] text-center top-[0.08px] tracking-[-0.1504px]">Back to Events</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[31.997px] relative shrink-0 w-[137.435px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.999px] items-center relative size-full">
        <Container45 />
        <Text10 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9984 15.9984">
        <g clipPath="url(#clip0_34_1815)" id="Icon">
          <path d={svgPaths.p1b8f9900} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d={svgPaths.pda61f80} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d={svgPaths.p16783200} id="Vector_3" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d={svgPaths.p25dbde80} id="Vector_4" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d={svgPaths.p47e71c0} id="Vector_5" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
        </g>
        <defs>
          <clipPath id="clip0_34_1815">
            <rect fill="white" height="15.9984" width="15.9984" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white relative rounded-[36164600px] shrink-0 size-[42px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#def2ee] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[36164600px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[13.068px] pr-[1.078px] py-[1.078px] relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9984 15.9984">
        <g clipPath="url(#clip0_34_1811)" id="Icon">
          <path d={svgPaths.p39a5d300} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
          <path d={svgPaths.p19b69600} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3332" />
        </g>
        <defs>
          <clipPath id="clip0_34_1811">
            <rect fill="white" height="15.9984" width="15.9984" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white flex-[1_0_0] h-[42px] min-h-px min-w-px relative rounded-[36164600px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#def2ee] border-[1.078px] border-solid inset-0 pointer-events-none rounded-[36164600px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[13.068px] pr-[1.078px] py-[1.078px] relative size-full">
          <Icon11 />
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-[96.26px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative w-full">
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bg-[rgba(249,250,251,0.8)] content-stretch flex h-[66px] items-center justify-between left-0 px-[15.998px] top-0 w-[350px]" data-name="Container">
      <Button2 />
      <Container46 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute h-[2255px] left-[16px] top-[61.5px] w-[350px]" data-name="Main Content">
      <Container />
      <Container44 />
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

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Logo />
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[43px] mt-[3px] not-italic relative row-1 text-[#1e9680] text-[20px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.34%_12.76%_0.77%_12.75%]" data-name="Group">
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
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="mingcute:notification-line">
      <Group />
    </div>
  );
}

function MdiCartOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mdi:cart-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi:cart-outline">
          <path d={svgPaths.p39263700} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0 w-[145px]">
      <MingcuteNotificationLine />
      <MdiCartOutline />
    </div>
  );
}

function TopNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex gap-[97px] items-center justify-center left-0 overflow-clip px-[14px] py-[6px] rounded-[12px] top-[3px] w-[381px]" data-name="Top Nav">
      <Group3 />
      <Frame4 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="flex-[1_0_0] h-[27.997px] min-h-px min-w-px relative" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#177564] text-[18px] top-[-0.31px]">Get Tickets</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[27.997px] relative shrink-0 w-[98.694px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Heading1 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-white h-[23.004px] left-[2px] rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-[2px] w-[54.984px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[26.99px] not-italic text-[#177564] text-[10px] text-center top-[4.08px]">Guided</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[23.004px] left-[56.98px] rounded-[8px] top-[2px] w-[37.622px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[18.99px] not-italic text-[10px] text-[rgba(23,117,100,0.6)] text-center top-[4.08px]">List</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[26.995px] relative rounded-[10px] shrink-0 w-[96.597px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button5 />
        <Button6 />
      </div>
    </div>
  );
}

function MaterialSymbolsCloseRounded() {
  return (
    <div className="relative shrink-0 size-[19.2px]" data-name="material-symbols:close-rounded">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <g id="material-symbols:close-rounded">
          <path d={svgPaths.p19013a00} fill="var(--fill-0, #125B4E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#def2ee] relative rounded-[12px] shrink-0 size-[24px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-end p-[2px] relative size-full">
        <MaterialSymbolsCloseRounded />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[26.995px] relative shrink-0 w-[159.69px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container50 />
        <Frame3 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[#e9f6f4] content-stretch flex h-[59.994px] items-center justify-between left-0 px-[23.998px] top-0 w-[361.397px]" data-name="Header">
      <Container48 />
      <Container49 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[22.398px] left-0 top-0 w-[313.401px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[#181d27] text-[16px] top-[-0.92px] tracking-[-0.48px]">{`Let's find the perfect tickets for you:`}</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute left-0 rounded-[8px] top-[38.4px] w-[313.401px]" data-name="Button" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 313.4 44\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(4.6136e-7 -2.2 15.67 6.4772e-8 156.7 22)\\'><stop stop-color=\\'rgba(255,255,255,0)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(255,255,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)" }}>
      <div className="content-stretch flex items-center justify-center overflow-clip px-[18px] py-[10px] relative rounded-[inherit] w-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Get Started</p>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[86.392px] relative shrink-0 w-full" data-name="Container">
      <Paragraph4 />
      <Button7 />
    </div>
  );
}

function MainContent1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[134.387px] items-start left-0 overflow-clip pt-[23.998px] px-[23.998px] top-[59.99px] w-[361.397px]" data-name="Main Content">
      <Container51 />
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[15.005px] relative shrink-0 w-[87.099px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-0 not-italic text-[#99a1af] text-[10px] top-[0.08px] tracking-[0.5px] uppercase">Total Amount</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[28px] relative shrink-0 w-[45px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#177564] text-[20px] top-[-0.54px] w-[45px] whitespace-pre-wrap">₱0</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[27.997px] relative shrink-0 w-[87.099px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Text12 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[43.002px] relative shrink-0 w-[87.099px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text11 />
        <Container56 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[43.002px] relative shrink-0 w-[313.401px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pr-[226.302px] relative size-full">
        <Container55 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[17.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.994 17.994">
        <g clipPath="url(#clip0_34_1791)" id="Icon">
          <path d={svgPaths.p7f1b700} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4995" />
          <path d="M5.99802 8.99702H11.996" id="Vector_2" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4995" />
          <path d="M8.99609 5.99805V11.9961" id="Vector_3" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4995" />
        </g>
        <defs>
          <clipPath id="clip0_34_1791">
            <rect fill="white" height="17.994" width="17.994" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[19.501px] relative shrink-0 w-[92.673px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-[46.5px] not-italic text-[#d1d5dc] text-[13px] text-center top-[0.62px] tracking-[0.325px] uppercase">Add to Cart</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex gap-[7.999px] h-[47.995px] items-center justify-center left-0 p-[0.539px] rounded-[12px] top-0 w-[150.697px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.539px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon12 />
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[19.501px] relative shrink-0 w-[76.473px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] left-[38.5px] not-italic text-[#99a1af] text-[13px] text-center top-[0.62px] tracking-[0.325px] uppercase">Checkout</p>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[17.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.994 17.994">
        <g id="Icon">
          <path d={svgPaths.p2b391780} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4995" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex gap-[7.999px] h-[47.995px] items-center justify-center left-[162.7px] pr-[0.008px] rounded-[12px] top-0 w-[150.705px]" data-name="Button">
      <Text14 />
      <Icon13 />
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[47.995px] relative shrink-0 w-[313.401px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col gap-[15.998px] h-[106.996px] items-start relative shrink-0 w-full" data-name="Container">
      <Container54 />
      <Container57 />
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[139.532px] items-start left-0 pt-[16.537px] px-[23.998px] top-[194.69px] w-[361.397px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-solid border-t-[0.539px] inset-0 pointer-events-none shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.05)]" />
      <Container53 />
    </div>
  );
}

function Container47() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white h-[333.913px] left-[calc(50%-0.3px)] overflow-clip rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] top-[calc(50%+0.46px)] w-[361.397px]" data-name="Container">
      <Header />
      <MainContent1 />
      <Container52 />
    </div>
  );
}

export default function EventPageBuyTicketsGuided() {
  return (
    <div className="bg-[#f8fafc] relative size-full" data-name="Event Page - Buy Tickets - Guided">
      <MainContent />
      <TopNav />
      <div className="absolute backdrop-blur-[4px] bg-[rgba(0,0,0,0.5)] h-[841px] left-0 top-0 w-[382px]" />
      <Container47 />
    </div>
  );
}