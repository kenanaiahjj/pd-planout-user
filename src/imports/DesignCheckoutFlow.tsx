import svgPaths from "./svg-e6vbum89sh";
import imgFrame from "figma:asset/b53264ffd75ffd1c26463acad0418c80a7d70f95.png";
import imgFrame1 from "figma:asset/5a332411061613331a1ffc8c7aa2ccf247ff8699.png";
import imgFrame2 from "figma:asset/ce45a896d958cf406bb83c3c0a93e2f03fcb0bef.png";

function Group1() {
  return (
    <div className="absolute contents inset-[30.55%_30.56%_30.56%_30.55%]" data-name="Group">
      <div className="absolute bottom-1/2 left-[30.55%] right-[30.56%] top-1/2" data-name="Line">
        <div className="absolute inset-[-1px_-8.04%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.4445 2">
            <path d="M13.4445 1H1" id="Line" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[30.56%] left-[30.55%] right-1/2 top-[30.55%]" data-name="Vector">
        <div className="absolute inset-[-8.04%_-16.07%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.22225 14.4445">
            <path d={svgPaths.p2baf680} id="Vector" stroke="var(--stroke-0, #177564)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p1199c300} fill="var(--fill-0, #DEF2EE)" id="Vector" />
      </svg>
      <Group1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Group />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[32px] top-[2px]" data-name="Frame">
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute h-[36px] left-[40px] top-0 w-[162.352px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] left-0 not-italic text-[36px] text-black top-0 tracking-[-0.72px]">Checkout</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[202.352px]" data-name="Frame">
      <Frame4 />
      <Frame6 />
    </div>
  );
}

function Frame9() {
  return <div className="absolute bg-[#21a58d] h-[8px] left-0 rounded-[999px] top-0 w-[278.664px]" data-name="Frame" />;
}

function Frame10() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[13px] w-[278.664px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[16px] text-black top-[-1px] tracking-[-0.48px]">Participant Information</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute h-[35.398px] left-0 top-0 w-[278.664px]" data-name="Frame">
      <Frame9 />
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return <div className="absolute bg-[#e9eaeb] h-[8px] left-0 rounded-[999px] top-0 w-[278.664px]" data-name="Frame" />;
}

function Frame13() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[13px] w-[278.664px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[16px] text-black top-[-1px] tracking-[-0.48px]">Payment Method</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute h-[35.398px] left-[294.66px] top-0 w-[278.664px]" data-name="Frame">
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame15() {
  return <div className="absolute bg-[#e9eaeb] h-[8px] left-0 rounded-[999px] top-0 w-[278.664px]" data-name="Frame" />;
}

function Frame16() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[13px] w-[278.664px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[16px] text-black top-[-1px] tracking-[-0.48px]">Confirmation</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute h-[35.398px] left-[589.33px] top-0 w-[278.664px]" data-name="Frame">
      <Frame15 />
      <Frame16 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute h-[35.398px] left-0 top-[60px] w-[868px]" data-name="Frame">
      <Frame8 />
      <Frame11 />
      <Frame14 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[95.398px] relative shrink-0 w-full" data-name="Frame">
      <Frame3 />
      <Frame7 />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[16px] size-[20px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10.8333 4.16602H17.4999" id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10.8333 10H17.5" id="Vector_2" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10.8333 15.834H17.4999" id="Vector_3" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1506000} id="Vector_4" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p33581700} id="Vector_5" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#7b3306] text-[14px] top-[0.5px] tracking-[-0.1504px]">Form Requirements Preview</p>
    </div>
  );
}

function BoldText() {
  return <div className="absolute h-[19px] left-[51.98px] top-[26.5px] w-[109.516px]" data-name="Bold Text" />;
}

function Paragraph() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[16px] text-[rgba(151,60,0,0.8)] top-[-1px] tracking-[-0.3125px] w-[402px] whitespace-pre-wrap">
        <span className="leading-[24px]">{`To streamline your checkout, we'll ask for the following participant details `}</span>
        <span className="font-['Inter:Bold',sans-serif] font-bold leading-[24px]">{`after payment. `}</span>
        <span className="leading-[24px]">Please ensure you have this information ready.</span>
      </p>
      <BoldText />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[96px] items-start left-[48px] top-[16px] w-[502px]" data-name="Container">
      <Text />
      <Paragraph />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[rgba(255,251,235,0.5)] h-[129px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(254,230,133,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Icon />
      <Container2 />
    </div>
  );
}

function Container5() {
  return <div className="absolute bg-[#ffb900] left-0 rounded-[16777200px] size-[6px] top-[7px]" data-name="Container" />;
}

function Container4() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container5 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[14px] not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px]">First Name</p>
    </div>
  );
}

