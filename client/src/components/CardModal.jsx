
import { displayModal } from "../utils/utils";

const CardModal = ({ setState, cardData, modalRef, overlayRef }) => {



  const viewCard = (card) => {
    displayModal(overlayRef, modalRef);
    setState(card);
    
  };

  return (
    <div className=" h-full w-full"  >
      <div
       
        ref={modalRef}
        className="absolute gap-2 dark:text-white  overflow-y-auto overflow-x-hidden flex flex-col  opacity-0 p-5 duration-300 transform -0 transition-all inset-0  -z-10 dark:bg-gray-900 bg-white shadow-lg min-sm:w-1/2 translate-x-1/5 w-3/4 h-1/2 rounded-2xl translate-y-1/4 min-sm:translate-1/2  "
      >
        <div className="flex flex-col ">
          <div className="absolute flex justify-center text-center items-center right-2 top-1">
            <button
              className="text-sm  px-2 h-fit justify-self-center items-center  rounded-2xl  bg-blue-500 cursor-pointer"
              onClick={viewCard}
            >
              x
            </button>
          </div>
          <div className="text-2xl font-bold border-b-2 border-black">
            {cardData?.topic}
          </div>
        </div>
        <section className="gap-2 flex flex-col">
          <span className="font-bold capitalize text-sm">{cardData?.goal}</span>
          <p className="font-light">{cardData?.description}</p>
          <div className=" grid max-sm:grid-cols-1 grid-cols-2 gap-5 ">
            {cardData?.resources?.map((resource, idx) => {
              return (
                <div className="rounded-5xl text-center ">
                 
                  <a className="hover:text-blue-800 font-semibold text-blue-500" href={resource.resource.link}>Resource {idx + 1}</a>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <div
        ref={overlayRef}
        className="overlay transition-all h-full  duration-150 opacity-0 absolute inset-0 bg-black -z-10"
        onClick={viewCard}
      ></div>
    </div>
  );
};

export default CardModal;
