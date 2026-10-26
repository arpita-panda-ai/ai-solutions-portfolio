import type { Department, IssueType } from './types'

// Real-world evaluation set, sourced from a public Kaggle dataset of actual (anonymised) IT
// service desk tickets, not synthetic text. See REAL_WORLD_SOURCE below for provenance,
// licensing and sampling method. Ground-truth labels here were assigned by hand, reading each
// ticket's actual text (not just trusting the source dataset's own category), BEFORE looking at
// what the rules engine outputs, a genuine blind test, same discipline as the synthetic set.
//
// expectedDepartment defaults to the dataset's own "Topic_group" (sourceCategory): that native
// label is generally trustworthy since it reflects how the business actually routed the ticket.
// expectedIssueType has no native equivalent and is hand-labelled fresh under the new rubric.
export interface RealWorldCase {
  id: string
  sourceCategory: string
  text: string
  expectedDepartment: Department
  expectedIssueType: IssueType
  note?: string
}

export const REAL_WORLD_SOURCE = {
  name: 'IT Service Ticket Classification Dataset',
  author: 'adisongoh (Kaggle)',
  license: 'CC0: Public Domain',
  totalRows: 47837,
  sampleSize: 40,
  samplingMethod:
    'Stratified random sample (seed 42), 5 tickets from each of the dataset\'s 8 "Topic_group" categories: 40 cases in total. The first version of this evaluation sampled 35 cases across only 7 categories, excluding "HR Support" (10,915 of the 47,837 rows), because it had no analog in this engine\'s old single-axis request-type schema. Once the engine moved to an independent Department × Issue type model, Department became a straightforward match against all 8 native categories, so HR Support was added back in as a full 5-ticket stratum: these are RW36–RW40 below. Figures on this page are for the current, 40-case, 8-category version only; they are not directly comparable to any 35-case figure quoted elsewhere.',
  preprocessingCaveat:
    'The publisher has already lowercased this text, stripped punctuation, removed stopwords and likely lemmatised it. That erases most of the multi-word phrases, punctuation and function words (negation, question marks) that this engine\'s priority logic depends on; so this real-world set is used for Department and Issue-type accuracy only. Priority accuracy continues to be measured on the synthetic set, where casing, punctuation and full phrasing are intact.',
}

