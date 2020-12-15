import { parse } from 'papaparse';
import { CardDataType, UserClientService } from '../../helpers';
import { CREDIT_CARD_ACCOUNTS } from '../../constants';

type CardData = { [key: string]: CardDataType };

export type Data = {
  timestamp: string;
  card: string;
  vendor: string;
  vendor_category: string;
  amount: string;
  artificial_id: string;
  department: string;
  owner_id: string;
  name: string;
};

// function xml2json(xml) {
//   try {
//     var obj = {};
//     if (xml.children.length > 0) {
//       for (var i = 0; i < xml.children.length; i++) {
//         var item = xml.children.item(i);
//         var nodeName = item.nodeName;

//         if (typeof obj[nodeName] == 'undefined') {
//           obj[nodeName] = xml2json(item);
//         } else {
//           if (typeof obj[nodeName].push == 'undefined') {
//             var old = obj[nodeName];

//             obj[nodeName] = [];
//             obj[nodeName].push(old);
//           }
//           obj[nodeName].push(xml2json(item));
//         }
//       }
//     } else {
//       obj = xml.textContent;
//     }
//     return obj;
//   } catch (e) {
//     console.log(e.message);
//   }
// }

export const getFileType = (filename: string) =>
  filename.substring(filename.length - 3).toLowerCase();

const loadUserCards = async (cardNumber: string): Promise<CardData> => {
  const account = CREDIT_CARD_ACCOUNTS.find(account =>
    account.includes(cardNumber),
  );
  if (!account) return {};
  const cardData = await UserClientService.loadCreditCardWithAccount(account);
  return cardData.reduce(
    (aggr, item) => ({ ...aggr, [item.cardNumber]: item }),
    {},
  );
};

const getXmlCardNumber = (fileContent: string) =>
  fileContent.replace(
    /[\S\s]*<\?xml[\S\s]+<CCACCTFROM>[\S\s]+<ACCTID>([0-9]+)<\/ACCTID[\S\s]+<\/CCACCTFROM>[\S\s]+<\/OFX>[\S\s]*/g,
    '$1',
  );

const processXmlData = (
  fileContent: string,
  cardNumber: string,
  cards: CardData,
) =>
  fileContent
    .replace(
      /[\S\s]*<\?xml[\S\s]+<\/DTEND>([\S\s]+)<\/BANKTRANLIST>[\S\s]+<\/OFX>[\S\s]*/,
      '$1',
    )
    .split(/(?<=<\/STMTTRN>)/g)
    .map(record =>
      record.replace(
        /\n\s+<STMTTRN>\n\s+<TRNTYPE>(\w+)<\/TRNTYPE>\n\s+<DTPOSTED>[0-9.]+<\/DTPOSTED>\n\s+<DTUSER>([0-9.]+)<\/DTUSER>\n\s+<TRNAMT>-?([0-9.]+)<\/TRNAMT>\n\s+<FITID>([0-9]+)<\/FITID>\n\s+<NAME>([^<]+)<\/NAME>\n\s+<CCACCTTO>\n\s+<ACCTID>([0-9]{4})<\/ACCTID>\n\s+<\/CCACCTTO>\n\s+<MEMO>[^<]+<\/MEMO>\n\s+<\/STMTTRN>/g,
        (...args) => {
          const [_, type, timestamp, amount, auth, vendor, card] = args;
          let card_data = cards[(+card).toString()] || {
            user: 0,
            account: cardNumber,
            name: 'Card not registered to user on account',
            departmentId: 0,
          };
          return (
            `${timestamp.substring(4, 6)}/${timestamp.substring(
              6,
              8,
            )}/${timestamp.substring(0, 4)},` +
            `${card},` +
            `"${vendor.replace(/"/g, '\\"').replace(/&amp;/g, '&')}",,` +
            `${type == 'CREDIT' ? '-' : ''}${amount},` +
            `${cardNumber}-${card}-${auth},` +
            `${card_data.departmentId},` + //FIXME
            `${card_data.user?.id},` +
            `${card_data.name}\n`
          );
        },
      ),
    )
    .reduce(
      (aggr, item) => aggr + item,
      'timestamp,card,vendor,vendor_category,amount,artificial_id,department,owner_id,name\n',
    )
    .trim();

export const processFile = async (filename: string, filedata: string) => {
  const fileContent = atob(filedata.split(';base64,')[1]);
  const fileType = getFileType(filename);
  if (!['ofx', 'qbo', 'csv'].includes(fileType))
    throw 'Invalid file format, must be one of ofx, qbo or csv.';
  let csv = '';
  switch (fileType) {
    case 'ofx':
    case 'qbo':
      const cardNumber = getXmlCardNumber(fileContent);
      const cards = await loadUserCards(cardNumber);
      csv = processXmlData(fileContent, cardNumber, cards);
      console.log(csv);
      break;
    case 'csv':
      break;
  }
  const { data } = parse<Data>(csv, {
    header: true,
    dynamicTyping: false,
    worker: false,
    // step: actions.step,
    error: console.log,
  });
  console.log(data);
  return data;
};
