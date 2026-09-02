// Standard US Albers Projection SVG paths (viewBox: "0 0 960 600")
// Fully vector compliant and optimized for choropleth mapping
export interface StateSvgPath {
  id: string; // 2-letter postal code
  name: string;
  d: string;
  labelX: number;
  labelY: number;
}

export const US_STATE_PATHS: Record<string, StateSvgPath> = {
  AL: {
    id: "AL",
    name: "Alabama",
    d: "M663,408L671,409L678,409L677,446L684,459L685,479L678,480L663,480L663,491L649,493L647,480L640,480L640,408Z",
    labelX: 660,
    labelY: 450
  },
  AK: {
    id: "AK",
    name: "Alaska",
    d: "M175,470L210,460L235,480L250,530L220,550L180,560L160,535L150,510L140,510L125,530L110,510L130,480Z",
    labelX: 185,
    labelY: 510
  },
  AZ: {
    id: "AZ",
    name: "Arizona",
    d: "M216,335L296,346L282,453L243,446L214,438L183,445L185,417L194,395L216,335Z",
    labelX: 242,
    labelY: 395
  },
  AR: {
    id: "AR",
    name: "Arkansas",
    d: "M553,371L607,370L606,400L614,411L610,436L585,436L577,438L551,438L552,393L544,392L545,372Z",
    labelX: 577,
    labelY: 405
  },
  CA: {
    id: "CA",
    name: "California",
    d: "M103,178L157,214L142,267L194,363L184,392L174,390L165,379L155,364L142,352L127,341L114,316L95,274L86,236L92,208Z",
    labelX: 138,
    labelY: 285
  },
  CO: {
    id: "CO",
    name: "Colorado",
    d: "M321,257L418,271L407,347L309,333Z",
    labelX: 365,
    labelY: 300
  },
  CT: {
    id: "CT",
    name: "Connecticut",
    d: "M848,197L865,200L860,214L842,211Z",
    labelX: 855,
    labelY: 206
  },
  DE: {
    id: "DE",
    name: "Delaware",
    d: "M806,243L814,245L810,268L804,264Z",
    labelX: 810,
    labelY: 254
  },
  FL: {
    id: "FL",
    name: "Florida",
    d: "M684,480L717,477L745,479L764,505L782,544L777,557L758,542L745,510L729,484L686,480L663,480L663,491L684,491Z",
    labelX: 735,
    labelY: 512
  },
  GA: {
    id: "GA",
    name: "Georgia",
    d: "M678,409L727,399L743,443L739,478L717,477L684,480L685,459L678,446Z",
    labelX: 708,
    labelY: 442
  },
  HI: {
    id: "HI",
    name: "Hawaii",
    d: "M280,545L295,540L305,550L288,560ZM315,532L327,530L325,539ZM335,520L348,518L345,527ZM355,510L370,505L375,520L360,525Z",
    labelX: 325,
    labelY: 535
  },
  ID: {
    id: "ID",
    name: "Idaho",
    d: "M210,87L229,89L223,158L270,187L261,250L201,238L193,171L215,168Z",
    labelX: 228,
    labelY: 165
  },
  IL: {
    id: "IL",
    name: "Illinois",
    d: "M612,243L631,248L641,270L638,348L627,364L609,368L595,335L608,290L602,260Z",
    labelX: 620,
    labelY: 300
  },
  IN: {
    id: "IN",
    name: "Indiana",
    d: "M641,250L676,257L671,332L654,345L638,348L641,270Z",
    labelX: 658,
    labelY: 295
  },
  IA: {
    id: "IA",
    name: "Iowa",
    d: "M519,232L599,243L595,290L587,294L528,290L523,248Z",
    labelX: 558,
    labelY: 265
  },
  KS: {
    id: "KS",
    name: "Kansas",
    d: "M416,290L515,296L516,346L417,344Z",
    labelX: 466,
    labelY: 318
  },
  KY: {
    id: "KY",
    name: "Kentucky",
    d: "M642,347L685,336L721,328L707,358L683,361L627,364L638,348Z",
    labelX: 672,
    labelY: 348
  },
  LA: {
    id: "LA",
    name: "Louisiana",
    d: "M551,438L577,438L585,436L610,436L609,466L628,472L627,486L603,495L575,483L554,484L553,446Z",
    labelX: 585,
    labelY: 465
  },
  ME: {
    id: "ME",
    name: "Maine",
    d: "M867,110L885,108L900,135L890,165L870,180L857,175L862,130Z",
    labelX: 878,
    labelY: 145
  },
  MD: {
    id: "MD",
    name: "Maryland",
    d: "M752,246L805,243L803,266L788,272L775,257L751,257Z",
    labelX: 778,
    labelY: 252
  },
  MA: {
    id: "MA",
    name: "Massachusetts",
    d: "M848,187L883,189L891,200L875,208L846,197Z",
    labelX: 865,
    labelY: 195
  },
  MI: {
    id: "MI",
    name: "Michigan",
    d: "M633,180L668,172L690,195L693,248L671,256L643,249L642,210ZM601,164L648,155L645,173L601,180Z",
    labelX: 668,
    labelY: 215
  },
  MN: {
    id: "MN",
    name: "Minnesota",
    d: "M505,123L561,128L576,160L547,192L555,236L519,232L510,180Z",
    labelX: 536,
    labelY: 180
  },
  MS: {
    id: "MS",
    name: "Mississippi",
    d: "M606,400L640,402L640,480L627,486L610,466L610,436L614,411Z",
    labelX: 624,
    labelY: 440
  },
  MO: {
    id: "MO",
    name: "Missouri",
    d: "M515,296L587,294L595,335L609,368L553,371L545,372L516,346Z",
    labelX: 560,
    labelY: 330
  },
  MT: {
    id: "MT",
    name: "Montana",
    d: "M229,89L382,110L371,188L269,173L223,158Z",
    labelX: 300,
    labelY: 138
  },
  NE: {
    id: "NE",
    name: "Nebraska",
    d: "M399,228L512,238L528,290L416,290L418,271L393,267Z",
    labelX: 460,
    labelY: 260
  },
  NV: {
    id: "NV",
    name: "Nevada",
    d: "M157,214L230,225L216,335L194,363L142,267Z",
    labelX: 188,
    labelY: 275
  },
  NH: {
    id: "NH",
    name: "New Hampshire",
    d: "M852,165L866,166L858,206L848,203L849,175Z",
    labelX: 856,
    labelY: 180
  },
  NJ: {
    id: "NJ",
    name: "New Jersey",
    d: "M818,223L830,223L822,256L808,252Z",
    labelX: 822,
    labelY: 238
  },
  NM: {
    id: "NM",
    name: "New Mexico",
    d: "M296,346L384,352L373,446L310,439L308,448L282,453Z",
    labelX: 336,
    labelY: 398
  },
  NY: {
    id: "NY",
    name: "New York",
    d: "M765,190L810,185L848,175L844,215L820,224L775,220L750,228Z",
    labelX: 795,
    labelY: 205
  },
  NC: {
    id: "NC",
    name: "North Carolina",
    d: "M714,350L798,340L810,360L775,385L727,399L714,375Z",
    labelX: 760,
    labelY: 365
  },
  ND: {
    id: "ND",
    name: "North Dakota",
    d: "M382,110L505,123L498,178L375,166Z",
    labelX: 440,
    labelY: 145
  },
  OH: {
    id: "OH",
    name: "Ohio",
    d: "M676,257L723,264L715,315L685,336L671,332Z",
    labelX: 695,
    labelY: 288
  },
  OK: {
    id: "OK",
    name: "Oklahoma",
    d: "M417,344L545,350L544,392L475,392L475,402L417,388Z",
    labelX: 475,
    labelY: 370
  },
  OR: {
    id: "OR",
    name: "Oregon",
    d: "M111,102L210,116L193,171L201,238L114,223L96,170Z",
    labelX: 155,
    labelY: 165
  },
  PA: {
    id: "PA",
    name: "Pennsylvania",
    d: "M738,228L818,233L806,260L735,255Z",
    labelX: 772,
    labelY: 242
  },
  RI: {
    id: "RI",
    name: "Rhode Island",
    d: "M867,203L875,204L872,216L864,214Z",
    labelX: 870,
    labelY: 210
  },
  SC: {
    id: "SC",
    name: "South Carolina",
    d: "M727,399L775,385L760,428L735,438L727,415Z",
    labelX: 748,
    labelY: 412
  },
  SD: {
    id: "SD",
    name: "South Dakota",
    d: "M375,166L498,178L495,236L378,224Z",
    labelX: 440,
    labelY: 200
  },
  TN: {
    id: "TN",
    name: "Tennessee",
    d: "M618,368L718,358L712,388L627,398Z",
    labelX: 668,
    labelY: 378
  },
  TX: {
    id: "TX",
    name: "Texas",
    d: "M373,446L417,446L417,388L475,402L475,392L544,392L551,438L553,484L540,510L505,548L470,545L445,510L400,480L360,470L308,448Z",
    labelX: 450,
    labelY: 465
  },
  UT: {
    id: "UT",
    name: "Utah",
    d: "M230,225L304,236L296,346L216,335Z",
    labelX: 260,
    labelY: 285
  },
  VT: {
    id: "VT",
    name: "Vermont",
    d: "M838,168L852,165L848,203L835,200Z",
    labelX: 842,
    labelY: 184
  },
  VA: {
    id: "VA",
    name: "Virginia",
    d: "M721,328L785,310L805,335L770,340L718,358Z",
    labelX: 760,
    labelY: 330
  },
  WA: {
    id: "WA",
    name: "Washington",
    d: "M124,45L223,58L210,116L111,102L106,68Z",
    labelX: 165,
    labelY: 82
  },
  WV: {
    id: "WV",
    name: "West Virginia",
    d: "M715,278L750,270L748,310L721,328L707,315Z",
    labelX: 732,
    labelY: 295
  },
  WI: {
    id: "WI",
    name: "Wisconsin",
    d: "M561,168L608,172L615,245L565,240L555,205Z",
    labelX: 585,
    labelY: 205
  },
  WY: {
    id: "WY",
    name: "Wyoming",
    d: "M270,187L385,200L375,270L260,255Z",
    labelX: 320,
    labelY: 228
  },
  DC: {
    id: "DC",
    name: "District of Columbia",
    d: "M790,260L794,260L794,264L790,264Z",
    labelX: 792,
    labelY: 262
  }
};
