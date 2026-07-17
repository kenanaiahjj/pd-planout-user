import svgPaths from "./svg-5mr7h6lix3";
import imgImage from "figma:asset/af983a35e62624534d209b801137275105765fe8.png";
import imgImage1 from "figma:asset/29aad9093de6ad9860eb9b2ab121ec2152fecc07.png";
import imgImage2 from "figma:asset/8671acbd81a2e7163cbe808f309629b86885879b.png";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgAvatar from "figma:asset/ce45a896d958cf406bb83c3c0a93e2f03fcb0bef.png";
import { imgGroup } from "./svg-ijodz";

function Frame() {
  return (
    <div className="absolute left-[calc(66.67%-35.33px)] size-[32px] top-[815px]" data-name="Frame">
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

function Group() {
  return (
    <div className="absolute contents left-[calc(66.67%-35.33px)] top-[815px]" data-name="Group">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute left-[calc(58.33%+28.33px)] size-[32px] top-[815px]" data-name="Frame">
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

function Group1() {
  return (
    <div className="absolute contents left-[calc(58.33%+28.33px)] top-[815px]" data-name="Group">
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute left-[248px] size-[24px] top-[682px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.pb8cc300} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[248px] top-[682px]" data-name="Group">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute left-[calc(16.67%+161.67px)] size-[24px] top-[682px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="var(--fill-0, #B5BCC9)" id="Vector" />
          <path d={svgPaths.p92aaa80} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[calc(16.67%+161.67px)] top-[682px]" data-name="Group">
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute left-[calc(8.33%+181.33px)] size-[24px] top-[682px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p2c5f2300} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[calc(8.33%+181.33px)] top-[682px]" data-name="Group">
      <Frame4 />
    </div>
  );
}

function Group8() {
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
      <Group8 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[16.67%]" data-name="Group">
      <MaskGroup />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute left-[calc(25%+95px)] overflow-clip rounded-[8px] size-[24px] top-[682px]" data-name="Frame">
      <Group7 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[calc(25%+95px)] top-[682px]" data-name="Group">
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute left-[calc(16.67%+121.67px)] size-[24px] top-[682px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p22443790} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[calc(16.67%+121.67px)] top-[682px]" data-name="Group">
      <Frame6 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[248px] top-[682px]" data-name="Group">
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group9 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute left-[248px] size-[24px] top-[603px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.p237040f8} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[248px] top-[603px]" data-name="Group">
      <Frame7 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(8.33%+173.33px)] not-italic text-[#b5bcc9] text-[14px] top-[605px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">organizer@email.com</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute left-[248px] size-[24px] top-[638px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.pd9b22c0} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents left-[248px] top-[638px]" data-name="Group">
      <Frame8 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(8.33%+173.33px)] not-italic text-[#b5bcc9] text-[14px] top-[642px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">123-1234-5678</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[248px] top-[603px]" data-name="Group">
      <Group11 />
      <Group12 />
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents left-[calc(50%+54px)] top-[676px]" data-name="Group">
      <div className="absolute bg-gradient-to-r from-[#3cd4b9] h-[36px] left-[calc(50%+54px)] rounded-[8px] to-[#177564] top-[676px] w-[157px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(62.5%-95px)] not-italic text-[#def2ee] text-[16px] top-[calc(50%-438.5px)] tracking-[-0.48px]">Contact Organizer</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents leading-[normal] left-[calc(75%-69.78px)] not-italic text-black top-[574px]" data-name="Group">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium left-[calc(75%-69.78px)] text-[16px] top-[613px] tracking-[-0.64px]">Number of Events</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[calc(75%-69.78px)] text-[32px] top-[574px] tracking-[-1.28px]">247</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute left-[calc(83.33%-103.67px)] size-[20.909px] top-[484px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9094 20.9094">
        <g id="Frame">
          <path d={svgPaths.p707c780} fill="var(--fill-0, #FFDD00)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents left-[calc(75%-69.78px)] top-[482px]" data-name="Group">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(75%-69.78px)] not-italic text-[32px] text-black top-[482px] tracking-[-1.28px]">4.76</p>
      <Frame9 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents left-[calc(75%-69.78px)] top-[482px]" data-name="Group">
      <Group17 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[calc(75%-69.78px)] not-italic text-[16px] text-black top-[522px] tracking-[-0.64px]">Overall Rating</p>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents leading-[normal] left-[calc(75%-69.78px)] not-italic text-black top-[391px]" data-name="Group">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[calc(75%-69.78px)] text-[32px] top-[391px] tracking-[-1.28px]">2091</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium left-[calc(75%-69.78px)] text-[16px] top-[430px] tracking-[-0.64px]">Reviews</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents left-[calc(75%-69.78px)] top-[391px]" data-name="Group">
      <Group15 />
      <Group16 />
      <Group18 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1096px]" data-name="Group">
      <div className="absolute bg-[#f9fafb] h-[44px] left-[calc(25%+115px)] rounded-[8px] top-[1096px] w-[372px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(25%+123px)] not-italic text-[#b5bcc9] text-[12px] top-[1104px] tracking-[-0.24px] w-[356px] whitespace-pre-wrap">{`Organized by: International Athletics Organization of the World (Rated 4.5/5 ⭐)  `}</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute left-[calc(25%+115px)] size-[24px] top-[1030px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.p7468e80} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1030px]" data-name="Group">
      <Frame10 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+145px)] not-italic text-[#b5bcc9] text-[14px] top-[1034px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">June 27, 2025 at 4:00 AM</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute left-[calc(25%+115px)] size-[24px] top-[1062px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.p6557200} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1062px]" data-name="Group">
      <Frame11 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+145px)] not-italic text-[#b5bcc9] text-[14px] top-[1065px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Canlaon City, Philippines</p>
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

function Frame13() {
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

function Frame14() {
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

function Frame15() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase2 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[calc(25%+115px)] top-[896px]" data-name="Frame">
      <Frame13 />
      <Frame14 />
      <Frame15 />
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[896px]" data-name="Group">
      <Group21 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+115px)] not-italic text-[#121212] text-[20px] top-[926px] tracking-[-0.4px] w-[392px] whitespace-pre-wrap">{`Canlaon Marathon (5K, 10K, 21K, 42K) Canlaon Half Marathon (5K, 10K, 21K, 42K) Canlaon Half Marathon `}</p>
      <Group22 />
      <Group23 />
      <Frame12 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents left-[247px] top-[880px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[292px] left-[247px] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[880px] w-[608px]" data-name="Rectangle" />
      <div className="absolute h-[200px] left-[calc(8.33%+156.33px)] rounded-[8px] top-[896px] w-[142px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage2} />
      </div>
      <Group20 />
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1404px]" data-name="Group">
      <div className="absolute bg-[#f9fafb] h-[44px] left-[calc(25%+115px)] rounded-[8px] top-[1404px] w-[372px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(25%+123px)] not-italic text-[#b5bcc9] text-[12px] top-[1412px] tracking-[-0.24px] w-[356px] whitespace-pre-wrap">{`Organized by: International Athletics Organization of the World (Rated 4.5/5 ⭐)  `}</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute left-[calc(25%+115px)] size-[24px] top-[1338px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.p7468e80} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1338px]" data-name="Group">
      <Frame16 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+145px)] not-italic text-[#b5bcc9] text-[14px] top-[1342px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">June 27, 2025 at 4:00 AM</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute left-[calc(25%+115px)] size-[24px] top-[1370px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.p6557200} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1370px]" data-name="Group">
      <Frame17 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+145px)] not-italic text-[#b5bcc9] text-[14px] top-[1373px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Canlaon City, Philippines</p>
    </div>
  );
}

