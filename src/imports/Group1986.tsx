import svgPaths from "./svg-vk26qfze2q";
import imgImage from "figma:asset/9dd246725291ca31eadbba57f65fc35c16ef8f44.png";

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
    <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[20px]">
      <Badge />
      <Badge1 />
      <Badge2 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[16px] top-[198px]">
      <div className="absolute bg-[#f9fafb] h-[46px] left-[16px] rounded-[8px] top-[198px] w-[326px]" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] left-[27px] not-italic text-[#b5bcc9] text-[12px] top-[207px] tracking-[-0.24px] w-[304px] whitespace-pre-wrap">{`Organized by: International Atheletics Organization of the World (Rated 4.5/5 ⭐)  `}</p>
    </div>
  );
}

function MdiCalendar() {
  return (
    <div className="absolute left-[113px] size-[21.723px] top-[87px]" data-name="mdi:calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.7226 21.7226">
        <g id="mdi:calendar">
          <rect height="20.7226" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="20.7226" x="0.5" y="0.5" />
          <path d={svgPaths.p12525d00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[113px] top-[87px]">
      <MdiCalendar />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[140.15px] not-italic text-[#b5bcc9] text-[14px] top-[90.62px] tracking-[-0.28px]">June 27, 2025 at 4:00 AM</p>
    </div>
  );
}

function RivetIconsMapPinSolid() {
  return (
    <div className="absolute left-[113px] size-[21.723px] top-[119px]" data-name="rivet-icons:map-pin-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.7226 21.7226">
        <g id="rivet-icons:map-pin-solid">
          <rect height="20.7226" rx="3.5" stroke="var(--stroke-0, #DEF2EE)" width="20.7226" x="0.5" y="0.5" />
          <path d={svgPaths.p296d4c00} fill="var(--fill-0, #177564)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[113px] top-[119px]">
      <RivetIconsMapPinSolid />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[140.15px] not-italic text-[#b5bcc9] text-[14px] top-[121.71px] tracking-[-0.28px]">Canlaon City, Philippines</p>
    </div>
  );
}

export default function Group2() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-white border border-[#def2ee] border-solid h-[260px] left-0 rounded-[8px] shadow-[0px_406px_114px_0px_rgba(0,0,0,0),0px_260px_104px_0px_rgba(0,0,0,0),0px_146px_88px_0px_rgba(0,0,0,0.02),0px_65px_65px_0px_rgba(0,0,0,0.03),0px_16px_36px_0px_rgba(0,0,0,0.03)] top-0 w-[358px]" />
      <div className="absolute h-[124px] left-[16px] rounded-[8px] top-[55px] w-[89px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgImage} />
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[113px] not-italic text-[#121212] text-[20px] top-[55px] tracking-[-0.4px]">{`Canlaon Half Marathon `}</p>
      <Frame />
      <Group3 />
      <Group />
      <Group1 />
    </div>
  );
}