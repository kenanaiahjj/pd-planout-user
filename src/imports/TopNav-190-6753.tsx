import svgPaths from "./svg-itgzqxitd6";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";

function Group() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%-120.5px)] top-[33px]">
      <div className="-translate-x-1/2 absolute left-[calc(50%-161px)] size-[36px] top-[33px]" data-name="Logo">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[58px] not-italic text-[#1e9680] text-[20px] top-[36px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute left-[226px] size-[20px] top-[42px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p21eb1b00} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2a7e9c00} id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[226px] top-[42px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[252px] not-italic text-[#b5bcc9] text-[16px] top-[42px] tracking-[-0.48px]">Login or Register</p>
      <Frame />
    </div>
  );
}

export default function TopNav() {
  return (
    <div className="backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] overflow-clip relative rounded-[12px] size-full" data-name="Top Nav">
      <Group />
      <Group1 />
    </div>
  );
}