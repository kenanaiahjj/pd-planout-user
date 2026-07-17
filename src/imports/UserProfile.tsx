import svgPaths from "./svg-7fe9qw244g";
import imgLogo from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgAvatar from "figma:asset/ce45a896d958cf406bb83c3c0a93e2f03fcb0bef.png";
import imgImageOrg from "figma:asset/42dc5919595bba34125ab191d040552aeef17365.png";

function Logo() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[36px]" data-name="Logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Group">
      <Logo />
      <p className="col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] ml-[42px] mt-[3px] not-italic relative row-1 text-[#1e9680] text-[20px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.4] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px]">Home</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#177564] text-[16px] tracking-[-0.48px]">Events</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#def2ee] content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Frame6 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Frame">
      <Frame3 />
      <Frame5 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Group />
      <Frame2 />
    </div>
  );
}

function Frame9() {
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

function Frame8() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[8px] py-[7px] relative shrink-0" data-name="Frame">
      <Frame9 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.48px] whitespace-nowrap">
        <p className="leading-[1.4]">My Tickets</p>
      </div>
    </div>
  );
}

function Frame11() {
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

function Frame12() {
  return (
    <div className="content-stretch flex items-start overflow-clip p-[10px] relative rounded-[6px] shrink-0" data-name="Frame">
      <Bell />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-name="Frame">
      <Frame11 />
      <Frame12 />
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

function Frame7() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
      <Frame8 />
      <Frame10 />
      <Dropdown />
    </div>
  );
}

function Frame() {
  return (
    <div className="backdrop-blur-[20px] content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-[1280px]" data-name="Frame">
      <Frame1 />
      <Frame7 />
    </div>
  );
}

function UserHeaderNav() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(249,250,251,0.6)] content-stretch flex flex-col items-center left-0 overflow-clip top-px w-[1280px]" data-name="User Header Nav">
      <Frame />
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

