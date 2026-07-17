import svgPaths from "./svg-969ns6dgym";
import imgImage from "figma:asset/3ed8d5de26d5c2f012f8455cddf6ec2129e79ccf.png";
import imgRectangle from "figma:asset/02012253d5c314fe91ce5f1ba3d49752206fb92a.png";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgAvatar from "figma:asset/ce45a896d958cf406bb83c3c0a93e2f03fcb0bef.png";

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

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
      <Badge />
      <Badge1 />
      <Badge2 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.34%_12.76%_0.76%_12.75%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8969 18.1793">
        <g id="Group">
          <g id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p11065180} fill="var(--fill-0, #177564)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[20px] top-1/2" data-name="Frame">
      <Group1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white border border-[#177564] border-solid col-1 ml-0 mt-0 overflow-clip relative rounded-[8px] row-1 size-[32px]" data-name="Frame">
      <Frame3 />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Frame2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
      <Frame1 />
      <Group />
    </div>
  );
}

function Frame5() {
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

function Frame4() {
  return (
    <div className="absolute aspect-[36/36] bg-white border border-[#def2ee] border-solid left-0 overflow-clip right-[85.37%] rounded-[8px] top-0" data-name="Frame">
      <Frame5 />
    </div>
  );
}

function EventDetails() {
  return (
    <div className="h-[40px] relative shrink-0 w-[273.442px]" data-name="Event Details">
      <Frame4 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold inset-[47.5%_0_2.5%_16.09%] leading-[1.4] not-italic text-[#b5bcc9] text-[14px] tracking-[-0.28px] whitespace-pre-wrap">4:00 AM GMT+8:00</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold inset-[5%_0_45%_16.09%] leading-[1.4] not-italic text-[#252b37] text-[14px] tracking-[-0.28px] whitespace-pre-wrap">Friday, June 27, 2025</p>
    </div>
  );
}

function Frame7() {
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

function Frame6() {
  return (
    <div className="absolute bg-white border border-[#def2ee] border-solid left-0 overflow-clip rounded-[8px] size-[40px] top-0" data-name="Frame">
      <Frame7 />
    </div>
  );
}

function EventDetails1() {
  return (
    <div className="h-[40px] relative shrink-0 w-[273.442px]" data-name="Event Details">
      <Frame6 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[44px] not-italic text-[#b5bcc9] text-[14px] top-[18px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Canlaon City</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[44px] not-italic text-[#252b37] text-[14px] top-px tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Capitol Building</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p263e5000} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute bg-white border border-[#def2ee] border-solid left-0 overflow-clip rounded-[8px] size-[40px] top-0" data-name="Frame">
      <Frame9 />
    </div>
  );
}

function EventDetails2() {
  return (
    <div className="h-[40px] relative shrink-0 w-[273.442px]" data-name="Event Details">
      <Frame8 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[44px] not-italic text-[#b5bcc9] text-[14px] top-[18px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">June 15, 2025</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[44px] not-italic text-[#252b37] text-[14px] top-px tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Ticket Sales End On:</p>
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="_Button base" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\'0 0 423 42\' xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\'><rect x=\'0\' y=\'0\' height=\'100%\' width=\'100%\' fill=\'url(%23grad)\' opacity=\'0.20000000298023224\'/><defs><radialGradient id=\'grad\' gradientUnits=\'userSpaceOnUse\' cx=\'0\' cy=\'0\' r=\'10\' gradientTransform=\'matrix(6.2269e-7 -2.1 21.15 6.1828e-8 211.5 21)\'><stop stop-color=\'rgba(255,255,255,0)\' offset=\'0\'/><stop stop-color=\'rgba(255,255,255,1)\' offset=\'1\'/></radialGradient></defs></svg>'), linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)" }}>
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[10px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-white tracking-[-0.48px]">Buy Tickets</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Button() {
  return (
    <div className="backdrop-blur-[10px] content-stretch flex items-start min-w-[400px] relative rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Button">
      <ButtonBase />
    </div>
  );
}

function EventInfo() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[18px] items-start left-[calc(33.33%+127.09px)] top-[112px] w-[423px]" data-name="Event Info">
      <Frame />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[36px] text-black tracking-[-0.72px] w-[min-content] whitespace-pre-wrap">Canlaon Half Marathon (5K, 10K, 21K, 42K)</p>
      <EventDetails />
      <EventDetails1 />
      <EventDetails2 />
      <Button />
    </div>
  );
}

function EventImage() {
  return (
    <div className="absolute h-[464px] left-[200px] top-[112px] w-[330px]" data-name="Event Image">
      <div className="absolute inset-0 rounded-[8px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-start min-h-px min-w-px relative" data-name="Frame">
      <div className="relative rounded-[8px] shrink-0 size-[42px]" data-name="Rectangle">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
          <div className="absolute bg-[#f7f9f5] inset-0 rounded-[8px]" />
          <img alt="" className="absolute max-w-none object-cover rounded-[8px] size-full" src={imgRectangle} />
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#252b37] text-[14px] tracking-[-0.28px] w-[176px] whitespace-pre-wrap">{`International Athletics Organization of the World `}</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <div className="bg-[#def2ee] col-1 ml-0 mt-0 rounded-[8px] row-1 size-[42px]" data-name="Rectangle" />
      <div className="-translate-y-1/2 col-1 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[14.875px] justify-center ml-[6px] mt-[26.44px] not-italic relative row-1 text-[12px] text-black tracking-[-0.24px] w-[30.625px]">
        <p className="leading-[1.2] whitespace-pre-wrap">4.5/5</p>
      </div>
      <div className="-translate-y-1/2 col-1 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center ml-[6px] mt-[11px] not-italic relative row-1 text-[#177564] text-[10px] tracking-[-0.2px] whitespace-nowrap">
        <p className="leading-[1.2]">Rating</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
      <Frame12 />
      <Group2 />
    </div>
  );
}

function ButtonBase1() {
  return (
    <div className="backdrop-blur-[10px] bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="_Button base">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[14px] py-[8px] relative w-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[14px] tracking-[-0.28px]">Contact Organizer</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#177564] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)]" />
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

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative" data-name="Frame">
      <Frame11 />
      <Button1 />
    </div>
  );
}

function OrganizerBlock() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[32px] items-start left-[200px] top-[592px] w-[330px]" data-name="Organizer Block">
      <Frame10 />
    </div>
  );
}

function AboutBlock() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[28px] items-start left-[calc(33.33%+127.33px)] top-[522px] w-[436px]" data-name="About Block">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[20px] text-black tracking-[-0.4px] w-full whitespace-pre-wrap">About Event</p>
      <div className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.48px] w-full whitespace-pre-wrap">
        <p className="mb-0">{`Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. `}</p>
        <p className="mb-0">&nbsp;</p>
        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
      </div>
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 436 1">
            <line id="Line" stroke="var(--stroke-0, #9ED1C8)" x2="436" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Medium',sans-serif] font-medium gap-[8px] items-start leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px]" data-name="Frame">
      <p className="relative shrink-0">Route Map</p>
      <p className="relative shrink-0">Download Waiver</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[28px] items-start left-[calc(33.33%+127.33px)] top-[1008px] w-[436px]" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] min-w-full not-italic relative shrink-0 text-[20px] text-black tracking-[-0.4px] w-[min-content] whitespace-pre-wrap">Event Requirements</p>
      <Frame14 />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 436 1">
            <line id="Line" stroke="var(--stroke-0, #9ED1C8)" x2="436" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.1001 76.1001">
        <g id="Group">
          <path d={svgPaths.p86fdb80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pa828880} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.pc2aca00} fill="var(--fill-0, white)" id="Vector_3" />
          <g id="Vector_4" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBoldGallery() {
  return (
    <div className="col-1 ml-[30.44px] mt-[48.92px] relative row-1 size-[76.1px]" data-name="vuesax/bold/gallery">
      <Group5 />
    </div>
  );
}

