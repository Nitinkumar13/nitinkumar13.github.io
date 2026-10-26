
export const CAMPAIGNS = [
  {
    id: "animal-care",

    category: "Animal Welfare",

    title: "Compassionate Care for Animals",

    image: "./assets/AnimalWelfare.png",

    imageAlt: "A woman feeding cows at an animal shelter",

    shortDescription:
      "Help us support food, veterinary care, rescue and welfare for animals in need.",

    description:
      "An initiative focused on improving the care, protection and welfare of animals in need. Funds raised will support eligible animal-care activities, including food, veterinary assistance, rescue-related expenses and other approved project costs, according to the campaign budget and applicable requirements.",

    story: `
Animals in need may require food, medical attention,
safe shelter and timely care.

Through this initiative, our Foundation aims to support
genuine animal-welfare activities and build the
foundation for our long-term vision of a modern,
technology-enabled Gaushala and animal rescue centre.

Every contribution will be recorded and used for the
disclosed campaign purpose, subject to the final
approved project plan and applicable requirements.
`,

    target: 500000,

    raised: 0,

    donors: 0,

    currency: "INR",

    status: "Upcoming",

    taxBenefit: false,

    useOfFunds: [
      {
        title: "Animal Food & Nutrition",
        percentage: 10
      },
      {
        title: "Veterinary Care & Medicines",
        percentage: null
      },
      {
        title: "Animal Rescue & Transportation",
        percentage: null
      },
      {
        title: "Shelter & Essential Care",
        percentage: null
      },
      {
        title: "Project Coordination & Administration",
        percentage: null
      }
    ],

    transparency: {
      publishUtilizationReports: true,
      publishActivityUpdates: true,
      maintainExpenseRecords: true
    },

    href: "campaign.html?id=animal-care",

    donateHref:
      "http://m-lp.co/nitinkum-53?utm_medium=campaign_page_share&utm_source=copy"
  }
];