function BadgeBase3() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Adventure</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase3 />
    </div>
  );
}

function BadgeBase4() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Indoor</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase4 />
    </div>
  );
}

function BadgeBase5() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Team-based</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase5 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[calc(25%+115px)] top-[1204px]" data-name="Frame">
      <Frame19 />
      <Frame20 />
      <Frame21 />
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1204px]" data-name="Group">
      <Group26 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+115px)] not-italic text-[#121212] text-[20px] top-[1234px] tracking-[-0.4px] w-[392px] whitespace-pre-wrap">{`Canlaon Marathon (5K, 10K, 21K, 42K) Canlaon Half Marathon (5K, 10K, 21K, 42K) Canlaon Half Marathon `}</p>
      <Group27 />
      <Group28 />
      <Frame18 />
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents left-[247px] top-[1188px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[292px] left-[247px] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[1188px] w-[608px]" data-name="Rectangle" />
      <div className="absolute h-[200px] left-[calc(8.33%+156.33px)] rounded-[8px] top-[1204px] w-[142px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage2} />
      </div>
      <Group25 />
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1712px]" data-name="Group">
      <div className="absolute bg-[#f9fafb] h-[44px] left-[calc(25%+115px)] rounded-[8px] top-[1712px] w-[372px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[calc(25%+123px)] not-italic text-[#b5bcc9] text-[12px] top-[1720px] tracking-[-0.24px] w-[356px] whitespace-pre-wrap">{`Organized by: International Athletics Organization of the World (Rated 4.5/5 ⭐)  `}</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="absolute left-[calc(25%+115px)] size-[24px] top-[1646px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.p7468e80} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1646px]" data-name="Group">
      <Frame22 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+145px)] not-italic text-[#b5bcc9] text-[14px] top-[1650px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">June 27, 2025 at 4:00 AM</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute left-[calc(25%+115px)] size-[24px] top-[1678px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <rect height="23" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="23" x="0.5" y="0.5" />
          <path d={svgPaths.p6557200} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1678px]" data-name="Group">
      <Frame23 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+145px)] not-italic text-[#b5bcc9] text-[14px] top-[1681px] tracking-[-0.28px] w-[229.442px] whitespace-pre-wrap">Canlaon City, Philippines</p>
    </div>
  );
}

