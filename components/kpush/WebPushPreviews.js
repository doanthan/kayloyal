import Button from "react-bootstrap/Button"
import Image from "react-bootstrap/Image"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

const WebPushPreviews = ({
  title,
  message,
  link,
  image,
  initialImgUrl,
  iconUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/2048px-Google_Chrome_icon_%28February_2022%29.svg.png",
}) => {
  console.log("initialImgUrl", initialImgUrl)
  console.log("image", image)
  console.log("iconUrl", iconUrl)
  return (
    <section
      id="flow-content"
      className="card card-body border-0 shadow-sm p-4 mb-4 bg-secondary"
    >
      <div className="d-flex align-items-center mb-4">
        <h4 className="me-2 mb-0">Previews</h4>
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip>
              Previews are just an approximation of what your notification will
              look like on different devices.
            </Tooltip>
          }
        >
          <i className="fi-help fs-5" role="button"></i>
        </OverlayTrigger>
      </div>
      <div className="web-push-previews">
        <div className="mb-4">
          <h5>Chrome on Windows</h5>
          <section
            id="description"
            className="card border-0 shadow-sm overflow-hidden"
          >
            {initialImgUrl && !image && <Image src={initialImgUrl} />}
            {image && <Image src={image} />}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                position: "relative",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/2048px-Google_Chrome_icon_%28February_2022%29.svg.png"
                  className="me-2"
                  style={{ width: "20px" }}
                />
                <p className="small m-0">Google Chrome</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "16px",
                }}
              >
                {iconUrl && (
                  <img
                    src={
                      iconUrl
                        ? iconUrl
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/2048px-Google_Chrome_icon_%28February_2022%29.svg.png"
                    }
                    className=""
                    style={{ width: "60px", height: "100%" }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <p
                    className="mb-0"
                    style={{
                      color: "rgb(25, 25, 25)",
                      fontSize: "15px",
                      letterSpacing: "0.1px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: "2",
                      overflow: "hidden",
                      width: "100%",
                      textOverflow: "ellipsis",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    className="mb-0"
                    style={{
                      color: "rgb(91, 91, 91)",
                      fontSize: "14px",
                      letterSpacing: "0px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: "4",
                      overflow: "hidden",
                      width: "100%",
                      textOverflow: "ellipsis",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {message}
                  </p>
                  <p className="mb-0 small text-muted">{link}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mb-4">
          <h5>Chrome on Android</h5>
          <section
            id="description"
            className="card border-0 shadow-sm overflow-hidden"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20px auto 60px",
                gap: "10px",
                padding: "16px 16px 0px",
              }}
            >
              <img
                src="https://www.shareicon.net/data/2015/08/12/83792_google_256x256.png"
                className="me-2"
                style={{ width: "16px", height: "16px" }}
              />
              <p className="small m-0">Chrome &bull; {link} &bull; now</p>
              {iconUrl && (
                <img
                  src={iconUrl}
                  className="float-end"
                  style={{ width: "60px", height: "100%" }}
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                padding: "0px 16px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <p
                  className="mb-0"
                  style={{
                    color: "rgb(25, 25, 25)",
                    fontSize: "15px",
                    letterSpacing: "0.1px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {title}
                </p>
                <p
                  className="mb-0"
                  style={{
                    color: "rgb(91, 91, 91)",
                    fontSize: "14px",
                    letterSpacing: "0px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "4",
                    overflow: "hidden",
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {message}
                </p>
                <div>
                  {initialImgUrl && !image && <img src={initialImgUrl} />}
                  {image && <img src={image} />}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mb-4">
          <h5>Apple iOS</h5>
          <section
            id="description"
            className="card border-0 shadow-sm overflow-hidden"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px auto 30px",
                gap: "10px",
                padding: "16px",
              }}
            >
              <img
                src={
                  iconUrl
                    ? iconUrl
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/2048px-Google_Chrome_icon_%28February_2022%29.svg.png"
                }
                className=""
                style={{ width: "40px" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <p
                  className="mb-0"
                  style={{
                    color: "rgb(25, 25, 25)",
                    fontSize: "15px",
                    letterSpacing: "0.1px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "2",
                    overflow: "hidden",
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {title}
                </p>
                <p
                  className="mb-0"
                  style={{
                    color: "rgb(91, 91, 91)",
                    fontSize: "14px",
                    letterSpacing: "0px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "4",
                    overflow: "hidden",
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {message}
                </p>
              </div>
              <p className="mb-0 small text-muted">now</p>
            </div>
          </section>
        </div>

        <div className="mb-4">
          <h5>Apple macOS</h5>
          <section id="description" className="card border-0 shadow-sm">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "45px auto 60px",
                gap: "10px",
                padding: "16px",
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/2048px-Google_Chrome_icon_%28February_2022%29.svg.png"
                className="d-inline-block text-align-center align-top"
                style={{
                  width: "45px",
                  padding: "5px",
                  background: "white",
                  borderRadius: "10px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <p
                  className="mb-0"
                  style={{
                    color: "rgb(25, 25, 25)",
                    fontSize: "15px",
                    letterSpacing: "0.1px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "2",
                    overflow: "hidden",
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {title}
                </p>
                <p
                  className="mb-0"
                  style={{
                    color: "rgb(25, 25, 25)",
                    fontSize: "15px",
                    letterSpacing: "0.1px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "1",
                    overflow: "hidden",
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {link}
                </p>
                <p
                  className="mb-0"
                  style={{
                    color: "rgb(91, 91, 91)",
                    fontSize: "14px",
                    letterSpacing: "0px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "4",
                    overflow: "hidden",
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {message}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <p className="mb-0 small text-muted">now</p>
                {iconUrl && (
                  <img
                    src={iconUrl}
                    className="text-align-right"
                    style={{ width: "60px" }}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default WebPushPreviews