function Container7() {
  return <div className="absolute bg-[#ffb900] left-0 rounded-[16777200px] size-[6px] top-[7px]" data-name="Container" />;
}

function Container6() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container7 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[14px] not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px]">Last Name</p>
    </div>
  );
}

function Container9() {
  return <div className="absolute bg-[#ffb900] left-0 rounded-[16777200px] size-[6px] top-[7px]" data-name="Container" />;
}

function Container8() {
  return (
    <div className="col-1 justify-self-stretch relative row-2 self-stretch shrink-0" data-name="Container">
      <Container9 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[14px] not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px]">Date of Birth (Age Verification)</p>
    </div>
  );
}

function Container11() {
  return <div className="absolute bg-[#ffb900] left-0 rounded-[16777200px] size-[6px] top-[7px]" data-name="Container" />;
}

function Container10() {
  return (
    <div className="col-2 justify-self-stretch relative row-2 self-stretch shrink-0" data-name="Container">
      <Container11 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[14px] not-italic text-[#364153] text-[14px] top-[0.5px] tracking-[-0.1504px]">Gender</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] h-[84px] relative shrink-0 w-full" data-name="Container">
      <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] p-[16px] relative size-full">
        <Container4 />
        <Container6 />
        <Container8 />
        <Container10 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#fffbeb] h-[214px] left-[-1px] rounded-[10px] top-0 w-[466px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container1 />
        <Container3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#fee685] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame21() {
  return <div className="absolute h-[28px] left-[24px] top-[24px] w-[417px]" data-name="Frame" />;
}

function Frame20() {
  return (
    <div className="absolute h-[264.375px] left-[-0.5px] overflow-clip top-[0.4px] w-[465px]" data-name="Frame">
      <Frame21 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="h-[214px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <Container />
      <Frame20 />
    </div>
  );
}

function Frame23() {
  return <div className="absolute bg-[rgba(255,255,255,0)] border border-[#def2ee] border-solid h-[380px] left-0 rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)] top-0 w-[465px]" data-name="Frame" />;
}

function Frame25() {
  return (
    <div className="absolute h-[28px] left-[24px] top-[24px] w-[417px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#121212] text-[20px] top-[-0.5px] tracking-[-0.4px]">Primary Contact Information</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute bg-white h-[46px] left-0 rounded-[8px] top-[28.4px] w-[200.5px]" data-name="Frame">
      <div className="content-stretch flex items-center overflow-clip px-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(24,29,39,0.5)] tracking-[-0.48px]">John</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame30() {
  return (
    <div className="absolute content-stretch flex h-[19.5px] items-start left-0 top-px w-[81.82px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] not-italic relative shrink-0 text-[#414651] text-[16px] tracking-[-0.48px]">First Name</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="absolute content-stretch flex h-[19.5px] items-start left-[81.82px] top-px w-[7.867px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] not-italic relative shrink-0 text-[#fec84b] text-[16px] tracking-[-0.48px]">*</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="absolute h-[22.398px] left-0 top-0 w-[89.688px]" data-name="Frame">
      <Frame30 />
      <Frame31 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="absolute h-[74.398px] left-0 top-0 w-[200.5px]" data-name="Frame">
      <Frame28 />
      <Frame29 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="absolute bg-white h-[46px] left-0 rounded-[8px] top-[28.4px] w-[200.5px]" data-name="Frame">
      <div className="content-stretch flex items-center overflow-clip px-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(24,29,39,0.5)] tracking-[-0.48px]">Doe</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame35() {
  return (
    <div className="absolute content-stretch flex h-[19.5px] items-start left-0 top-px w-[80.93px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] not-italic relative shrink-0 text-[#414651] text-[16px] tracking-[-0.48px]">Last Name</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="absolute content-stretch flex h-[19.5px] items-start left-[80.93px] top-px w-[7.867px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] not-italic relative shrink-0 text-[#fec84b] text-[16px] tracking-[-0.48px]">*</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="absolute h-[22.398px] left-0 top-0 w-[88.797px]" data-name="Frame">
      <Frame35 />
      <Frame36 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="absolute h-[74.398px] left-[216.5px] top-0 w-[200.5px]" data-name="Frame">
      <Frame33 />
      <Frame34 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="absolute h-[74.398px] left-[24.5px] top-[72.23px] w-[417px]" data-name="Frame">
      <Frame27 />
      <Frame32 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="absolute bg-white h-[46px] left-0 rounded-[8px] top-[28.4px] w-[417px]" data-name="Frame">
      <div className="content-stretch flex items-center overflow-clip px-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(24,29,39,0.5)] tracking-[-0.48px]">john.doe@example.com</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame40() {
  return (
    <div className="absolute content-stretch flex h-[19.5px] items-start left-0 top-px w-[106.07px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] not-italic relative shrink-0 text-[#414651] text-[16px] tracking-[-0.48px]">Email Address</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="absolute content-stretch flex h-[19.5px] items-start left-[106.07px] top-px w-[7.867px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] not-italic relative shrink-0 text-[#fec84b] text-[16px] tracking-[-0.48px]">*</p>
    </div>
  );
}

function Frame39() {
  return (
    <div className="absolute h-[22.398px] left-0 top-0 w-[113.938px]" data-name="Frame">
      <Frame40 />
      <Frame41 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="absolute h-[74.398px] left-[24.5px] top-[170.63px] w-[417px]" data-name="Frame">
      <Frame38 />
      <Frame39 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="absolute bg-white h-[46px] left-0 rounded-[8px] top-[28.4px] w-[417px]" data-name="Frame">
      <div className="content-stretch flex items-center overflow-clip px-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(24,29,39,0.5)] tracking-[-0.48px]">+63 912 345 6789</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame45() {
  return (
    <div className="absolute content-stretch flex h-[19.5px] items-start left-0 top-px w-[111.852px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] not-italic relative shrink-0 text-[#414651] text-[16px] tracking-[-0.48px]">Phone Number</p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="absolute content-stretch flex h-[19.5px] items-start left-[111.85px] top-px w-[7.867px]" data-name="Frame">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] not-italic relative shrink-0 text-[#fec84b] text-[16px] tracking-[-0.48px]">*</p>
    </div>
  );
}

function Frame44() {
  return (
    <div className="absolute h-[22.398px] left-0 top-0 w-[119.719px]" data-name="Frame">
      <Frame45 />
      <Frame46 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="absolute h-[74.398px] left-[24.5px] top-[269.02px] w-[417px]" data-name="Frame">
      <Frame43 />
      <Frame44 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute h-[567.992px] left-[-0.5px] overflow-clip top-[-0.23px] w-[465px]" data-name="Frame">
      <Frame25 />
      <Frame26 />
      <Frame37 />
      <Frame42 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-white h-[380px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <Frame23 />
      <Frame24 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[856.367px] items-start left-0 top-0 w-[465px]" data-name="Frame">
      <Frame19 />
      <Frame22 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#177564] text-[20px] top-[-0.5px] tracking-[-0.4px]">Order Summary</p>
    </div>
  );
}

function Frame49() {
  return (
    <div className="absolute bg-[#e9f6f4] content-stretch flex flex-col h-[45px] items-start left-[0.5px] pl-[21px] pr-[176.516px] pt-[11.008px] rounded-tl-[8px] rounded-tr-[8px] top-[-0.4px] w-[377px]" data-name="Frame">
      <Frame50 />
    </div>
  );
}

function Frame54() {
  return (
    <div className="h-[84.094px] relative shrink-0 w-full" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame} />
    </div>
  );
}

function Frame53() {
  return (
    <div className="absolute content-stretch flex flex-col h-[84.094px] items-start left-0 overflow-clip rounded-[8px] top-[8.34px] w-[58px]" data-name="Frame">
      <Frame54 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="absolute h-[44.797px] left-0 top-0 w-[142px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.4px] left-0 not-italic text-[16px] text-black top-[-1px] tracking-[-0.48px] w-[123px] whitespace-pre-wrap">Manila Marathon 2025</p>
    </div>
  );
}

function Frame57() {
  return (
    <div className="absolute h-[19.594px] left-0 top-[51.8px] w-[142px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.6px] left-0 not-italic text-[#b5bcc9] text-[14px] top-0 tracking-[-0.28px]">10K Category</p>
    </div>
  );
}

function Frame58() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[78.39px] w-[142px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[#b5bcc9] text-[16px] top-[-1px] tracking-[-0.48px]">₱ 1,500.00</p>
    </div>
  );
}

function Frame55() {
  return (
    <div className="absolute h-[100.789px] left-[66px] top-0 w-[142px]" data-name="Frame">
      <Frame56 />
      <Frame57 />
      <Frame58 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="absolute h-[100.789px] left-0 top-0 w-[208px]" data-name="Frame">
      <Frame53 />
      <Frame55 />
    </div>
  );
}

function Frame59() {
  return (
    <div className="absolute h-[19.594px] left-[275.43px] top-[40.59px] w-[69.57px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.6px] left-0 not-italic text-[14px] text-black top-0 tracking-[-0.28px]">₱ 1,500.00</p>
    </div>
  );
}

function Frame51() {
  return (
    <div className="absolute h-[100.789px] left-[16px] top-[69.05px] w-[345px]" data-name="Frame">
      <Frame52 />
      <Frame59 />
    </div>
  );
}

function Frame62() {
  return (
    <div className="bg-white flex-[1_0_0] h-[43px] min-h-px min-w-px relative rounded-[8px]" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[14px] py-[10px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(24,29,39,0.5)] tracking-[-0.28px]">Enter code</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
    </div>
  );
}

function Frame63() {
  return (
    <div className="bg-[#177564] h-[43px] relative rounded-[8px] shrink-0 w-[69.945px]" data-name="Frame">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[35.5px] not-italic text-[14px] text-center text-white top-[11px] tracking-[-0.28px]">Apply</p>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[43px] items-start left-0 top-[27.59px] w-[345px]" data-name="Frame">
      <Frame62 />
      <Frame63 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="absolute h-[19.594px] left-0 top-0 w-[160.68px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.6px] left-0 not-italic text-[#414651] text-[14px] top-0 tracking-[-0.28px]">Voucher / Discount Code</p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="absolute h-[70.594px] left-[16px] top-[193.84px] w-[345px]" data-name="Frame">
      <Frame61 />
      <Frame64 />
    </div>
  );
}

function Frame67() {
  return (
    <div className="absolute h-[19.594px] left-0 top-0 w-[93.094px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.6px] left-0 not-italic text-[14px] text-black top-0 tracking-[-0.28px]">Items Subtotal</p>
    </div>
  );
}

function Frame68() {
  return (
    <div className="absolute h-[19.594px] left-[275.43px] top-0 w-[69.57px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.6px] left-0 not-italic text-[14px] text-black top-0 tracking-[-0.28px]">₱ 1,500.00</p>
    </div>
  );
}

function Frame66() {
  return (
    <div className="absolute h-[19.594px] left-0 top-0 w-[345px]" data-name="Frame">
      <Frame67 />
      <Frame68 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="absolute h-[19.594px] left-0 top-0 w-[110.922px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.6px] left-0 not-italic text-[14px] text-black top-0 tracking-[-0.28px]">Convenience Fee</p>
    </div>
  );
}

function Frame71() {
  return (
    <div className="absolute h-[19.594px] left-[286.84px] top-0 w-[58.156px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.6px] left-0 not-italic text-[14px] text-black top-0 tracking-[-0.28px]">₱ 100.00</p>
    </div>
  );
}

function Frame69() {
  return (
    <div className="absolute h-[19.594px] left-0 top-[35.59px] w-[345px]" data-name="Frame">
      <Frame70 />
      <Frame71 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="absolute h-[55.188px] left-[16px] top-[288.43px] w-[345px]" data-name="Frame">
      <Frame66 />
      <Frame69 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="absolute h-[22.398px] left-0 top-0 w-[36.055px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.4px] left-0 not-italic text-[16px] text-black top-[-1px] tracking-[-0.48px]">Total</p>
    </div>
  );
}

function Frame75() {
  return (
    <div className="absolute h-[22.398px] left-[72.21px] top-0 w-[80.125px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.4px] left-0 not-italic text-[16px] text-black top-[-1px] tracking-[-0.48px]">₱ 1,600.00</p>
    </div>
  );
}

function Frame76() {
  return (
    <div className="absolute h-[14.398px] left-0 opacity-50 top-[27.4px] w-[152.336px]" data-name="Frame">
      <p className="-translate-x-full absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[14.4px] left-[153px] not-italic text-[12px] text-black text-right top-[-0.5px] tracking-[-0.24px]">(VAT included if applicable)</p>
    </div>
  );
}

function Frame74() {
  return (
    <div className="absolute h-[41.797px] left-[192.66px] top-0 w-[152.336px]" data-name="Frame">
      <Frame75 />
      <Frame76 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="absolute h-[41.797px] left-[16px] top-[367.62px] w-[345px]" data-name="Frame">
      <Frame73 />
      <Frame74 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="absolute h-[22.398px] left-[92.34px] top-[8.8px] w-[158.328px]" data-name="Frame">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.4px] left-[79.5px] not-italic text-[16px] text-center text-white top-[-0.5px] tracking-[-0.3125px]">Continue to Payment</p>
    </div>
  );
}

function Frame78() {
  return (
    <div className="h-[40px] overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame79 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[#3cd4b9] h-[42px] items-start left-[16px] p-px rounded-[8px] to-[#177564] top-[433.41px] w-[345px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <Frame78 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="h-[499.414px] relative shrink-0 w-full" data-name="Frame">
      <Frame49 />
      <Frame51 />
      <Frame60 />
      <Frame65 />
      <Frame72 />
      <Frame77 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[501.414px] items-start left-[489px] p-px rounded-[8px] top-0 w-[379px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#def2ee] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.03),0px_2px_2px_0px_rgba(0,0,0,0.03),0px_5px_5px_0px_rgba(0,0,0,0.05)]" />
      <Frame48 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="h-[856.367px] relative shrink-0 w-full" data-name="Frame">
      <Frame18 />
      <Frame47 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[975.766px] items-start left-[206.5px] top-[98px] w-[868px]" data-name="Frame">
      <Frame2 />
      <Frame17 />
    </div>
  );
}

function Frame84() {
  return (
    <div className="absolute left-0 size-[36px] top-0" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFrame1} />
    </div>
  );
}

function Frame85() {
  return (
    <div className="absolute h-[28px] left-[42px] top-[3px] w-[74.234px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-0 not-italic text-[#1e9680] text-[20px] top-[-0.5px] tracking-[-0.4px]">PlanOut</p>
    </div>
  );
}

function Frame83() {
  return (
    <div className="absolute h-[36px] left-0 top-[1.2px] w-[116.234px]" data-name="Frame">
      <Frame84 />
      <Frame85 />
    </div>
  );
}

function Frame88() {
  return (
    <div className="absolute h-[22.398px] left-[12px] top-[8px] w-[43.133px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[#181d27] text-[16px] top-[-1px] tracking-[-0.48px]">Home</p>
    </div>
  );
}

function Frame87() {
  return (
    <div className="absolute h-[38.398px] left-0 overflow-clip rounded-[6px] top-0 w-[67.133px]" data-name="Frame">
      <Frame88 />
    </div>
  );
}

function Frame90() {
  return (
    <div className="absolute h-[22.398px] left-[12px] top-[8px] w-[49.734px]" data-name="Frame">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.4px] left-0 not-italic text-[#177564] text-[16px] top-[-1px] tracking-[-0.48px]">Events</p>
    </div>
  );
}

function Frame89() {
  return (
    <div className="absolute bg-[#def2ee] h-[38.398px] left-[71.13px] overflow-clip rounded-[6px] top-0 w-[73.734px]" data-name="Frame">
      <Frame90 />
    </div>
  );
}

function Frame92() {
  return (
    <div className="absolute h-[22.398px] left-[12px] top-[8px] w-[58.445px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[#414651] text-[16px] top-[-1px] tracking-[-0.48px]">Support</p>
    </div>
  );
}

function Frame91() {
  return (
    <div className="absolute h-[38.398px] left-[148.87px] overflow-clip rounded-[6px] top-0 w-[82.445px]" data-name="Frame">
      <Frame92 />
    </div>
  );
}

function Frame86() {
  return (
    <div className="absolute h-[38.398px] left-[132.23px] top-0 w-[231.313px]" data-name="Frame">
      <Frame87 />
      <Frame89 />
      <Frame91 />
    </div>
  );
}

function Frame82() {
  return (
    <div className="absolute h-[38.398px] left-[32px] top-[16.8px] w-[363.547px]" data-name="Frame">
      <Frame83 />
      <Frame86 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[20.84%_12.5%_20.83%_12.5%]" data-name="Group">
      <div className="absolute inset-[20.84%_12.5%_20.83%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.59%_-5.13%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 17.1666">
            <path d={svgPaths.p10092880} id="Vector" stroke="var(--stroke-0, #7D8490)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame96() {
  return (
    <div className="h-[26px] overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Group2 />
    </div>
  );
}

function Frame95() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[26px] top-[7px]" data-name="Frame">
      <Frame96 />
    </div>
  );
}

function Frame97() {
  return (
    <div className="absolute h-[22.398px] left-[40px] top-[8.8px] w-[78.664px]" data-name="Frame">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.4px] left-0 not-italic text-[#7d8490] text-[16px] top-[-1px] tracking-[-0.48px]">My Tickets</p>
    </div>
  );
}

function Frame94() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[126.664px]" data-name="Frame">
      <Frame95 />
      <Frame97 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-1/4" data-name="Group">
      <div className="absolute inset-1/4" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p2c268c70} fill="var(--fill-0, #7D8490)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Frame100() {
  return (
    <div className="h-[40px] overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Group3 />
    </div>
  );
}

function Frame99() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[40px] top-0" data-name="Frame">
      <Frame100 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[8.33%_12.5%_8.35%_12.5%]" data-name="Group">
      <div className="absolute inset-[8.33%_12.5%_8.35%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6668 18.3304">
            <path d={svgPaths.p32b35000} id="Vector" stroke="var(--stroke-0, #7D8490)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame103() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Group4 />
    </div>
  );
}

function Frame102() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[10px] size-[20px] top-[10px]" data-name="Frame">
      <Frame103 />
    </div>
  );
}

function Frame101() {
  return (
    <div className="absolute left-[44px] overflow-clip rounded-[6px] size-[40px] top-0" data-name="Frame">
      <Frame102 />
    </div>
  );
}

function Frame98() {
  return (
    <div className="absolute h-[40px] left-[142.66px] top-0 w-[84px]" data-name="Frame">
      <Frame99 />
      <Frame101 />
    </div>
  );
}

function Frame105() {
  return (
    <div className="h-[40px] relative rounded-[200px] shrink-0 w-full" data-name="Frame">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[200px] size-full" src={imgFrame2} />
    </div>
  );
}

function Frame104() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[242.66px] rounded-[200px] size-[40px] top-0" data-name="Frame">
      <Frame105 />
    </div>
  );
}

