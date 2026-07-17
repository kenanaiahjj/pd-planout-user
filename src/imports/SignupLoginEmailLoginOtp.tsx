import imgFrame from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";
import imgImage from "figma:asset/80a9288cce0f3fbae7ebd6ed6d5626c04458d6fd.png";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";

function Frame() {
  return (
    <div className="absolute h-[1024px] left-[calc(100%+325px)] overflow-clip top-[-275px] w-[637px]" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame} />
      <div className="absolute h-[1080px] left-[-277px] top-[-28px] w-[1920px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[16px] items-center justify-center left-1/2 top-[119px] w-[384px]" data-name="Frame">
      <Logo />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none not-italic relative shrink-0 text-[#121212] text-[36px] tracking-[-0.72px]">Welcome to PlanOut</p>
      <div className="font-['Inter:Medium',sans-serif] font-medium h-[69px] leading-[1.4] not-italic relative shrink-0 text-[#7d8490] text-[20px] text-center tracking-[-0.4px] w-full whitespace-pre-wrap">
        <p className="mb-0">Exploring events is a great way to expand your horizons and experience new things.</p>
        <p className="mb-0">&nbsp;</p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[1022px] left-0 overflow-clip top-[2px] w-[640px]" data-name="Frame">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return <div className="absolute h-[1022px] left-1/2 top-[2px] w-[640px]" data-name="Frame" />;
}

function Frame5() {
  return (
    <div className="-translate-y-1/2 absolute h-[976px] left-0 overflow-clip rounded-[16px] top-1/2 w-[618px]" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame} />
      <div className="absolute h-[1080px] left-[-277px] top-[-28px] w-[1920px]" data-name="Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[1022px] left-1/2 overflow-clip top-[2px] w-[640px]" data-name="Frame">
      <Frame5 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center not-italic relative shrink-0 w-[380px] whitespace-pre-wrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none relative shrink-0 text-[#121212] text-[36px] text-center tracking-[-0.72px] w-full">OTP</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] relative shrink-0 text-[#b5bcc9] text-[20px] tracking-[-0.4px] w-full">We sent a code to ken****ah@gmail.com</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-white h-[64px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#6ac3b3] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[60px] min-h-px min-w-px not-italic relative text-[#1e9680] text-[48px] text-center tracking-[-0.96px] whitespace-pre-wrap">0</p>
        </div>
      </div>
    </div>
  );
}

function MegaInputFieldBase() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-[64px]" data-name="_Mega input field base">
      <div aria-hidden="true" className="absolute border-4 border-[#bae3dc] border-solid inset-[-4px] pointer-events-none rounded-[12px]" />
      <Frame9 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-white h-[64px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[60px] min-h-px min-w-px not-italic relative text-[#d5d7da] text-[48px] text-center tracking-[-0.96px] whitespace-pre-wrap">0</p>
        </div>
      </div>
    </div>
  );
}

function MegaInputFieldBase1() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-[64px]" data-name="_Mega input field base">
      <Frame10 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-white h-[64px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[60px] min-h-px min-w-px not-italic relative text-[#d5d7da] text-[48px] text-center tracking-[-0.96px] whitespace-pre-wrap">0</p>
        </div>
      </div>
    </div>
  );
}

function MegaInputFieldBase2() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-[64px]" data-name="_Mega input field base">
      <Frame11 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-white h-[64px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[60px] min-h-px min-w-px not-italic relative text-[#d5d7da] text-[48px] text-center tracking-[-0.96px] whitespace-pre-wrap">0</p>
        </div>
      </div>
    </div>
  );
}

function MegaInputFieldBase3() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-[64px]" data-name="_Mega input field base">
      <Frame12 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-white h-[64px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[60px] min-h-px min-w-px not-italic relative text-[#d5d7da] text-[48px] text-center tracking-[-0.96px] whitespace-pre-wrap">0</p>
        </div>
      </div>
    </div>
  );
}

function MegaInputFieldBase4() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-[64px]" data-name="_Mega input field base">
      <Frame13 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-white h-[64px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[60px] min-h-px min-w-px not-italic relative text-[#d5d7da] text-[48px] text-center tracking-[-0.96px] whitespace-pre-wrap">0</p>
        </div>
      </div>
    </div>
  );
}

function MegaInputFieldBase5() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-[64px]" data-name="_Mega input field base">
      <Frame14 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Frame">
      <MegaInputFieldBase />
      <MegaInputFieldBase1 />
      <MegaInputFieldBase2 />
      <MegaInputFieldBase3 />
      <MegaInputFieldBase4 />
      <MegaInputFieldBase5 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[8px] items-center leading-[1.4] not-italic relative shrink-0 w-[237px] whitespace-pre-wrap" data-name="Frame">
      <p className="relative shrink-0 text-[20px] text-black tracking-[-0.4px] w-full">Didn’t receive OTP Code?</p>
      <p className="relative shrink-0 text-[#177564] text-[16px] text-center tracking-[-0.48px] w-full">Resend Code</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] items-center left-[108px] top-[383px] w-[424px]" data-name="Frame">
      <Frame7 />
      <Frame8 />
      <Frame15 />
    </div>
  );
}

export default function SignupLoginEmailLoginOtp() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="Signup/Login - Email login - OTP">
      <Frame />
      <Frame1 />
      <Frame3 />
      <Frame4 />
      <Frame6 />
    </div>
  );
}