import manImg from "assets/images/image-default.svg";
import Polygon from "assets/images/network/polygon.svg";
import dayjs from "dayjs";
import { walletAddressTruncate } from "util/WalletUtils";

const NFTSalesMobile = ({ items }) => {
  return (
    <>
      {items.length ? (
        <div>
          {items.map((item, index) => (
            <div
              key={index}
              className={`${
                index < items.length - 1 ? "border-b" : ""
              } text-left text-[13px] pt-4 pb-2`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[14px] text-[#303548] pb-2 block">
                    Items
                  </span>
                  <div className="flex items-center">
                    <img
                      src={item?.nft_asset_path ? item.nft_asset_path : manImg}
                      alt="nft"
                      className="h-[33px] w-[33px]"
                    />{" "}
                    <span className="ml-2">{item.nft_name}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[14px] text-[#303548] pb-2 block">
                    Price
                  </span>
                  <div className="flex items-center">
                    <span> {item.nft_price ? item.nft_price : "-"}</span>
                    <img src={Polygon} alt="network" className="ml-2" />
                  </div>
                </div>
                <div>
                  <span className="text-[14px] text-[#303548] pb-2 block">
                    Qty
                  </span>
                  <span>{item.nft_unit}</span>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex-1">
                  <span className="text-[14px] text-[#303548] pb-2 block">
                    Buyer
                  </span>
                  <span>
                    {item.user_eoa ? walletAddressTruncate(item.user_eoa) : "-"}
                  </span>
                </div>
                <div className="ml-10">
                  <span className="text-[14px] text-[#303548] pb-2 block">
                    Date
                  </span>
                  <span>
                    {dayjs(item.purchase_time).format("DD/MM/YYYY - HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">You don't have any sales to display</p>
      )}
    </>
  );
};

export default NFTSalesMobile;