import Aos from "aos";
import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";

type Props = {};
declare global {
  interface Window {
    MyNamespace: any;
  }
}
export default function Whatsapp({}: Props) {
  const [help, setHelp] = React.useState(false);
  const onCantact = () => {
    if (!help) {
      showMessage();
    }
    let url: string = "https://wa.me/447441428355?lang=en";
    (window as any).open(url, "_blank").focus();
  };
  function showMessage() {
    setHelp(true);
    let audio = new Audio("/sound/stop-13692.mp3");
    audio.play();
  }
  React.useEffect(() => {
    Aos.init();

    if (!localStorage.getItem("help")) {
      setTimeout(() => {
        localStorage.setItem("help", "true");
        if (!help) {
          showMessage();
        }
      }, 3000);
    }
  }, []);
  return (
    <>
      {help ? (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "15px",
            padding: "15px",
            borderRadius: "15px",
            backgroundColor: "#f1f1f1",
            border: "1px solid gray",
            width: "100%",
            maxWidth: "350px",
          }}
          data-aos="fade-up"
        >
          <div
            style={{
              top: "-20px",
              position: "absolute",
              right: "-10px",
              cursor: "pointer",
            }}
            onClick={() => setHelp(false)}
          >
            <AiFillCloseCircle size={30} color="#00A884" />
          </div>
          <p>
            Hay there! If you have any question please contact us on Whatsapp by
            clicking on the icon below or call us on these numbers:
            <br />
            <br />
            <b> +447441428355</b> <br />
            <b>+33644624246 </b>
            <br />
            <b> +213672427409</b>
          </p>
        </div>
      ) : null}

      <div
        style={{
          position: "fixed",
          bottom: "15px",
          right: "15px",
          padding: "10px",
          borderRadius: "100%",
          backgroundColor: "#00A884",
          cursor: "pointer",
        }}
        onClick={onCantact}
      >
        <BsWhatsapp size={35} color="white" />
      </div>
    </>
  );
}