function Group4() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1" data-name="Group">
      <div className="col-1 h-[173.944px] ml-0 mt-0 relative row-1 w-[136.981px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 136.981 173.944">
          <path d={svgPaths.pc12f680} fill="var(--fill-0, #DDDDDD)" id="Vector" />
        </svg>
      </div>
      <VuesaxBoldGallery />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.1001 76.1001">
        <g id="Group">
          <path d={svgPaths.p86fdb80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pa828880} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.pc2aca00} fill="var(--fill-0, white)" id="Vector_3" />
          <g id="Vector_4" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBoldGallery1() {
  return (
    <div className="col-1 ml-[30.44px] mt-[48.92px] relative row-1 size-[76.1px]" data-name="vuesax/bold/gallery">
      <Group7 />
    </div>
  );
}

function Group6() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-[144.98px] mt-0 relative row-1" data-name="Group">
      <div className="col-1 h-[173.944px] ml-0 mt-0 relative row-1 w-[136.981px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 136.981 173.944">
          <path d={svgPaths.pc12f680} fill="var(--fill-0, #DDDDDD)" id="Vector" />
        </svg>
      </div>
      <VuesaxBoldGallery1 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.1001 76.1001">
        <g id="Group">
          <path d={svgPaths.p86fdb80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pa828880} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.pc2aca00} fill="var(--fill-0, white)" id="Vector_3" />
          <g id="Vector_4" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBoldGallery2() {
  return (
    <div className="col-1 ml-[30.44px] mt-[48.92px] relative row-1 size-[76.1px]" data-name="vuesax/bold/gallery">
      <Group9 />
    </div>
  );
}