export const REAL_WORLD_DATASET: RealWorldCase[] = [
  // --- Hardware ---
  {
    id: 'RW1',
    sourceCategory: 'Hardware',
    text: 'alert disk failed sent monday alert disk failed hello dear please raise call queue fix disk redundancy issue for our controller thanks',
    expectedDepartment: 'Hardware',
    expectedIssueType: 'Incident / Something is broken',
  },
  {
    id: 'RW2',
    sourceCategory: 'Hardware',
    text: 'laptop charger charger forgot charger kind regards',
    expectedDepartment: 'Hardware',
    expectedIssueType: 'Request / Something new is needed',
    note: 'Heavily stripped fragment: reads as asking for a replacement charger, i.e. something new is needed, not a modification to an existing setup.',
  },
  {
    id: 'RW3',
    sourceCategory: 'Hardware',
    text: 'laptop stand stand dear stand computer possible best regards tester',
    expectedDepartment: 'Hardware',
    expectedIssueType: 'Other / unclassified',
    note: 'Too garbled by preprocessing to confidently assign an issue type.',
  },
  {
    id: 'RW4',
    sourceCategory: 'Hardware',
    text: 'problems with pc meeting room problems with pc meeting room error when starting up ask if you want repair',
    expectedDepartment: 'Hardware',
    expectedIssueType: 'Incident / Something is broken',
  },
  {
    id: 'RW5',
    sourceCategory: 'Hardware',
    text: 'fields project wednesday february pm re hi call story points type number available issue types story epic thank wednesday february hello please note administrator rights both confluence too until everything order afterwards rights attached please take regarding user story please more afraid understa',
    expectedDepartment: 'Hardware',
    expectedIssueType: 'Other / unclassified',
    note: 'Garbled, multi-topic, truncated: no single confident issue type despite the native Hardware label.',
  },

  // --- Access ---
  {
    id: 'RW6',
    sourceCategory: 'Access',
    text: 'access card number july pm kind confirmation importance high dear colleagues please kindly card assigned thank best regards',
    expectedDepartment: 'Access',
    expectedIssueType: 'Request / Something new is needed',
  },
  {
    id: 'RW7',
    sourceCategory: 'Access',
    text: 'license visual studio pm license visual studio dear please help license visual studio visual studio attached problem best regards engineer',
    expectedDepartment: 'Access',
    expectedIssueType: 'Request / Something new is needed',
  },
  {
    id: 'RW8',
    sourceCategory: 'Access',
    text: 'drive drive hey please thank best regards user acceptance test companion device ext',
    expectedDepartment: 'Access',
    expectedIssueType: 'Other / unclassified',
    note: 'Fragment with no clear ask.',
  },
  {
    id: 'RW9',
    sourceCategory: 'Access',
    text: 'confluence prod instance issue sent october confluence prod instance issue importance high hi teams right noticed issue with our confluence prod instance below displayed error row text confluence you cannot access confluence present look table below identify reasons type description exception level',
    expectedDepartment: 'Access',
    expectedIssueType: 'Incident / Something is broken',
    note: 'Despite the surface word "access", this describes a system error/outage, not a request for new permissions.',
  },
  {
    id: 'RW10',
    sourceCategory: 'Access',
    text: 'license license hi install create architecture diagrams please let where download application license thank design lead',
    expectedDepartment: 'Access',
    expectedIssueType: 'Request / Something new is needed',
  },

  // --- Miscellaneous ---
  {
    id: 'RW11',
    sourceCategory: 'Miscellaneous',
    text: 'manager change error failed with errors manager change for hello va ale administration officer sent tuesday november failed with errors manager change for access task application failed with errors manager change for change layout one column two columns two columns narrow left two columns narrow rig',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Incident / Something is broken',
    note: 'A change process that "failed with errors": the error is the primary signal, not the change itself.',
  },
  {
    id: 'RW12',
    sourceCategory: 'Miscellaneous',
    text: 'change issue for sent monday july change line manager for hello requested through change current line manager for around weeks ago change yet reflected could you please help solve best regards line manager bogota',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Incident / Something is broken',
    note: 'A previously requested change has not taken effect: reads as a problem to resolve, not a new change ask.',
  },
  {
    id: 'RW13',
    sourceCategory: 'Miscellaneous',
    text: 'submit proposals october pm submit proposals hello please proposals submitted proposals approved by has holiday leaving easier these submitted remotely then apply proposals thank regards',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Other / unclassified',
    note: 'Too garbled to confidently separate an information question from a change/process ask.',
  },
  {
    id: 'RW14',
    sourceCategory: 'Miscellaneous',
    text: 'add agile transformation project add agile hello issue regarding little bit please add agile option thanks officer floor blvd district',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Change / Modify something existing',
  },
  {
    id: 'RW15',
    sourceCategory: 'Miscellaneous',
    text: 'alp ownership wednesday pm alp hi please make owner alp clear out working properly due leavers please note alp old name running thanks head managing director germany',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Change / Modify something existing',
    note: 'Ownership/configuration change request.',
  },

  // --- Purchase ---
  {
    id: 'RW16',
    sourceCategory: 'Purchase',
    text: 'new purchase po friday december pm purchase po dear purchased please log installation administrator',
    expectedDepartment: 'Purchase',
    expectedIssueType: 'Other / unclassified',
    note: 'Routine purchase-order logging, an administrative notice rather than a clean Incident/Request/Change/Query.',
  },
  {
    id: 'RW17',
    sourceCategory: 'Purchase',
    text: 'new purchase po user left on purchase po dear purchased pro retina intel plus graphics kb mouse keyboard numeric keypad please log allocation kind regards administrator',
    expectedDepartment: 'Purchase',
    expectedIssueType: 'Other / unclassified',
  },
  {
    id: 'RW18',
    sourceCategory: 'Purchase',
    text: 'new purchase po purchase po dear purchased lite mobile subscription updated include device under user name please log allocation device after receive item please take consideration mandatory receipts section order receive item ordered how video link please receipt number item needed processed thank',
    expectedDepartment: 'Purchase',
    expectedIssueType: 'Other / unclassified',
    note: 'Same routine PO-logging template as RW16/17/19, just with extra receipt-processing language. Under the old single-axis schema this was mislabelled into a pseudo-category "Billing / invoice query" because "receipts"/"invoice" looked like billing vocabulary; the two-axis split now correctly keeps Department=Purchase (matching the dataset\'s own Topic_group) with Issue type=Other, same as its siblings.',
  },
  {
    id: 'RW19',
    sourceCategory: 'Purchase',
    text: 'new purchase po purchase po dear purchased printer brother touch label printer monochrome thermal transfer please log allocation kind regards administrator',
    expectedDepartment: 'Purchase',
    expectedIssueType: 'Other / unclassified',
  },
  {
    id: 'RW20',
    sourceCategory: 'Purchase',
    text: 'allocation new purchase po july pm purchase po dear purchased please log allocation please take consideration mandatory receipts section order receive item ordered how video please explorer kind regards administrator',
    expectedDepartment: 'Purchase',
    expectedIssueType: 'Other / unclassified',
    note: 'Same reasoning as RW18: receipts/order-receive language, but still the routine PO-logging template, not a billing dispute.',
  },

  // --- Administrative rights ---
  {
    id: 'RW21',
    sourceCategory: 'Administrative rights',
    text: 'issues with tuesday pm issues importance high hello guys seems issues while builds attached images help step hangs seconds sometimes more then screen receive after further tried old out different cables same result please fix fast since blockage work kind regards engineer ext',
    expectedDepartment: 'Administrative rights',
    expectedIssueType: 'Incident / Something is broken',
  },
  {
    id: 'RW22',
    sourceCategory: 'Administrative rights',
    text: 'pas problems problems hi can you please help pass over issues described previous thank you sent friday problems hi experiencing some issue when fill report problems facing review input link open save button for report works close button work regards agile manager',
    expectedDepartment: 'Administrative rights',
    expectedIssueType: 'Incident / Something is broken',
  },
  {
    id: 'RW23',
    sourceCategory: 'Administrative rights',
    text: 'lost all appointments from outlook sent thursday july lost appointments hello morning something unexpected happened apparently lost appointments calendar can you help with issue thank you',
    expectedDepartment: 'Administrative rights',
    expectedIssueType: 'Incident / Something is broken',
  },
  {
    id: 'RW24',
    sourceCategory: 'Administrative rights',
    text: 'windows forced upgrade postponing re forced upgrade hi please postpone upgrade working remotely client side connected wired computer connected wired run upgrade wireless upgrade upon return st december thank understanding friday december pm forced upgrade hello everyone upgraded workstation thanking',
    expectedDepartment: 'Administrative rights',
    expectedIssueType: 'Change / Modify something existing',
    note: 'Asking to reschedule/postpone a scheduled upgrade, not reporting it as broken.',
  },
  {
    id: 'RW25',
    sourceCategory: 'Administrative rights',
    text: 'windows upgrade not enough space on partition upgrade started hello could you please help with below afraid have access delete any temp files aware have any use also have any personal files thanks sent monday re upgrade started hello please or but can also advise you following purge browsers history',
    expectedDepartment: 'Administrative rights',
    expectedIssueType: 'Incident / Something is broken',
    note: 'Upgrade blocked by insufficient disk space, a problem blocking progress, not primarily an access or change ask.',
  },

  // --- Storage ---
  {
    id: 'RW26',
    sourceCategory: 'Storage',
    text: 'wants to access thursday july pm wants because accept decline',
    expectedDepartment: 'Storage',
    expectedIssueType: 'Other / unclassified',
    note: 'Too fragmented to confidently label despite the surface word "access". This is the auto-generated SharePoint access-notification template ("wants to access... accept/decline"), deliberately not keyed on, since "wants"/"decline" are corpus-specific noise, not generalizable English signal.',
  },
  {
    id: 'RW27',
    sourceCategory: 'Storage',
    text: 'flagged and moved mails re appear under after processing with we move them client folder after while under if haven moved client folder can you please investigate',
    expectedDepartment: 'Storage',
    expectedIssueType: 'Incident / Something is broken',
    note: 'Mail routing not behaving as expected, explicitly asking someone to "investigate".',
  },
  {
    id: 'RW28',
    sourceCategory: 'Storage',
    text: 'increase storage capacity thursday pm increase storage hi receiving error saying close exceeding limit please increase storing regards',
    expectedDepartment: 'Storage',
    expectedIssueType: 'Change / Modify something existing',
    note: 'Explicit ask is to increase capacity (a change), even though it is triggered by an error.',
  },
  {
    id: 'RW29',
    sourceCategory: 'Storage',
    text: 'new access permission for managers pm permission hi guys make changes these files view migrated please enable also tried share files these make changes also update these files daily basis across better package flow thanks',
    expectedDepartment: 'Storage',
    expectedIssueType: 'Request / Something new is needed',
    note: 'Native category is Storage (permissions on shared files), even though the surface language ("permission", "enable") overlaps Access vocabulary.',
  },
  {
    id: 'RW30',
    sourceCategory: 'Storage',
    text: 'mailboxes tuesday july please delete mine gone enough feel important required kind regards planning officer infrastructure upcoming holiday wednesday july friday july inclusive please consider environment print',
    expectedDepartment: 'Storage',
    expectedIssueType: 'Change / Modify something existing',
    note: 'Request to delete a mailbox: modifying/removing something existing.',
  },

  // --- Internal Project ---
  {
    id: 'RW31',
    sourceCategory: 'Internal Project',
    text: 'new project code form pas thursday july pm re awaiting response code form thank add attached forms please let senior date wednesday july awaiting response code form hello please find form attached thanks kind regards analyst ext wednesday july pm re awaiting response code form hi sorry hub currently',
    expectedDepartment: 'Internal Project',
    expectedIssueType: 'Request / Something new is needed',
    note: 'Setting up a brand-new project code: something new is needed, not a modification to an existing one.',
  },
  {
    id: 'RW32',
    sourceCategory: 'Internal Project',
    text: 'move the mobile team opportunity to pas thursday march opportunities hi please move mobile opportunity thank regards center floor',
    expectedDepartment: 'Internal Project',
    expectedIssueType: 'Change / Modify something existing',
    note: 'Moving/reassigning an existing opportunity, not creating a new one.',
  },
  {
    id: 'RW33',
    sourceCategory: 'Internal Project',
    text: 'end project setup form pas setup form hello thank providing regarding codes future similar requests please instead fulfilled both please two tickets thank kind regards setup form hi please client code per attached form thanks best regards',
    expectedDepartment: 'Internal Project',
    expectedIssueType: 'Request / Something new is needed',
    note: 'Setting up new client/project codes via the setup form.',
  },
  {
    id: 'RW34',
    sourceCategory: 'Internal Project',
    text: 'new project code pas hi guys please attached code thanks',
    expectedDepartment: 'Internal Project',
    expectedIssueType: 'Request / Something new is needed',
  },
  {
    id: 'RW35',
    sourceCategory: 'Internal Project',
    text: 'create the project job oracle hello please help out creation job officer grade senior technician thank best regards',
    expectedDepartment: 'Internal Project',
    expectedIssueType: 'Request / Something new is needed',
  },

  // --- HR Support (added once the engine moved to an independent Department axis, see
  // REAL_WORLD_SOURCE.samplingMethod) ---
  {
    id: 'RW36',
    sourceCategory: 'HR Support',
    text: 'access to network december pm hello working floor connect order virtual machine machine id machine number please add user ecosystem senior developer next annual leave november december',
    expectedDepartment: 'HR Support',
    expectedIssueType: 'Request / Something new is needed',
    note: 'Native category is HR Support (mentions the requester\'s own upcoming annual leave), even though the surface ask ("please add user", "access to network") reads like Access vocabulary, a genuine cross-department ambiguity in the native labels, not a labelling error on our part.',
  },
  {
    id: 'RW37',
    sourceCategory: 'HR Support',
    text: 'accounts needed for web automation workshops internship tuesday accounts needed automation workshops internship dear organizing few automation workshops interns prerequisite each created provided workshop starting therefore accounts ready by possible persons require please let provide further details thanks senior test lead',
    expectedDepartment: 'HR Support',
    expectedIssueType: 'Request / Something new is needed',
    note: 'Provisioning accounts for a batch of interns: an HR-driven onboarding request.',
  },
  {
    id: 'RW38',
    sourceCategory: 'HR Support',
    text: 'access tuesday pm re approved tuesday pm tuesday pm hello please advised added certain ask pm updated configuration plan thank kind regards analyst ext hub tuesday hi currently working view planning thanks',
    expectedDepartment: 'HR Support',
    expectedIssueType: 'Change / Modify something existing',
    note: 'Garbled, but "approved... added... updated configuration plan" reads as modifying an existing setup rather than requesting something brand new.',
  },
  {
    id: 'RW39',
    sourceCategory: 'HR Support',
    text: 'open hello please help thank intern',
    expectedDepartment: 'HR Support',
    expectedIssueType: 'Other / unclassified',
    note: 'Too sparse to confidently assign an issue type beyond the "intern" signal pointing to HR Support.',
  },
  {
    id: 'RW40',
    sourceCategory: 'HR Support',
    text: 'error on installing net framework friday march pm error installing framework hello help please framework installation tried install error code thank engineer',
    expectedDepartment: 'HR Support',
    expectedIssueType: 'Incident / Something is broken',
    note: 'Native category is HR Support, but the text itself is a plain software installation error with zero HR-specific vocabulary, included deliberately as a reminder that native dataset categories reflect who the ticket was routed to in practice, not always what vocabulary the text contains.',
  },
]
