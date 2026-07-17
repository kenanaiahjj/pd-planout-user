import svgPaths from "./svg-488h79uj7t";

function TextAndSupportingText() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Text and supporting text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#535862] text-[16px] tracking-[-0.48px] w-full whitespace-pre-wrap">Enter your name and choose an avatar that will be displayed on your profile.</p>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Content">
      <TextAndSupportingText />
    </div>
  );
}

function MaterialSymbolsUploadRounded() {
  return <div className="-translate-y-1/2 absolute aspect-[24/24] left-[13.38%] right-[83.01%] top-[calc(50%+17.85px)]" data-name="material-symbols:upload-rounded" />;
}

function Group() {
  return (
    <div className="absolute contents left-0 top-[-0.5px]">
      <div className="absolute h-[61.903px] left-0 top-[-0.5px] w-[62.497px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62.4973 61.9027">
          <ellipse cx="31.2487" cy="30.9514" fill="url(#paint0_linear_34_10126)" id="Ellipse 1485" rx="31.2487" ry="30.9514" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_34_10126" x1="31.2487" x2="31.2487" y1="0" y2="61.9027">
              <stop stopColor="#3CFFDE" />
              <stop offset="1" stopColor="#1C5A4F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute h-[22.285px] left-[42.5px] top-[42.21px] w-[22.499px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.499 22.285">
          <path d={svgPaths.p17ad0a00} fill="var(--fill-0, #DEF2EE)" id="Ellipse 1486" stroke="var(--stroke-0, #177564)" />
        </svg>
      </div>
      <MaterialSymbolsUploadRounded />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Content">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[1.4] min-h-px min-w-px not-italic relative text-[#b5bcc9] text-[16px] tracking-[-0.48px] whitespace-pre-wrap">Enter your name</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Content1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function InputWithLabel() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Input with label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#414651] text-[16px] tracking-[-0.48px]">Name</p>
      <Input />
    </div>
  );
}

function InputFieldBase() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="_Input field base">
      <InputWithLabel />
    </div>
  );
}

function InputField() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[77px] top-[-6px] w-[237px]" data-name="Input field">
      <InputFieldBase />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[71px] relative shrink-0 w-full">
      <Group />
      <div className="absolute inset-[69.01%_81.67%_20.62%_15.92%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.56353 7.36263">
          <path d={svgPaths.p2683a300} fill="var(--fill-0, #177564)" id="Vector" />
        </svg>
      </div>
      <InputField />
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]" data-name="_Button base" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 314 44\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(4.6224e-7 -2.2 15.7 6.4772e-8 157 22)\\'><stop stop-color=\\'rgba(255,255,255,0)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(255,255,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)" }}>
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[18px] py-[10px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-white">Get Started</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <ButtonBase />
    </div>
  );
}

function ModalActions() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="_Modal actions">
      <Button />
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

function Frame2() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center p-[2px] relative rounded-[12px] shrink-0 size-[24px]">
      <MaterialSymbolsCloseRounded />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#e9f6f4] content-stretch flex items-center justify-between left-0 overflow-clip px-[16px] py-[12px] top-0 w-[362px]">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[20px] tracking-[-0.4px]">Complete Your Profile</p>
      <Frame2 />
    </div>
  );
}

export default function Modal() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center overflow-clip pb-[24px] pt-[68px] px-[24px] relative rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] size-full" data-name="Modal">
      <Content />
      <Frame />
      <ModalActions />
      <Frame1 />
    </div>
  );
}