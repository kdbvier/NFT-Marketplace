const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
const WEB_SOKET = process.env.NEXT_PUBLIC_WEB_SOKET;
const FILE_SERVER_URL = process.env.NEXT_PUBLIC_FILE_SERVER_ENDPOINT;
const PINATA_URL = process.env.NEXT_PUBLIC_PINATA;
const Config = {
  API_ENDPOINT: BASE_URL,
  WEB_SOKET: WEB_SOKET,
  FILE_SERVER_URL: FILE_SERVER_URL,
  PINATA_URL: PINATA_URL,
};

export default Config;