function Frame93() {
  return (
    <div className="absolute h-[40px] left-[965.34px] top-[16px] w-[282.664px]" data-name="Frame">
      <Frame94 />
      <Frame98 />
      <Frame104 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="h-[72px] relative shrink-0 w-[1280px]" data-name="Frame">
      <Frame82 />
      <Frame93 />
    </div>
  );
}

function Frame107() {
  return (
    <div className="h-px overflow-clip relative shrink-0 w-full" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1">
        <path clipRule="evenodd" d="M1280 1H0V0H1280V1Z" fill="var(--fill-0, #E9EAEB)" fillRule="evenodd" id="Vector" />
      </svg>
    </div>
  );
}

function Frame106() {
  return (
    <div className="content-stretch flex flex-col h-px items-start relative shrink-0 w-full" data-name="Frame">
      <Frame107 />
    </div>
  );
}

function Frame109() {
  return (
    <div className="h-px overflow-clip relative shrink-0 w-full" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1">
        <path clipRule="evenodd" d="M1280 1H0V0H1280V1Z" fill="var(--fill-0, #E9EAEB)" fillRule="evenodd" id="Vector" />
      </svg>
    </div>
  );
}

function Frame108() {
  return (
    <div className="content-stretch flex flex-col h-px items-start relative shrink-0 w-full" data-name="Frame">
      <Frame109 />
    </div>
  );
}

function Frame80() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(249,250,251,0.6)] content-stretch flex flex-col items-center left-1/2 top-0 w-[1280px]" data-name="Frame">
      <Frame81 />
      <Frame106 />
      <Frame108 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-[#fafafa] h-[1322px] left-0 top-0 w-[1280px]" data-name="Frame">
      <Frame1 />
      <Frame80 />
    </div>
  );
}

export default function DesignCheckoutFlow() {
  return (
    <div className="bg-white relative size-full" data-name="Design Checkout Flow">
      <Frame />
    </div>
  );
}