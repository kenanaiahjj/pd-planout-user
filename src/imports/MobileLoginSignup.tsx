import svgPaths from "./svg-hle99t8q2a";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";

function Logo() {
  return (
    <div className="absolute h-[70px] left-[156px] top-[45px] w-[71px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Group1() {
  return (
    <div className="-translate-x-1/2 absolute contents left-1/2 top-[512px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[1.4] left-[calc(50%-8px)] not-italic text-[#b5bcc9] text-[16px] top-[512px] tracking-[-0.48px]">or</p>
      <div className="absolute h-0 left-[204px] top-[527px] w-[155px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 155 1">
            <line id="Line 1" stroke="var(--stroke-0, #E9E9E9)" x2="155" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[31px] top-[527px] w-[153.023px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 153.023 1">
            <line id="Line 2" stroke="var(--stroke-0, #E9E9E9)" x2="153.023" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SocialIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Social icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_34_9842)" id="Social icon">
          <path d={svgPaths.p7776880} fill="var(--fill-0, #4285F4)" id="Vector" />
          <path d={svgPaths.p2d84f580} fill="var(--fill-0, #34A853)" id="Vector_2" />
          <path d={svgPaths.p380d1d80} fill="var(--fill-0, #FBBC04)" id="Vector_3" />
          <path d={svgPaths.p1ebd4080} fill="var(--fill-0, #EA4335)" id="Vector_4" />
        </g>
        <defs>
          <clipPath id="clip0_34_9842">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SocialButton() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Social button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-center px-[16px] py-[10px] relative w-full">
          <SocialIcon />
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#414651] text-[16px]">Sign in with Google</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function SocialIcon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Social icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_34_9860)" id="Social icon">
          <path d={svgPaths.p2334f790} fill="var(--fill-0, #1877F2)" id="Vector" />
          <path d={svgPaths.p137c9ab0} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_34_9860">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SocialButton1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Social button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[12px] items-center justify-center px-[16px] py-[10px] relative w-full">
          <SocialIcon1 />
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#414651] text-[16px]">Sign in with Facebook</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[8px] items-center left-1/2 top-[570px] w-[328px]">
      <SocialButton />
      <SocialButton1 />
    </div>
  );
}

function Group() {
  return (
    <div className="col-1 h-[16px] ml-0 mt-[5%] relative row-1 w-[9.437px]" data-name="Group">
      <div className="absolute inset-[-6.25%_-10.6%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.4372 18">
          <g id="Group">
            <path d={svgPaths.p36d4d200} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M4.96362 13.9727H6.47358" id="Vector_2" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <p className="col-1 font-['Inter:Medium',sans-serif] font-medium leading-[1.4] ml-[15.44px] mt-0 not-italic relative row-1 text-[#b5bcc9] text-[14px] tracking-[-0.28px]">Use Phone Number</p>
      <Group />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Content">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[1.2] min-h-px min-w-px not-italic relative text-[#b5bcc9] text-[16px] tracking-[-0.64px] whitespace-pre-wrap">Enter your email address</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Content />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function InputWithLabel() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Input with label">
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
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Input field">
      <InputFieldBase />
    </div>
  );
}

function ButtonBase() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="_Button base" style={{ backgroundImage: "url(\'data:image/svg+xml;utf8,<svg viewBox=\\'0 0 320.44 40\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(4.7171e-7 -2 16.022 5.8883e-8 160.22 20)\\'><stop stop-color=\\'rgba(255,255,255,0)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(255,255,255,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>\'), linear-gradient(90deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)" }}>
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[16px] py-[10px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[14px] text-white tracking-[-0.28px]">Continue</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <InputField />
      <ButtonBase />
    </div>
  );
}

function Frame() {
  return (
    <div className="-translate-x-1/2 absolute content-start flex flex-wrap gap-[8px_144px] h-[125px] items-start left-[calc(50%+0.22px)] top-[348px] w-[320.437px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.28px]">Email</p>
      <Group2 />
      <Frame1 />
    </div>
  );
}

export default function MobileLoginSignup() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Mobile - Login - Signup">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] left-[calc(50%+0.5px)] not-italic text-[#121212] text-[24px] text-center top-[139px] tracking-[-0.48px] w-[261px] whitespace-pre-wrap">Welcome to PlanOut</p>
      <Logo />
      <div className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium h-[39px] leading-[1.4] left-[calc(50%+0.5px)] not-italic text-[#7d8490] text-[14px] text-center top-[177px] tracking-[-0.28px] w-[291px] whitespace-pre-wrap">
        <p className="mb-0">Exploring events is a great way to expand your horizons and experience new things.</p>
        <p className="mb-0">&nbsp;</p>
        <p>&nbsp;</p>
      </div>
      <Group1 />
      <Frame2 />
      <Frame />
    </div>
  );
}