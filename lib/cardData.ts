import type { CardTemplate } from './types';

export const CARD_TEMPLATES: CardTemplate[] = [
  // ─── CHASE ───────────────────────────────────────────────────────────────
  {
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    annualFee: 550,
    color: '#1a3a5c',
    officialBenefitsUrl: 'https://creditcards.chase.com/travel-credit-cards/sapphire/reserve',
    benefits: [
      {
        name: '$300 Annual Travel Credit',
        description: 'Up to $300 in statement credits for travel purchases each cardmember year.',
        value: 300, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Global Entry / TSA PreCheck Credit',
        description: 'Up to $100 credit for Global Entry (every 4 years) or $85 for TSA PreCheck.',
        value: 100, frequency: 'once', category: 'travel',
      },
      {
        name: 'DoorDash DashPass',
        description: 'Complimentary DashPass subscription ($0 delivery fees, reduced service fees).',
        value: 96, frequency: 'annual', category: 'dining',
      },
      {
        name: '$10 Monthly Lyft Credit',
        description: '$10/month in Lyft Cash plus complimentary Lyft Pink All Access membership.',
        value: 10, frequency: 'monthly', category: 'travel',
      },
      {
        name: 'Primary Rental Car Insurance',
        description: 'Primary auto rental collision damage waiver — no need to file with personal insurance first.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Trip Cancellation/Interruption Insurance',
        description: 'Up to $10,000 per person / $20,000 per trip for non-refundable travel expenses.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
    ],
  },
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    annualFee: 95,
    color: '#1e4d8c',
    officialBenefitsUrl: 'https://creditcards.chase.com/travel-credit-cards/sapphire/preferred',
    benefits: [
      {
        name: '$50 Annual Hotel Credit',
        description: 'Up to $50 in annual hotel statement credits through Chase Travel.',
        value: 50, frequency: 'annual', category: 'travel',
      },
      {
        name: '$10 Monthly Dining Credit',
        description: '$10/month statement credit at select dining partners.',
        value: 10, frequency: 'monthly', category: 'dining',
      },
      {
        name: 'DoorDash DashPass',
        description: 'Complimentary DashPass subscription.',
        value: 96, frequency: 'annual', category: 'dining',
      },
      {
        name: 'Trip Cancellation Insurance',
        description: 'Up to $10,000 per person for non-refundable prepaid travel.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
    ],
  },
  {
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    annualFee: 0,
    color: '#2d6a4f',
    officialBenefitsUrl: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/flex',
    benefits: [
      {
        name: 'Cell Phone Protection',
        description: 'Up to $800 per claim ($25 deductible) when you pay monthly phone bill with the card.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Trip Cancellation Insurance',
        description: 'Up to $1,500 per person for non-refundable travel expenses.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Purchase Protection',
        description: 'Covers new purchases for 120 days against damage or theft, up to $500 per claim.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
    ],
  },
  {
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    annualFee: 0,
    color: '#145a32',
    officialBenefitsUrl: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited',
    benefits: [
      {
        name: 'Purchase Protection',
        description: 'Covers new purchases for 120 days against damage or theft, up to $500 per claim.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Extended Warranty',
        description: 'Extends US manufacturer\'s warranty by 1 additional year.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Trip Cancellation Insurance',
        description: 'Up to $1,500 per person for non-refundable travel expenses.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
    ],
  },
  {
    name: 'Chase Ink Business Cash',
    issuer: 'Chase',
    annualFee: 0,
    color: '#1b4f72',
    officialBenefitsUrl: 'https://creditcards.chase.com/business-credit-cards/ink/cash',
    benefits: [
      {
        name: 'Cell Phone Protection',
        description: 'Up to $1,000 per claim ($100 deductible) when you pay monthly phone bill with the card. Max 3 claims / $1,800 per year.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Purchase Protection',
        description: 'Covers new purchases for 120 days against damage or theft, up to $10,000 per claim.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Extended Warranty',
        description: 'Extends US manufacturer\'s warranty by 1 additional year.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
    ],
  },
  {
    name: 'Chase Ink Business Preferred',
    issuer: 'Chase',
    annualFee: 95,
    color: '#154360',
    officialBenefitsUrl: 'https://creditcards.chase.com/business-credit-cards/ink/preferred',
    benefits: [
      {
        name: 'Cell Phone Protection',
        description: 'Up to $1,000 per claim ($100 deductible) when you pay monthly phone bill. Max 3 claims / $1,800 per year.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Primary Rental Car Insurance',
        description: 'Primary auto rental collision damage waiver for business travel.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Trip Cancellation Insurance',
        description: 'Up to $5,000 per person / $10,000 per trip for non-refundable prepaid travel.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
    ],
  },
  {
    name: 'Chase Hyatt Personal',
    issuer: 'Chase',
    annualFee: 149,
    color: '#2c3e50',
    officialBenefitsUrl: 'https://creditcards.chase.com/travel-credit-cards/world-of-hyatt',
    benefits: [
      {
        name: 'Free Night Award (Cat 1–4)',
        description: 'One free night award at any Category 1–4 World of Hyatt property each cardmember anniversary year.',
        value: 150, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Bonus Free Night (Cat 1–4) after $15k',
        description: 'Earn a second free night award (Cat 1–4) after spending $15,000 in a cardmember year.',
        value: 150, frequency: 'annual', category: 'travel',
      },
      {
        name: 'World of Hyatt Discoverist Status',
        description: 'Automatic World of Hyatt Discoverist status plus 5 Elite Night Credits per year.',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'Chase Hyatt Business',
    issuer: 'Chase',
    annualFee: 199,
    color: '#1c2833',
    officialBenefitsUrl: 'https://creditcards.chase.com/business-credit-cards/world-of-hyatt',
    benefits: [
      {
        name: 'Free Night Award (Cat 1–4)',
        description: 'One free night award at any Category 1–4 World of Hyatt property each cardmember year.',
        value: 150, frequency: 'annual', category: 'travel',
      },
      {
        name: '$50 Semi-Annual Hyatt Credit',
        description: '$50 in statement credits twice per year ($100 total) for eligible Hyatt purchases.',
        value: 50, frequency: 'annual', category: 'travel',
      },
      {
        name: 'World of Hyatt Discoverist Status',
        description: 'Automatic Discoverist status plus 5 Elite Night Credits annually toward Globalist.',
        value: 0, frequency: 'annual', category: 'travel',
      },
      {
        name: '9 Elite Night Credits',
        description: '9 additional qualifying night credits toward World of Hyatt elite status each year.',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'The Ritz-Carlton™ Card',
    issuer: 'Chase',
    annualFee: 450,
    color: '#2e1f0e',
    officialBenefitsUrl: 'https://creditcards.chase.com/luxury-credit-cards/ritz-carlton',
    benefits: [
      {
        name: '$300 Annual Travel Credit',
        description: 'Up to $300 in statement credits for travel purchases (airlines, hotels, car rentals, etc.) per year.',
        value: 300, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Free Night Award (up to 85k pts)',
        description: 'One free night award worth up to 85,000 Marriott Bonvoy points each cardmember year.',
        value: 425, frequency: 'annual', category: 'travel',
      },
      {
        name: '$100 On-Property Credit',
        description: 'Up to $100 on-property credit for paid stays of 2+ consecutive nights at Ritz-Carlton or St. Regis.',
        value: 100, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Global Entry / TSA PreCheck Credit',
        description: 'Up to $100 for Global Entry or $85 for TSA PreCheck application fee.',
        value: 100, frequency: 'once', category: 'travel',
      },
      {
        name: 'Marriott Bonvoy Gold Elite Status',
        description: 'Automatic Marriott Bonvoy Gold Elite status.',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },

  // ─── AMERICAN EXPRESS ────────────────────────────────────────────────────
  {
    name: 'The Platinum Card® from American Express',
    issuer: 'American Express',
    annualFee: 695,
    color: '#4a4a4a',
    officialBenefitsUrl: 'https://www.americanexpress.com/us/credit-cards/card/platinum/',
    benefits: [
      {
        name: '$200 Airline Fee Credit',
        description: 'Up to $200 per calendar year for incidental fees at one selected qualifying airline.',
        value: 200, frequency: 'annual', category: 'travel',
      },
      {
        name: '$200 Hotel Credit',
        description: 'Up to $200 back on prepaid Fine Hotels + Resorts or The Hotel Collection bookings through Amex Travel.',
        value: 200, frequency: 'annual', category: 'travel',
      },
      {
        name: '$20 Monthly Digital Entertainment Credit',
        description: '$20/month for select streaming services (Disney+, Hulu, ESPN+, Peacock, NYT, Audible, etc.).',
        value: 20, frequency: 'monthly', category: 'entertainment',
      },
      {
        name: '$15 Monthly Uber Cash',
        description: '$15/month Uber Cash (plus $20 in December) for Uber rides or Uber Eats.',
        value: 15, frequency: 'monthly', category: 'travel',
      },
      {
        name: '$25 Monthly Equinox Credit',
        description: '$25/month credit for Equinox gym membership or Equinox+ digital app.',
        value: 25, frequency: 'monthly', category: 'other',
      },
      {
        name: '$189 CLEAR Plus Credit',
        description: 'Annual statement credit for CLEAR Plus airport security membership.',
        value: 189, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Global Entry / TSA PreCheck Credit',
        description: 'Up to $100 for Global Entry or $85 for TSA PreCheck every 4 years.',
        value: 100, frequency: 'once', category: 'travel',
      },
      {
        name: '$12.95 Monthly Walmart+ Credit',
        description: 'Monthly Walmart+ membership fee covered by statement credit.',
        value: 12.95, frequency: 'monthly', category: 'shopping',
      },
      {
        name: 'Hilton Honors Gold Status',
        description: 'Complimentary Hilton Honors Gold elite status.',
        value: 0, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Marriott Bonvoy Gold Elite',
        description: 'Complimentary Marriott Bonvoy Gold Elite status.',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'The Business Platinum Card® from American Express',
    issuer: 'American Express',
    annualFee: 695,
    color: '#5d4037',
    officialBenefitsUrl: 'https://www.americanexpress.com/us/credit-cards/card/business-platinum/',
    benefits: [
      {
        name: '$200 Annual Airline Fee Credit',
        description: 'Up to $200 per calendar year for incidental fees at one selected qualifying airline.',
        value: 200, frequency: 'annual', category: 'travel',
      },
      {
        name: '$90 Quarterly Indeed Credit',
        description: '$90 per quarter ($360/yr) in statement credits for Indeed hiring platform.',
        value: 360, frequency: 'annual', category: 'other',
      },
      {
        name: '$200 Semi-Annual Dell Credit',
        description: 'Up to $200 per semi-annual period ($400/yr) in statement credits for Dell Technologies purchases.',
        value: 400, frequency: 'annual', category: 'shopping',
      },
      {
        name: '$150 Annual Adobe Credit',
        description: 'Up to $150 per year in statement credits for eligible Adobe Creative Cloud products.',
        value: 150, frequency: 'annual', category: 'other',
      },
      {
        name: '$10 Monthly Wireless Credit',
        description: '$10/month statement credit for US wireless telephone service purchases.',
        value: 10, frequency: 'monthly', category: 'other',
      },
      {
        name: '$199 CLEAR Plus Credit',
        description: 'Annual statement credit for CLEAR Plus airport security membership.',
        value: 199, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Global Entry / TSA PreCheck Credit',
        description: 'Up to $100 for Global Entry or $85 for TSA PreCheck every 4.5 years.',
        value: 100, frequency: 'once', category: 'travel',
      },
      {
        name: 'Marriott Bonvoy Gold Elite',
        description: 'Complimentary Marriott Bonvoy Gold Elite status.',
        value: 0, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Hilton Honors Gold Status',
        description: 'Complimentary Hilton Honors Gold status.',
        value: 0, frequency: 'annual', category: 'travel',
      },
      {
        name: '35% Pay with Points Rebate',
        description: '35% of points back when using Pay with Points for flights through Amex Travel (up to 1M points/yr).',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'American Express® Gold Card',
    issuer: 'American Express',
    annualFee: 325,
    color: '#b8860b',
    officialBenefitsUrl: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
    benefits: [
      {
        name: '$10 Monthly Dining Credit',
        description: '$10/month credit at Grubhub, The Cheesecake Factory, Goldbelly, Wine.com, and Five Guys.',
        value: 10, frequency: 'monthly', category: 'dining',
      },
      {
        name: '$10 Monthly Uber Cash',
        description: '$10/month Uber Cash for Uber rides or Uber Eats.',
        value: 10, frequency: 'monthly', category: 'travel',
      },
      {
        name: '$50 Semi-Annual Resy Credit',
        description: 'Up to $50 twice per year in statement credits at US restaurants on Resy.',
        value: 50, frequency: 'annual', category: 'dining',
      },
      {
        name: '$7 Monthly Dunkin\' Credit',
        description: '$7/month statement credit for Dunkin\' purchases.',
        value: 7, frequency: 'monthly', category: 'dining',
      },
      {
        name: '$100 Hotel Credit',
        description: 'Up to $100 back on The Hotel Collection bookings of 2+ nights via Amex Travel.',
        value: 100, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'The American Express® Business Gold Card',
    issuer: 'American Express',
    annualFee: 375,
    color: '#7d6608',
    officialBenefitsUrl: 'https://www.americanexpress.com/us/credit-cards/card/business-gold/',
    benefits: [
      {
        name: '$20 Monthly Wireless/Shipping Credit',
        description: '$20/month in statement credits for US wireless telephone service or US shipping purchases. Up to $240/year.',
        value: 20, frequency: 'monthly', category: 'other',
      },
      {
        name: '$12.95 Monthly Walmart+ Credit',
        description: 'Monthly Walmart+ membership covered by statement credit.',
        value: 12.95, frequency: 'monthly', category: 'shopping',
      },
    ],
  },
  {
    name: 'American Express® Green Card',
    issuer: 'American Express',
    annualFee: 150,
    color: '#1e8449',
    officialBenefitsUrl: 'https://www.americanexpress.com/us/credit-cards/card/green/',
    benefits: [
      {
        name: '$189 CLEAR Plus Credit',
        description: 'Annual statement credit for CLEAR Plus airport security membership.',
        value: 189, frequency: 'annual', category: 'travel',
      },
      {
        name: '$25 Quarterly LoungeBuddy Credit',
        description: '$25 per quarter ($100/yr) in credits for lounge access through LoungeBuddy.',
        value: 25, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'Blue Business® Plus Credit Card from American Express',
    issuer: 'American Express',
    annualFee: 0,
    color: '#1565c0',
    officialBenefitsUrl: 'https://www.americanexpress.com/us/credit-cards/card/blue-business-plus/',
    benefits: [
      {
        name: 'Purchase Protection',
        description: 'Coverage for eligible purchases against accidental damage or theft for 90 days.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
      {
        name: 'Extended Warranty',
        description: 'Up to 1 additional year on eligible US manufacturer\'s warranties of 5 years or less.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
    ],
  },
  {
    name: 'Delta SkyMiles® Blue American Express Card',
    issuer: 'American Express',
    annualFee: 0,
    color: '#6e2594',
    officialBenefitsUrl: 'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-blue/',
    benefits: [
      {
        name: '20% Inflight Savings',
        description: '20% back as a statement credit on inflight purchases of food, beverages, and headsets on Delta flights.',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },

  // ─── CAPITAL ONE ─────────────────────────────────────────────────────────
  {
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    annualFee: 395,
    color: '#8b0000',
    officialBenefitsUrl: 'https://www.capitalone.com/credit-cards/venture-x/',
    benefits: [
      {
        name: '$300 Annual Travel Credit',
        description: 'Up to $300 in credits for bookings through Capital One Travel each year.',
        value: 300, frequency: 'annual', category: 'travel',
      },
      {
        name: '10,000 Anniversary Bonus Miles',
        description: '10,000 bonus miles on your account anniversary each year (~$100 in travel value).',
        value: 100, frequency: 'annual', category: 'credit',
      },
      {
        name: 'Global Entry / TSA PreCheck Credit',
        description: 'Up to $100 for Global Entry or $85 for TSA PreCheck.',
        value: 100, frequency: 'once', category: 'travel',
      },
      {
        name: 'Primary Rental Car Insurance',
        description: 'Primary rental car collision damage waiver when paying with the card.',
        value: 0, frequency: 'annual', category: 'insurance',
      },
    ],
  },

  // ─── BARCLAYS ────────────────────────────────────────────────────────────
  {
    name: 'JetBlue Plus Card',
    issuer: 'Barclays',
    annualFee: 99,
    color: '#003087',
    officialBenefitsUrl: 'https://www.jetblue.com/credit-cards/jetblue-plus-card',
    benefits: [
      {
        name: '5,000 Anniversary Bonus Points',
        description: '5,000 bonus TrueBlue points each account anniversary year (~$70 value).',
        value: 70, frequency: 'annual', category: 'credit',
      },
      {
        name: '10% Points Back on Redemptions',
        description: 'Get 10% of your TrueBlue points back every time you redeem for a JetBlue flight.',
        value: 0, frequency: 'annual', category: 'travel',
      },
      {
        name: 'First Checked Bag Free',
        description: 'First checked bag free for you and up to 3 travel companions on the same JetBlue itinerary.',
        value: 90, frequency: 'annual', category: 'travel',
      },
      {
        name: '50% Inflight Savings',
        description: '50% savings on inflight cocktails and food purchases on JetBlue flights.',
        value: 0, frequency: 'annual', category: 'dining',
      },
    ],
  },
  {
    name: 'Wyndham Rewards Earner Plus Card',
    issuer: 'Barclays',
    annualFee: 75,
    color: '#4a235a',
    officialBenefitsUrl: 'https://www.barclaycardus.com/apply/landing/wyndham-earner-plus/',
    benefits: [
      {
        name: '7,500 Anniversary Bonus Points',
        description: '7,500 bonus Wyndham Rewards points each anniversary year (enough for 1 free night at many properties).',
        value: 75, frequency: 'annual', category: 'credit',
      },
      {
        name: 'Platinum Status',
        description: 'Automatic Wyndham Rewards Platinum membership status.',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'Wyndham Rewards Earner Business Card',
    issuer: 'Barclays',
    annualFee: 95,
    color: '#6c3483',
    officialBenefitsUrl: 'https://www.barclaycardus.com/apply/landing/wyndham-earner-business/',
    benefits: [
      {
        name: '15,000 Anniversary Bonus Points',
        description: '15,000 bonus Wyndham Rewards points each anniversary year (enough for 1–2 free nights).',
        value: 150, frequency: 'annual', category: 'credit',
      },
      {
        name: 'Diamond Status',
        description: 'Automatic Wyndham Rewards Diamond membership status (top tier).',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'Hawaiian Airlines World Elite Mastercard',
    issuer: 'Barclays',
    annualFee: 99,
    color: '#8e1010',
    officialBenefitsUrl: 'https://www.barclaycardus.com/apply/landing/hawaiian-airlines/',
    benefits: [
      {
        name: 'Annual Companion Discount',
        description: '50% off companion fare on Hawaiian Airlines flights between Hawaii and North America each anniversary year.',
        value: 200, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Free Checked Bag',
        description: 'First checked bag free on Hawaiian Airlines flights for the cardholder.',
        value: 60, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'Hawaiian Airlines World Elite Business Mastercard',
    issuer: 'Barclays',
    annualFee: 99,
    color: '#7b0d0d',
    officialBenefitsUrl: 'https://www.barclaycardus.com/apply/landing/hawaiian-airlines-business/',
    benefits: [
      {
        name: 'Annual Companion Discount',
        description: '50% off companion fare on Hawaiian Airlines flights between Hawaii and North America each anniversary year.',
        value: 200, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Free Checked Bag',
        description: 'First checked bag free on Hawaiian Airlines flights for the cardholder.',
        value: 60, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'AAdvantage® Aviator® Red World Elite Mastercard®',
    issuer: 'Barclays',
    annualFee: 99,
    color: '#b22222',
    officialBenefitsUrl: 'https://cards.barclaycardus.com/banking/aadvantage-aviator-red-world-elite-mastercard/',
    benefits: [
      {
        name: 'First Checked Bag Free',
        description: 'First checked bag free for cardholder and up to 4 travel companions on the same itinerary.',
        value: 240, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Preferred Boarding',
        description: 'Group 5 preferred boarding on American Airlines flights.',
        value: 0, frequency: 'annual', category: 'travel',
      },
      {
        name: '25% Inflight Savings',
        description: '25% savings on inflight food and beverages on American Airlines flights.',
        value: 0, frequency: 'annual', category: 'dining',
      },
      {
        name: '10% Miles Back on Redemptions',
        description: '10% of redeemed AAdvantage miles back each year (up to 10,000 miles).',
        value: 0, frequency: 'annual', category: 'travel',
      },
    ],
  },

  // ─── BANK OF AMERICA ─────────────────────────────────────────────────────
  {
    name: 'Alaska Airlines Visa Signature® (Atmos Ascent)',
    issuer: 'Bank of America',
    annualFee: 95,
    color: '#006a4e',
    officialBenefitsUrl: 'https://www.bankofamerica.com/credit-cards/products/alaska-airlines-visa-credit-card/',
    benefits: [
      {
        name: 'Annual Companion Fare',
        description: 'One Companion Fare from $122 ($99 base + taxes/fees from $23) each account anniversary year.',
        value: 300, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Free Checked Bag',
        description: 'First checked bag free for cardholder and up to 6 guests on the same reservation.',
        value: 180, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'Alaska Airlines Visa Infinite® (Atmos Summit)',
    issuer: 'Bank of America',
    annualFee: 375,
    color: '#004d3a',
    officialBenefitsUrl: 'https://www.bankofamerica.com/credit-cards/products/alaska-airlines-visa-infinite-credit-card/',
    benefits: [
      {
        name: 'Annual Companion Fare',
        description: 'One Companion Fare from $122 each account anniversary year.',
        value: 300, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Alaska Lounge+ Membership',
        description: 'Complimentary Alaska Lounge+ membership with unlimited lounge visits.',
        value: 450, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Free Checked Bags',
        description: 'First and second checked bags free for cardholder and up to 6 guests.',
        value: 300, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Global Entry / TSA PreCheck Credit',
        description: 'Up to $100 for Global Entry or $85 for TSA PreCheck.',
        value: 100, frequency: 'once', category: 'travel',
      },
      {
        name: '$100 Alaska Airlines Credit',
        description: 'Up to $100 in statement credits for Alaska Airlines purchases annually.',
        value: 100, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'Bank of America® Premium Rewards® Elite',
    issuer: 'Bank of America',
    annualFee: 550,
    color: '#e31837',
    officialBenefitsUrl: 'https://www.bankofamerica.com/credit-cards/products/premium-rewards-elite-credit-card/',
    benefits: [
      {
        name: '$150 Annual Airline Incidental Credit',
        description: 'Up to $150 in statement credits for airline incidental fees annually.',
        value: 150, frequency: 'annual', category: 'travel',
      },
      {
        name: '$150 Annual Lifestyle Credit',
        description: 'Up to $150/year for eligible streaming, food delivery, and fitness purchases.',
        value: 150, frequency: 'annual', category: 'entertainment',
      },
      {
        name: 'Global Entry / TSA PreCheck Credit',
        description: 'Up to $100 for Global Entry or $85 for TSA PreCheck.',
        value: 100, frequency: 'once', category: 'travel',
      },
    ],
  },

  // ─── CITI ────────────────────────────────────────────────────────────────
  {
    name: 'Citi® / AAdvantage® Platinum Select®',
    issuer: 'Citi',
    annualFee: 99,
    color: '#003087',
    officialBenefitsUrl: 'https://www.citi.com/credit-cards/citi-aadvantage-platinum-select-world-elite-mastercard',
    benefits: [
      {
        name: 'First Checked Bag Free',
        description: 'Free first checked bag for cardholder and up to 4 travel companions on the same itinerary.',
        value: 240, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Preferred Boarding',
        description: 'Group 5 preferred boarding on American Airlines flights.',
        value: 0, frequency: 'annual', category: 'travel',
      },
      {
        name: '25% Inflight Savings',
        description: '25% savings on inflight food and beverages when you pay with the card.',
        value: 0, frequency: 'annual', category: 'dining',
      },
      {
        name: '$125 AA Flight Discount',
        description: '$125 American Airlines flight discount certificate after $20,000 in purchases within the cardmember year.',
        value: 125, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'CitiBusiness® / AAdvantage® Platinum Select®',
    issuer: 'Citi',
    annualFee: 99,
    color: '#1a237e',
    officialBenefitsUrl: 'https://www.citi.com/credit-cards/citibusiness-aadvantage-platinum-select-mastercard',
    benefits: [
      {
        name: 'First Checked Bag Free',
        description: 'Free first checked bag for cardholder and up to 4 travel companions on the same itinerary.',
        value: 240, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Preferred Boarding',
        description: 'Group 5 preferred boarding on American Airlines flights.',
        value: 0, frequency: 'annual', category: 'travel',
      },
      {
        name: '25% Inflight Savings',
        description: '25% savings on inflight food and beverages.',
        value: 0, frequency: 'annual', category: 'dining',
      },
      {
        name: '2 Admirals Club One-Day Passes',
        description: 'Two complimentary Admirals Club® One-Day Passes each cardmember year.',
        value: 100, frequency: 'annual', category: 'travel',
      },
      {
        name: 'Companion Certificate after $30k',
        description: 'American Airlines Companion Certificate (pay taxes/fees from $22) after $30,000 spend in a cardmember year.',
        value: 300, frequency: 'annual', category: 'travel',
      },
    ],
  },
  {
    name: 'Citi Premier® Card',
    issuer: 'Citi',
    annualFee: 95,
    color: '#0d47a1',
    officialBenefitsUrl: 'https://www.citi.com/credit-cards/citi-premier-credit-card',
    benefits: [
      {
        name: '$100 Annual Hotel Savings',
        description: 'Up to $100 off a single hotel stay of $500+ booked through thankyou.com (once per year).',
        value: 100, frequency: 'annual', category: 'travel',
      },
    ],
  },
];

export const CUSTOM_CARD_TEMPLATE = {
  name: 'Custom Card',
  issuer: 'Custom',
  annualFee: 0,
  color: '#374151',
  officialBenefitsUrl: '',
  benefits: [],
};