function BadgeBase6() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Adventure</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase6 />
    </div>
  );
}

function BadgeBase7() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Indoor</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase7 />
    </div>
  );
}

function BadgeBase8() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#177564] text-[12px] text-center">Team-based</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Frame">
      <BadgeBase8 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[calc(25%+115px)] top-[1512px]" data-name="Frame">
      <Frame25 />
      <Frame26 />
      <Frame27 />
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute contents left-[calc(25%+115px)] top-[1512px]" data-name="Group">
      <Group31 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(25%+115px)] not-italic text-[#121212] text-[20px] top-[1542px] tracking-[-0.4px] w-[392px] whitespace-pre-wrap">{`Canlaon Marathon (5K, 10K, 21K, 42K) Canlaon Half Marathon (5K, 10K, 21K, 42K) Canlaon Half Marathon `}</p>
      <Group32 />
      <Group33 />
      <Frame24 />
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute contents left-[247px] top-[1496px]" data-name="Group">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[292px] left-[247px] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-[1496px] w-[608px]" data-name="Rectangle" />
      <div className="absolute h-[200px] left-[calc(8.33%+156.33px)] rounded-[8px] top-[1512px] w-[142px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage2} />
      </div>
      <Group30 />
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

function Group34() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Group">
      <Logo />
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[42px] mt-[3px] not-italic relative row-1 text-[#1e9680] text-[20px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px]">Home</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame32 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px]">Events</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame34 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Frame">
      <Frame31 />
      <Frame33 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Group34 />
      <Frame30 />
    </div>
  );
}

function Frame37() {
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

function Frame36() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[8px] py-[7px] relative shrink-0" data-name="Frame">
      <Frame37 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px] whitespace-nowrap">
        <p className="leading-[1.4]">My Tickets</p>
      </div>
    </div>
  );
}

function Frame39() {
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

function Frame40() {
  return (
    <div className="content-stretch flex items-start overflow-clip p-[10px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Bell />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-name="Frame">
      <Frame39 />
      <Frame40 />
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

function Frame35() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Frame36 />
      <Frame38 />
      <Dropdown />
    </div>
  );
}

function Frame28() {
  return (
    <div className="backdrop-blur-[20px] content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-[1280px]" data-name="Frame">
      <Frame29 />
      <Frame35 />
    </div>
  );
}

function UserHeaderNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex flex-col items-center left-0 overflow-clip top-px w-[1280px]" data-name="User Header Nav">
      <Frame28 />
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

export default function OrganizerProfileUpcomingEvents() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Organizer Profile // Upcoming Events">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[248px] not-italic text-[24px] text-black top-[810px] tracking-[-0.48px]">Events</p>
      <div className="-translate-x-1/2 absolute h-[224px] left-1/2 rounded-[8px] top-[83px] w-[880px]" data-name="Image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[8px]">
          <img alt="" className="absolute h-[100.85%] left-0 max-w-none top-[-0.43%] w-[100.13%]" src={imgImage} />
        </div>
      </div>
      <div className="absolute left-[248px] pointer-events-none rounded-[8px] size-[96px] top-[259px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[8px] size-full" src={imgImage1} />
        <div aria-hidden="true" className="absolute border-4 border-solid border-white inset-[-4px] rounded-[12px]" />
      </div>
      <Group />
      <Group1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none left-[248px] not-italic text-[36px] text-black top-[379px] tracking-[-0.72px]">Mountaineering Club</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[248px] not-italic text-[#181d27] text-[16px] top-[451px] tracking-[-0.48px] w-[519px] whitespace-pre-wrap">Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
      <Group2 />
      <Group10 />
      <Group13 />
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[282px] left-[calc(75%-94px)] rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03)] top-[367px] w-[177px]" data-name="Rectangle" />
      <Group14 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[251px] not-italic text-[#121212] text-[16px] top-[750px] tracking-[-0.48px]">Events</p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(16.67%+120.67px)] not-italic text-[#b5bcc9] text-[16px] top-[750px] tracking-[-0.48px]">Reviews</p>
      <div className="absolute bg-[#177564] h-[2px] left-[248px] top-[777px] w-[58px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(66.67%-115.33px)] not-italic text-[#177564] text-[16px] top-[calc(50%-370.5px)] tracking-[-0.48px]">Leave a Review</p>
      <Group19 />
      <Group24 />
      <Group29 />
      <UserHeaderNav />
    </div>
  );
}