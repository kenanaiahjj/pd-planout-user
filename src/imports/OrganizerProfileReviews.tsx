import svgPaths from "./svg-lgn4rau9ti";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgEllipse from "figma:asset/df692514c51e252497f9b8d5272152b9f7c80c14.png";
import { imgGroup } from "./svg-2rwy6";

function Logo() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-558px)] size-[36px] top-[26px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
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

function Frame1() {
  return (
    <div className="absolute left-[1080px] overflow-clip size-[20px] top-[31px]" data-name="Frame">
      <Group1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute left-[1116px] size-[20px] top-[31px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p7633d00} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute left-[958px] size-[20px] top-[30px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p1a637000} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[958px] top-[30px]" data-name="Group">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[984px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">My Tickets</p>
      <Frame3 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[24px] top-[26px]" data-name="Group">
      <Logo />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[66px] not-italic text-[#1e9680] text-[20px] top-[29px] tracking-[-0.4px]">PlanOut</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[338px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">Events</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[410px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">Support</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[205px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">Home</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[272px] not-italic text-[#b5bcc9] text-[16px] top-[31px] tracking-[-0.48px]">About</p>
      <div className="absolute left-[1152px] size-[24px] top-[29px]" data-name="Ellipse">
        <img alt="" className="block max-w-none size-full" height="24" src={imgEllipse} width="24" />
      </div>
      <Frame1 />
      <Frame2 />
      <Group2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] h-[81px] left-0 overflow-clip rounded-[12px] top-px w-[1200px]" data-name="Frame">
      <Group />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[calc(50%+9px)] top-[676px]" data-name="Group">
      <div className="absolute bg-gradient-to-r from-[#3cd4b9] h-[36px] left-[calc(50%+9px)] rounded-[8px] to-[#177564] top-[676px] w-[157px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(58.33%-81px)] not-italic text-[#def2ee] text-[16px] top-[calc(50%-435.5px)] tracking-[-0.48px]">Contact Organizer</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents leading-[normal] left-[calc(66.67%+37.22px)] not-italic text-black top-[574px]" data-name="Group">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium left-[calc(66.67%+37.22px)] text-[16px] top-[613px] tracking-[-0.64px]">Number of Events</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[calc(66.67%+37.22px)] text-[32px] top-[574px] tracking-[-1.28px]">247</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute left-[calc(75%+3px)] size-[20.909px] top-[484px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9094 20.9094">
        <g id="Frame">
          <path d={svgPaths.p707c780} fill="var(--fill-0, #FFDD00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[calc(66.67%+37.22px)] top-[482px]" data-name="Group">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(66.67%+37.22px)] not-italic text-[32px] text-black top-[482px] tracking-[-1.28px]">4.76</p>
      <Frame4 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[calc(66.67%+37.22px)] top-[482px]" data-name="Group">
      <Group8 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(66.67%+37.22px)] not-italic text-[16px] text-black top-[522px] tracking-[-0.64px]">Overall Rating</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents leading-[normal] left-[calc(66.67%+37.22px)] not-italic text-black top-[391px]" data-name="Group">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[calc(66.67%+37.22px)] text-[32px] top-[391px] tracking-[-1.28px]">2091</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium left-[calc(66.67%+37.22px)] text-[16px] top-[430px] tracking-[-0.64px]">Reviews</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[calc(66.67%+37.22px)] top-[391px]" data-name="Group">
      <Group6 />
      <Group7 />
      <Group9 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[calc(66.67%+13px)] top-[367px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[282px] left-[calc(66.67%+13px)] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03)] top-[367px] w-[177px]" data-name="Rectangle" />
      <Group5 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[calc(16.67%+49px)] top-[918px]" data-name="Group">
      <div className="absolute left-[calc(16.67%+49px)] size-[32px] top-[918px]" data-name="Ellipse">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #177564)" id="Ellipse" r="16" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+56px)] not-italic text-[#e9f6f4] text-[12px] top-[927px] tracking-[-0.24px]">ML</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute left-[calc(16.67%+87px)] size-[16px] top-[934px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute left-[calc(16.67%+100px)] size-[16px] top-[934px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute left-[calc(16.67%+113px)] size-[16px] top-[934px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute left-[calc(25%+26px)] size-[16px] top-[934px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute left-[calc(25%+39px)] size-[16px] top-[934px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #535862)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents left-[calc(16.67%+87px)] top-[934px]" data-name="Group">
      <Frame5 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[calc(8.33%+125px)] top-[894px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[114px] left-[calc(8.33%+125px)] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[894px] w-[578px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+88px)] not-italic text-[12px] text-black top-[918px] tracking-[-0.24px]">Morgan Lee</p>
      <Group11 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(25%+61px)] not-italic text-[10px] text-black top-[936px] tracking-[-0.2px]">06-28-25</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(16.67%+49px)] not-italic text-[16px] text-black top-[962px] tracking-[-0.48px]">“Professional, organized and a looking forward to future events.”</p>
      <Group12 />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents left-[calc(16.67%+49px)] top-[1052px]" data-name="Group">
      <div className="absolute left-[calc(16.67%+49px)] size-[32px] top-[1052px]" data-name="Ellipse">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #177564)" id="Ellipse" r="16" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+57px)] not-italic text-[#e9f6f4] text-[12px] top-[1061px] tracking-[-0.24px]">JS</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute left-[calc(16.67%+87px)] size-[16px] top-[1068px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute left-[calc(16.67%+100px)] size-[16px] top-[1068px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute left-[calc(16.67%+113px)] size-[16px] top-[1068px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute left-[calc(25%+26px)] size-[16px] top-[1068px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute left-[calc(25%+39px)] size-[16px] top-[1068px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #535862)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents left-[calc(16.67%+87px)] top-[1068px]" data-name="Group">
      <Frame10 />
      <Frame11 />
      <Frame12 />
      <Frame13 />
      <Frame14 />
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents left-[calc(8.33%+125px)] top-[1028px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[356px] left-[calc(8.33%+125px)] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[1028px] w-[578px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+88px)] not-italic text-[12px] text-black top-[1052px] tracking-[-0.24px]">Jordan Smith</p>
      <Group14 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(25%+61px)] not-italic text-[10px] text-black top-[1070px] tracking-[-0.2px]">06-28-25</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(16.67%+49px)] not-italic text-[16px] text-black top-[1096px] tracking-[-0.48px]">“They made the event truly special, Highly recommended!.”</p>
      <Group15 />
      <div className="absolute bg-[#d9d9d9] left-[calc(16.67%+49px)] rounded-[8px] size-[67px] top-[1136px]" data-name="Rectangle" />
      <div className="absolute bg-[#d9d9d9] left-[calc(25%+24px)] rounded-[8px] size-[67px] top-[1136px]" data-name="Rectangle" />
      <div className="absolute bg-[#d9d9d9] left-[calc(25%+99px)] rounded-[8px] size-[67px] top-[1136px]" data-name="Rectangle" />
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute left-[calc(16.67%+47px)] size-[24px] top-[682px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.pb8cc300} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents left-[calc(16.67%+47px)] top-[682px]" data-name="Group">
      <Frame15 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute left-[calc(25%+67px)] size-[24px] top-[682px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="var(--fill-0, #B5BCC9)" id="Vector" />
          <path d={svgPaths.p92aaa80} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents left-[calc(25%+67px)] top-[682px]" data-name="Group">
      <Frame16 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute left-[calc(16.67%+87px)] size-[24px] top-[682px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p2c5f2300} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents left-[calc(16.67%+87px)] top-[682px]" data-name="Group">
      <Frame17 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute inset-[19.79%_16.67%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-0.75px] mask-size-[16px_16px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 14.5006">
        <g id="Group">
          <path d={svgPaths.p2836c100} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents inset-[16.67%]" data-name="Mask Group">
      <Group22 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[16.67%]" data-name="Group">
      <MaskGroup />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute left-[calc(25%+107px)] overflow-clip rounded-[8px] size-[24px] top-[682px]" data-name="Frame">
      <Group21 />
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents left-[calc(25%+107px)] top-[682px]" data-name="Group">
      <Frame18 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute left-[calc(25%+27px)] size-[24px] top-[682px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p22443790} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents left-[calc(25%+27px)] top-[682px]" data-name="Group">
      <Frame19 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents left-[calc(16.67%+47px)] top-[682px]" data-name="Group">
      <Group17 />
      <Group18 />
      <Group19 />
      <Group20 />
      <Group23 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute left-[calc(16.67%+47px)] size-[24px] top-[603px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.p237040f8} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute contents left-[calc(16.67%+47px)] top-[603px]" data-name="Group">
      <Frame20 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(16.67%+79px)] not-italic text-[#b5bcc9] text-[14px] top-[605px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">organizer@email.com</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute left-[calc(16.67%+47px)] size-[24px] top-[638px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.pd9b22c0} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents left-[calc(16.67%+47px)] top-[638px]" data-name="Group">
      <Frame21 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(16.67%+79px)] not-italic text-[#b5bcc9] text-[14px] top-[642px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">123-1234-5678</p>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents left-[calc(16.67%+47px)] top-[603px]" data-name="Group">
      <Group25 />
      <Group26 />
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute contents left-[calc(16.67%+49px)] top-[1428px]" data-name="Group">
      <div className="absolute left-[calc(16.67%+49px)] size-[32px] top-[1428px]" data-name="Ellipse">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #177564)" id="Ellipse" r="16" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+56px)] not-italic text-[#e9f6f4] text-[12px] top-[1437px] tracking-[-0.24px]">ML</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="absolute left-[calc(16.67%+87px)] size-[16px] top-[1444px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute left-[calc(16.67%+100px)] size-[16px] top-[1444px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute left-[calc(16.67%+113px)] size-[16px] top-[1444px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute left-[calc(25%+26px)] size-[16px] top-[1444px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="absolute left-[calc(25%+39px)] size-[16px] top-[1444px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #535862)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute contents left-[calc(16.67%+87px)] top-[1444px]" data-name="Group">
      <Frame22 />
      <Frame23 />
      <Frame24 />
      <Frame25 />
      <Frame26 />
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents left-[calc(8.33%+125px)] top-[1404px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[114px] left-[calc(8.33%+125px)] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[1404px] w-[578px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+88px)] not-italic text-[12px] text-black top-[1428px] tracking-[-0.24px]">Morgan Lee</p>
      <Group28 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(25%+61px)] not-italic text-[10px] text-black top-[1446px] tracking-[-0.2px]">06-28-25</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(16.67%+49px)] not-italic text-[16px] text-black top-[1472px] tracking-[-0.48px]">“Professional, organized and a looking forward to future events.”</p>
      <Group29 />
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute contents left-[calc(16.67%+49px)] top-[1562px]" data-name="Group">
      <div className="absolute left-[calc(16.67%+49px)] size-[32px] top-[1562px]" data-name="Ellipse">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #177564)" id="Ellipse" r="16" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+56px)] not-italic text-[#e9f6f4] text-[12px] top-[1571px] tracking-[-0.24px]">ML</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="absolute left-[calc(16.67%+87px)] size-[16px] top-[1578px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute left-[calc(16.67%+100px)] size-[16px] top-[1578px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame29() {
  return (
    <div className="absolute left-[calc(16.67%+113px)] size-[16px] top-[1578px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame30() {
  return (
    <div className="absolute left-[calc(25%+26px)] size-[16px] top-[1578px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame31() {
  return (
    <div className="absolute left-[calc(25%+39px)] size-[16px] top-[1578px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #535862)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute contents left-[calc(16.67%+87px)] top-[1578px]" data-name="Group">
      <Frame27 />
      <Frame28 />
      <Frame29 />
      <Frame30 />
      <Frame31 />
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute contents left-[calc(8.33%+125px)] top-[1538px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[114px] left-[calc(8.33%+125px)] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[1538px] w-[578px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+88px)] not-italic text-[12px] text-black top-[1562px] tracking-[-0.24px]">Morgan Lee</p>
      <Group31 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(25%+61px)] not-italic text-[10px] text-black top-[1580px] tracking-[-0.2px]">06-28-25</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(16.67%+49px)] not-italic text-[16px] text-black top-[1606px] tracking-[-0.48px]">“Professional, organized and a looking forward to future events.”</p>
      <Group32 />
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute contents left-[calc(16.67%+49px)] top-[1696px]" data-name="Group">
      <div className="absolute left-[calc(16.67%+49px)] size-[32px] top-[1696px]" data-name="Ellipse">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #177564)" id="Ellipse" r="16" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+56px)] not-italic text-[#e9f6f4] text-[12px] top-[1705px] tracking-[-0.24px]">ML</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="absolute left-[calc(16.67%+87px)] size-[16px] top-[1712px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="absolute left-[calc(16.67%+100px)] size-[16px] top-[1712px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame34() {
  return (
    <div className="absolute left-[calc(16.67%+113px)] size-[16px] top-[1712px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame35() {
  return (
    <div className="absolute left-[calc(25%+26px)] size-[16px] top-[1712px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #FFBC00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame36() {
  return (
    <div className="absolute left-[calc(25%+39px)] size-[16px] top-[1712px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p9f94bc0} fill="var(--fill-0, #535862)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute contents left-[calc(16.67%+87px)] top-[1712px]" data-name="Group">
      <Frame32 />
      <Frame33 />
      <Frame34 />
      <Frame35 />
      <Frame36 />
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute contents left-[calc(8.33%+125px)] top-[1672px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[114px] left-[calc(8.33%+125px)] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[1672px] w-[578px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(16.67%+88px)] not-italic text-[12px] text-black top-[1696px] tracking-[-0.24px]">Morgan Lee</p>
      <Group34 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(25%+61px)] not-italic text-[10px] text-black top-[1714px] tracking-[-0.2px]">06-28-25</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(16.67%+49px)] not-italic text-[16px] text-black top-[1740px] tracking-[-0.48px]">“Professional, organized and a looking forward to future events.”</p>
      <Group35 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="absolute left-[calc(58.33%+71px)] size-[32px] top-[815px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <rect fill="var(--fill-0, white)" height="31" rx="7.5" width="31" x="0.5" y="0.5" />
          <rect height="31" rx="7.5" stroke="var(--stroke-0, #177564)" width="31" x="0.5" y="0.5" />
          <path d={svgPaths.p151b6080} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute contents left-[calc(58.33%+71px)] top-[815px]" data-name="Group">
      <Frame37 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="absolute left-[calc(58.33%+28px)] size-[32px] top-[815px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <path d={svgPaths.p3318d300} fill="var(--fill-0, white)" />
          <path d={svgPaths.p3318d300} stroke="var(--stroke-0, #177564)" />
          <path d={svgPaths.p2ce3e700} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute contents left-[calc(58.33%+28px)] top-[815px]" data-name="Group">
      <Frame38 />
    </div>
  );
}

export default function OrganizerProfileReviews() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Organizer Profile // Reviews">
      <Frame />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none left-[calc(16.67%+47px)] not-italic text-[36px] text-black top-[379px] tracking-[-0.72px]">Mountaineering Club</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(16.67%+34px)] not-italic text-[24px] text-black top-[810px] tracking-[-0.48px]">Reviews</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(16.67%+47px)] not-italic text-[#181d27] text-[16px] top-[451px] tracking-[-0.48px] w-[520px] whitespace-pre-wrap">Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
      <Group3 />
      <Group4 />
      <Group10 />
      <Group13 />
      <Group16 />
      <Group24 />
      <Group27 />
      <Group30 />
      <Group33 />
      <Group36 />
      <Group37 />
      <div className="absolute font-['Inter:Medium',sans-serif] font-medium h-[43px] leading-[1.4] left-[calc(16.67%+108px)] not-italic text-[16px] text-black top-[1293px] tracking-[-0.48px] w-[440px] whitespace-pre-wrap">
        <p className="mb-0">Thank you so much for your kind words! We loved having you at our event and hope to see you again soon.</p>
        <p>&nbsp;</p>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(16.67%+47px)] not-italic text-[#121212] text-[16px] top-[750px] tracking-[-0.48px]">Events</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+41px)] not-italic text-[#b5bcc9] text-[16px] top-[750px] tracking-[-0.48px]">Reviews</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(54.17%-41px)] not-italic text-[#177564] text-[16px] top-[calc(50%-370.5px)] tracking-[-0.48px]">Leave a Review</p>
    </div>
  );
}