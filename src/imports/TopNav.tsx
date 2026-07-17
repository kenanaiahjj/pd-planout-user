import svgPaths from "./svg-munqdh9yic";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";

function Logo() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[36px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Group1() {
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

function Text() {
  return (
    <div className="-translate-y-1/2 absolute aspect-[17.985624313354492/17.985624313354492] bg-[#ff545c] content-stretch flex items-center justify-center left-[47.92%] right-[-6.25%] rounded-[36164600px] top-[calc(50%-11px)]" data-name="Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[9px] text-center text-white tracking-[0.1172px]">3</p>
    </div>
  );
}

function MdiCartOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mdi:cart-outline">
      <div className="absolute inset-[8.34%_12.5%_8.33%_4.17%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p205431f0} fill="var(--fill-0, #B5BCC9)" id="Vector" />
        </svg>
      </div>
      <Text />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0 w-[145px]">
      <MingcuteNotificationLine />
      <MdiCartOutline />
    </div>
  );
}

export default function TopNav() {
  return (
    <div className="backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex gap-[97px] items-center justify-center overflow-clip px-[16px] py-[6px] relative rounded-[12px] size-full" data-name="Top Nav">
      <Group1 />
      <Frame />
    </div>
  );
}