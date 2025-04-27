import {
  Check,
  Database,
  Download,
  FileDown,
  HardDriveDownload,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import {
  Calendar,
  CircleHelp,
  FileArchive,
  FileSearch,
  GitFork,
  Maximize,
  Minimize,
  NotebookPen,
  Settings,
  Terminal,
} from "lucide-react";
import CountUp from "./CountUp";
import * as XLSX from "xlsx";

const Data = [
  {
    Email: "fdrewitt0@umn.edu",
    Name: "Francisco Drewitt",
    Date: "14/4/2024",
    UserID: "2930314d-766a-450b-9a44-f07de96e5469",
  },
  {
    Email: "ekynnd1@imageshack.us",
    Name: "Ethelred Kynnd",
    Date: "6/2/2025",
    UserID: "e241a928-c407-4c7d-93c5-238540d30f02",
  },
  {
    Email: "floder2@yolasite.com",
    Name: "Fanny Loder",
    Date: "22/2/2025",
    UserID: "041b993a-f13d-4d4f-a9f4-d748840da72d",
  },
  {
    Email: "selleyne3@kickstarter.com",
    Name: "Selma Elleyne",
    Date: "4/3/2024",
    UserID: "75d1ba8d-c827-4d11-90d2-4ae610f1c2d5",
  },
  {
    Email: "pcrowd4@mlb.com",
    Name: "Peyter Crowd",
    Date: "2/10/2024",
    UserID: "fc4fc512-0835-4f38-9c5d-2337888d2216",
  },
  {
    Email: "mmoir5@drupal.org",
    Name: "Mateo Moir",
    Date: "21/7/2024",
    UserID: "ef923cc5-d9c4-409d-b74b-ebb5aee1ecca",
  },
  {
    Email: "ereame6@cyberchimps.com",
    Name: "Elly Reame",
    Date: "27/9/2024",
    UserID: "f1247539-6ee1-42b1-b31a-d8cbf994971a",
  },
  {
    Email: "jgeorgievski7@deviantart.com",
    Name: "Jonathon Georgievski",
    Date: "29/1/2025",
    UserID: "b1615429-244b-4b67-8e87-be95ec5e72ea",
  },
  {
    Email: "ygoslin8@icio.us",
    Name: "Ynez Goslin",
    Date: "18/4/2024",
    UserID: "ccc42f94-152f-430e-9d77-45b9bee5ac14",
  },
  {
    Email: "meannetta9@ebay.co.uk",
    Name: "Muhammad Eannetta",
    Date: "25/6/2024",
    UserID: "9de1eb03-c2a7-4251-b3c9-0e780d1a317d",
  },
  {
    Email: "borgela@aboutads.info",
    Name: "Bailey Orgel",
    Date: "15/1/2025",
    UserID: "af4d6dd8-352f-43ef-a5e5-1bff904e6cb7",
  },
  {
    Email: "wswedelandb@addthis.com",
    Name: "Webster Swedeland",
    Date: "11/4/2024",
    UserID: "dbeaee99-93f1-444a-8605-49b4257e424a",
  },
  {
    Email: "njacquesc@posterous.com",
    Name: "Noelani Jacques",
    Date: "14/3/2024",
    UserID: "fe62f47b-9c52-4aeb-b7e9-c7cc51626a03",
  },
  {
    Email: "mswiffend@smh.com.au",
    Name: "Melodee Swiffen",
    Date: "27/11/2024",
    UserID: "573db1c2-bf61-4032-bc04-4f11245f4ac3",
  },
  {
    Email: "mwhykee@mozilla.org",
    Name: "Monique Whyke",
    Date: "3/11/2024",
    UserID: "7bb3dc4a-703e-4376-b50a-e0a6f9e76efb",
  },
  {
    Email: "gmuzzinif@princeton.edu",
    Name: "Gordy Muzzini",
    Date: "16/12/2024",
    UserID: "08ef8b3e-fddb-4e1d-92bb-220cf8a9367d",
  },
  {
    Email: "kdruelg@twitpic.com",
    Name: "Kris D'Ruel",
    Date: "11/1/2025",
    UserID: "bcf7565d-c270-4632-8a51-c306d0ae77b9",
  },
  {
    Email: "rpolkinhornh@ed.gov",
    Name: "Robinson Polkinhorn",
    Date: "22/4/2024",
    UserID: "8d8186d7-fc75-48ab-aca8-560d6a453d07",
  },
  {
    Email: "icleghorni@51.la",
    Name: "Isobel Cleghorn",
    Date: "12/2/2025",
    UserID: "b3f0bcb9-229f-437b-8d1e-2c605d16bc80",
  },
  {
    Email: "jgeeringj@cdbaby.com",
    Name: "Johnny Geering",
    Date: "13/7/2024",
    UserID: "f9b1a38b-1636-46ad-9506-4a86266c7d16",
  },
  {
    Email: "rdobbisonk@instagram.com",
    Name: "Rip Dobbison",
    Date: "8/10/2024",
    UserID: "1f4de4fd-f418-4805-9b94-e42ff7a2cba8",
  },
  {
    Email: "glydalll@google.es",
    Name: "Gris Lydall",
    Date: "10/9/2024",
    UserID: "b15ad08d-4c61-492e-8e16-835b304a99dd",
  },
  {
    Email: "sriseboroughm@cloudflare.com",
    Name: "Sianna Riseborough",
    Date: "12/8/2024",
    UserID: "b4a33c87-1eef-46f1-8038-924010a2c3b1",
  },
  {
    Email: "pbathowen@opensource.org",
    Name: "Pyotr Bathowe",
    Date: "29/7/2024",
    UserID: "36366ae5-ed88-4e3e-aa64-c4a54fe13576",
  },
  {
    Email: "ppatyo@cdc.gov",
    Name: "Patrice Paty",
    Date: "1/5/2024",
    UserID: "527ae287-597f-4f20-9c0e-cbc0f76c5ed4",
  },
  {
    Email: "pmerrallp@sbwire.com",
    Name: "Petey Merrall",
    Date: "18/2/2025",
    UserID: "6b4af294-db3c-4a42-8f8d-86bf3f5135da",
  },
  {
    Email: "fburnyateq@usnews.com",
    Name: "Fulton Burnyate",
    Date: "25/12/2024",
    UserID: "0778baec-ca9d-4ee7-a721-21f9ae8f75a9",
  },
  {
    Email: "gredshawr@google.co.jp",
    Name: "Gertruda Redshaw",
    Date: "5/2/2025",
    UserID: "e22da656-656a-4822-a87e-168e792e1d06",
  },
  {
    Email: "pfouldss@mit.edu",
    Name: "Papageno Foulds",
    Date: "25/1/2025",
    UserID: "b187cf7a-3066-4b61-a4ee-3c62e7d566e1",
  },
  {
    Email: "rbrumbyet@google.com.br",
    Name: "Regina Brumbye",
    Date: "20/5/2024",
    UserID: "b7854d95-b518-480b-a209-4fc79b45029d",
  },
  {
    Email: "spedrocchiu@blog.com",
    Name: "Solly Pedrocchi",
    Date: "11/3/2024",
    UserID: "90a94661-96ee-4e34-a4c6-c2f94adb5771",
  },
  {
    Email: "scarlislev@com.com",
    Name: "Saxon Carlisle",
    Date: "2/5/2024",
    UserID: "64f3fec6-0c0b-424b-8035-8b51162557b3",
  },
  {
    Email: "kbracegirdlew@wired.com",
    Name: "Karil Bracegirdle",
    Date: "7/3/2024",
    UserID: "cb0332e2-4624-4e4a-9ec4-3fbf7917d01b",
  },
  {
    Email: "adowdamx@paypal.com",
    Name: "Ashlie Dowdam",
    Date: "23/4/2024",
    UserID: "fdf2832d-1502-4655-ad84-dfd511735b90",
  },
  {
    Email: "ftwentymany@sbwire.com",
    Name: "Forster Twentyman",
    Date: "12/4/2024",
    UserID: "3404eef5-1313-4477-a78a-bb92cce97996",
  },
  {
    Email: "agledhallz@yolasite.com",
    Name: "Alf Gledhall",
    Date: "14/3/2024",
    UserID: "7c396e0e-4ae0-414e-8311-ea7312a9aed2",
  },
  {
    Email: "gfurze10@mtv.com",
    Name: "Guendolen Furze",
    Date: "20/4/2024",
    UserID: "6bd2c265-f528-470a-8526-2bf6bbae2ed1",
  },
  {
    Email: "fridolfi11@sourceforge.net",
    Name: "Findlay Ridolfi",
    Date: "18/4/2024",
    UserID: "997cf517-1317-4a88-96ac-85c3a73b27e1",
  },
  {
    Email: "yratley12@tumblr.com",
    Name: "Yolande Ratley",
    Date: "15/2/2025",
    UserID: "daf7e5f2-61d9-4699-9bf5-06be6b37df9b",
  },
  {
    Email: "cmarxsen13@histats.com",
    Name: "Chelsie Marxsen",
    Date: "30/6/2024",
    UserID: "33040fbf-76d8-46fc-8a41-0e03072a65fe",
  },
  {
    Email: "rpringour14@ca.gov",
    Name: "Rafa Pringour",
    Date: "16/7/2024",
    UserID: "e7340da1-581a-4790-8882-f5cfe2114bee",
  },
  {
    Email: "lhallin15@smugmug.com",
    Name: "Lester Hallin",
    Date: "5/9/2024",
    UserID: "efb173d8-e481-4f3f-aa47-649bdc6bd2f4",
  },
  {
    Email: "ljaspar16@rediff.com",
    Name: "Luther Jaspar",
    Date: "5/10/2024",
    UserID: "de446ded-3e24-426f-b9f6-fc8df9ba8bd9",
  },
  {
    Email: "wsmillie17@wired.com",
    Name: "Waylon Smillie",
    Date: "21/6/2024",
    UserID: "667790c5-aed0-41cc-b62c-73442a16044d",
  },
  {
    Email: "pgallahue18@domainmarket.com",
    Name: "Patsy Gallahue",
    Date: "6/9/2024",
    UserID: "e56f7216-80fe-4686-a17a-54e0855e3f26",
  },
  {
    Email: "ccolebourn19@com.com",
    Name: "Cristy Colebourn",
    Date: "18/4/2024",
    UserID: "f2c71215-5372-4738-a614-defb6f1ee654",
  },
  {
    Email: "bcolston1a@home.pl",
    Name: "Bran Colston",
    Date: "5/8/2024",
    UserID: "10351806-4fcf-4831-ac19-9491606ce013",
  },
  {
    Email: "pgoodsir1b@php.net",
    Name: "Peta Goodsir",
    Date: "8/10/2024",
    UserID: "3dd5660d-2bae-4acd-9b55-a649f0142b56",
  },
  {
    Email: "bpiscopo1c@privacy.gov.au",
    Name: "Bessie Piscopo",
    Date: "25/9/2024",
    UserID: "47257965-78f8-4647-bcec-f61e6ef0361f",
  },
  {
    Email: "hpigne1d@soup.io",
    Name: "Hedi Pigne",
    Date: "4/12/2024",
    UserID: "8dea8ec9-5c06-41b1-88ff-2ce3c31e1aa1",
  },
  {
    Email: "gmullard1e@a8.net",
    Name: "Gleda Mullard",
    Date: "30/11/2024",
    UserID: "08b1480a-bc00-4f77-b168-660e7fb5654f",
  },
  {
    Email: "abamb1f@unblog.fr",
    Name: "Analiese Bamb",
    Date: "8/9/2024",
    UserID: "aff6307d-0c39-418f-a338-5d5bdbd8800c",
  },
  {
    Email: "mchuney1g@answers.com",
    Name: "Marlene Chuney",
    Date: "15/8/2024",
    UserID: "1b756ca1-acc8-4e5c-bcee-ee0af13ddcf2",
  },
  {
    Email: "cbresland1h@businesswire.com",
    Name: "Conrado Bresland",
    Date: "1/10/2024",
    UserID: "8b07b997-a3af-497e-8ae6-93dd9c9a0dc6",
  },
  {
    Email: "lrown1i@microsoft.com",
    Name: "Lydon Rown",
    Date: "10/9/2024",
    UserID: "66088267-7572-481a-8658-9356f877958a",
  },
  {
    Email: "ibeston1j@angelfire.com",
    Name: "Idalia Beston",
    Date: "16/6/2024",
    UserID: "84ad4467-bab4-440a-af56-c1f4a9ddf097",
  },
  {
    Email: "hmardlin1k@ebay.co.uk",
    Name: "Hewe Mardlin",
    Date: "27/11/2024",
    UserID: "19e224bb-8a58-4ef6-9a82-80f8dabab0ed",
  },
  {
    Email: "gcoyte1l@geocities.com",
    Name: "Garret Coyte",
    Date: "5/1/2025",
    UserID: "24c0a235-ea93-47de-9efa-528d35fb7d6e",
  },
  {
    Email: "hmcgill1m@imdb.com",
    Name: "Had McGill",
    Date: "16/6/2024",
    UserID: "97ba1c1e-f685-42d9-b2b2-9193a7607bdb",
  },
  {
    Email: "dchicken1n@eventbrite.com",
    Name: "Deena Chicken",
    Date: "3/1/2025",
    UserID: "458d4ecb-2043-4079-b4c5-4d2f63b9ee5b",
  },
  {
    Email: "amaccrackan1o@quantcast.com",
    Name: "Alena MacCrackan",
    Date: "23/1/2025",
    UserID: "4388e0bf-a5f9-4c64-9fe5-8e3898bc2bbf",
  },
  {
    Email: "sschoroder1p@tmall.com",
    Name: "Shandie Schoroder",
    Date: "14/8/2024",
    UserID: "25cecaab-d814-41ce-9a09-0973d5b77e58",
  },
  {
    Email: "melsop1q@tiny.cc",
    Name: "Matthus Elsop",
    Date: "28/11/2024",
    UserID: "9118d5e5-8c62-457b-bb30-028ec667ea9c",
  },
  {
    Email: "rmartignoni1r@ucla.edu",
    Name: "Richard Martignoni",
    Date: "4/9/2024",
    UserID: "7852e406-dcaf-4889-9e41-eb820bf4096e",
  },
  {
    Email: "rgittoes1s@google.fr",
    Name: "Raymund Gittoes",
    Date: "22/11/2024",
    UserID: "0e75bc6e-836f-4675-ac7d-8dc4178cf2d4",
  },
  {
    Email: "cmorsley1t@amazon.co.jp",
    Name: "Costanza Morsley",
    Date: "4/1/2025",
    UserID: "8f89ac8b-4820-44b3-a560-2ce4c33c31ab",
  },
  {
    Email: "wwooller1u@hhs.gov",
    Name: "Wayne Wooller",
    Date: "28/10/2024",
    UserID: "d95d8388-1318-434c-8ccf-d026fca433fc",
  },
  {
    Email: "seasom1v@amazon.de",
    Name: "Sterling Easom",
    Date: "5/5/2024",
    UserID: "c4bc1d60-3d90-496f-8360-ad436d97741b",
  },
  {
    Email: "rlimbourne1w@typepad.com",
    Name: "Roddy Limbourne",
    Date: "3/2/2025",
    UserID: "46b72dfc-9e36-4094-bce6-3a98cbdb9eab",
  },
  {
    Email: "agoalby1x@icq.com",
    Name: "Amii Goalby",
    Date: "24/5/2024",
    UserID: "01472be9-3446-43f1-9c50-c1aa916557c6",
  },
  {
    Email: "amarjot1y@github.com",
    Name: "Antonietta Marjot",
    Date: "3/12/2024",
    UserID: "f2a6683c-67fe-4d85-960c-1808d2deffc9",
  },
  {
    Email: "vrobertshaw1z@chron.com",
    Name: "Vivi Robertshaw",
    Date: "18/2/2025",
    UserID: "6032eb3d-dbd4-4b67-aaba-fc9383936f17",
  },
  {
    Email: "jgronauer20@buzzfeed.com",
    Name: "Jedediah Gronauer",
    Date: "9/11/2024",
    UserID: "5240bebd-b154-4fd6-aaad-4efade12e245",
  },
  {
    Email: "gofarris21@cnet.com",
    Name: "Geralda O'Farris",
    Date: "11/7/2024",
    UserID: "3374885f-668c-4b26-a90a-3736d79a3408",
  },
  {
    Email: "grobarts22@prnewswire.com",
    Name: "Gaby Robarts",
    Date: "13/4/2024",
    UserID: "d2200d9a-d0e5-41d1-8cb1-64dd5ae8fbfc",
  },
  {
    Email: "fchilcotte23@narod.ru",
    Name: "Foss Chilcotte",
    Date: "10/7/2024",
    UserID: "cbc1139c-fe4d-47e9-bb65-683c24dc9183",
  },
  {
    Email: "cocullen24@gmpg.org",
    Name: "Clement O'Cullen",
    Date: "7/8/2024",
    UserID: "22848913-b22b-43f1-b5b8-46841386aed9",
  },
  {
    Email: "emcowan25@constantcontact.com",
    Name: "Evin McOwan",
    Date: "11/10/2024",
    UserID: "98c24fb9-0a78-4616-8406-d3cbe3eba8a9",
  },
  {
    Email: "mhedderly26@bbb.org",
    Name: "Muriel Hedderly",
    Date: "29/8/2024",
    UserID: "2c54b7cc-147b-45c2-b31f-623232e76044",
  },
  {
    Email: "vfeavyour27@behance.net",
    Name: "Valera Feavyour",
    Date: "29/4/2024",
    UserID: "25ce4c2b-5858-4544-8abe-acc7d399662d",
  },
  {
    Email: "mcastillon28@harvard.edu",
    Name: "Misty Castillon",
    Date: "7/10/2024",
    UserID: "81b93ff8-09c3-4b08-ab09-5e7c6e00891b",
  },
  {
    Email: "mhurleston29@cbslocal.com",
    Name: "Mimi Hurleston",
    Date: "13/12/2024",
    UserID: "ca49cafa-222c-4221-a883-65685cc3f5cf",
  },
  {
    Email: "guwins2a@intel.com",
    Name: "Gweneth Uwins",
    Date: "18/6/2024",
    UserID: "7664a9e1-57c6-48ed-b43b-ec995d8cc590",
  },
  {
    Email: "ncorbally2b@typepad.com",
    Name: "Noam Corbally",
    Date: "14/3/2024",
    UserID: "35bb3b58-292f-45e9-89a8-19e6d6609a70",
  },
  {
    Email: "ajohncey2c@discuz.net",
    Name: "Annemarie Johncey",
    Date: "1/10/2024",
    UserID: "27cc43c1-35de-4901-8637-62560443e638",
  },
  {
    Email: "rcurrm2d@examiner.com",
    Name: "Rubetta Currm",
    Date: "26/4/2024",
    UserID: "8503c328-4b63-4808-98a9-ef817ef7dd87",
  },
  {
    Email: "hchaloner2e@hibu.com",
    Name: "Hephzibah Chaloner",
    Date: "13/11/2024",
    UserID: "4ba2f7e4-ba3a-45cd-a0d8-1f47f9738fd2",
  },
  {
    Email: "amartinon2f@about.me",
    Name: "Ame Martinon",
    Date: "20/5/2024",
    UserID: "c4e8f489-2602-4378-aa48-47a3926a898a",
  },
  {
    Email: "cbalazot2g@plala.or.jp",
    Name: "Cilka Balazot",
    Date: "5/5/2024",
    UserID: "4afa3be1-a149-4912-a3e7-d51f824283df",
  },
  {
    Email: "lcolcomb2h@google.pl",
    Name: "Lauren Colcomb",
    Date: "26/4/2024",
    UserID: "906b653f-cf4f-4ba0-8973-d2baf57e725d",
  },
  {
    Email: "mvanyukhin2i@51.la",
    Name: "Marylee Vanyukhin",
    Date: "18/9/2024",
    UserID: "8052b3c6-262a-4062-af8e-a24a87be3ade",
  },
  {
    Email: "cendrici2j@wikipedia.org",
    Name: "Constantia Endrici",
    Date: "30/9/2024",
    UserID: "df33e2f9-c9e1-4395-bf65-b3a0565d5337",
  },
  {
    Email: "rdomingues2k@360.cn",
    Name: "Randolf Domingues",
    Date: "16/5/2024",
    UserID: "d83a1862-62de-4e70-b408-7ba87f75763f",
  },
  {
    Email: "ggilbody2l@ox.ac.uk",
    Name: "Gasparo Gilbody",
    Date: "16/5/2024",
    UserID: "1acb7167-c95f-4006-8f7f-fd7ee164444c",
  },
  {
    Email: "cle2m@desdev.cn",
    Name: "Car Le Pine",
    Date: "10/6/2024",
    UserID: "00a4d62d-8cc2-4d0f-bf93-1b8e2a518e7f",
  },
  {
    Email: "mpitson2n@mozilla.org",
    Name: "Mariele Pitson",
    Date: "20/2/2025",
    UserID: "96fb6b4b-873e-495c-b425-a3fe517b5661",
  },
  {
    Email: "tunworth2o@wikimedia.org",
    Name: "Trace Unworth",
    Date: "8/11/2024",
    UserID: "08fa5dce-f3d1-4441-83ee-5c32b7918e46",
  },
  {
    Email: "klukas2p@cnet.com",
    Name: "Kristofer Lukas",
    Date: "14/7/2024",
    UserID: "b85d4665-a2e1-43c6-8925-08f47a93b2bd",
  },
  {
    Email: "cmouth2q@si.edu",
    Name: "Celestyna Mouth",
    Date: "11/4/2024",
    UserID: "5cec918f-b5ef-4ba9-80de-51846e295800",
  },
  {
    Email: "ljaqueminet2r@comcast.net",
    Name: "Lurlene Jaqueminet",
    Date: "23/4/2024",
    UserID: "d1d150c6-25cf-412c-a7e2-ff1f897776d3",
  },
];

export default function AdminPage() {
  const [selectedData, setSelectedData] = useState([]);
  const [isSettings, setIsSettings] = useState(false);

  function formatDate(inputDate) {
    const [day, month, year] = inputDate.split("/").map(Number);

    const suffixes = ["th", "st", "nd", "rd"];
    const relevantSuffix =
      day % 10 < 4 && ![11, 12, 13].includes(day) ? suffixes[day % 10] : "th";

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${day}${relevantSuffix} ${monthNames[month - 1]}, ${year}`;
  }

  const downloadExcel = () => {
    // Define column order
    const orderedData = Data.map(({ Name, Email, Date, UserID }) => ({
      Name,
      Email,
      Date,
      UserID,
    }));

    // Convert ordered data to worksheet
    const ws = XLSX.utils.json_to_sheet(orderedData);

    // Set column widths dynamically
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Date
      { wch: 10 }, // UserID
    ];

    ws["!cols"] = columnWidths;

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save as an Excel file
    XLSX.writeFile(wb, "data.xlsx");
  };

  return (
    <div className="w-full h-[100svh] flex justify-center items-start font-[DMSr] text-[14px] bg-[#1D1E20] text-[white]">
      <div
        className={
          "h-full w-[50px] hidden md:flex lg:flex flex-col justify-start items-center  " +
          (false
            ? " bg-[#141414] text-[#9ba6aa]"
            : " bg-[#ffffff00] text-[#6e6e7c]")
        }
        // style={{ transitionDelay: props?.isMinimise ? ".3s" : "0s" }}
      >
        {/* {isSettings ? (
          <>
            <SettingsPage
              theme={false}
              isSettings={isSettings}
              setIsSettings={setIsSettings}
            />
          </>
        ) : (
          <></>
        )} */}
        <div className="w-full h-[40px] border-b-[1.5px] border-[#25252500] flex justify-center items-center">
          <div className=""></div>
        </div>
        <div
          className={
            "h-[calc(100%-40px)] w-[50px] flex flex-col justify-between items-center py-[18px] border-r-[1.5px] border-[#25252500]" +
            (false ? " bg-[#141414]" : " bg-[#ffffff00]")
          }
        >
          <div className="flex flex-col justify-start items-center w-full">
            <FileSearch
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (false ? " hover:text-[#ffffff]" : " hover:text-[#1e1e1ee4]")
              }
            />
            <FileArchive
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (false ? " hover:text-[#ffffff]" : " hover:text-[#1e1e1ee4]")
              }
            />
            {/* <GitFork
          width={20}
          height={20}
          strokeWidth="1.8"
          className="mb-[18px] text-[#7b798b] hover:text-[#000000] cursor-pointer"
        /> */}
            <NotebookPen
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (false ? " hover:text-[#ffffff]" : " hover:text-[#1e1e1ee4]")
              }
            />
            <Calendar
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (false ? " hover:text-[#ffffff]" : " hover:text-[#1e1e1ee4]")
              }
            />
            <Terminal
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (false ? " hover:text-[#ffffff]" : " hover:text-[#1e1e1ee4]")
              }
            />
          </div>
          <div className="flex flex-col justify-end items-center w-full">
            <CircleHelp
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (false ? " hover:text-[#ffffff]" : " hover:text-[#1e1e1ee4]")
              }
            />
            <Settings
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                " cursor-pointer" +
                (false ? " hover:text-[#ffffff]" : " hover:text-[#1e1e1ee4]")
              }
              onClick={() => {
                setIsSettings(!isSettings);
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-[300px] h-[100svh] flex flex-col justify-start items-start  p-[20px]">
        <div className="flex justify-start items-center font-[geistSemibold] text-[16px]">
          Write a Query
        </div>
        <div className="w-full flex justify-start items-center">
          <div className="px-[10px] py-[6px] rounded-md flex justify-center items-center bg-[#061322de] text-[white] cursor-pointer h-[28px]">
            SELECT
          </div>
        </div>
        <textarea
          className=" w-full rounded-lg mt-[20px] outline-none p-[15px] py-[10px] bg-transparent border-[1.5px] border-[#ededed00]"
          placeholder="eg. SELECT * FROM Database"
        ></textarea>
        <div className="w-full rounded-lg mt-[20px] h-[300px] p-[15px] py-[10px] border-[1.5px] border-[#ededed00]">
          <div className="w-full h-full overflow-scroll flex justify-start items-start">
            <div className="w-auto flex flex-col justify-center items-start px-[10px]">
              <pre className="w-auto h-[30px] text-[#777777] font-bold">
                Name
              </pre>
              {Data.map((data, index) => {
                return (
                  <pre className="w-auto h-[30px] whitespace-nowrap text-[#adadad]">
                    {data?.Name}
                  </pre>
                );
              })}
            </div>
            <div className="w-auto flex flex-col justify-center items-start px-[10px]">
              <pre className="w-auto h-[30px] text-[#777777] font-bold">
                Email
              </pre>
              {Data.map((data, index) => {
                return (
                  <pre className="w-auto h-[30px] whitespace-nowrap text-[#adadad]">
                    {data?.Email}
                  </pre>
                );
              })}
            </div>
            <div className="w-auto flex flex-col justify-center items-start px-[10px]">
              <pre className="w-auto h-[30px] text-[#777777] font-bold">
                Date
              </pre>
              {Data.map((data, index) => {
                return (
                  <pre className="w-auto h-[30px] whitespace-nowrap text-[#adadad]">
                    {data?.Date}
                  </pre>
                );
              })}
            </div>
            <div className="w-auto flex flex-col justify-center items-start px-[10px]">
              <pre className="w-auto h-[30px] text-[#777777] font-bold">
                UserID
              </pre>
              {Data.map((data, index) => {
                return (
                  <pre className="w-auto h-[30px] whitespace-nowrap text-[#adadad]">
                    {data?.UserID}
                  </pre>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%-350px)] h-[100svh] flex flex-col justify-start items-start bg-[#1D1E20] border-[1.5px] border-[#ededed00] rounded-lg p-[30px]">
        <div className="w-full flex justify-start items-center">
          <div className="w-[calc((100%-40px)/3)] max-w-[250px] h-[100px] rounded-xl p-[20px] flex flex-col justify-start items-start bg-[#18191B] py-[15px] border-[1.5px] border-[#272b30]">
            <pre className="text-[30px] font-extrabold">
              <CountUp
                from={0}
                to={1789}
                separator=""
                direction="up"
                duration={0.5}
                className="count-up-text"
              />
            </pre>
            <pre className="text-[#adadad]">Total users</pre>
          </div>
          <div className="w-[calc((100%-40px)/3)] max-w-[250px] ml-[20px] h-[100px] rounded-lg p-[20px] flex flex-col justify-start items-start bg-[#18191B] py-[15px] border-[1.5px] border-[#272b30]">
            <pre className="text-[30px] font-extrabold">
              <CountUp
                from={0}
                to={345}
                separator=""
                direction="up"
                duration={0.5}
                className="count-up-text"
              />
            </pre>
            <pre className="text-[#adadad]">Last month engagement</pre>
          </div>
          <div className="w-[calc((100%-40px)/3)] max-w-[250px] ml-[20px] h-[100px] rounded-lg p-[20px] flex flex-col justify-start items-start bg-[#18191B] py-[15px] border-[1.5px] border-[#272b30]">
            <pre className="text-[30px] font-extrabold">
              <CountUp
                from={0}
                to={100384}
                separator=""
                direction="up"
                duration={0.5}
                className="count-up-text"
              />
            </pre>
            <pre className="text-[#adadad]">Total users</pre>
          </div>
        </div>
        <div className="w-full flex justify-between items-center mt-[30px] h-[35px]">
          <pre className="text-[#adadad] whitespace-nowrap">
            {/* <Database
              width={16}
              height={16}
              strokeWidth="2"
              className="mr-[5px]"
            /> */}
            Database / Total Records :{" "}
            <span className="text-[white]">{Data?.length}</span>
          </pre>
          <div className="flex justify-end items-center">
            <pre
              className="px-[8px] py-[6px] rounded-lg flex justify-center items-center bg-[#323336] cursor-pointer h-[30px] text-[white]  hover:bg-[#3f4044]"
              onClick={downloadExcel}
            >
              Export{" "}
              <HardDriveDownload
                width={16}
                height={16}
                strokeWidth="2"
                className="ml-[5px]"
              />{" "}
            </pre>{" "}
            <pre className=" py-[6px] rounded-lg flex justify-center items-center cursor-pointer h-[33px] text-[#adadad] hover:text-[white] ml-[15px] ">
              {/* Export{" "} */}
              <Search width={16} height={16} strokeWidth="2" className="" />
            </pre>
          </div>
        </div>
        <div className="w-full h-[calc(100%-175px)] overflow-y-scroll flex flex-col justify-start items-start bg-[#141414] border-[1.5px] border-[#272b30] rounded-xl mt-[10px] text-[14px] text-[#777777]">
          <div className="w-full min-h-[35px] flex justify-start items-center font-[geistSemibold] px-[12px]">
            <div className="w-[35px] flex justify-start items-center">
              <div
                className={
                  "w-[17px] h-[17px] rounded-[6px] border-[1.5px] cursor-pointer flex justify-center items-center" +
                  (selectedData?.length == Data?.length
                    ? " bg-[#5e5e5ec4] border-[#5e5e5e]"
                    : " bg-[#ffffff00] border-[#303030]")
                }
                onClick={() => {
                  if (selectedData?.length == Data?.length) {
                    setSelectedData([]);
                  } else {
                    setSelectedData([...Array(Data?.length).keys()]);
                  }
                }}
              >
                {selectedData?.length == Data?.length ? (
                  <>
                    <Check
                      width={10}
                      height={10}
                      strokeWidth={4.8}
                      className="text-[white]"
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <pre className="font-bold w-[200px]">Name</pre>
            <pre className="font-bold w-[300px]">Email</pre>
            <pre className="font-bold w-[200px]">Date</pre>
            <pre className="font-bold w-[calc(100%-735px)]">UserID</pre>
          </div>
          <div
            className="w-full h-[calc(100%-35px)] overflow-y-scroll flex flex-col justify-start its
          "
          >
            {Data?.map((data, index) => {
              return (
                <div
                  key={index}
                  className={
                    "w-full min-h-[35px] flex justify-start items-center border-t-[1.5px] border-[#ededed00] px-[12px]  hover:text-[white] group" +
                    (selectedData?.includes(index)
                      ? " text-[white]"
                      : " text-[#adadad]") +
                    (index % 2 == 0 ? " bg-[#18191B]" : " bg-transparent")
                  }
                  onClick={() => {
                    if (selectedData?.includes(index)) {
                      setSelectedData(
                        selectedData?.filter((data) => data !== index)
                      );
                    } else {
                      setSelectedData((prev) => [...prev, index]);
                    }
                  }}
                >
                  <div className="w-[35px] flex justify-start items-center">
                    <div
                      className={
                        "w-[17px] h-[17px] rounded-[6px] border-[1.5px] cursor-pointer flex justify-center items-center group-hover:border-[#5e5e5e]" +
                        (selectedData?.includes(index)
                          ? " bg-[#5e5e5ec4] border-[#5e5e5e]"
                          : " bg-[#ffffff00] border-[#303030]")
                      }
                    >
                      {selectedData?.includes(index) ? (
                        <>
                          <Check
                            width={10}
                            height={10}
                            strokeWidth={4.8}
                            className="text-[white]"
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <pre className="w-[200px]">{data?.Name}</pre>
                  <pre className="w-[300px]">{data?.Email}</pre>
                  <pre className="w-[200px]">{formatDate(data?.Date)}</pre>
                  <pre className="w-[calc(100%-735px)] text-ellipsis whitespace-nowrap overflow-hidden">
                    {data?.UserID}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
