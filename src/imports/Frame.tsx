import svgPaths from "./svg-l8dfd49fq8";
import imgPngTransparentGcashLogo1 from "figma:asset/361b5ff808595f5b0ded183dc36121f71aa9d6bf.png";
import imgImage2 from "figma:asset/65ebd716d42cf572d26c663985c86d40104a8c69.png";
import imgUntitledDesign34 from "figma:asset/40d504f26d5f8282558fa00f9262f8c18f761ac8.png";
import imgQrPhLogoSvg1 from "figma:asset/bb63f7a883805a79e93cdb6c0667cac5d61c6ca2.png";

function Frame3() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[24px] w-[417px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#121212] text-[20px] top-[-0.5px] tracking-[-0.4px]">Payment Method</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[1.56%]" data-name="Group">
      <div className="absolute inset-[1.56%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
          <path d={svgPaths.pe3be380} fill="var(--fill-0, #DEF2EE)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[1.56%]" data-name="Vector">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <path d={svgPaths.p109a300} id="Vector" stroke="var(--stroke-0, #1E9680)" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[31.25%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <path d={svgPaths.p2ca50880} fill="var(--fill-0, #1E9680)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function CheckboxBaseChecked() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[32px] top-0" data-name="CheckboxBaseChecked2">
      <Icon />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[28px] left-[41px] top-[4px] w-[80.656px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#121212] text-[20px] top-[-0.5px] tracking-[-0.4px]">Pay Now</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <CheckboxBaseChecked />
      <Paragraph />
    </div>
  );
}

function Label() {
  return (
    <div className="absolute content-stretch flex flex-col h-[32px] items-start left-0 top-0 w-[428px]" data-name="Label">
      <Container2 />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[107.258px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#15695a] text-[14px] top-[0.5px] tracking-[-0.1504px]">Pay with GCash</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[40px] items-center relative size-full">
        <div className="relative shrink-0 size-[40px]" data-name="png-transparent-gcash-logo 1">
          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[112.4%] left-[-72.9%] max-w-none top-[-6.47%] w-[249.32%]" src={imgPngTransparentGcashLogo1} />
          </div>
        </div>
        <Text />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#1e9680] relative rounded-[16777200px] shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#def2ee] h-[74px] relative rounded-[14px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#1e9680] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex gap-[16px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[98.477px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#99a1af] text-[14px] top-[0.5px] tracking-[-0.1504px]">Pay with Maya</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[40px] items-center relative size-full">
        <div className="relative shrink-0 size-[40px]" data-name="image 2">
          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute left-[-5.68%] max-w-none size-[111.79%] top-[-6.99%]" src={imgImage2} />
          </div>
        </div>
        <Text1 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-white relative rounded-[16777200px] shrink-0 size-[20px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[74px] relative rounded-[14px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex gap-[16px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[95.023px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#99a1af] text-[14px] top-[0.5px] tracking-[-0.1504px]">Pay with Card</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <div className="h-[18px] relative shrink-0 w-[69px]" data-name="Untitled design (3) 4">
          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[656.72%] left-[-38.34%] max-w-none top-[-275.63%] w-[175.22%]" src={imgUntitledDesign34} />
          </div>
        </div>
        <Text2 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white relative rounded-[16777200px] shrink-0 size-[20px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[58px] relative rounded-[14px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex gap-[16px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[102.484px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#99a1af] text-[14px] top-[0.5px] tracking-[-0.1504px]">Pay with QRPH</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <div className="h-[16px] relative shrink-0 w-[69px]" data-name="QR_Ph_Logo.svg 1">
          <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgQrPhLogoSvg1} />
        </div>
        <Text3 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-white relative rounded-[16777200px] shrink-0 size-[20px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[74px] relative rounded-[14px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex gap-[16px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container10 />
        <Container11 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[316px] items-start left-[40px] top-[48px] w-[388px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[364px] left-0 top-0 w-[428px]" data-name="Container">
      <Label />
      <Container3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[#f3f4f6] border border-[#e5e7eb] border-solid h-[21px] left-[183.41px] rounded-[16777200px] top-[5.5px] w-[100.352px]" data-name="Text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[8px] not-italic text-[#6a7282] text-[10px] top-[2.5px] tracking-[0.6172px] uppercase">Coming Soon</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[32px] relative rounded-[32px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}

function CheckboxBase() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 rounded-[32px] size-[32px] top-0" data-name="CheckboxBase2">
      <Container14 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[28px] left-[41px] top-[2px] w-[125.406px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[#121212] text-[20px] top-[-0.5px] tracking-[-0.4px]">Payment Plan</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <Text4 />
      <CheckboxBase />
      <Paragraph1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[428px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container13 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col h-[32px] items-start left-0 opacity-60 top-[388px] w-[428px]" data-name="Container">
      <Label1 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[420px] left-[24px] top-[84px] w-[428px]" data-name="Container">
      <Container1 />
      <Container12 />
    </div>
  );
}

function Frame4() {
  return <div className="absolute left-[23px] size-px top-[83px]" data-name="Frame" />;
}

function Frame2() {
  return (
    <div className="absolute h-[252px] left-0 rounded-[8px] top-0 w-[465px]" data-name="Frame">
      <Frame3 />
      <Container />
      <Frame4 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-white h-[527px] left-px rounded-[8px] top-0 w-[474px]" data-name="Frame">
      <Frame2 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full" data-name="Frame">
      <Frame1 />
    </div>
  );
}