function Frame15() {
  return (
    <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Frame">
      <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[36px] min-h-px min-w-px not-italic relative text-[#0f172b] text-[30px] tracking-[-0.3545px] whitespace-pre-wrap">Settings</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Frame">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Manage your account settings and preferences.</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[64px] items-start left-0 top-0 w-[1232px]" data-name="Frame">
      <Frame15 />
      <Frame16 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute left-[4px] size-[16px] top-[18px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p191442a3} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p9aced80} id="Vector_2" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className="h-[54px] relative shrink-0 w-[86.648px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[#177564] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Frame19 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[55px] not-italic text-[#177564] text-[14px] text-center top-[16.5px] tracking-[-0.1504px]">Account</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute left-[4px] size-[16px] top-[18px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p71d29e0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33203 6.66406H14.6654" id="Line" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="h-[54px] relative shrink-0 w-[116.844px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Frame21 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[70.5px] not-italic text-[#6a7282] text-[14px] text-center top-[16.5px] tracking-[-0.1504px]">Transactions</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute left-[4px] size-[16px] top-[18px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p134d4000} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame22() {
  return (
    <div className="h-[54px] relative shrink-0 w-[111.602px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Frame23 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[68px] not-italic text-[#6a7282] text-[14px] text-center top-[16.5px] tracking-[-0.1504px]">Preferences</p>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute left-[4px] size-[16px] top-[18px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p227d3a80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2f72e100} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame24() {
  return (
    <div className="h-[54px] relative shrink-0 w-[108.852px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Frame25 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[66.5px] not-italic text-[#6a7282] text-[14px] text-center top-[16.5px] tracking-[-0.1504px]">Certificates</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute h-[54px] left-0 top-[96px] w-[1216px]" data-name="Frame">
      <div className="content-stretch flex gap-[32px] items-start overflow-clip pb-px relative rounded-[inherit] size-full">
        <Frame18 />
        <Frame20 />
        <Frame22 />
        <Frame24 />
      </div>
      <div aria-hidden="true" className="absolute border-[#b5bcc9] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[30px] left-0 top-0 w-[936px]" data-name="Heading 2">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[20px] text-black top-0 tracking-[-0.8492px]">Your Profile</p>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[200px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#b5bcc9] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Organization Photo</p>
    </div>
  );
}

function ImageOrg() {
  return (
    <div className="h-[110px] relative shrink-0 w-full" data-name="Image (Org)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageOrg} />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 overflow-clip rounded-[16777200px] size-[110px] top-0" data-name="Container">
      <ImageOrg />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[37.5%] left-1/2 right-1/2 top-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 11.6667">
            <path d="M0.833333 0.833333V10.8333" id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_29.17%_66.67%_29.16%]" data-name="Vector">
        <div className="absolute inset-[-20%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5.83333">
            <path d={svgPaths.pbedad00} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[62.5%_12.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 6.66667">
            <path d={svgPaths.p3e05ba00} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#def2ee] content-stretch flex flex-col items-start left-[70px] pb-[2px] pt-[10px] px-[10px] rounded-[16777200px] size-[40px] top-[70px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[16777200px]" />
      <Icon />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute left-0 size-[110px] top-[36px]" data-name="Container">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[165px] relative shrink-0 w-[200px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Container4 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[24px] relative shrink-0 w-[233px]" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#414651] text-[16px] top-[-0.5px] tracking-[-0.3125px]">First Name</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[338px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#181d27] text-[16px] tracking-[-0.3125px]">sample text</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame38() {
  return (
    <div className="h-full relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] h-full items-start relative">
        <Label />
        <TextInput />
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[233px]" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#414651] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Last Name</p>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[342px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#181d27] text-[16px] tracking-[-0.3125px]">sample text</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame39() {
  return (
    <div className="h-full relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] h-full items-start relative">
        <Label1 />
        <TextInput1 />
      </div>
    </div>
  );
}

function InputField() {
  return (
    <div className="h-[76px] relative shrink-0 w-[688px]" data-name="InputField">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-start relative size-full">
        <Frame38 />
        <Frame39 />
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[233px]" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#414651] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Birthdate</p>
    </div>
  );
}

function TextInput2() {
  return (
    <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[14px] py-[10px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#181d27] text-[16px] tracking-[-0.3125px]">MM/DD/YYYY</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame40() {
  return (
    <div className="h-full relative shrink-0 w-[688px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Label2 />
        <TextInput2 />
      </div>
    </div>
  );
}

function InputField1() {
  return (
    <div className="h-[76px] relative shrink-0 w-[688px]" data-name="InputField">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Frame40 />
      </div>
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[688px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#414651] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Bio</p>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[688px]" data-name="Text Area">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip p-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#b5bcc9] text-[16px] tracking-[-0.3125px]">Share a little about your background and interests.</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function InputField2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[688px]" data-name="InputField">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Label3 />
        <TextArea />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[350px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <InputField />
        <InputField1 />
        <InputField2 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] h-[350px] items-start left-0 top-[62px] w-[936px]" data-name="Container">
      <Container3 />
      <Container7 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-center left-0 top-0 w-[718px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] tracking-[-0.1504px]">Social Links</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="bg-[#f3f3f5] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] tracking-[-0.1504px]">Instagram</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame32() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M12 4L4 12" id="Line" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4L12 12" id="Line_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame31() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Frame32 />
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="col-1 content-stretch flex gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Frame">
      <Frame30 />
      <Frame31 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-[#f3f3f5] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] tracking-[-0.1504px]">Twitter</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame36() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d="M12 4L4 12" id="Line" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4L12 12" id="Line_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame35() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Frame36 />
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="col-2 content-stretch flex gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Frame">
      <Frame34 />
      <Frame35 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[36px] left-0 top-[30px] w-[718px]" data-name="Frame">
      <Frame29 />
      <Frame33 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="absolute bg-white border border-[rgba(0,0,0,0.1)] border-solid h-[32px] left-0 rounded-[8px] top-[90px] w-[126.961px]" data-name="Frame">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[62.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5.5px] tracking-[-0.1504px]">Add Social Link</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="absolute h-[122px] left-0 top-[651px] w-[718px]" data-name="Frame">
      <Frame27 />
      <Frame28 />
      <Frame37 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[760px] relative shrink-0 w-[783px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading />
        <Container2 />
        <Frame26 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[20px] size-[20px] top-[11px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1ef99f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-gradient-to-b from-[#3cd4b9] h-[42px] relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 to-[#177564] w-[175.297px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[102px] not-italic text-[16px] text-center text-white top-[8.5px] tracking-[-0.3125px]">Save Changes</p>
      </div>
    </div>
  );
}

function SectionDivider() {
  return <div className="bg-[#def2ee] h-px shrink-0 w-[936px]" data-name="SectionDivider" />;
}

function Heading1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[936px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[20px] text-black top-0 tracking-[-0.8492px]">Emails</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-[936px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#b5bcc9] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Add additional emails to receive event invites sent to those addresses.</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[62px] relative shrink-0 w-[936px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[414.891px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[20px] text-black top-0 tracking-[-0.4492px]">johndoe@email.com</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[414.891px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#b5bcc9] text-[12px] top-px">Add additional emails to receive event invites sent to those addresses.</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[48px] relative shrink-0 w-[414.891px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text1 />
        <Text2 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <path d={svgPaths.p32cd9cf0} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-3/4 right-[16.67%] top-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <path d={svgPaths.p32cd9cf0} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-[16.67%] right-3/4 top-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <path d={svgPaths.p32cd9cf0} id="Vector" stroke="var(--stroke-0, #B5BCC9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#fafafa] flex-[1_0_0] min-h-px min-w-px relative rounded-[12px] w-[800px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#125b4e] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[17px] py-px relative size-full">
        <Container11 />
        <Button1 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[168px] relative shrink-0 w-[936px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function SectionDivider1() {
  return <div className="bg-[#def2ee] h-px shrink-0 w-[936px]" data-name="SectionDivider" />;
}

function Heading2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[936px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[20px] text-black top-0 tracking-[-0.8492px]">Phone Number</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[936px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#b5bcc9] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Manage the phone number you use to sign in to PlanOut and receive SMS updates</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[62px] relative shrink-0 w-[936px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading2 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[487.656px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#414651] text-[16px] top-[-0.5px] tracking-[-0.3125px]">Phone Number</p>
      </div>
    </div>
  );
}

function TextInput3() {
  return (
    <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[487.656px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#181d27] text-[16px] tracking-[-0.3125px]">+63 961 480 2451</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function InputField3() {
  return (
    <div className="flex-[1_0_0] h-[76px] min-h-px min-w-px relative" data-name="InputField">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Label4 />
        <TextInput3 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[46px] relative rounded-[8px] shrink-0 w-[96.344px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#177564] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[48.5px] not-italic text-[#177564] text-[16px] text-center top-[10.5px] tracking-[-0.3125px]">Update</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[600px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-end relative size-full">
        <InputField3 />
        <Button2 />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[936px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#b5bcc9] text-[16px] top-[-0.5px] tracking-[-0.3125px]">For your security, we will send you a code to verify any change to your phone number.</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[210px] relative shrink-0 w-[936px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <Container13 />
        <Container14 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function SectionDivider2() {
  return <div className="bg-[#def2ee] h-px shrink-0 w-[936px]" data-name="SectionDivider" />;
}

function Heading3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[936px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[20px] text-black top-0 tracking-[-0.8492px]">Delete Account</p>
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[936px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#b5bcc9] text-[16px] top-[-0.5px] tracking-[-0.3125px]">If you no longer wish to use PlanOut, you can permanently delete your account.</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[62px] relative shrink-0 w-[936px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading3 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[17px] size-[24px] top-[13px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1b59fc80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 9V13" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 17H12.01" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f04438] h-[50px] relative rounded-[9px] shrink-0 w-[206.109px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#def2ee] border-solid inset-0 pointer-events-none rounded-[9px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[119.5px] not-italic text-[16px] text-center text-white top-[12.5px] tracking-[-0.3125px]">Delete My Account</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[184px] relative shrink-0 w-[936px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <Container16 />
        <Button3 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="-translate-x-1/2 absolute bg-white content-stretch flex flex-col gap-[32px] h-[1603px] items-start left-1/2 pl-[32px] py-[32px] rounded-[8px] top-[171px] w-[906px]" data-name="Container">
      <Container1 />
      <Button />
      <SectionDivider />
      <Container8 />
      <SectionDivider1 />
      <Container12 />
      <SectionDivider2 />
      <Container15 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(249,250,251,0.5)] h-[1714px] left-[calc(50%+8px)] top-[103px] w-[1232px]" data-name="Frame">
      <Frame14 />
      <Frame17 />
      <Container />
    </div>
  );
}

export default function UserProfile() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="User Profile">
      <UserHeaderNav />
      <Frame13 />
    </div>
  );
}