function Group8() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-[289.96px] mt-0 relative row-1" data-name="Group">
      <div className="col-1 h-[173.944px] ml-0 mt-0 relative row-1 w-[136.981px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 136.981 173.944">
          <path d={svgPaths.pc12f680} fill="var(--fill-0, #DDDDDD)" id="Vector" />
        </svg>
      </div>
      <VuesaxBoldGallery2 />
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Group4 />
      <Group6 />
      <Group8 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black tracking-[-0.48px] w-[min-content] whitespace-pre-wrap">Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien</p>
      <Group3 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[20px] text-black tracking-[-0.4px] w-full whitespace-pre-wrap">Title</p>
      <Frame16 />
    </div>
  );
}

function BlockWithPhotos() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[32px_8px] h-[314px] items-start left-[calc(33.33%+127.33px)] top-[1182px] w-[428px]" data-name="Block with Photos">
      <Frame15 />
      <div className="h-0 relative shrink-0 w-[428px]" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 428 1">
            <line id="Line" stroke="var(--stroke-0, #9ED1C8)" x2="428" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.1001 76.1001">
        <g id="Group">
          <path d={svgPaths.p86fdb80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pa828880} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.pc2aca00} fill="var(--fill-0, white)" id="Vector_3" />
          <g id="Vector_4" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBoldGallery3() {
  return (
    <div className="col-1 ml-[30.44px] mt-[48.92px] relative row-1 size-[76.1px]" data-name="vuesax/bold/gallery">
      <Group12 />
    </div>
  );
}

function Group11() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1" data-name="Group">
      <div className="col-1 h-[173.944px] ml-0 mt-0 relative row-1 w-[136.981px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 136.981 173.944">
          <path d={svgPaths.pc12f680} fill="var(--fill-0, #DDDDDD)" id="Vector" />
        </svg>
      </div>
      <VuesaxBoldGallery3 />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.1001 76.1001">
        <g id="Group">
          <path d={svgPaths.p86fdb80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pa828880} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.pc2aca00} fill="var(--fill-0, white)" id="Vector_3" />
          <g id="Vector_4" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBoldGallery4() {
  return (
    <div className="col-1 ml-[30.44px] mt-[48.92px] relative row-1 size-[76.1px]" data-name="vuesax/bold/gallery">
      <Group14 />
    </div>
  );
}

