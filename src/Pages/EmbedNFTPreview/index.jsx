import { useState, useEffect, useRef } from "react";

function EmbedNFTPreview(props) {
  const [height, setHeight] = useState(450);
  const [width, setWidth] = useState(350);
  const [iframeContent, setIframeContent] = useState("");
  const [isTextCopied, setIsTextCopied] = useState(false);
  const copyRef = useRef(null);
  const nftId = props.match.params.id;

  let host = window.location.origin;

  useEffect(() => {
    setIframeContent(
      `<iframe src='${host}/embed/${nftId}' width='${width}px' height='${height}px' title='NFT'></iframe>`
    );
  }, [height, width]);

  const copyToClipboard = (e) => {
    copyRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setIsTextCopied(true);
    setTimeout(() => {
      setIsTextCopied(false);
    }, 2000);
  };

  return (
    <div className="block md:flex w-full mt-8">
      <div className="w-4/4 md:w-1/4 mr-0 md:mr-10">
        <h2 className="txtblack dark:text-white mb-6">Configure the view</h2>
        <div className="mb-6">
          <label
            className="block text-sm font-bold font-satoshi-bold txtblack dark:text-white"
            htmlFor="height"
          >
            Set Height
          </label>
          <div className="relative">
            <input
              className="block mb-3"
              id="name"
              name="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <p className="text-[#9499ae] text-md absolute right-2 top-2">px</p>
          </div>
        </div>
        <div className="mb-6">
          <label
            className="block text-sm font-bold font-satoshi-bold txtblack dark:text-white"
            htmlFor="width"
          >
            Set Width
          </label>
          <div className="relative">
            <input
              className="block mb-3"
              id="width"
              name="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            <p className="text-[#9499ae] text-md absolute right-2 top-2">px</p>
          </div>
        </div>
        <div>
          <p className="txtblack dark:text-white mb-2">
            Embed this HTML code to your page
          </p>
          <div className="relative">
            <input
              className="block mb-3 py-[10px] pl-[15px] pr-[40px] bg-[#232032] border-[#232032] text-[#9499ae] w-full rounded border-[1px]"
              id="iframe"
              name="iframe"
              value={iframeContent}
              ref={copyRef}
            />
            <div className="text-[#9499ae] absolute top-2 right-2">
              <i
                className="fa-regular fa-copy text-lg cursor-pointer"
                onClick={copyToClipboard}
              ></i>
            </div>
          </div>
          {isTextCopied && (
            <p className="txtblack dark:text-white text-center text-xs">
              Copied Successfully!
            </p>
          )}
        </div>
      </div>
      <div className="w-4/4 md:w-3/4 mt-10 md:mt-0 ml-0 md:ml-10">
        <h2 className="txtblack dark:text-white mb-6">Preview</h2>
        <iframe
          src={`http://localhost:3000/embed/${nftId}`}
          width={`${width}px`}
          height={`${height}px`}
          title="NFT"
        ></iframe>
      </div>
    </div>
  );
}

export default EmbedNFTPreview;
