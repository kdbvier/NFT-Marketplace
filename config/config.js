const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;
const WEB_SOKET = process.env.NEXT_PUBLIC_WEB_SOKET;
const FILE_SERVER_URL = process.env.NEXT_PUBLIC_FILE_SERVER_ENDPOINT;
const PINATA_URL = process.env.NEXT_PUBLIC_PINATA;
const MAINTENANCE_MODE_URL = process.env.NEXT_PUBLIC_MAINTENANCE_MODE_API;
const MOONPAY_URL = process.env.NEXT_PUBLIC_MOONPAY_API;
const MOONPAY_KEY = process.env.NEXT_PUBLIC_MOONPAY_KEY;
const TOKEN_GATED_FILE_ENDPOINT =
  process.env.NEXT_PUBLIC_TOKEN_GATED_FILE_ENDPOINT;
const MOONPAY_GCP = process.env.NEXT_PUBLIC_MOONPAY_GCP;
const GASLESS_ENABLE = process.env.NEXT_PUBLIC_GASLESS_ENABLE;
const SLACK_WEBHOOK = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;
const ENVIROMENT = process.env.NEXT_PUBLIC_ENV;

const Config = {
  API_ENDPOINT: BASE_URL,
  WEB_SOKET: WEB_SOKET,
  FILE_SERVER_URL: FILE_SERVER_URL,
  TOKEN_GATE_FILE_SERVER_URL: TOKEN_GATED_FILE_ENDPOINT,
  PINATA_URL: PINATA_URL,
  MAINTENANCE_MODE_URL: MAINTENANCE_MODE_URL,
  MOONPAY_URL: MOONPAY_URL,
  MOONPAY_KEY: MOONPAY_KEY,
  MOONPAY_GCP: MOONPAY_GCP,
  GASLESS_ENABLE: GASLESS_ENABLE,
  SLACK_WEBHOOK,
  IS_PRODUCTION: ENVIROMENT === 'production',
};

export default Config;