function Group13() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-[144.98px] mt-0 relative row-1" data-name="Group">
      <div className="col-1 h-[173.944px] ml-0 mt-0 relative row-1 w-[136.981px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 136.981 173.944">
          <path d={svgPaths.pc12f680} fill="var(--fill-0, #DDDDDD)" id="Vector" />
        </svg>
      </div>
      <VuesaxBoldGallery4 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76.1001 76.1001">
        <g id="Group">
          <path d={svgPaths.p86fdb80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pa828880} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.pc2aca00} fill="var(--fill-0, white)" id="Vector_3" />
          <g id="Vector_4" opacity="0" />
        </g>
      </svg>
    </div>
  );
}

function VuesaxBoldGallery5() {
  return (
    <div className="col-1 ml-[30.44px] mt-[48.92px] relative row-1 size-[76.1px]" data-name="vuesax/bold/gallery">
      <Group16 />
    </div>
  );
}

function Group15() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-[289.96px] mt-0 relative row-1" data-name="Group">
      <div className="col-1 h-[173.944px] ml-0 mt-0 relative row-1 w-[136.981px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 136.981 173.944">
          <path d={svgPaths.pc12f680} fill="var(--fill-0, #DDDDDD)" id="Vector" />
        </svg>
      </div>
      <VuesaxBoldGallery5 />
    </div>
  );
}

function Group10() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Group11 />
      <Group13 />
      <Group15 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black tracking-[-0.48px] w-[min-content] whitespace-pre-wrap">Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien</p>
      <Group10 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[20px] text-black tracking-[-0.4px] w-full whitespace-pre-wrap">Title</p>
      <Frame18 />
    </div>
  );
}

function BlockWithPhotos1() {
  return (
    <div className="absolute content-start flex flex-wrap gap-[32px_8px] h-[314px] items-start left-[calc(33.33%+127.33px)] top-[1538px] w-[428px]" data-name="Block with Photos">
      <Frame17 />
      <div className="h-0 relative shrink-0 w-[428px]" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 428 1">
            <line id="Line" stroke="var(--stroke-0, #9ED1C8)" x2="428" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
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

function Group17() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Group">
      <Logo />
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[42px] mt-[3px] not-italic relative row-1 text-[#1e9680] text-[20px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px]">Home</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame23 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px]">Events</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame25 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Frame">
      <Frame22 />
      <Frame24 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Group17 />
      <Frame21 />
    </div>
  );
}

function Frame28() {
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

function Frame27() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[8px] py-[7px] relative shrink-0" data-name="Frame">
      <Frame28 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px] whitespace-nowrap">
        <p className="leading-[1.4]">My Tickets</p>
      </div>
    </div>
  );
}

function Frame30() {
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

function Frame31() {
  return (
    <div className="content-stretch flex items-start overflow-clip p-[10px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Bell />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-name="Frame">
      <Frame30 />
      <Frame31 />
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

function Frame26() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Frame27 />
      <Frame29 />
      <Dropdown />
    </div>
  );
}

function Frame19() {
  return (
    <div className="backdrop-blur-[20px] content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-[1280px]" data-name="Frame">
      <Frame20 />
      <Frame26 />
    </div>
  );
}

function UserHeaderNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex flex-col items-center left-0 overflow-clip top-px w-[1280px]" data-name="User Header Nav">
      <Frame19 />
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

export default function EventPage() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Event Page">
      <div className="absolute h-0 left-[calc(41.67%+24.67px)] top-[490px] w-[436px]" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 436 1">
            <line id="Line" stroke="var(--stroke-0, #9ED1C8)" x2="436" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <EventInfo />
      <EventImage />
      <OrganizerBlock />
      <AboutBlock />
      <Frame13 />
      <BlockWithPhotos />
      <BlockWithPhotos1 />
      <UserHeaderNav />
    </div>
  );
}